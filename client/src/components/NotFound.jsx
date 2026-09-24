import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY } from '../data/content.js';
import { IconArrowRight } from './Icons.jsx';
import { StrategyCallLink } from './Links.jsx';

/**
 * Shown for any path that is not a real page ("/" or "/services").
 */
export default function NotFound() {
  useEffect(() => {
    document.title = `Page not found — ${COMPANY.name}`;
    // Keep stray URLs out of search results. index.html ships the robots tag.
    const robots = document.querySelector('meta[name="robots"]');
    robots?.setAttribute('content', 'noindex, follow');
    // Leaving the 404 inside the app: the next page is indexable again.
    return () => robots?.setAttribute('content', 'index, follow');
  }, []);

  return (
    <div className="page">
      <main className="not-found dark-field">
        <div className="container not-found__inner">
          <Link className="not-found__logo" to="/" aria-label={`${COMPANY.name} — home`}>
            <img
              src="/logo/logo-lockup-light.png"
              alt={COMPANY.name}
              width="260"
              height="87"
            />
          </Link>

          <p className="label">Error 404</p>
          <h1>
            Nothing on this page.{' '}
            <span className="accent">Plenty on the home page.</span>
          </h1>

          <div className="prose not-found__copy">
            <p>
              The link may be old, or the address mistyped. Head back to the home page, see
              our <Link className="text-link" to="/services">services</Link>, or tell us what you were looking for at{' '}
              <a className="text-link" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
              .
            </p>
          </div>

          <div className="not-found__actions">
            <Link className="btn btn--primary" to="/">
              Back to Home
              <IconArrowRight />
            </Link>
            <StrategyCallLink className="btn btn--ghost-light">Book Strategy Call</StrategyCallLink>
          </div>
        </div>
      </main>
    </div>
  );
}
