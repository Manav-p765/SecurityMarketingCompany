import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { connectDatabase, isDatabaseReady } from './db.js';
import leadRoutes from './routes/leads.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/security-marketing';
const ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: ORIGINS }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: isDatabaseReady() ? 'connected' : 'disconnected' });
});

app.use('/api', leadRoutes);

// Unknown API routes get a JSON 404, not the HTML page.
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found.' }));

// In production the Express app also serves the built React bundle — when it
// exists. Hosted API-only (e.g. Render, with the client on Vercel) it won't.
const dist = path.resolve(__dirname, '../../client/dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(dist)) {
  // /services and each /services/:slug have their own prerendered HTML (see
  // client/scripts/prerender.js), so they get their own meta tags on a direct
  // load or refresh. Registered before the static handler: dist/services/ is
  // a folder, and express.static would otherwise redirect /services to
  // /services/.
  app.get('/services', (_req, res) => res.sendFile(path.join(dist, 'services.html')));
  app.get('/services/:slug', (req, res, next) => {
    const { slug } = req.params;
    const file = path.join(dist, 'services', `${slug}.html`);
    // Only slugs the build wrote a page for; anything else falls through to the 404.
    if (/^[a-z0-9-]+$/.test(slug) && fs.existsSync(file)) return res.sendFile(file);
    return next();
  });
  app.use(express.static(dist, { redirect: false }));
  // Any other path renders the client's 404 screen with a real 404 status so
  // search engines drop it.
  app.get('*', (_req, res) => res.status(404).sendFile(path.join(dist, '404.html')));
}

connectDatabase(MONGODB_URI).catch((err) =>
  console.error('[db] initial connection failed:', err.message)
);

app.listen(PORT, () => {
  console.log(`[api] Security Marketing Company API listening on http://localhost:${PORT}`);
});
