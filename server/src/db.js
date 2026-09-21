import mongoose from 'mongoose';

/**
 * Connects to MongoDB. The API still boots if this fails so the marketing
 * site never goes down with the database — lead submissions return 503 until
 * the connection recovers.
 */
export async function connectDatabase(uri) {
  mongoose.connection.on('connected', () => console.log('[db] connected'));
  mongoose.connection.on('disconnected', () => console.warn('[db] disconnected'));
  mongoose.connection.on('error', (err) => console.error('[db] error:', err.message));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
