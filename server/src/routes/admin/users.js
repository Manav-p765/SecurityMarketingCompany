import { Router } from 'express';
import mongoose from 'mongoose';
import { AdminUser } from '../../models/AdminUser.js';
import { hashPassword, validatePassword } from './auth.js';

/** Admin users (admins only — mounted behind requireAuth('admin')). */
const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

router.get('/', async (_req, res) => {
  const users = await AdminUser.find().sort({ createdAt: 1 });
  res.json({ users: users.map((u) => u.toPublic()) });
});

router.post('/', async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const role = req.body?.role === 'admin' ? 'admin' : 'editor';
  const errors = {};
  if (!name || name.length > 120) errors.name = 'Enter a name.';
  if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  else if (await AdminUser.exists({ email })) errors.email = 'Someone already uses that email.';
  const problem = validatePassword(req.body?.password);
  if (problem) errors.password = problem;
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const user = await AdminUser.create({ name, email, role, passwordHash: await hashPassword(req.body.password) });
  return res.status(201).json({ user: user.toPublic() });
});

async function findUser(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ message: 'User not found.' });
    return null;
  }
  const user = await AdminUser.findById(req.params.id);
  if (!user) res.status(404).json({ message: 'User not found.' });
  return user;
}

router.post('/:id/reset-password', async (req, res) => {
  const user = await findUser(req, res);
  if (!user) return undefined;
  const problem = validatePassword(req.body?.password);
  if (problem) return res.status(400).json({ errors: { password: problem } });
  user.passwordHash = await hashPassword(req.body.password);
  user.sessionVersion += 1; // signs them out everywhere
  await user.save();
  return res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  const user = await findUser(req, res);
  if (!user) return undefined;
  if (user.id === req.user.id) return res.status(400).json({ message: 'You cannot remove your own account.' });
  if (user.role === 'admin' && (await AdminUser.countDocuments({ role: 'admin' })) <= 1) {
    return res.status(400).json({ message: 'There must always be at least one admin.' });
  }
  await user.deleteOne();
  return res.json({ ok: true });
});

export default router;
