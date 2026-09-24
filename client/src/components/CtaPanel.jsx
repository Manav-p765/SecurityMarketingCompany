import { useId } from 'react';
import { servicesPage } from '../data/content.js';
import { IconArrowRight } from './Icons.jsx';
import { StrategyCallLink } from './Links.jsx';

/**
 * Closing call to action on /services and every detail page: a red card
 * rather than the full-width gradient band, which stays unique to the home
 * page. Copy defaults to servicesPage.cta.
 */
export default function CtaPanel({ copy = servicesPage.cta }) {
  const titleId = useId();

  return (
    <section className="section section--tight svc-cta-wrap" aria-labelledby={titleId}>
      <div className="container">
        <div className="svc-cta reveal">
          <div>
            <p className="svc-cta__kicker">{copy.label}</p>
            <h2 id={titleId}>{copy.title}</h2>
            <p className="svc-cta__body">{copy.body}</p>
          </div>
          <div className="svc-cta__actions">
            <StrategyCallLink className="btn btn--light">
              {copy.button}
              <IconArrowRight />
            </StrategyCallLink>
            <p className="svc-cta__note">{copy.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
