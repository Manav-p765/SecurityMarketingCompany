import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

/**
 * Admin sessions: a signed JWT in an httpOnly cookie, valid for 7 days.
 * The site calls the API through a Vercel rewrite (/api/* on the site's own
 * domain), so the cookie is first-party: SameSite=Lax, Secure in production.
 *
 * The token carries the user id and their `sessionVersion`; a password
 * change or reset bumps the version, which ends every existing session.
 */
export const COOKIE_NAME = 'smc_admin';
export const SESSION_DAYS = 7;
const MAX_AGE_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

const secret = () => process.env.JWT_SECRET || process.env.SESSION_SECRET || '';
export const isAuthConfigured = () => secret().length >= 32;

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/admin',
});

export function setSessionCookie(res, user) {
  const token = jwt.sign({ sub: user.id, ver: user.sessionVersion }, secret(), {
    algorithm: 'HS256',
    expiresIn: `${SESSION_DAYS}d`,
  });
  res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: MAX_AGE_MS });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

export function readCookie(req, name) {
  for (const part of (req.headers.cookie || '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return '';
}

/** The signed-in user for this request, or null. */
export async function sessionUser(req) {
  if (!isAuthConfigured()) return null;
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret(), { algorithms: ['HS256'] });
    const user = await AdminUser.findById(payload.sub);
    if (!user || user.sessionVersion !== payload.ver) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Route guard: requires a valid session and (optionally) one of `roles`.
 * Use on every /api/admin route except login.
 */
export function requireAuth(...roles) {
  return async (req, res, next) => {
    if (!isAuthConfigured()) {
      return res.status(503).json({ message: 'Admin sign-in is not configured on the server (JWT_SECRET).' });
    }
    const user = await sessionUser(req);
    if (!user) {
      clearSessionCookie(res);
      return res.status(401).json({ message: 'Please sign in.' });
    }
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do that.' });
    }
    req.user = user;
    return next();
  };
}

/**
 * Cross-site request protection on top of SameSite=Lax: a state-changing
 * request that names an Origin must come from one of `allowedOrigins`.
 */
export function checkOrigin(allowedOrigins) {
  return (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const origin = req.get('origin');
    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ message: 'Request blocked.' });
    }
    return next();
  };
}
