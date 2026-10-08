import express, { Router } from 'express';
import { checkOrigin, requireAuth } from '../../auth/session.js';
import { Post } from '../../models/Post.js';
import { Lead } from '../../models/Lead.js';
import mongoose from 'mongoose';
import { isDatabaseReady } from '../../db.js';
import { deployNow, lastDeploy } from '../../services/deploy.js';
import { images } from '../../services/images.js';
import authRoutes from './auth.js';
import postRoutes from './posts.js';
import categoryRoutes from './categories.js';
import uploadRoutes from './uploads.js';
import userRoutes from './users.js';
import leadRoutes from './leads.js';

/**
 * Everything under /api/admin. Login is the only route without a session;
 * every other route is guarded on the server, by role:
 *   admin  — posts, categories, uploads, users, leads, health, deploy
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

  // What the blog admin depends on: configured, and answering?
  router.get('/health', requireAuth('admin'), async (_req, res) => {
    const database = async () => {
      if (!isDatabaseReady()) return { ok: false, error: 'Not connected to MongoDB.' };
      try {
        await mongoose.connection.db.admin().ping();
        return { ok: true, error: null };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    };
    const [db, cloudinary, deploy] = await Promise.all([database(), images.check(), lastDeploy()]);
    const hook = deploy.problem
      ? { ok: false, error: deploy.problem }
      : deploy.at && !deploy.ok
        ? { ok: false, error: `Last call failed: ${deploy.error}` }
        : { ok: true, error: null };
    res.json({
      database: db,
      cloudinary: { configured: images.isConfigured(), ...cloudinary },
      deployHook: { configured: deploy.configured, ...hook },
    });
  });

  // Rebuild the public site now (e.g. after a failed deploy hook call).
  router.post('/deploy', requireAuth('admin'), async (req, res) => {
    const deploy = await deployNow(req.user.email);
    res.status(deploy.ok ? 200 : 502).json({
      deploy: await lastDeploy(),
      message: deploy.ok ? 'Rebuild started. The site updates in about 2–3 minutes.' : deploy.error,
    });
  });

  router.use((_req, res) => res.status(404).json({ message: 'Not found.' }));
  // Async errors (Express 4 forwards them via the wrapper below).
  router.use((err, _req, res, _next) => {
    console.error('[admin]', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  });
  return router;
}
