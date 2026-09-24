import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Industries from '../components/Industries.jsx';
import Process from '../components/Process.jsx';
import Footer from '../components/Footer.jsx';
import { StrategyCallLink } from '../components/Links.jsx';
import {
  IconArrowRight,
  IconCheckSmall,
  IconPlus,
  SERVICE_ICONS,
} from '../components/Icons.jsx';
import { SERVICES, servicesPage } from '../data/content.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';
import { servicesSchema } from '../seo.js';

const { hero, pricing, blockLabels, details, process, faq, cta } = servicesPage;

// Built once: usePageMeta re-applies whenever the object identity changes.
const SCHEMA = servicesSchema();

/** "Starting at $X" when prices are published for this service, else the custom label. */
function priceLine(id) {
  const price = pricing.showPrices && pricing.prices[id];
  return price ? `Starting at ${price}` : pricing.customLabel;
}

function ServiceBlock({ service }) {
  const Icon = SERVICE_ICONS[service.id];
  const detail = details[service.id];
  const titleId = `${service.id}-title`;

  return (
    <article className="svc reveal" id={service.id} aria-labelledby={titleId}>
      <header className="svc__head">
        <div className="svc__meta">
          <span className="service-card__icon">
            <Icon />
          </span>
          <span className="service-card__num">{service.number}</span>
        </div>
        <h2 id={titleId}>{service.title}</h2>
        <p className="svc__outcome">{service.lead}</p>
      </header>

      <div className="svc__body">
        <div className="svc__copy">
          <h3 className="svc__label">{blockLabels.problem}</h3>
          <p>{detail.problem}</p>

          <h3 className="svc__label">{blockLabels.bestFor}</h3>
          <p>{detail.bestFor}</p>
        </div>

        <div className="svc__panel surface">
          <h3 className="svc__label">{blockLabels.included}</h3>
          <ul className="feature__list svc__list">
            {detail.included.map((item) => (
              <li key={item}>
                <IconCheckSmall />
                {item}
              </li>
            ))}
          </ul>

          <div className="svc__footer">
            <dl className="svc__price">
              <dt>{pricing.label}</dt>
              <dd>{priceLine(service.id)}</dd>
            </dl>
            <StrategyCallLink className="btn btn--primary">
              {blockLabels.cta}
              <IconArrowRight />
            </StrategyCallLink>
          </div>
          <p className="svc__note">{pricing.note}</p>
        </div>
      </div>
    </article>
  );
}

/**
 * Disclosure-pattern accordion: each question is a real button inside a
 * heading, with aria-expanded and aria-controls pointing at its answer.
 * Items open independently, so opening one never hides another.
 */
function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const buttonId = `${id}-q`;
  const panelId = `${id}-a`;

  return (
    <div className={`faq__item${open ? ' is-open' : ''}`}>
      <h3>
        <button
          type="button"
          id={buttonId}
          className="faq__question"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{item.q}</span>
          <IconPlus />
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} className="faq__answer" hidden={!open}>
        <p>{item.a}</p>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  useReveal();
  usePageMeta(servicesPage.meta, SCHEMA);

  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <section className="svc-hero dark-field">
          <div className="container">
            <p className="label">{hero.eyebrow}</p>
            <h1>
              {hero.headlineTop} <span className="accent">{hero.headlineBottom}</span>
            </h1>
            <p className="svc-hero__subhead">{hero.subhead}</p>

            <div className="svc-hero__actions">
              <StrategyCallLink className="btn btn--primary">
                {hero.cta}
                <IconArrowRight />
              </StrategyCallLink>
            </div>

            <nav className="svc-index" aria-label={hero.indexLabel}>
              <p className="svc-index__label">{hero.indexLabel}</p>
              <ul>
                {SERVICES.map((service) => (
                  <li key={service.id}>
                    <Link className="chip" to={`#${service.id}`}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <section className="section svc-list dark-field dark-field--quiet" aria-label="Services">
          <div className="container">
            {SERVICES.map((service) => (
              <ServiceBlock key={service.id} service={service} />
            ))}
          </div>
        </section>

        <Process id="how-we-work" copy={process} />

        <Industries />

        <section className="section faq dark-field dark-field--quiet" id="faq">
          <div className="container faq__layout">
            <div className="section-head reveal">
              <p className="label">{faq.label}</p>
              <h2>{faq.title}</h2>
            </div>
            <div className="faq__list reveal">
              {faq.items.map((item) => (
                <FaqItem key={item.q} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tight svc-cta-wrap" aria-labelledby="services-cta-title">
          <div className="container">
            <div className="svc-cta reveal">
              <div>
                <p className="svc-cta__kicker">{cta.label}</p>
                <h2 id="services-cta-title">{cta.title}</h2>
                <p className="svc-cta__body">{cta.body}</p>
              </div>
              <div className="svc-cta__actions">
                <StrategyCallLink className="btn btn--light">
                  {cta.button}
                  <IconArrowRight />
                </StrategyCallLink>
                <p className="svc-cta__note">{cta.note}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
