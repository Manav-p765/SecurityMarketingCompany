/**
 * One-time move from the free-text post author to blog authors (October 2026).
 *
 *   node scripts/migrate-authors.js [--dry-run]
 *
 * 1. Creates the default author "Security Marketing Company Team" (isTeam,
 *    see TEAM_AUTHOR in src/models/Author.js) if there is none. Its photo is
 *    the site's round badge logo (client/public/logo/author-team.jpg, served
 *    from the live site); admins can replace it in /admin/authors.
 * 2. Assigns every post that has no author to it.
 * 3. Removes the old free-text `author` field from posts.
 *
 * Safe to re-run: an existing team author is kept, and posts that already
 * have an author are left alone.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { Author, TEAM_AUTHOR } from '../src/models/Author.js';
import { Post } from '../src/models/Post.js';
import { SITE_URL } from '../src/config.js';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}${dryRun ? ' (dry run)' : ''}`);

  let team = await Author.findOne({ isTeam: true });
  if (team) {
    console.log(`Team author exists: ${team.name} (${team.id})`);
  } else {
    console.log(`Creating team author: ${TEAM_AUTHOR.name}`);
    if (!dryRun) {
      const { photoPath, ...fields } = TEAM_AUTHOR;
      team = await Author.create({ ...fields, isTeam: true, photo: { url: `${SITE_URL}${photoPath}`, publicId: '' } });
    }
  }

  // Raw collection: `author` is no longer in the Post schema.
  const posts = Post.collection;
  const legacy = await posts.find({ author: { $exists: true } }).project({ slug: 1, author: 1 }).toArray();
  for (const post of legacy.filter((p) => p.author && p.author !== TEAM_AUTHOR.name)) {
    console.log(`  note: "${post.slug}" was by "${post.author}"; it now uses the team author`);
  }

  const unassigned = { $or: [{ authorId: { $exists: false } }, { authorId: null }] };
  console.log(`Posts to assign to the team author: ${await posts.countDocuments(unassigned)}`);
  console.log(`Posts with the old author field to clean up: ${legacy.length}`);
  if (dryRun) return;

  // Raw updates, so updatedAt (the post's "updated" date) stays as it is.
  await posts.updateMany(unassigned, { $set: { authorId: team._id } });
  await posts.updateMany({ author: { $exists: true } }, { $unset: { author: '' } });
  console.log('Done.');
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
