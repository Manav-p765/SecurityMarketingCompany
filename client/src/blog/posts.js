/**
 * Blog posts. `loadPosts()` is the only function that knows where posts come
 * from. Today that is the markdown files in src/content/blog/ (rendered to
 * HTML at build time by the Vite plugin in vite.config.js), written by hand
 * or through the blog admin at /admin (Sveltia CMS). To move to a
 * headless CMS or WordPress, change loadPosts() to return the same shape and
 * leave everything else alone.
 *
 * Post shape:
 *   { slug, title, date: 'YYYY-MM-DD', excerpt, category, author,
 *     coverImage?, readingTime (minutes), service?, html }
 *
 * The same module runs in the browser and, through Vite, in
 * scripts/prerender.js, so pages, sitemap and schema always agree.
 */

const WORDS_PER_MINUTE = 225;
const REQUIRED = ['title', 'date', 'excerpt', 'category', 'author'];

/** `draft: true` in the frontmatter (the "Draft" switch in /admin). */
export const isDraft = (frontmatter) => frontmatter.draft === true || frontmatter.draft === 'true';

const text = (value) => (value == null ? '' : String(value).trim());

/** 2026-10-01, or a full date/time the admin might write, as YYYY-MM-DD. */
function toDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return text(value).slice(0, 10);
}

function toPost(doc, file) {
  const fm = doc.frontmatter;
  const fileSlug = file.split('/').pop().replace(/\.md$/, '');
  for (const key of REQUIRED) {
    if (!text(fm[key])) throw new Error(`Blog post ${file}: frontmatter "${key}" is missing.`);
  }
  const date = toDate(fm.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Blog post ${file}: date must be YYYY-MM-DD, got "${fm.date}".`);
  }
  return {
    slug: text(fm.slug) || fileSlug,
    title: text(fm.title),
    date,
    excerpt: text(fm.excerpt),
    category: text(fm.category),
    author: text(fm.author),
    coverImage: text(fm.coverImage) || null,
    service: text(fm.service) || null,
    readingTime: Number(fm.readingTime) || Math.max(1, Math.ceil(doc.words / WORDS_PER_MINUTE)),
    html: doc.html,
  };
}

/**
 * Every published post, newest first. Drafts (`draft: true`) are left out
 * before anything else looks at them, so they get no page, no card, no
 * sitemap entry and no prerendered HTML — and an unfinished draft missing a
 * field can never break the build.
 */
export function loadPosts() {
  const modules = import.meta.glob('../content/blog/*.md', { eager: true, import: 'default' });
  const posts = Object.entries(modules)
    .filter(([, doc]) => !isDraft(doc.frontmatter))
    .map(([file, doc]) => toPost(doc, file));

  const seen = new Set();
  for (const post of posts) {
    if (seen.has(post.slug)) throw new Error(`Blog: two posts share the slug "${post.slug}".`);
    seen.add(post.slug);
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export const posts = loadPosts();

export const getPost = (slug) => posts.find((post) => post.slug === slug);

/** Categories in the order they first appear (newest post first). */
export const categories = [...new Set(posts.map((post) => post.category))];

export const postPath = (post) => `/blog/${post.slug}`;

/** "2026-09-24" -> "September 24, 2026" (no time zone shift). */
export function formatDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** 2–3 related posts: same category first, then the newest others. */
export function relatedPosts(post, count = 3) {
  const others = posts.filter((item) => item.slug !== post.slug);
  const same = others.filter((item) => item.category === post.category);
  const rest = others.filter((item) => item.category !== post.category);
  return [...same, ...rest].slice(0, count);
}
