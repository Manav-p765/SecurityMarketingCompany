import { useEffect } from 'react';
import { COMPANY } from '../data/content.js';
import { IconArrowRight } from './Icons.jsx';

/**
 * Shown for any path other than "/". The site is a single page, so every
 * section link here points back at the home page's anchors.
 */
export default function NotFound() {
  useEffect(() => {
    document.title = `Page not found — ${COMPANY.name}`;
    // Keep stray URLs out of search results. index.html ships the robots tag.
    const robots = document.querySelector('meta[name="robots"]');
    robots?.setAttribute('content', 'noindex, follow');
  }, []);

  return (
    <div className="page">
      <main className="not-found dark-field">
        <div className="container not-found__inner">
          <a className="not-found__logo" href="/" aria-label={`${COMPANY.name} — home`}>
            <img
              src="/logo/logo-lockup-light.png"
              alt={COMPANY.name}
              width="260"
              height="87"
            />
          </a>

          <p className="label">Error 404</p>
          <h1>
            Nothing on this page.{' '}
            <span className="accent">Plenty on the home page.</span>
          </h1>

          <div className="prose not-found__copy">
            <p>
              The link may be old, or the address mistyped. Everything we do lives on one page —
              head back there, or tell us what you were looking for at{' '}
              <a className="text-link" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
              .
            </p>
          </div>

          <div className="not-found__actions">
            <a className="btn btn--primary" href="/">
              Back to Home
              <IconArrowRight />
            </a>
            <a className="btn btn--ghost-light" href="/#contact">
              Book Strategy Call
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
