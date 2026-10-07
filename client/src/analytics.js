import { PRODUCTION_HOSTNAMES } from './site.js';

/**
 * Google Analytics 4. The measurement ID lives here and nowhere else; the
 * production hostnames come from site.js:
 *  - vite.config.js imports them to write the loader snippet into the <head>
 *    of index.html, so every prerendered page (dist/services.html,
 *    dist/services/<slug>.html, 404.html) carries it too;
 *  - App.jsx sends one page_view per route through trackPageView below.
 *
 * The snippet only loads gtag.js when the page is served from a production
 * hostname, so localhost, `vite preview` and Vercel preview deployments send
 * nothing. Off those hosts `window.gtag` is never defined and trackPageView
 * does nothing.
 *
 * No cookie consent yet: GA4 loads for every visitor on the live site. UK/EU
 * visitors usually have to opt in before analytics cookies are set (PECR /
 * ePrivacy) — see the COOKIE CONSENT note in data/legal/privacy.js.
 */

export const GA_MEASUREMENT_ID = 'G-CBBT708R7T';

export const GA_HOSTNAMES = PRODUCTION_HOSTNAMES;

/**
 * The inline <head> script. `send_page_view: false` stops the config call
 * from counting the first load on its own: the app sends every page_view
 * itself, after the page title is set.
 */
export function gaHeadSnippet() {
  const id = JSON.stringify(GA_MEASUREMENT_ID);
  const hosts = JSON.stringify(GA_HOSTNAMES);
  return `<!-- Google tag (gtag.js), production hostnames only. Config: src/analytics.js -->
    <script>
      (function () {
        if (${hosts}.indexOf(window.location.hostname) === -1) return;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', ${id}, { send_page_view: false });
        var tag = document.createElement('script');
        tag.async = true;
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${id};
        document.head.appendChild(tag);
      })();
    </script>`;
}

/**
 * GA4 `generate_lead` after a successful form submission. `formLocation` is
 * "contact_page" or "homepage". Does nothing off the production hosts.
 */
export function trackLead(formLocation) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'generate_lead', { form_location: formLocation });
}

/** Sends one GA4 page_view for the current URL and document.title. */
export function trackPageView() {
  if (typeof window.gtag !== 'function') return;
  const { origin, pathname, search } = window.location;
  window.gtag('event', 'page_view', {
    page_path: pathname + search,
    page_title: document.title,
    page_location: origin + pathname + search,
  });
}
