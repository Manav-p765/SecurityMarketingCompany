import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { clientIp } from '../../clientIp.js';
import { AdminUser } from '../../models/AdminUser.js';
import {
  clearSessionCookie,
  isAuthConfigured,
  requireAuth,
  setSessionCookie,
} from '../../auth/session.js';

export const BCRYPT_COST = 12;
export const MIN_PASSWORD = 10;

/** Same message for unknown email and wrong password, so neither leaks. */
const LOGIN_FAILED = 'Incorrect email or password.';
// Compared against when the email is unknown, so both paths take as long.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password-placeholder', BCRYPT_COST);

export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    return `Use at least ${MIN_PASSWORD} characters.`;
  }
  if (password.length > 200) return 'That password is too long.';
  return null;
}

export const hashPassword = (password) => bcrypt.hash(password, BCRYPT_COST);

// 10 failed attempts per visitor + email per 15 minutes (successful logins
// don't count), plus 30 per visitor across all emails.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${clientIp(req)}|${String(req.body?.email ?? '').trim().toLowerCase()}`,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Please wait 15 minutes and try again.' },
});

const router = Router();

const visitorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  skipSuccessfulRequests: true,
  keyGenerator: clientIp,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Please wait 15 minutes and try again.' },
});

router.post('/login', visitorLimiter, loginLimiter, async (req, res) => {
  if (!isAuthConfigured()) {
    return res.status(503).json({ message: 'Admin sign-in is not configured on the server (JWT_SECRET).' });
  }
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  if (!email || !password || email.length > 254 || password.length > 200) {
    return res.status(400).json({ message: LOGIN_FAILED });
  }

  const user = await AdminUser.findOne({ email });
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return res.status(401).json({ message: LOGIN_FAILED });

  user.lastLoginAt = new Date();
  await user.save();
  setSessionCookie(res, user);
  return res.json({ user: user.toPublic() });
});

router.post('/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth(), (req, res) => res.json({ user: req.user.toPublic() }));

router.post('/change-password', requireAuth(), async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  const ok = await bcrypt.compare(String(currentPassword ?? ''), req.user.passwordHash);
  if (!ok) return res.status(400).json({ errors: { currentPassword: 'That is not your current password.' } });
  const problem = validatePassword(newPassword);
  if (problem) return res.status(400).json({ errors: { newPassword: problem } });

  req.user.passwordHash = await hashPassword(newPassword);
  req.user.sessionVersion += 1; // signs out every other session
  await req.user.save();
  setSessionCookie(res, req.user); // keeps this one signed in
  return res.json({ ok: true });
});

export default router;
