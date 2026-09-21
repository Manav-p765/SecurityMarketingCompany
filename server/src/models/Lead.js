import mongoose from 'mongoose';

export const SERVICES = [
  'SEO',
  'WordPress Development',
  'Shopify Development',
  'Marketing',
  'Not sure yet',
];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 160 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Invalid email address'],
    },
    service: { type: String, required: true, enum: SERVICES },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    source: { type: String, default: 'securitymarketingcompany.com' },
    userAgent: { type: String, maxlength: 512 },
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);
