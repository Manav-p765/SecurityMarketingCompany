import { Router } from 'express';
import { Post } from '../models/Post.js';
import { Author, TEAM_AUTHOR } from '../models/Author.js';
import { SITE_URL } from '../config.js';

/**
 * Read-only blog API, no sign-in. The website build (client/scripts/
 * blog-source.js) fetches every published post from here and prerenders
 * them; drafts are never returned.
 *
 *   GET /api/public/posts          all published posts, newest first
 *   GET /api/public/posts/:slug    one published post
 *
 * Each post carries its author (name, slug, role, bio, photo, links). A post
 * without one, or whose author is missing, gets the team author.
 */
const router = Router();

const day = (date) => (date ? new Date(date).toISOString().slice(0, 10) : null);

const toPublicAuthor = (author) => ({
  name: author.name,
  slug: author.slug,
  role: author.role || '',
  bio: author.bio || '',
  photo: author.photo?.url || null,
  links: {
    linkedin: author.linkedinUrl || null,
    x: author.xUrl || null,
    website: author.websiteUrl || null,
  },
  isTeam: Boolean(author.isTeam),
});

// Until scripts/migrate-authors.js has run there is no team author in the
// database; posts then still get a complete one.
const FALLBACK_TEAM = toPublicAuthor({ ...TEAM_AUTHOR, photo: { url: `${SITE_URL}${TEAM_AUTHOR.photoPath}` }, isTeam: true });

/** id -> public author, plus the team author for posts without one. */
async function authorsFor(posts) {
  const ids = [...new Set(posts.map((post) => post.authorId && String(post.authorId)).filter(Boolean))];
  const authors = await Author.find({ $or: [{ _id: { $in: ids } }, { isTeam: true }] }).sort({ createdAt: 1 });
  const byId = new Map(authors.map((author) => [author.id, toPublicAuthor(author)]));
  const team = authors.find((author) => author.isTeam);
  return { byId, team: team ? byId.get(team.id) : FALLBACK_TEAM };
}

const toPublic = (post, { byId, team }) => ({
  slug: post.slug,
  title: post.title,
  date: day(post.publishedAt),
  updated: day(post.updatedAt > post.publishedAt ? post.updatedAt : post.publishedAt),
  excerpt: post.excerpt,
  category: post.category,
  author: byId.get(String(post.authorId)) || team,
  coverImage: post.coverImage?.url || null,
  html: post.contentHtml,
  seoTitle: post.seoTitle || '',
  seoDescription: post.seoDescription || '',
});

router.get('/posts', async (_req, res) => {
  const posts = await Post.find({ status: 'published' }).sort({ publishedAt: -1, title: 1 });
  const authors = await authorsFor(posts);
  res.set('Cache-Control', 'no-store').json({ posts: posts.map((post) => toPublic(post, authors)) });
});

router.get('/posts/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: String(req.params.slug), status: 'published' });
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  return res.set('Cache-Control', 'no-store').json({ post: toPublic(post, await authorsFor([post])) });
});

export default router;
