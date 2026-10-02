import mongoose from 'mongoose';

/**
 * People who can sign in to /admin. Passwords are stored only as bcrypt
 * hashes. `sessionVersion` is part of every session token; bumping it (on a
 * password change or reset) signs the user out everywhere.
 *
 * Roles: admin — posts, categories, users and leads; editor — posts only.
 * The first admin is created with `npm run create-admin` (server/scripts).
 */
const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 254 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
    sessionVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'adminUsers' }
);

/** What the API returns about a user — never the hash. */
adminUserSchema.methods.toPublic = function toPublic() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
};

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
