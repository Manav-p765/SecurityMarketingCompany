/**
 * Admin API client. Calls are same-origin (/api/admin/...), so the httpOnly
 * session cookie goes along automatically: through the Vercel rewrite in
 * production, through the Vite proxy locally.
 */
export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

let onUnauthorized = null;
/** Called on any 401 (session expired or signed out elsewhere). */
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export async function api(path, { method = 'GET', body, form } = {}) {
  let response;
  try {
    response = await fetch(`/api/admin${path}`, {
      method,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }
  const data = (response.headers.get('content-type') || '').includes('application/json')
    ? await response.json().catch(() => ({}))
    : {};
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/login')) onUnauthorized?.();
    throw new ApiError(
      data.message || (data.errors ? 'Please check the highlighted fields.' : `Something went wrong (${response.status}).`),
      response.status,
      data.errors || {}
    );
  }
  return data;
}

/** "Oct 1, 2026, 3:45 PM" */
export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '—';

/** "Oct 1, 2026" */
export const formatDay = (value) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

/** Same rules as the server (server/src/services/slug.js). */
export function slugify(text, maxLength = 80) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');
}
