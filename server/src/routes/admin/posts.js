import { Router } from 'express';
import mongoose from 'mongoose';
import { Post } from '../../models/Post.js';
import { Category } from '../../models/Category.js';
import { htmlText, sanitizePostHtml } from '../../services/sanitize.js';
import { isValidSlug, slugify, uniqueSlug } from '../../services/slug.js';
import { scheduleDeploy } from '../../services/deploy.js';
import { images } from '../../services/images.js';

/**
 * Blog posts (admins and editors). Every save is validated and the content
 * sanitized. Publishing, unpublishing, and editing or deleting a published
 * post schedule a site rebuild (services/deploy.js).
 */
const router = Router();
const PAGE_SIZE = 20;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isId = (id) => mongoose.isValidObjectId(id);

/** Admin view of a post. */
const toAdmin = (post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  category: post.category,
  coverImage: post.coverImage?.url ? { url: post.coverImage.url, publicId: post.coverImage.publicId || '' } : null,
  contentHtml: post.contentHtml,
  author: post.author,
  status: post.status,
  publishedAt: post.publishedAt,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  seoTitle: post.seoTitle,
  seoDescription: post.seoDescription,
  // The URL can only change until the post has been published once.
  slugLocked: Boolean(post.publishedAt),
});

const LIMITS = { title: 200, excerpt: 400, author: 120, seoTitle: 120, seoDescription: 320 };

/** Validates and normalizes editable fields from a request body. */
async function readFields(body) {
  const errors = {};
  const fields = {};
  for (const key of ['title', 'excerpt', 'author', 'seoTitle', 'seoDescription']) {
    if (body[key] === undefined) continue;
    const value = String(body[key] ?? '').trim();
    if (value.length > LIMITS[key]) errors[key] = `Keep this under ${LIMITS[key]} characters.`;
    fields[key] = value;
  }
  if (fields.title !== undefined && !fields.title) errors.title = 'Add a title.';
  if (fields.author !== undefined && !fields.author) fields.author = 'Security Marketing Company Team';

  if (body.category !== undefined) {
    const category = String(body.category ?? '').trim();
    if (category && !(await Category.exists({ name: category }))) errors.category = 'Choose a category from the list.';
    fields.category = category;
  }
  if (body.contentHtml !== undefined) {
    if (String(body.contentHtml).length > 500_000) errors.contentHtml = 'This article is too long to save.';
    else fields.contentHtml = sanitizePostHtml(body.contentHtml);
  }
  if (body.coverImage !== undefined) {
    const cover = body.coverImage;
    if (!cover) fields.coverImage = undefined;
    else if (typeof cover.url !== 'string' || !/^https:\/\//.test(cover.url)) errors.coverImage = 'Upload the cover image again.';
    else fields.coverImage = { url: cover.url.slice(0, 1000), publicId: String(cover.publicId ?? '').slice(0, 300) };
  }
  return { fields, errors };
}

/** What a post needs before it can be live. */
function publishProblems(post) {
  const errors = {};
  if (!post.title) errors.title = 'Add a title.';
  if (!post.excerpt) errors.excerpt = 'Add an excerpt.';
  if (!post.category) errors.category = 'Choose a category.';
  if (htmlText(post.contentHtml).length < 50) errors.contentHtml = 'Write the article before publishing.';
  return errors;
}

const slugTaken = (id) => async (slug) => Boolean(await Post.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) }));

async function loadPost(req, res) {
  if (!isId(req.params.id)) {
    res.status(404).json({ message: 'Post not found.' });
    return null;
  }
  const post = await Post.findById(req.params.id);
  if (!post) res.status(404).json({ message: 'Post not found.' });
  return post;
}

router.get('/', async (req, res) => {
  const filter = {};
  if (['draft', 'published'].includes(req.query.status)) filter.status = req.query.status;
  const search = String(req.query.search ?? '').trim().slice(0, 100);
  if (search) {
    const re = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: re }, { excerpt: re }, { category: re }, { slug: re }];
  }
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const [total, posts] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .select('-contentHtml'),
  ]);
  res.json({
    posts: posts.map((post) => {
      const { contentHtml, ...rest } = toAdmin(post);
      void contentHtml;
      return rest;
    }),
    page,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
  });
});

router.get('/:id', async (req, res) => {
  const post = await loadPost(req, res);
  if (post) res.json({ post: toAdmin(post) });
});

router.post('/', async (req, res) => {
  const { fields, errors } = await readFields(req.body ?? {});
  if (!fields.title) errors.title = 'Add a title.';
  const requested = String(req.body?.slug ?? '').trim();
  if (requested && !isValidSlug(requested)) errors.slug = 'Use lowercase letters, numbers and hyphens.';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const slug = await uniqueSlug(requested || slugify(fields.title), slugTaken(null));
  const post = await Post.create({ ...fields, slug, status: 'draft' });
  return res.status(201).json({ post: toAdmin(post) });
});

router.put('/:id', async (req, res) => {
  const post = await loadPost(req, res);
  if (!post) return undefined;
  const { fields, errors } = await readFields(req.body ?? {});

  if (req.body?.slug !== undefined && req.body.slug !== post.slug) {
    const requested = String(req.body.slug ?? '').trim();
    if (post.publishedAt) errors.slug = 'The web address cannot change after a post has been published.';
    else if (!isValidSlug(requested)) errors.slug = 'Use lowercase letters, numbers and hyphens.';
    else if (await slugTaken(post.id)(requested)) errors.slug = 'Another post already uses this web address.';
    else fields.slug = requested;
  }
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  // A live post must stay publishable.
  if (post.status === 'published') {
    const problems = publishProblems({ ...post.toObject(), ...fields });
    if (Object.keys(problems).length) return res.status(400).json({ errors: problems });
  }

  const oldCover = post.coverImage?.publicId;
  Object.assign(post, fields);
  if ('coverImage' in fields && !fields.coverImage) post.coverImage = undefined;
  await post.save();

  if (oldCover && oldCover !== post.coverImage?.publicId) await images.remove(oldCover);
  if (post.status === 'published') scheduleDeploy(`updated "${post.title}"`);
  return res.json({ post: toAdmin(post) });
});

router.post('/:id/publish', async (req, res) => {
  const post = await loadPost(req, res);
  if (!post) return undefined;
  const problems = publishProblems(post);
  if (Object.keys(problems).length) {
    return res.status(400).json({ message: 'This post is not ready to publish yet.', errors: problems });
  }
  post.status = 'published';
  post.publishedAt ??= new Date();
  await post.save();
  scheduleDeploy(`published "${post.title}"`);
  return res.json({ post: toAdmin(post) });
});

router.post('/:id/unpublish', async (req, res) => {
  const post = await loadPost(req, res);
  if (!post) return undefined;
  const wasLive = post.status === 'published';
  post.status = 'draft';
  await post.save();
  if (wasLive) scheduleDeploy(`unpublished "${post.title}"`);
  return res.json({ post: toAdmin(post) });
});

router.delete('/:id', async (req, res) => {
  const post = await loadPost(req, res);
  if (!post) return undefined;
  await post.deleteOne();
  await images.remove(post.coverImage?.publicId);
  if (post.status === 'published') scheduleDeploy(`deleted "${post.title}"`);
  return res.json({ ok: true });
});

export default router;
