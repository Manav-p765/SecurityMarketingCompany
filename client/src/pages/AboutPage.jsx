import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Stats from '../components/Stats.jsx';
import CtaPanel from '../components/CtaPanel.jsx';
import Footer from '../components/Footer.jsx';
import { StrategyCallLink } from '../components/Links.jsx';
import { IconArrowRight, IconCheckSmall, SERVICE_ICONS } from '../components/Icons.jsx';
import { aboutPage, services, servicesPage } from '../data/content.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';
import { aboutSchema, servicePath } from '../seo.js';

const { hero, whoWeAre, whyFocus, principles, cta } = aboutPage;
const SCHEMA = aboutSchema();

export default function AboutPage() {
  useReveal();
  usePageMeta(aboutPage.meta, SCHEMA);

  return (
    <div className="page detail-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        {/* 1. Hero */}
        <section className="svc-hero dark-field">
          <div className="container">
            <p className="label">{hero.eyebrow}</p>
            <h1>
              {hero.headlineTop} <span className="accent">{hero.headlineBottom}</span>
            </h1>
            <p className="svc-hero__subhead">{hero.subhead}</p>
            <div className="detail-hero__actions">
              <StrategyCallLink className="btn btn--primary">
                {hero.cta}
                <IconArrowRight />
              </StrategyCallLink>
              <Link className="btn btn--ghost-light" to={servicesPage.meta.path}>
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Who we are */}
        <section className="section section--tight dark-field dark-field--quiet detail-problem" id="who-we-are">
          <div className="container">
            <div className="section-head section-head--split reveal">
              <div>
                <p className="label">{whoWeAre.label}</p>
                <h2>{whoWeAre.title}</h2>
              </div>
              <div className="section-head__lead detail-problem__body">
                {whoWeAre.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Why we focus on security companies */}
        <section className="section section--tight dark-field" id="why-security">
          <div className="container">
            <div className="section-head section-head--split reveal">
              <div>
                <p className="label">{whyFocus.label}</p>
                <h2>{whyFocus.title}</h2>
              </div>
              <p className="section-head__lead">{whyFocus.lead}</p>
            </div>
            <ul className="why-grid">
              {whyFocus.points.map((point, index) => (
                <li
                  key={point.title}
                  className="why-card surface reveal"
                  style={{ transitionDelay: `${(index % 2) * 70}ms` }}
                >
                  <div className="why-card__top">
                    <span className="why-card__num" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. How we work */}
        <section className="section section--tight light-wash" id="how-we-work">
          <div className="container">
            <div className="section-head reveal">
              <p className="label">{principles.label}</p>
              <h2>{principles.title}</h2>
            </div>
            <ul className="detail-grid about-principles">
              {principles.items.map((item, index) => (
                <li
                  key={item.title}
                  className="detail-card surface reveal"
                  style={{ transitionDelay: `${(index % 4) * 70}ms` }}
                >
                  <span className="detail-card__icon">
                    <IconCheckSmall />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. What we do */}
        <section className="section section--tight dark-field dark-field--quiet" id="what-we-do">
          <div className="container">
            <div className="section-head section-head--split reveal">
              <div>
                <p className="label">{aboutPage.services.label}</p>
                <h2>{aboutPage.services.title}</h2>
              </div>
              <p className="section-head__lead">
                <Link className="svc__more" to={servicesPage.meta.path}>
                  {aboutPage.services.all}
                  <IconArrowRight />
                </Link>
              </p>
            </div>
            <ul className="about-services">
              {services.map((service, index) => {
                const Icon = SERVICE_ICONS[service.icon];
                return (
                  <li key={service.slug} className="reveal" style={{ transitionDelay: `${(index % 4) * 50}ms` }}>
                    <Link className="about-service surface" to={servicePath(service)}>
                      <span className="service-card__icon">
                        <Icon />
                      </span>
                      <span className="about-service__text">
                        <b>{service.name}</b>
                        <small>{service.shortDescription}</small>
                      </span>
                      <IconArrowRight />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* 6. Stats — the same component and values as the home page */}
        <Stats />

        {/* 7. Final CTA */}
        <CtaPanel copy={cta} />
      </main>

      <Footer />
    </div>
  );
}
