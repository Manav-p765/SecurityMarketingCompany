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

// Render's free plan sleeps when idle and can take a minute or more to wake.
// Wake it first (GET /api/health), retrying with backoff: 5 attempts with
// waits of 6, 12, 24 and 48 seconds (90s in all), each request allowed 90s.
const ATTEMPTS = 5;
const TIMEOUT_MS = 90_000;
const FIRST_DELAY_MS = 6_000;

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

/** fetch + JSON with retries and backoff. Throws the last error. */
async function getJson(url, label) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const started = Date.now();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (attempt > 1) console.log(`[blog] ${label}: answered on attempt ${attempt}`);
      return data;
    } catch (err) {
      lastError = err;
      const seconds = ((Date.now() - started) / 1000).toFixed(1);
      if (attempt < ATTEMPTS) {
        const wait = FIRST_DELAY_MS * 2 ** (attempt - 1);
        console.warn(`[blog] ${label}: attempt ${attempt}/${ATTEMPTS} failed after ${seconds}s (${err.message}); retrying in ${wait / 1000}s`);
        await sleep(wait);
      } else {
        console.warn(`[blog] ${label}: attempt ${attempt}/${ATTEMPTS} failed after ${seconds}s (${err.message})`);
      }
    }
  }
  throw lastError;
}

function stop(url, reason) {
  return new Error(
    `Blog: could not load published posts from ${url} — ${reason}.\n` +
      '  The build was stopped so the site is never deployed without its blog.\n' +
      '  Check that the API is running (GET /api/health), or set BLOG_API_URL to another API.'
  );
}

/**
 * Every published post from the API. Throws on any failure (see above).
 * Only network trouble is retried; a wrong answer will not fix itself.
 */
export async function fetchPublishedPosts({ allowEmpty = process.env.ALLOW_EMPTY_BLOG === '1' } = {}) {
  const base = blogApiUrl();
  const url = `${base}/api/public/posts`;
  try {
    await getJson(`${base}/api/health`, 'waking the API');
  } catch (err) {
    throw stop(url, `the API did not answer after ${ATTEMPTS} attempts (${err.message})`);
  }
  let data;
  try {
    data = await getJson(url, 'loading posts');
  } catch (err) {
    throw stop(url, err.message);
  }
  try {
    if (!Array.isArray(data?.posts)) throw new Error('response has no "posts" list');
    const posts = data.posts.map(check);
    if (!posts.length && !allowEmpty) {
      throw new Error('the API returned zero published posts (set ALLOW_EMPTY_BLOG=1 if that is intended)');
    }
    console.log(`[blog] loaded ${posts.length} published posts from ${base}`);
    return posts;
  } catch (err) {
    throw stop(url, err.message);
  }
}
