import 'dotenv/config';
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

// In production the Express app also serves the built React bundle.
if (process.env.NODE_ENV === 'production') {
  const dist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

connectDatabase(MONGODB_URI).catch((err) =>
  console.error('[db] initial connection failed:', err.message)
);

app.listen(PORT, () => {
  console.log(`[api] Security Marketing Company API listening on http://localhost:${PORT}`);
});
