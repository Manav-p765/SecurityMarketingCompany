import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { gaHeadSnippet } from './src/analytics.js';
import { fetchPublishedPosts } from './scripts/blog-source.js';

/**
 * Blog posts as `import posts from 'virtual:blog-posts'`: every published
 * post, fetched from the API at build time (scripts/blog-source.js) and
 * baked into the bundle, so posts are prerendered like any other page.
 *
 * Builds (and prerender.js, which sets BLOG_STRICT=1) fail if the posts
 * cannot be loaded. Only the local dev server carries on with an empty
 * blog, with a warning, so the rest of the site can be worked on offline.
 */
function blogPosts() {
  const ID = 'virtual:blog-posts';
  const RESOLVED = `\0${ID}`;
  let command = 'build';
  return {
    name: 'blog-posts',
    configResolved(config) {
      command = config.command;
    },
    resolveId(id) {
      return id === ID ? RESOLVED : null;
    },
    async load(id) {
      if (id !== RESOLVED) return null;
      const strict = command === 'build' || process.env.BLOG_STRICT === '1';
      try {
        const posts = await fetchPublishedPosts({ allowEmpty: !strict || process.env.ALLOW_EMPTY_BLOG === '1' });
        return `export default ${JSON.stringify(posts)};`;
      } catch (err) {
        if (strict) throw err;
        this.warn(`${err.message}\n  Dev server: continuing with no blog posts.`);
        return 'export default [];';
      }
    },
  };
}

/**
 * Writes the Google tag into the <head> of index.html, right after the
 * charset and viewport tags. prerender.js copies the built index.html for
 * every other page, so they all carry it. The snippet itself checks the
 * hostname, so it is safe to include in dev and preview builds.
 */
function googleTag() {
  const anchor = '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
  return {
    name: 'google-tag',
    transformIndexHtml(html) {
      if (!html.includes(anchor)) throw new Error('google-tag: viewport meta not found in index.html');
      return html.replace(anchor, `${anchor}\n\n    ${gaHeadSnippet()}\n`);
    },
  };
}

// The site calls the API at relative /api URLs. In production a Vercel
// rewrite (vercel.json) sends them to the API on Render; locally the dev and
// preview servers forward them to the Express API.
const apiProxy = {
  '/api': {
    target: process.env.LOCAL_API_URL || 'http://localhost:5000',
    changeOrigin: false,
  },
};

export default defineConfig({
  plugins: [blogPosts(), react(), googleTag()],
  server: { port: 5173, proxy: apiProxy },
  preview: { port: 4173, proxy: apiProxy },
});
