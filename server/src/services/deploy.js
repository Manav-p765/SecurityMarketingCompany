import { getState, setState } from '../models/AppState.js';

/**
 * Rebuilds the public site when published blog content changes, by calling
 * the Vercel Deploy Hook (VERCEL_DEPLOY_HOOK_URL). Debounced: several saves
 * within DEBOUNCE_MS trigger one deploy, DEBOUNCE_MS after the last one.
 * The pending timer lives in memory; if the server restarts in that window,
 * the next change schedules it again.
 */
export const DEBOUNCE_MS = Number(process.env.DEPLOY_DEBOUNCE_MS) || 60_000;
const STATE_KEY = 'lastDeploy';

let timer = null;
let reasons = new Set();

export const isDeployConfigured = () => Boolean(process.env.VERCEL_DEPLOY_HOOK_URL);

/** Time and outcome of the last deploy request, for the dashboard. */
export async function lastDeploy() {
  const state = (await getState(STATE_KEY)) || null;
  return { ...state, pending: Boolean(timer), configured: isDeployConfigured() };
}

async function fire() {
  timer = null;
  const reason = [...reasons].join('; ');
  reasons = new Set();
  const at = new Date().toISOString();
  if (!isDeployConfigured()) {
    console.warn('[deploy] VERCEL_DEPLOY_HOOK_URL is not set; skipping deploy:', reason);
    await setState(STATE_KEY, { at, reason, ok: false, error: 'Deploy hook not configured' }).catch(() => {});
    return;
  }
  try {
    const response = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
    const ok = response.ok;
    console.log(`[deploy] hook ${ok ? 'triggered' : `failed (${response.status})`}: ${reason}`);
    await setState(STATE_KEY, { at, reason, ok, error: ok ? null : `HTTP ${response.status}` });
  } catch (err) {
    console.error('[deploy] hook request failed:', err.message);
    await setState(STATE_KEY, { at, reason, ok: false, error: err.message }).catch(() => {});
  }
}

/** Schedule a site rebuild. Calls within the debounce window are combined. */
export function scheduleDeploy(reason) {
  reasons.add(reason);
  if (timer) clearTimeout(timer);
  timer = setTimeout(fire, DEBOUNCE_MS);
  timer.unref?.();
}
