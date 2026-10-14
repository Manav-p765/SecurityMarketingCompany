import { Router } from 'express';
import mongoose from 'mongoose';
import { Author, AUTHOR_LIMITS } from '../../models/Author.js';
import { Post } from '../../models/Post.js';
import { requireAuth } from '../../auth/session.js';
import { slugify, uniqueSlug } from '../../services/slug.js';
import { scheduleDeploy } from '../../services/deploy.js';
import { images } from '../../services/images.js';

/**
 * Blog authors. Everyone signed in can list them (the post editor needs the
 * list); only admins can create, edit or delete. Every save is validated
 * like a post. Changing or deleting an author who has published posts
 * schedules a site rebuild (their byline, bio box and author page change).
 *
 * An author with posts cannot be deleted unless the request names another
 * author to move the posts to (?reassignTo=<id>). The team author (isTeam)
 * is the fallback for posts without one and can never be deleted.
 */
const router = Router();

const isId = (id) => mongoose.isValidObjectId(id);

/** Allowed hosts for each social link (any https/http URL for the website). */
const LINKS = {
  linkedinUrl: { label: 'LinkedIn', hosts: ['linkedin.com'] },
  xUrl: { label: 'X', hosts: ['x.com', 'twitter.com'] },
  websiteUrl: { label: 'website', hosts: null },
};

function readUrl(value, { label, hosts }) {
  if (!value) return { value: '' };
  if (value.length > AUTHOR_LIMITS.url) return { error: `Keep this under ${AUTHOR_LIMITS.url} characters.` };
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return { error: `Enter a full ${label} address.` };
  }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) {
    return { error: `Enter a full ${label} address.` };
  }
  const host = url.hostname.toLowerCase();
  if (hosts && !hosts.some((h) => host === h || host.endsWith(`.${h}`))) {
    return { error: `Use a ${label} address (${hosts.join(' or ')}).` };
  }
  return { value: url.href };
}

/** Validates and normalizes editable fields from a request body. */
function readFields(body) {
  const errors = {};
  const fields = {};
  for (const key of ['name', 'role', 'bio']) {
    if (body[key] === undefined) continue;
    const value = String(body[key] ?? '')
      .trim()
      .replace(key === 'bio' ? /[ \t]+/g : /\s+/g, ' ');
    if (value.length > AUTHOR_LIMITS[key]) errors[key] = `Keep this under ${AUTHOR_LIMITS[key]} characters.`;
    fields[key] = value;
  }
  if (fields.name !== undefined) {
    if (!fields.name) errors.name = 'Enter a name.';
    else if (!slugify(fields.name)) errors.name = 'Use at least one letter or number.';
  }
  for (const [key, rule] of Object.entries(LINKS)) {
    if (body[key] === undefined) continue;
    const { value, error } = readUrl(String(body[key] ?? '').trim(), rule);
    if (error) errors[key] = error;
    else fields[key] = value;
  }
  if (body.photo !== undefined) {
    const photo = body.photo;
    if (!photo) fields.photo = undefined;
    else if (typeof photo.url !== 'string' || !/^https:\/\//.test(photo.url)) errors.photo = 'Upload the photo again.';
    else fields.photo = { url: photo.url.slice(0, 1000), publicId: String(photo.publicId ?? '').slice(0, 300) };
  }
  return { fields, errors };
}

/** Post counts per author: { [authorId]: { posts, published } }. */
async function postCounts() {
  const team = await Author.findOne({ isTeam: true }).select('_id');
  const rows = await Post.aggregate([
    {
      $group: {
        _id: '$authorId',
        posts: { $sum: 1 },
        published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
      },
    },
  ]);
  const counts = {};
  for (const row of rows) {
    // Posts without an author belong to the team author.
    const key = row._id ? String(row._id) : team ? String(team._id) : null;
    if (!key) continue;
    counts[key] ??= { posts: 0, published: 0 };
    counts[key].posts += row.posts;
    counts[key].published += row.published;
  }
  return counts;
}

/** Admin view of an author. */
const toAdmin = (author, counts = {}) => ({
  id: author.id,
  name: author.name,
  slug: author.slug,
  role: author.role,
  bio: author.bio,
  photo: author.photo?.url ? { url: author.photo.url, publicId: author.photo.publicId || '' } : null,
  linkedinUrl: author.linkedinUrl,
  xUrl: author.xUrl,
  websiteUrl: author.websiteUrl,
  isTeam: author.isTeam,
  posts: counts[author.id]?.posts || 0,
  published: counts[author.id]?.published || 0,
  createdAt: author.createdAt,
  updatedAt: author.updatedAt,
});

const slugTaken = (id) => async (slug) => Boolean(await Author.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) }));

