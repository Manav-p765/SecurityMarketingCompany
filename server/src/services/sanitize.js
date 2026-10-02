import sanitizeHtml from 'sanitize-html';
import { slugify } from './slug.js';

const SITE_HOSTS = ['securitymarketingcompany.com', 'www.securitymarketingcompany.com'];

const isExternal = (href) => {
  try {
    const url = new URL(href);
    return /^https?:$/.test(url.protocol) && !SITE_HOSTS.includes(url.hostname);
  } catch {
    return false; // relative link: stays on the site
  }
};

/**
 * Allowlist for blog post HTML, applied on every save. Anything else —
 * scripts, styles, event handlers, iframes, unknown tags — is removed.
 * Headings start at h2 (the title is the page's h1).
 */
const OPTIONS = {
  allowedTags: ['h2', 'h3', 'h4', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'a', 'strong', 'em', 's', 'blockquote', 'img', 'code', 'pre'],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https'] },
  allowProtocolRelative: false,
  transformTags: {
    h1: 'h2',
    h5: 'h4',
    h6: 'h4',
    b: 'strong',
    i: 'em',
    strike: 's',
    del: 's',
    a: (tagName, attribs) => {
      const href = attribs.href || '';
      const out = { href };
      if (attribs.title) out.title = attribs.title;
      // External links open in a new tab, safely; internal ones stay in the app.
      if (isExternal(href)) Object.assign(out, { target: '_blank', rel: 'noopener noreferrer' });
      return { tagName, attribs: out };
    },
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: 'lazy', alt: attribs.alt ?? '' },
    }),
  },
  exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
};

/**
 * Sanitized post HTML. Every h2/h3/h4 gets an id from its text (kept if it
 * already has a valid one), so sections can be linked to (#section-name).
 */
export function sanitizePostHtml(html) {
  const clean = sanitizeHtml(String(html ?? ''), OPTIONS);
  const used = new Set();
  return clean.replace(/<(h[234])(?:\s+id="([^"]*)")?>([\s\S]*?)<\/\1>/g, (match, tag, id, inner) => {
    const base = (id && /^[a-z0-9-]+$/.test(id) ? id : slugify(inner.replace(/<[^>]+>/g, ''))) || 'section';
    let unique = base;
    for (let n = 2; used.has(unique); n++) unique = `${base}-${n}`;
    used.add(unique);
    return `<${tag} id="${unique}">${inner}</${tag}>`;
  });
}

/** Plain text of post HTML (word counts, "is it empty?" checks). */
export const htmlText = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
