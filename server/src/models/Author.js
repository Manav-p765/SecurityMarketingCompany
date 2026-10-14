import mongoose from 'mongoose';

/**
 * Blog authors, managed by admins in /admin/authors. Every post points at
 * one (Post.authorId). Published posts show the author's byline and bio box,
 * and each author with a published post gets a page at /blog/author/<slug>.
 *
 * - slug: the author page URL, unique. Generated from the name.
 * - isTeam: the default author ("Security Marketing Company Team", created
 *   by scripts/migrate-authors.js). Posts without a chosen author use it, it
 *   is marked up as an Organization rather than a Person, and it cannot be
 *   deleted.
 * - photo: a square Cloudinary upload, shown as a circle.
 */
export const AUTHOR_LIMITS = { name: 120, role: 120, bio: 600, url: 300 };

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, maxlength: 1000 },
    publicId: { type: String, trim: true, maxlength: 300 },
  },
  { _id: false }
);

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: AUTHOR_LIMITS.name },
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 120 },
    role: { type: String, default: '', trim: true, maxlength: AUTHOR_LIMITS.role },
    bio: { type: String, default: '', trim: true, maxlength: AUTHOR_LIMITS.bio },
    photo: { type: photoSchema, default: undefined },
    linkedinUrl: { type: String, default: '', trim: true, maxlength: AUTHOR_LIMITS.url },
    xUrl: { type: String, default: '', trim: true, maxlength: AUTHOR_LIMITS.url },
    websiteUrl: { type: String, default: '', trim: true, maxlength: AUTHOR_LIMITS.url },
    isTeam: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Author = mongoose.model('Author', authorSchema);

/** The default author, as scripts/migrate-authors.js creates it. */
export const TEAM_AUTHOR = {
  name: 'Security Marketing Company Team',
  slug: 'security-marketing-company-team',
  role: 'Marketing Team',
  bio:
    'We market security companies and nothing else: guard and patrol firms, alarm and CCTV installers, ' +
    'and access control integrators. Our articles cover the websites, SEO, paid ads and lead follow-up ' +
    'that turn buyers searching for security into signed contracts, drawn from the work we do for ' +
    'security companies every day.',
  // The site's round badge logo, as a 400px square served by the site
  // (client/public/logo/author-team.jpg). Replaceable in /admin/authors.
  photoPath: '/logo/author-team.jpg',
};

/** The default (team) author; null until scripts/migrate-authors.js has run. */
export const teamAuthor = () => Author.findOne({ isTeam: true }).sort({ createdAt: 1 });
