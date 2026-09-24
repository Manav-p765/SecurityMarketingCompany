import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Industries from '../components/Industries.jsx';
import Process from '../components/Process.jsx';
import Faq from '../components/Faq.jsx';
import CtaPanel from '../components/CtaPanel.jsx';
import Footer from '../components/Footer.jsx';
import { StrategyCallLink } from '../components/Links.jsx';
import { IconArrowRight, IconCheckSmall, SERVICE_ICONS } from '../components/Icons.jsx';
import { serviceNumber, services, servicesPage } from '../data/content.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';
import { servicePath, servicesSchema } from '../seo.js';

const { hero, pricing, blockLabels, process, faq } = servicesPage;

// Built once: usePageMeta re-applies whenever the object identity changes.
const SCHEMA = servicesSchema();

/** Overview block for one service, anchored at /services#slug; full detail lives at /services/slug. */
function ServiceBlock({ service }) {
  const Icon = SERVICE_ICONS[service.icon];
  const titleId = `${service.slug}-title`;

  return (
    <article className="svc reveal" id={service.slug} aria-labelledby={titleId}>
      <header className="svc__head">
        <div className="svc__meta">
          <span className="service-card__icon">
            <Icon />
          </span>
          <span className="service-card__num">{serviceNumber(service)}</span>
        </div>
        <h2 id={titleId}>{service.name}</h2>
        <p className="svc__outcome">{service.shortDescription}</p>
        <Link className="svc__more" to={servicePath(service)}>
          {blockLabels.learnMore}
          <span className="visually-hidden"> about {service.name}</span>
          <IconArrowRight />
        </Link>
      </header>

      <div className="svc__body">
        <div className="svc__copy">
          <h3 className="svc__label">{blockLabels.problem}</h3>
          <p>{service.problem.body}</p>

          <h3 className="svc__label">{blockLabels.bestFor}</h3>
          <ul className="svc__bestfor">
            {service.bestFor.map((segment) => (
              <li key={segment}>{segment}</li>
            ))}
          </ul>
        </div>

        <div className="svc__panel surface">
          <h3 className="svc__label">{blockLabels.included}</h3>
          <ul className="feature__list svc__list">
            {service.included.map((item) => (
              <li key={item.title}>
                <IconCheckSmall />
                {item.title}
              </li>
            ))}
          </ul>

          <div className="svc__footer">
            <dl className="svc__price">
              <dt>{pricing.label}</dt>
              <dd>{service.pricing}</dd>
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
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link className="chip" to={`#${service.slug}`}>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <section className="section svc-list dark-field dark-field--quiet" aria-label="Services">
          <div className="container">
            {services.map((service) => (
              <ServiceBlock key={service.slug} service={service} />
            ))}
          </div>
        </section>

        <Process id="how-we-work" copy={process} />

        <Industries />

        <Faq label={faq.label} title={faq.title} items={faq.items} />

        <CtaPanel />
      </main>

      <Footer />
    </div>
  );
}
