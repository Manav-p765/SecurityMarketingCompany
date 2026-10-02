/**
 * Where blog posts come from: the public API (published posts only),
 * fetched at build time. The Vite plugin in vite.config.js turns the result
 * into the `virtual:blog-posts` module that src/blog/posts.js reads, so the
 * posts are baked into the build and prerendered like every other page.
 *
 * BLOG_API_URL sets the API origin (default: the production API on Render).
 *
 * Safety: a build must never ship a blog with zero posts by accident. If the
 * API cannot be reached, answers with an error, or returns no posts, this
 * throws and the build fails — the live site keeps its previous deploy.
 * Set ALLOW_EMPTY_BLOG=1 only if an empty blog is really intended.
 */
export const DEFAULT_BLOG_API = 'https://securitymarketingcompany.onrender.com';

const ATTEMPTS = 4;
const TIMEOUT_MS = 60_000; // Render's free plan can take up to a minute to wake
const RETRY_DELAY_MS = 5_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const blogApiUrl = () => (process.env.BLOG_API_URL || DEFAULT_BLOG_API).replace(/\/+$/, '');

function check(post, index) {
  for (const key of ['slug', 'title', 'date', 'excerpt', 'category', 'author', 'html']) {
    if (typeof post?.[key] !== 'string' || !post[key]) {
      throw new Error(`post ${index + 1} (${post?.slug ?? 'no slug'}) has no "${key}"`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) throw new Error(`post "${post.slug}" has a bad date "${post.date}"`);
  return post;
}

/** Every published post from the API. Throws on any failure (see above). */
export async function fetchPublishedPosts({ allowEmpty = process.env.ALLOW_EMPTY_BLOG === '1' } = {}) {
  const url = `${blogApiUrl()}/api/public/posts`;
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data?.posts)) throw new Error('response has no "posts" list');
      const posts = data.posts.map(check);
      if (!posts.length && !allowEmpty) {
        throw new Error('the API returned zero published posts (set ALLOW_EMPTY_BLOG=1 if that is intended)');
      }
      return posts;
    } catch (err) {
      lastError = err;
      // A wrong answer will not fix itself; only retry network problems.
      if (/zero published|no "posts"|has no|bad date/.test(err.message)) break;
      if (attempt < ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }
  throw new Error(
    `Blog: could not load published posts from ${url} — ${lastError?.message}.\n` +
      '  The build was stopped so the site is never deployed without its blog.\n' +
      '  Check that the API is running (GET /api/health), or set BLOG_API_URL to another API.'
  );
}
