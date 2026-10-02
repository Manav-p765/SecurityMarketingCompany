import { Router } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../../models/Lead.js';

/** Contact form leads (admins only — mounted behind requireAuth('admin')). */
const router = Router();
const PAGE_SIZE = 25;
const EXPORT_LIMIT = 10_000;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Filter from ?search=&from=YYYY-MM-DD&to=YYYY-MM-DD (dates inclusive, UTC). */
function leadFilter(query) {
  const filter = {};
  const search = String(query.search ?? '').trim().slice(0, 100);
  if (search) {
    const re = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: re }, { company: re }, { email: re }, { service: re }, { message: re }];
  }
  const range = {};
  if (/^\d{4}-\d{2}-\d{2}$/.test(query.from ?? '')) range.$gte = new Date(`${query.from}T00:00:00.000Z`);
  if (/^\d{4}-\d{2}-\d{2}$/.test(query.to ?? '')) range.$lte = new Date(`${query.to}T23:59:59.999Z`);
  if (Object.keys(range).length) filter.createdAt = range;
  return filter;
}

const toAdmin = (lead) => ({
  id: lead.id,
  name: lead.name,
  company: lead.company,
  email: lead.email,
  service: lead.service,
  message: lead.message,
  createdAt: lead.createdAt,
});

router.get('/', async (req, res) => {
  const filter = leadFilter(req.query);
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const [total, leads] = await Promise.all([
    Lead.countDocuments(filter),
    Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE),
  ]);
  res.json({ leads: leads.map(toAdmin), page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total });
});

/**
 * CSV of every lead matching the same filters. Cells that start with
 * = + - @ are prefixed with ' so spreadsheet apps never run them as formulas.
 */
router.get('/export.csv', async (req, res) => {
  const leads = await Lead.find(leadFilter(req.query)).sort({ createdAt: -1 }).limit(EXPORT_LIMIT);
  const cell = (value) => {
    let text = String(value ?? '');
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const rows = [
    ['Date (UTC)', 'Name', 'Company', 'Email', 'Service', 'Message'],
    ...leads.map((l) => [l.createdAt.toISOString(), l.name, l.company, l.email, l.service, l.message]),
  ];
  const csv = `﻿${rows.map((row) => row.map(cell).join(',')).join('\r\n')}\r\n`;
  const date = new Date().toISOString().slice(0, 10);
  res
    .set('Content-Type', 'text/csv; charset=utf-8')
    .set('Content-Disposition', `attachment; filename="leads-${date}.csv"`)
    .set('Cache-Control', 'no-store')
    .send(csv);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Lead not found.' });
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found.' });
  return res.json({ lead: toAdmin(lead) });
});

export default router;
