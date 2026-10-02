import mongoose from 'mongoose';

/** Small key/value store for app-wide state, e.g. when the last deploy was triggered. */
const appStateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true, collection: 'appState' }
);

export const AppState = mongoose.model('AppState', appStateSchema);

export async function getState(key) {
  return (await AppState.findOne({ key }).lean())?.value ?? null;
}

export async function setState(key, value) {
  await AppState.updateOne({ key }, { $set: { value } }, { upsert: true });
}
