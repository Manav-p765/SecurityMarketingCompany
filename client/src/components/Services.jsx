import { services } from '../data/content.js';
import { IconArrowRight } from './Icons.jsx';
import { StrategyCallLink } from './Links.jsx';
import ServiceCard from './ServiceCard.jsx';

/** Feeds the pointer position to the card under it, for the hover glow. */
function trackPointer(event) {
  const card = event.target.closest('.service-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  card.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

export default function Services() {
  return (
    <section className="section section--screen dark-field" id="services">
      <div className="container">
        <div className="section-head section-head--split reveal">
          <div>
            <p className="label">What we do</p>
            <h2>Marketing Services Built for Security Companies</h2>
          </div>
          <p className="section-head__lead">
            From your website and Google visibility to paid advertising, lead generation and
            automated follow-up, we build the digital systems security companies need to generate
            consistent opportunities and grow.
          </p>
        </div>

        {/* Each card links to its detail page at /services/:slug. */}
        <div className="services__grid" onPointerMove={trackPointer}>
          {services.map((service, index) => (
            <ServiceCard
              key={service.slug}
              service={service}
              style={{ transitionDelay: `${(index % 4) * 80}ms` }}
            />
          ))}

          {/* Eighth card fills the second row and turns the list into a next step. */}
          <StrategyCallLink
            className="service-card service-card--cta reveal"
            style={{ transitionDelay: '240ms' }}
          >
            <p className="service-card--cta__kicker">Not sure where to start?</p>
            <h3>Talk to a specialist</h3>
            <span className="btn btn--light">
              Book Strategy Call
              <IconArrowRight />
            </span>
          </StrategyCallLink>
        </div>
      </div>
    </section>
  );
}