async function loadAuthor(req, res) {
  if (!isId(req.params.id)) {
    res.status(404).json({ message: 'Author not found.' });
    return null;
  }
  const author = await Author.findById(req.params.id);
  if (!author) res.status(404).json({ message: 'Author not found.' });
  return author;
}

/** Posts of this author, including authorless posts for the team author. */
const postsOf = (author) => (author.isTeam ? { authorId: { $in: [author._id, null] } } : { authorId: author._id });

router.get('/', async (_req, res) => {
  const [authors, counts] = await Promise.all([Author.find().sort({ isTeam: -1, name: 1 }), postCounts()]);
  res.json({ authors: authors.map((author) => toAdmin(author, counts)) });
});

router.get('/:id', async (req, res) => {
  const author = await loadAuthor(req, res);
  if (author) res.json({ author: toAdmin(author, await postCounts()) });
});

router.post('/', requireAuth('admin'), async (req, res) => {
  const { fields, errors } = readFields(req.body ?? {});
  if (!fields.name) errors.name ??= 'Enter a name.';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const slug = await uniqueSlug(slugify(fields.name), slugTaken(null));
  const author = await Author.create({ ...fields, slug });
  return res.status(201).json({ author: toAdmin(author) });
});

router.put('/:id', requireAuth('admin'), async (req, res) => {
  const author = await loadAuthor(req, res);
  if (!author) return undefined;
  const { fields, errors } = readFields(req.body ?? {});
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  // The author page URL follows the name until the author has a published
  // post; after that it stays put so links to it keep working.
  const live = await Post.exists({ ...postsOf(author), status: 'published' });
  if (fields.name && fields.name !== author.name && !live) {
    fields.slug = await uniqueSlug(slugify(fields.name), slugTaken(author.id));
  }

  const oldPhoto = author.photo?.publicId;
  Object.assign(author, fields);
  if ('photo' in fields && !fields.photo) author.photo = undefined;
  await author.save();

  if (oldPhoto && oldPhoto !== author.photo?.publicId) await images.remove(oldPhoto);
  if (live) scheduleDeploy(`updated author "${author.name}"`);
  return res.json({ author: toAdmin(author, await postCounts()) });
});

router.delete('/:id', requireAuth('admin'), async (req, res) => {
  const author = await loadAuthor(req, res);
  if (!author) return undefined;
  if (author.isTeam) {
    return res.status(400).json({ message: `"${author.name}" is the default author for posts and cannot be deleted.` });
  }

  const owned = await Post.countDocuments(postsOf(author));
  const live = await Post.exists({ ...postsOf(author), status: 'published' });
  if (owned) {
    const target = String(req.query.reassignTo ?? '');
    if (!target) {
      return res.status(400).json({
        message: `${author.name} still has ${owned} post${owned === 1 ? '' : 's'}. Move them to another author first.`,
        posts: owned,
      });
    }
    if (target === author.id || !isId(target) || !(await Author.exists({ _id: target }))) {
      return res.status(400).json({ message: 'Choose another author to move the posts to.' });
    }
    await Post.updateMany(postsOf(author), { $set: { authorId: target } });
  }

  await author.deleteOne();
  await images.remove(author.photo?.publicId);
  if (live) scheduleDeploy(`deleted author "${author.name}"`);
  return res.json({ ok: true, moved: owned });
});

export default router;
