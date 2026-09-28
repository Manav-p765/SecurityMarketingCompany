/**
 * Build-time markdown for the blog. Runs in Node only (Vite plugin in
 * vite.config.js), so `marked` never ships to the browser: each .md file
 * becomes a small JS module with its frontmatter, rendered HTML and word
 * count.
 */
import { Marked } from 'marked';

/** "Speed to lead: why it matters" -> "speed-to-lead-why-it-matters" */
export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z0-9#]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const escapeAttr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const marked = new Marked({
  gfm: true,
  renderer: {
    // h2/h3 get ids so sections can be linked to (#section-name).
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(text)}">${text}</h${depth}>\n`;
    },
    // External links open in a new tab; internal ones stay in the app.
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      const attrs = [
        `href="${escapeAttr(href)}"`,
        title ? `title="${escapeAttr(title)}"` : '',
        external ? 'target="_blank" rel="noopener noreferrer"' : '',
      ].filter(Boolean);
      return `<a ${attrs.join(' ')}>${text}</a>`;
    },
    image({ href, title, text }) {
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
      return `<img src="${escapeAttr(href)}" alt="${escapeAttr(text)}"${titleAttr} loading="lazy" />`;
    },
  },
});

/**
 * Minimal frontmatter: `key: value` lines between two `---` lines. Values
 * may be quoted. That covers title, slug, date, excerpt, category,
 * coverImage, author, readingTime and service.
 */
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!pair) continue;
    let value = pair[2].trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    data[pair[1]] = value;
  }
  return { data, body: raw.slice(match[0].length) };
}

/** Frontmatter, rendered HTML and a word count for one markdown file. */
export function compileMarkdown(raw) {
  const { data, body } = parseFrontmatter(raw);
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return { frontmatter: data, html: marked.parse(body), words };
}
