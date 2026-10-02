import mongoose from 'mongoose';

/** Blog categories. Posts store the category name (see Post.category). */
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);
