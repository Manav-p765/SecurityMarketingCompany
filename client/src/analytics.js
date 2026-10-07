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
 * Consent (Google Consent Mode v2). Before the config call, the snippet sets
 * the defaults: everything denied in the UK, EEA and Switzerland; elsewhere
 * analytics granted and ads denied. A saved choice from the cookie banner
 * (components/CookieBanner.jsx) is then applied straight away, so a returning
 * visitor's choice holds from the first hit. page_view and generate_lead need
 * no consent checks of their own: gtag applies the consent state to them.
 */

export const GA_MEASUREMENT_ID = 'G-CBBT708R7T';

export const GA_HOSTNAMES = PRODUCTION_HOSTNAMES;

/** EU member states plus Iceland, Liechtenstein and Norway (EEA), the UK and Switzerland. */
export const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'IS', 'LI', 'NO', 'GB', 'CH',
];

/** localStorage key for the banner choice: { analytics: 'granted' | 'denied', expires: ms }. */
export const CONSENT_STORAGE_KEY = 'smc-cookie-consent';

const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 months

/** Fired on window by openCookieSettings(); CookieBanner listens for it. */
export const COOKIE_SETTINGS_EVENT = 'smc:cookie-settings';

/**
 * The inline <head> script. `send_page_view: false` stops the config call
 * from counting the first load on its own: the app sends every page_view
 * itself, after the page title is set. The saved-choice check repeats
 * getConsent() below in plain ES5 — keep the two in step.
 */
export function gaHeadSnippet() {
  const id = JSON.stringify(GA_MEASUREMENT_ID);
  const hosts = JSON.stringify(GA_HOSTNAMES);
  const regions = JSON.stringify(CONSENT_REGIONS);
  const key = JSON.stringify(CONSENT_STORAGE_KEY);
  return `<!-- Google tag (gtag.js) with Consent Mode v2, production hostnames only. Config: src/analytics.js -->
    <script>
      (function () {
        if (${hosts}.indexOf(window.location.hostname) === -1) return;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {
          analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
          region: ${regions}, wait_for_update: 500
        });
        window.gtag('consent', 'default', {
          analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
          wait_for_update: 500
        });
        try {
          var saved = JSON.parse(window.localStorage.getItem(${key}));
          if (saved && saved.expires > Date.now() && (saved.analytics === 'granted' || saved.analytics === 'denied')) {
            window.gtag('consent', 'update', { analytics_storage: saved.analytics });
          }
        } catch (e) {}
        window.gtag('js', new Date());
        window.gtag('config', ${id}, { send_page_view: false });
        var tag = document.createElement('script');
        tag.async = true;
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${id};
        document.head.appendChild(tag);
      })();
    </script>`;
}

/** The visitor's saved, unexpired choice: 'granted', 'denied' or null (no choice yet). */
export function getConsent() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY));
    if (saved && saved.expires > Date.now() && ['granted', 'denied'].includes(saved.analytics)) {
      return saved.analytics;
    }
  } catch {
    // Storage blocked or unreadable: treat as no choice, so the banner shows.
  }
  return null;
}

/** Removes GA's own cookies (_ga, _ga_<id>) from this host and the parent domain. */
function clearAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  const host = window.location.hostname;
  const domains = ['', host, `.${host.replace(/^www\./, '')}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

/**
 * Saves the banner choice for 12 months and passes it to Consent Mode. Ad
 * signals are never updated, so they stay denied. Declining also deletes any
 * GA cookies already set (outside the UK/EEA analytics starts out granted).
 */
export function setConsent(analytics) {
  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ analytics, expires: Date.now() + CONSENT_MAX_AGE_MS })
    );
  } catch {
    // Storage blocked: the choice still applies to this page view.
  }
  if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: analytics });
  if (analytics === 'denied') clearAnalyticsCookies();
}

/**
 * Reopens the cookie banner (footer "Cookie settings"). Used as a click
 * handler: the clicked element goes along so focus can return to it after a
 * choice (a click does not focus a button in every browser).
 */
export function openCookieSettings(event) {
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT, { detail: { trigger: event?.currentTarget ?? null } }));
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
