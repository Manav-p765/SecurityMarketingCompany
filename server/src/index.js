import 'dotenv/config';
import './asyncErrors.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { connectDatabase, isDatabaseReady } from './db.js';
import { ipSource } from './clientIp.js';
import leadRoutes from './routes/leads.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/security-marketing';
const ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
// Origins allowed to make signed-in admin requests (checked on writes).
const SITE_ORIGINS = ['https://www.securitymarketingcompany.com', 'https://securitymarketingcompany.com'];
const ADMIN_ORIGINS = [...new Set([...SITE_ORIGINS, ...ORIGINS, 'http://localhost:5173', 'http://localhost:4173'])];

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: ORIGINS }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: isDatabaseReady() ? 'connected' : 'disconnected', via: ipSource(req) });
});

// The admin API parses its own (larger) JSON bodies, so it comes before the
// site-wide 32kb parser.
app.use('/api/admin', adminRoutes({ allowedOrigins: ADMIN_ORIGINS }));
app.use(express.json({ limit: '32kb' }));
app.use('/api/public', publicRoutes);
app.use('/api', leadRoutes);

// Unknown API routes get a JSON 404, not the HTML page.
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found.' }));

// In production the Express app also serves the built React bundle — when it
// exists. Hosted API-only (e.g. Render, with the client on Vercel) it won't.
const dist = path.resolve(__dirname, '../../client/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(dist)) {
  // Every page other than "/" has its own prerendered HTML (see
  // client/scripts/prerender.js), so a direct load or refresh gets that
  // page's meta tags. Registered before the static handler: dist/services/
  // and dist/blog/ are folders, and express.static would otherwise redirect
  // /services to /services/.
  const PAGES = ['services', 'about', 'contact', 'privacy', 'terms', 'thank-you', 'blog'];
  for (const page of PAGES) {
    app.get(`/${page}`, (_req, res) => res.sendFile(path.join(dist, `${page}.html`)));
  }

  // /services/:slug and /blog/:slug: only slugs the build wrote a page for.
  // Anything else falls through to the 404 below.
  for (const folder of ['services', 'blog']) {
    app.get(`/${folder}/:slug`, (req, res, next) => {
      const { slug } = req.params;
      const file = path.join(dist, folder, `${slug}.html`);
      if (/^[a-z0-9-]+$/.test(slug) && fs.existsSync(file)) return res.sendFile(file);
      return next();
    });
  }

  // Admin panel: a React route (lazy-loaded), so every /admin URL gets the
  // app shell. Never indexed.
  app.get(['/admin', '/admin/*'], (_req, res) =>
    res.set('X-Robots-Tag', 'noindex, nofollow').sendFile(path.join(dist, 'index.html'))
  );

  app.use(express.static(dist, { redirect: false }));
  // Any other path renders the client's 404 screen with a real 404 status so
  // search engines drop it.
  app.get('*', (_req, res) => res.status(404).sendFile(path.join(dist, '404.html')));
}

// Last resort for errors thrown anywhere above (see asyncErrors.js).
app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  if (res.headersSent) return;
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

connectDatabase(MONGODB_URI).catch((err) =>
  console.error('[db] initial connection failed:', err.message)
);

app.listen(PORT, () => {
  console.log(`[api] Security Marketing Company API listening on http://localhost:${PORT}`);
});
