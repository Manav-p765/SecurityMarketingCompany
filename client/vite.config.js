import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { gaHeadSnippet } from './src/analytics.js';

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

export default defineConfig({
  plugins: [react(), googleTag()],
  server: {
    port: 5173,
    proxy: {
      // Forwards contact-form submissions to the Express API in development.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
