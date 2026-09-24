/**
 * Post-build step (runs after `vite build`, see package.json).
 *
 * 1. dist/404.html — a copy of index.html, so static hosts serve the app's
 *    404 screen with a real 404 status.
 * 2. dist/services.html — index.html with the /services title, description,
 *    canonical, Open Graph/Twitter tags and Service JSON-LD swapped in. Hosts
 *    serve it for "/services" (Vercel via cleanUrls in vercel.json, Express
 *    via an explicit route), so a direct load or refresh gets a 200 and the
 *    right meta even for crawlers and link previews that do not run JS.
 *
 * The values come from content.js through seo.js — the same source the app
 * uses at runtime — so there is nothing to keep in sync by hand.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servicesPage } from '../src/data/content.js';
import { absoluteUrl, servicesSchema } from '../src/seo.js';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const index = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

fs.writeFileSync(path.join(dist, '404.html'), index);

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Replaces one attribute value; fails the build if the tag is missing. */
function setTag(html, tagPattern, attr, value) {
  const re = new RegExp(`(<${tagPattern}[^>]*?\\s${attr}=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`prerender: no match for <${tagPattern}>`);
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

const { title, description, path: pagePath } = servicesPage.meta;
const url = absoluteUrl(pagePath);

let html = index.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
html = setTag(html, 'meta\\s+name="description"', 'content', description);
html = setTag(html, 'link\\s+rel="canonical"', 'href', url);
html = setTag(html, 'meta\\s+property="og:title"', 'content', title);
html = setTag(html, 'meta\\s+property="og:description"', 'content', description);
html = setTag(html, 'meta\\s+property="og:url"', 'content', url);
html = setTag(html, 'meta\\s+name="twitter:title"', 'content', title);
html = setTag(html, 'meta\\s+name="twitter:description"', 'content', description);

// Same id the runtime hook uses, so it updates this tag rather than adding one.
const schema = JSON.stringify(servicesSchema()).replace(/</g, '\\u003c');
html = html.replace(
  '</head>',
  `  <script type="application/ld+json" id="page-schema">${schema}</script>\n  </head>`
);

fs.writeFileSync(path.join(dist, 'services.html'), html);
console.log('prerender: wrote dist/404.html and dist/services.html');
