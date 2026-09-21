import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Lead, SERVICES } from '../models/Lead.js';
import { isDatabaseReady } from '../db.js';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many submissions. Please try again shortly.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Field-level validation mirrored on the client so errors read the same way. */
function validate(body) {
  const errors = {};
  const name = String(body.name ?? '').trim();
  const company = String(body.company ?? '').trim();
  const email = String(body.email ?? '').trim();
  const service = String(body.service ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (name.length < 2) errors.name = 'Please enter your full name.';
  if (company.length < 2) errors.company = 'Please enter your company name.';
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid work email address.';
  if (!SERVICES.includes(service)) errors.service = 'Please choose a service.';
  if (message.length < 10) errors.message = 'Tell us a little more — at least 10 characters.';

  return { errors, data: { name, company, email, service, message } };
}

router.post('/leads', submitLimiter, async (req, res) => {
  // Honeypot: real visitors never fill a hidden field.
  if (String(req.body?.website ?? '').trim() !== '') {
    return res.status(200).json({ ok: true, message: 'Thanks — we will be in touch.' });
  }

  const { errors, data } = validate(req.body ?? {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  if (!isDatabaseReady()) {
    return res.status(503).json({
      ok: false,
      message:
        'We could not save your request right now. Please email andy@securitymarketingcompany.com and we will reply the same day.',
    });
  }

  try {
    const lead = await Lead.create({
      ...data,
      userAgent: req.get('user-agent')?.slice(0, 512),
    });
    return res.status(201).json({ ok: true, id: lead.id, message: 'Thanks — your request is in.' });
  } catch (err) {
    console.error('[leads] save failed:', err.message);
    return res.status(500).json({
      ok: false,
      message: 'Something went wrong on our end. Please email andy@securitymarketingcompany.com.',
    });
  }
});

export default router;
