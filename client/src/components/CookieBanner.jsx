import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COOKIE_BANNER } from '../data/content.js';
import { COOKIE_SETTINGS_EVENT, getConsent, setConsent } from '../analytics.js';

const isAdminPath = (pathname) => pathname === '/admin' || pathname.startsWith('/admin/');

/**
 * Cookie consent bar for Google Analytics (Consent Mode v2, see analytics.js).
 * Shown until the visitor accepts or declines; the choice is kept for 12
 * months. The footer's "Cookie settings" link reopens it. Never shown on
 * /admin. It is a labelled region, not a modal: the page stays usable and
 * focus is never trapped.
 */
export default function CookieBanner() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => getConsent() === null);
  const panelRef = useRef(null);
  // Where focus was when "Cookie settings" reopened the banner, to go back to after a choice.
  const returnFocus = useRef(null);

  useEffect(() => {
    const reopen = (event) => {
      returnFocus.current = event.detail?.trigger ?? document.activeElement;
      setOpen(true);
      requestAnimationFrame(() => panelRef.current?.focus());
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  if (!open || isAdminPath(pathname)) return null;

  const choose = (analytics) => {
    setConsent(analytics);
    setOpen(false);
    returnFocus.current?.focus?.();
    returnFocus.current = null;
  };

  const [before, after] = COOKIE_BANNER.text.split('{privacy}');

  return (
    <section
      ref={panelRef}
      className="cookie-banner"
      role="region"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
      tabIndex={-1}
    >
      <h2 id="cookie-banner-title" className="cookie-banner__title">
        {COOKIE_BANNER.title}
      </h2>
      <p id="cookie-banner-text" className="cookie-banner__text">
        {before}
        <Link to="/privacy#analytics-and-cookies">{COOKIE_BANNER.privacyLinkLabel}</Link>
        {after}
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="btn btn--ghost-light cookie-banner__btn" onClick={() => choose('granted')}>
          {COOKIE_BANNER.accept}
        </button>
        <button type="button" className="btn btn--ghost-light cookie-banner__btn" onClick={() => choose('denied')}>
          {COOKIE_BANNER.decline}
        </button>
      </div>
    </section>
  );
}
