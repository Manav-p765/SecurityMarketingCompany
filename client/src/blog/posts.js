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
 * Author shape (managed in /admin/authors):
 *   { name, slug, role, bio, photo (URL or null),
 *     links: { linkedin, x, website } (URL or null each), isTeam }
 * isTeam marks the default "Security Marketing Company Team" author.
 *
 * The same module runs in the browser and, through Vite, in
 * scripts/prerender.js, so pages, sitemap and schema always agree.
 */

const WORDS_PER_MINUTE = 225;

/**
 * The default author. Only used for posts from an API that predates authors
 * (it sends the author's name alone); the API itself sends the team author's
 * stored details.
 */
const TEAM_AUTHOR = {
  name: 'Security Marketing Company Team',
  slug: 'security-marketing-company-team',
  role: 'Marketing Team',
  bio: 'We market security companies and nothing else: guard and patrol firms, alarm and CCTV installers, and access control integrators.',
  photo: '/logo/author-team.jpg',
  links: { linkedin: null, x: null, website: null },
  isTeam: true,
};

/** A post's author in the shape above. */
function readAuthor(author) {
  if (!author || typeof author === 'string') return TEAM_AUTHOR;
  return {
    name: author.name,
    slug: author.slug,
    role: author.role || '',
    bio: author.bio || '',
    photo: author.photo || null,
    links: {
      linkedin: author.links?.linkedin || null,
      x: author.links?.x || null,
      website: author.links?.website || null,
    },
    isTeam: Boolean(author.isTeam),
  };
}

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
    author: readAuthor(post.author),
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

/**
 * Every author with at least one published post (only they get a page), in
 * order of their newest post. Two different authors cannot share a slug.
 */
export const authors = [];
for (const post of posts) {
  const known = authors.find((author) => author.slug === post.author.slug);
  if (!known) authors.push(post.author);
  else if (known.name !== post.author.name) {
    throw new Error(`Blog: authors "${known.name}" and "${post.author.name}" share the slug "${known.slug}".`);
  }
}

export const getAuthor = (slug) => authors.find((author) => author.slug === slug);

export const authorPath = (author) => `/blog/author/${author.slug}`;

/** An author's published posts, newest first. */
export const postsBy = (author) => posts.filter((post) => post.author.slug === author.slug);

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
