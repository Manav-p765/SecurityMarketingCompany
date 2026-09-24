/**
 * Post-build step (runs after `vite build`, see package.json).
 *
 * 1. dist/404.html — a copy of index.html, so static hosts serve the app's
 *    404 screen with a real 404 status.
 * 2. dist/services.html and dist/services/<slug>.html for every service —
 *    index.html with that page's title, description, canonical, Open
 *    Graph/Twitter tags and JSON-LD swapped in. Hosts serve them for
 *    "/services" and "/services/<slug>" (Vercel via cleanUrls in vercel.json,
 *    Express via explicit routes), so a direct load or refresh gets a 200 and
 *    the right meta even for crawlers and link previews that do not run JS.
 *    An unknown slug has no file, so it falls through to the 404.
 * 3. dist/sitemap.xml — every page written above, plus the home page.
 *    robots.txt (static, in public/) points crawlers at it.
 * 4. A check that the contact form's service list on the server matches
 *    `services` in content.js (skipped when the server folder is absent).
 *
 * The values come from content.js through seo.js — the same source the app
 * uses at runtime — so there is nothing to keep in sync by hand.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOME_META, SERVICE_OPTIONS, services, servicesPage } from '../src/data/content.js';
import { absoluteUrl, serviceDetailSchema, serviceMeta, servicesSchema } from '../src/seo.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../dist');
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

/** index.html with one page's meta and JSON-LD, written to dist/<file>. */
function writePage(file, { title, description, path: pagePath }, schema) {
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
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json" id="page-schema">${json}</script>\n  </head>`
  );

  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}

writePage('services.html', servicesPage.meta, servicesSchema());
for (const service of services) {
  writePage(`services/${service.slug}.html`, serviceMeta(service), serviceDetailSchema(service));
}

// Every indexable page: the home page plus every page written above.
const PAGES = [HOME_META, servicesPage.meta, ...services.map(serviceMeta)];
const urls = PAGES.map((page) => `  <url><loc>${escapeAttr(absoluteUrl(page.path))}</loc></url>`);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

// The API deploys on its own (Render, rootDir: server), so it cannot import
// content.js and keeps its own copy of the form options. Fail the build if
// the two lists drift apart. Skipped when the server folder is not present.
const leadModel = path.resolve(here, '../../server/src/models/Lead.js');
if (fs.existsSync(leadModel)) {
  const source = fs.readFileSync(leadModel, 'utf8');
  const block = source.match(/export const SERVICES = \[([\s\S]*?)\];/);
  const serverList = block ? [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : [];
  if (JSON.stringify(serverList) !== JSON.stringify(SERVICE_OPTIONS)) {
    throw new Error(
      `prerender: server/src/models/Lead.js SERVICES does not match the contact form options.\n` +
        `  server: ${JSON.stringify(serverList)}\n  client: ${JSON.stringify(SERVICE_OPTIONS)}`
    );
  }
}

console.log(
  `prerender: wrote 404.html, services.html, ${services.length} service pages and sitemap.xml (${PAGES.length} URLs)`
);
