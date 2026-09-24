import { useEffect } from 'react';
import { absoluteUrl } from '../seo.js';

const SCHEMA_ID = 'page-schema';

function setAttr(selector, attr, value) {
  document.querySelector(selector)?.setAttribute(attr, value);
}

/**
 * Applies a page's title, description, canonical and social tags on route
 * change. On a direct load the static HTML already carries the same values
 * (index.html for "/", the prerendered services.html for "/services"), so
 * this only matters for in-app navigation.
 *
 * `schema` is optional page-level JSON-LD, added in its own script tag and
 * removed when the page unmounts. The site-wide ProfessionalService block in
 * index.html is left alone.
 */
export function usePageMeta({ path, title, description, socialDescription }, schema) {
  useEffect(() => {
    const url = absoluteUrl(path);
    const social = socialDescription || description;

    document.title = title;
    setAttr('meta[name="description"]', 'content', description);
    setAttr('link[rel="canonical"]', 'href', url);
    setAttr('meta[property="og:title"]', 'content', title);
    setAttr('meta[property="og:description"]', 'content', social);
    setAttr('meta[property="og:url"]', 'content', url);
    setAttr('meta[name="twitter:title"]', 'content', title);
    setAttr('meta[name="twitter:description"]', 'content', social);

    if (!schema) return undefined;
    let script = document.getElementById(SCHEMA_ID);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = SCHEMA_ID;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
    return () => script.remove();
  }, [path, title, description, socialDescription, schema]);
}
