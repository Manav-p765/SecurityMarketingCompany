/**
 * One-time import of the markdown blog posts into MongoDB (October 2026).
 *
 *   node scripts/migrate-blog-posts.js <folder-with-md-files> [--dry-run]
 *
 * Converts each post's markdown to HTML exactly as the old build step did
 * (same heading ids, link and image attributes), sanitizes it with the same
 * allowlist the admin uses, and keeps its slug and date, so every URL stays
 * the same. Posts whose slug already exists are skipped, so re-running is
 * safe. Also creates the categories the posts use.
 *
 * The markdown files were removed from the repo after the import; they
 * remain in git history (client/src/content/blog/ before commit "Replace
 * Sveltia blog admin").
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { Marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import { Post } from '../src/models/Post.js';
import { Category } from '../src/models/Category.js';
import { sanitizePostHtml } from '../src/services/sanitize.js';
import { slugify } from '../src/services/slug.js';

const escapeAttr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const headingId = (text) =>
  String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z0-9#]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// The renderer the site used for markdown posts (client/scripts/markdown.js).
const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${headingId(text)}">${text}</h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      const attrs = [
        `href="${escapeAttr(href)}"`,
        title ? `title="${escapeAttr(title)}"` : '',
        external ? 'target="_blank" rel="noopener noreferrer"' : '',
      ].filter(Boolean);
      return `<a ${attrs.join(' ')}>${text}</a>`;
    },
    image({ href, title, text }) {
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
      return `<img src="${escapeAttr(href)}" alt="${escapeAttr(text)}"${titleAttr} loading="lazy" />`;
    },
  },
});

function readPost(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`${file}: no frontmatter`);
  const fm = parseYaml(match[1]);
  const body = raw.slice(match[0].length);
  const slug = fm.slug || path.basename(file, '.md');
  const date = String(fm.date).slice(0, 10);
  const publishedAt = new Date(`${date}T00:00:00.000Z`);
  return {
    title: fm.title,
    slug,
    excerpt: fm.excerpt,
    category: fm.category,
    author: fm.author || 'Security Marketing Company Team',
    coverImage: fm.coverImage ? { url: fm.coverImage, publicId: '' } : undefined,
    contentHtml: sanitizePostHtml(marked.parse(body)),
    status: fm.draft === true ? 'draft' : 'published',
    publishedAt: fm.draft === true ? null : publishedAt,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  };
}

async function main() {
  const [folder, flag] = process.argv.slice(2);
  if (!folder || !fs.existsSync(folder)) throw new Error('Usage: node scripts/migrate-blog-posts.js <folder> [--dry-run]');
  const dryRun = flag === '--dry-run';
  const posts = fs
    .readdirSync(folder)
    .filter((f) => f.endsWith('.md'))
    .map((f) => readPost(path.join(folder, f)));

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`Database: ${mongoose.connection.host}/${mongoose.connection.name}${dryRun ? ' (dry run)' : ''}`);

  for (const name of [...new Set(posts.map((p) => p.category).filter(Boolean))]) {
    if (await Category.exists({ name })) continue;
    console.log(`  category: ${name}`);
    if (!dryRun) await Category.create({ name, slug: slugify(name) });
  }
  for (const post of posts) {
    if (await Post.exists({ slug: post.slug })) {
      console.log(`  skip (exists): ${post.slug}`);
      continue;
    }
    console.log(`  import: ${post.slug} (${post.status}, ${post.publishedAt?.toISOString().slice(0, 10)})`);
    // timestamps: false keeps the original dates as createdAt/updatedAt.
    if (!dryRun) await Post.create([post], { timestamps: false });
  }
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
