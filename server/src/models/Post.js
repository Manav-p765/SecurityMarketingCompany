import mongoose from 'mongoose';

/**
 * Blog posts, written in the admin (/admin). The public site reads published
 * posts at build time (GET /api/public/posts) and prerenders them.
 *
 * - slug: URL (/blog/<slug>). Generated from the title, unique, editable only
 *   until the post is first published (publishedAt set).
 * - contentHtml: sanitized on every save (services/sanitize.js).
 * - publishedAt: the date shown on the post; set on first publish and kept
 *   through unpublish/republish, so URLs and dates stay stable.
 */
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, maxlength: 1000 },
    publicId: { type: String, trim: true, maxlength: 300 },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 120 },
    excerpt: { type: String, default: '', trim: true, maxlength: 400 },
    category: { type: String, default: '', trim: true, maxlength: 80 },
    coverImage: { type: imageSchema, default: undefined },
    contentHtml: { type: String, default: '' },
    author: { type: String, default: 'Security Marketing Company Team', trim: true, maxlength: 120 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    publishedAt: { type: Date, default: null },
    seoTitle: { type: String, default: '', trim: true, maxlength: 120 },
    seoDescription: { type: String, default: '', trim: true, maxlength: 320 },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, publishedAt: -1 });

export const Post = mongoose.model('Post', postSchema);
