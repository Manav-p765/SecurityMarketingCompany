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
 *    dist/about.html and dist/contact.html the same way, with AboutPage and
 *    ContactPage schema. With real (non-sample) reviews in content.js, the
 *    home page index.html also gets their Review schema.
 *    dist/privacy.html and dist/terms.html; dist/thank-you.html with
 *    "noindex, nofollow"; dist/blog.html and dist/blog/<slug>.html for every
 *    post in src/content/blog/ (Article + BreadcrumbList schema). The blog is
 *    loaded through Vite (ssrLoadModule), so this script runs the exact same
 *    loadPosts() as the browser: a new markdown file gets its page and
 *    sitemap entry with no other change.
 * 3. dist/sitemap.xml — every indexable page written above, plus the home
 *    page. /thank-you is left out on purpose.
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
import { createServer } from 'vite';
import {
  aboutPage,
  blogPage,
  contactPage,
  HOME_META,
  privacyPolicy,
  SERVICE_OPTIONS,
  services,
  servicesPage,
  termsPage,
  thankYouPage,
} from '../src/data/content.js';
import {
  aboutSchema,
  absoluteUrl,
  contactSchema,
  reviewsSchema,
  serviceDetailSchema,
  serviceMeta,
  servicesSchema,
} from '../src/seo.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../dist');

// Blog modules use import.meta.glob and .md imports, so load them through
// Vite (same config and markdown plugin as the build) rather than natively.
const vite = await createServer({
  root: path.resolve(here, '..'),
  configFile: path.resolve(here, '../vite.config.js'),
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
  // No browser dependency pre-bundling: only Node-side module loading is needed.
  optimizeDeps: { noDiscovery: true, include: [] },
});
const { posts, postPath } = await vite.ssrLoadModule('/src/blog/posts.js');
const { blogSchema, postMeta, postSchema } = await vite.ssrLoadModule('/src/blog/schema.js');
await vite.close();
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

/** Adds page-level JSON-LD before </head>, with the id the runtime hook updates. */
function withSchema(html, schema) {
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');
  return html.replace(
    '</head>',
    `  <script type="application/ld+json" id="page-schema">${json}</script>\n  </head>`
  );
}

/** index.html with one page's meta and JSON-LD, written to dist/<file>. */
function writePage(file, { title, description, path: pagePath, robots, ogType }, schema) {
  const url = absoluteUrl(pagePath);

  let html = index.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
  html = setTag(html, 'meta\\s+name="description"', 'content', description);
  html = setTag(html, 'link\\s+rel="canonical"', 'href', url);
  html = setTag(html, 'meta\\s+property="og:title"', 'content', title);
  html = setTag(html, 'meta\\s+property="og:description"', 'content', description);
  html = setTag(html, 'meta\\s+property="og:url"', 'content', url);
  html = setTag(html, 'meta\\s+name="twitter:title"', 'content', title);
  html = setTag(html, 'meta\\s+name="twitter:description"', 'content', description);

  if (robots) html = setTag(html, 'meta\\s+name="robots"', 'content', robots);
  if (ogType) html = setTag(html, 'meta\\s+property="og:type"', 'content', ogType);

  if (schema) html = withSchema(html, schema);

  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}

writePage('services.html', servicesPage.meta, servicesSchema());
for (const service of services) {
  writePage(`services/${service.slug}.html`, serviceMeta(service), serviceDetailSchema(service));
}
writePage('about.html', aboutPage.meta, aboutSchema());
writePage('contact.html', contactPage.meta, contactSchema());
writePage('privacy.html', privacyPolicy.meta);
writePage('terms.html', termsPage.meta);
writePage('thank-you.html', thankYouPage.meta);
writePage('blog.html', blogPage.meta, blogSchema());
for (const post of posts) {
  writePage(`blog/${post.slug}.html`, postMeta(post), postSchema(post));
}

// Home page Review schema — real reviews only, so this is skipped while every
// review in content.js is a sample. Written last: the pages above are built
// from the original index.html.
const homeReviews = reviewsSchema();
if (homeReviews) fs.writeFileSync(path.join(dist, 'index.html'), withSchema(index, homeReviews));

// Every indexable page: the home page plus every page written above except
// /thank-you (noindex). Blog posts carry their date as <lastmod>.
const PAGES = [
  HOME_META,
  servicesPage.meta,
  ...services.map(serviceMeta),
  aboutPage.meta,
  contactPage.meta,
  blogPage.meta,
  ...posts.map((post) => ({ path: postPath(post), lastmod: post.date })),
  privacyPolicy.meta,
  termsPage.meta,
];
const urls = PAGES.map((page) => {
  const lastmod = page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : '';
  return `  <url><loc>${escapeAttr(absoluteUrl(page.path))}</loc>${lastmod}</url>`;
});
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
  `prerender: wrote 404.html, services.html, ${services.length} service pages, about, contact, ` +
    `privacy, terms, thank-you, blog, ${posts.length} blog posts` +
    `${homeReviews ? ', home Review schema' : ''} and sitemap.xml (${PAGES.length} URLs)`
);
