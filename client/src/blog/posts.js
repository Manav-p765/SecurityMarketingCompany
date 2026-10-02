import publishedPosts from 'virtual:blog-posts';

/**
 * Blog posts. `loadPosts()` is the only function that knows where posts come
 * from: every published post, fetched from the API's public endpoint at
 * build time (scripts/blog-source.js, through the `virtual:blog-posts`
 * module in vite.config.js). Posts are written in the admin panel at /admin
 * and stored in MongoDB; drafts are never returned by the API.
 *
 * Post shape:
 *   { slug, title, date: 'YYYY-MM-DD', updated: 'YYYY-MM-DD', excerpt,
 *     category, author, coverImage (URL or null), readingTime (minutes),
 *     service (null: the in-article box picks one from the category), html,
 *     seoTitle, seoDescription }
 *
 * The same module runs in the browser and, through Vite, in
 * scripts/prerender.js, so pages, sitemap and schema always agree.
 */

const WORDS_PER_MINUTE = 225;

/** Words in post HTML, for the reading time. */
const wordCount = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

/** Every published post, newest first. */
export function loadPosts() {
  const posts = publishedPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    updated: post.updated || post.date,
    excerpt: post.excerpt,
    category: post.category,
    author: post.author,
    coverImage: post.coverImage || null,
    service: post.service || null,
    readingTime: Math.max(1, Math.ceil(wordCount(post.html) / WORDS_PER_MINUTE)),
    html: post.html,
    seoTitle: post.seoTitle || '',
    seoDescription: post.seoDescription || '',
  }));

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
