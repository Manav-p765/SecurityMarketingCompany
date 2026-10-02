import { Router } from 'express';
import mongoose from 'mongoose';
import { Category } from '../../models/Category.js';
import { Post } from '../../models/Post.js';
import { requireAuth } from '../../auth/session.js';
import { slugify } from '../../services/slug.js';
import { scheduleDeploy } from '../../services/deploy.js';

/**
 * Blog categories. Everyone signed in can list them (the post editor needs
 * the list); only admins can change them. Posts store the category name, so
 * a rename updates the posts too. A category in use cannot be deleted.
 */
const router = Router();

const readName = (body) => String(body?.name ?? '').trim().replace(/\s+/g, ' ');

function validateName(name) {
  if (!name) return 'Enter a name.';
  if (name.length > 80) return 'Keep it under 80 characters.';
  if (!slugify(name)) return 'Use at least one letter or number.';
  return null;
}

async function withCounts(categories) {
  const counts = await Post.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const byName = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, posts: byName[c.name] || 0 }));
}

router.get('/', async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories: await withCounts(categories) });
});

router.post('/', requireAuth('admin'), async (req, res) => {
  const name = readName(req.body);
  const problem = validateName(name);
  if (problem) return res.status(400).json({ errors: { name: problem } });
  const slug = slugify(name);
  if (await Category.exists({ $or: [{ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }, { slug }] })) {
    return res.status(400).json({ errors: { name: 'That category already exists.' } });
  }
  const category = await Category.create({ name, slug });
  return res.status(201).json({ category: (await withCounts([category]))[0] });
});

router.put('/:id', requireAuth('admin'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Category not found.' });
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  const name = readName(req.body);
  const problem = validateName(name);
  if (problem) return res.status(400).json({ errors: { name: problem } });
  const slug = slugify(name);
  if (await Category.exists({ _id: { $ne: category.id }, $or: [{ name }, { slug }] })) {
    return res.status(400).json({ errors: { name: 'That category already exists.' } });
  }

  const oldName = category.name;
  category.name = name;
  category.slug = slug;
  await category.save();
  if (oldName !== name) {
    await Post.updateMany({ category: oldName }, { $set: { category: name } });
    if (await Post.exists({ category: name, status: 'published' })) {
      scheduleDeploy(`renamed category "${oldName}" to "${name}"`);
    }
  }
  return res.json({ category: (await withCounts([category]))[0] });
});

router.delete('/:id', requireAuth('admin'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Category not found.' });
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });
  const inUse = await Post.countDocuments({ category: category.name });
  if (inUse) {
    return res.status(400).json({
      message: `"${category.name}" is used by ${inUse} post${inUse === 1 ? '' : 's'}. Move them to another category first.`,
    });
  }
  await category.deleteOne();
  return res.json({ ok: true });
});

export default router;
