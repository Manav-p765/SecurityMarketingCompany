import express, { Router } from 'express';
import { checkOrigin, requireAuth } from '../../auth/session.js';
import { Post } from '../../models/Post.js';
import { Lead } from '../../models/Lead.js';
import { lastDeploy } from '../../services/deploy.js';
import authRoutes from './auth.js';
import postRoutes from './posts.js';
import categoryRoutes from './categories.js';
import uploadRoutes from './uploads.js';
import userRoutes from './users.js';
import leadRoutes from './leads.js';

/**
 * Everything under /api/admin. Login is the only route without a session;
 * every other route is guarded on the server, by role:
 *   admin  — posts, categories, uploads, users, leads
 *   editor — posts and uploads (and reading the category list)
 */
export default function adminRoutes({ allowedOrigins }) {
  const router = Router();
  router.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    next();
  });
  router.use(checkOrigin(allowedOrigins));
  // Post bodies are larger than the contact form's 32kb cap.
  router.use(express.json({ limit: '1mb' }));

  router.use('/auth', authRoutes);
  router.use('/posts', requireAuth('admin', 'editor'), postRoutes);
  router.use('/categories', requireAuth('admin', 'editor'), categoryRoutes);
  router.use('/uploads', requireAuth('admin', 'editor'), uploadRoutes);
  router.use('/users', requireAuth('admin'), userRoutes);
  router.use('/leads', requireAuth('admin'), leadRoutes);

  router.get('/dashboard', requireAuth('admin', 'editor'), async (req, res) => {
    const [published, drafts, deploy] = await Promise.all([
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'draft' }),
      lastDeploy(),
    ]);
    const isAdmin = req.user.role === 'admin';
    const latestLeads = isAdmin
      ? (await Lead.find().sort({ createdAt: -1 }).limit(5)).map((l) => ({
          id: l.id,
          name: l.name,
          company: l.company,
          service: l.service,
          createdAt: l.createdAt,
        }))
      : null;
    res.json({ posts: { published, drafts }, latestLeads, deploy });
  });

  router.use((_req, res) => res.status(404).json({ message: 'Not found.' }));
  // Async errors (Express 4 forwards them via the wrapper below).
  router.use((err, _req, res, _next) => {
    console.error('[admin]', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  });
  return router;
}
