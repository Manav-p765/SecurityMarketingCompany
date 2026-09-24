import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import Process from '../components/Process.jsx';
import Faq from '../components/Faq.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import CtaPanel from '../components/CtaPanel.jsx';
import Footer from '../components/Footer.jsx';
import NotFound from '../components/NotFound.jsx';
import { StrategyCallLink } from '../components/Links.jsx';
import {
  IconArrowRight,
  IconCheckSmall,
  IconShieldCheck,
  SERVICE_ICONS,
} from '../components/Icons.jsx';
import { getService, serviceDetail as copy, servicesPage } from '../data/content.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';
import { serviceDetailSchema, serviceMeta } from '../seo.js';

/**
 * "SEO & AI SEO for Security Companies" -> ["SEO & AI SEO", "for Security
 * Companies"], so the second line carries the red accent like the other
 * page heroes. Headlines without " for " render on one line.
 */
function splitHeadline(headline) {
  const at = headline.lastIndexOf(' for ');
  return at > 0 ? [headline.slice(0, at), headline.slice(at + 1)] : [headline, ''];
}

function ServiceDetail({ service }) {
  useReveal();
  const schema = useMemo(() => serviceDetailSchema(service), [service]);
  usePageMeta(serviceMeta(service), schema);

  const Icon = SERVICE_ICONS[service.icon];
  const [headline, accent] = splitHeadline(service.hero.headline);
  const related = service.relatedSlugs.map(getService).filter(Boolean);
  const steps = service.process.map((item, index) => ({
    step: String(index + 1).padStart(2, '0'),
    title: item.step,
    body: item.description,
  }));

  return (
    <div className="page detail-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        {/* 1–2. Breadcrumb and hero */}
        <section className="svc-hero detail-hero dark-field">
          <div className="container">
            <Breadcrumb
              items={[
                { label: copy.breadcrumb.home, to: '/' },
                { label: copy.breadcrumb.services, to: servicesPage.meta.path },
                { label: service.name },
              ]}
            />

            <span className="service-card__icon detail-hero__icon">
              <Icon />
            </span>

            <h1>
              {headline} {accent && <span className="accent">{accent}</span>}
            </h1>
            <p className="svc-hero__subhead">{service.hero.subheadline}</p>

            <div className="detail-hero__actions">
              <StrategyCallLink className="btn btn--primary">
                {copy.ctaPrimary}
                <IconArrowRight />
              </StrategyCallLink>
              <Link className="btn btn--ghost-light" to={servicesPage.meta.path}>
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>

        {/* 3. The problem */}
        <section className="section section--tight dark-field dark-field--quiet detail-problem">
          <div className="container">
            <div className="section-head section-head--split reveal">
              <div>
                <p className="label">{copy.problem.label}</p>
                <h2>{service.problem.heading}</h2>
              </div>
              <p className="section-head__lead">{service.problem.body}</p>
            </div>
          </div>
        </section>

        {/* 4. What's included */}
        <section className="section section--tight light-wash" id="included">
          <div className="container">
            <div className="section-head reveal">
              <p className="label">{copy.included.label}</p>
              <h2>{copy.included.title}</h2>
            </div>
            <ul className="detail-grid">
              {service.included.map((item, index) => (
                <li
                  key={item.title}
                  className="detail-card surface reveal"
                  style={{ transitionDelay: `${(index % 3) * 70}ms` }}
                >
                  <IconCheckSmall />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. How it works */}
        <Process
          id="how-it-works"
          copy={{ label: copy.process.label, title: copy.process.title, steps }}
        />

        {/* 6. What you get, with the pricing line */}
        <section className="section section--tight dark-field dark-field--quiet" id="deliverables">
          <div className="container detail-split">
            <div className="reveal">
              <div className="section-head">
                <p className="label">{copy.deliverables.label}</p>
                <h2>{copy.deliverables.title}</h2>
              </div>
              <ul className="feature__list detail-deliverables">
                {service.deliverables.map((item) => (
                  <li key={item}>
                    <IconCheckSmall />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="svc__panel surface detail-price reveal">
              <dl className="svc__price">
                <dt>{servicesPage.pricing.label}</dt>
                <dd>{service.pricing}</dd>
              </dl>
              <p className="svc__note">{servicesPage.pricing.note}</p>
              <StrategyCallLink className="btn btn--primary">
                {copy.ctaPrimary}
                <IconArrowRight />
              </StrategyCallLink>
            </div>
          </div>
        </section>

        {/* 7. Best for */}
        <section className="section section--tight dark-field" id="best-for">
          <div className="container">
            <div className="section-head reveal">
              <p className="label">{copy.bestFor.label}</p>
              <h2>{copy.bestFor.title}</h2>
            </div>
            <ul className="industries__grid detail-bestfor">
              {service.bestFor.map((segment, index) => (
                <li
                  key={segment}
                  className="industries__item reveal"
                  style={{ transitionDelay: `${index * 45}ms` }}
                >
                  <IconShieldCheck />
                  <span>{segment}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Proof — only with real, cleared testimonials or results in content.js. */}
        {service.proof?.length > 0 && (
          <section className="section section--tight dark-field dark-field--quiet" id="proof">
            <div className="container">
              <div className="section-head reveal">
                <p className="label">{copy.proof.label}</p>
                <h2>{copy.proof.title}</h2>
              </div>
              <div className="detail-grid">
                {service.proof.map((item) => (
                  <figure key={item.quote} className="detail-card surface reveal">
                    <blockquote>
                      <p>{item.quote}</p>
                    </blockquote>
                    <figcaption>
                      {item.name}
                      {item.company && `, ${item.company}`}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. FAQ */}
        <Faq label={copy.faq.label} title={copy.faq.title} items={service.faqs} />

        {/* 10. Related services */}
        <section className="section section--tight dark-field" id="related">
          <div className="container">
            <div className="section-head reveal">
              <p className="label">{copy.related.label}</p>
              <h2>{copy.related.title}</h2>
            </div>
            <div className="related__grid">
              {related.map((item) => (
                <ServiceCard key={item.slug} service={item} />
              ))}
            </div>
          </div>
        </section>

        {/* 11. Final CTA */}
        <CtaPanel />
      </main>

      <Footer />
    </div>
  );
}

/**
 * /services/:slug. An unknown slug renders the 404 page. Keyed by slug so
 * moving between detail pages remounts the page: the scroll-reveal and meta
 * hooks run again for the new content.
 */
export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getService(slug);
  return service ? <ServiceDetail key={slug} service={service} /> : <NotFound />;
}
