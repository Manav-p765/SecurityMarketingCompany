import { getState, setState } from '../models/AppState.js';

/**
 * Rebuilds the public site when published blog content changes, by calling
 * the Vercel Deploy Hook (VERCEL_DEPLOY_HOOK_URL). Debounced: several saves
 * within DEBOUNCE_MS trigger one deploy, DEBOUNCE_MS after the last one.
 * The pending timer lives in memory; if the server restarts in that window,
 * the next change schedules it again. Admins can also rebuild right away
 * (deployNow), e.g. after a failed hook call.
 */
export const DEBOUNCE_MS = Number(process.env.DEPLOY_DEBOUNCE_MS) || 60_000;
const STATE_KEY = 'lastDeploy';

let timer = null;
let reasons = new Set();

const hookUrl = () => (process.env.VERCEL_DEPLOY_HOOK_URL || '').trim();
export const isDeployConfigured = () => Boolean(hookUrl());

/**
 * Why the hook URL cannot work, or null if it looks right. A Vercel deploy
 * hook is https://api.vercel.com/v1/integrations/deploy/prj_<project>/<hook>;
 * a URL missing the project part is rejected by Vercel (415/404).
 */
export function hookProblem() {
  const url = hookUrl();
  if (!url) return 'VERCEL_DEPLOY_HOOK_URL is not set.';
  if (!/^https:\/\/api\.vercel\.com\/v1\/integrations\/deploy\/prj_[A-Za-z0-9]+\/[A-Za-z0-9]+\/?(\?.*)?$/.test(url)) {
    return 'VERCEL_DEPLOY_HOOK_URL is incomplete. It should look like https://api.vercel.com/v1/integrations/deploy/prj_…/… — copy the whole URL again from Vercel.';
  }
  return null;
}

/** Time and outcome of the last deploy request, for the dashboard. */
export async function lastDeploy() {
  const state = (await getState(STATE_KEY)) || null;
  return { ...state, pending: Boolean(timer), configured: isDeployConfigured(), problem: hookProblem() };
}

/** Vercel's answer, in words an admin can act on. */
function describeHookFailure(status) {
  if (status === 404 || status === 415) {
    return `HTTP ${status}: Vercel does not recognise this deploy hook. Create a new hook in Vercel and update VERCEL_DEPLOY_HOOK_URL on Render.`;
  }
  if (status === 429) return 'HTTP 429: Vercel is rate-limiting deploys. Try again in a few minutes.';
  return `HTTP ${status} from Vercel.`;
}

/** Calls the hook now and records the outcome. Resolves the recorded state. */
async function fire({ reason, by } = {}) {
  const at = new Date().toISOString();
  let state;
  if (!isDeployConfigured()) {
    console.warn('[deploy] VERCEL_DEPLOY_HOOK_URL is not set; skipping deploy:', reason);
    state = { at, reason, by, ok: false, error: 'Deploy hook not configured (VERCEL_DEPLOY_HOOK_URL).' };
  } else {
    try {
      const response = await fetch(hookUrl(), { method: 'POST', signal: AbortSignal.timeout(15_000) });
      const body = await response.text().catch(() => '');
      if (response.ok) {
        console.log(`[deploy] hook triggered: ${reason}`);
        state = { at, reason, by, ok: true, error: null };
      } else {
        console.error(`[deploy] hook failed (HTTP ${response.status}): ${body.slice(0, 300)} — ${reason}`);
        state = { at, reason, by, ok: false, error: describeHookFailure(response.status) };
      }
    } catch (err) {
      console.error('[deploy] hook request failed:', err);
      state = { at, reason, by, ok: false, error: `Could not reach Vercel: ${err.message}` };
    }
  }
  await setState(STATE_KEY, state).catch((err) => console.error('[deploy] could not record the deploy:', err.message));
  return state;
}

async function fireScheduled() {
  timer = null;
  const reason = [...reasons].join('; ');
  reasons = new Set();
  await fire({ reason });
}

/** Schedule a site rebuild. Calls within the debounce window are combined. */
export function scheduleDeploy(reason) {
  reasons.add(reason);
  if (timer) clearTimeout(timer);
  timer = setTimeout(fireScheduled, DEBOUNCE_MS);
  timer.unref?.();
}

/** Rebuild right away (admin action). Folds in any scheduled reasons. */
export async function deployNow(by) {
  if (timer) clearTimeout(timer);
  timer = null;
  const reason = ['manual rebuild', ...reasons].join('; ');
  reasons = new Set();
  return fire({ reason, by });
}
