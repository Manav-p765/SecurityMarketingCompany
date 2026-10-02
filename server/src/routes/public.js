import { Router } from 'express';
import { Post } from '../models/Post.js';

/**
 * Read-only blog API, no sign-in. The website build (client/scripts/
 * blog-source.js) fetches every published post from here and prerenders
 * them; drafts are never returned.
 *
 *   GET /api/public/posts          all published posts, newest first
 *   GET /api/public/posts/:slug    one published post
 */
const router = Router();

const day = (date) => (date ? new Date(date).toISOString().slice(0, 10) : null);

const toPublic = (post) => ({
  slug: post.slug,
  title: post.title,
  date: day(post.publishedAt),
  updated: day(post.updatedAt > post.publishedAt ? post.updatedAt : post.publishedAt),
  excerpt: post.excerpt,
  category: post.category,
  author: post.author,
  coverImage: post.coverImage?.url || null,
  html: post.contentHtml,
  seoTitle: post.seoTitle || '',
  seoDescription: post.seoDescription || '',
});

router.get('/posts', async (_req, res) => {
  const posts = await Post.find({ status: 'published' }).sort({ publishedAt: -1, title: 1 });
  res.set('Cache-Control', 'no-store').json({ posts: posts.map(toPublic) });
});

router.get('/posts/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: String(req.params.slug), status: 'published' });
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  return res.set('Cache-Control', 'no-store').json({ post: toPublic(post) });
});

export default router;
