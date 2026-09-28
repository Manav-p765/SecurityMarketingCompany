import Header from '../components/Header.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Faq from '../components/Faq.jsx';
import Footer from '../components/Footer.jsx';
import { IconArrowRight } from '../components/Icons.jsx';
import { telHref } from '../components/Links.jsx';
import { COMPANY, contactPage } from '../data/content.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';
import { contactSchema } from '../seo.js';

const { hero, form, direct, nextSteps, faq } = contactPage;
const SCHEMA = contactSchema();

export default function ContactPage() {
  useReveal();
  usePageMeta(contactPage.meta, SCHEMA);

  return (
    <div className="page detail-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <section className="svc-hero dark-field contact-hero">
          <div className="container">
            <p className="label">{hero.eyebrow}</p>
            <h1>
              {hero.headlineTop} <span className="accent">{hero.headlineBottom}</span>
            </h1>
            <p className="svc-hero__subhead">{hero.subhead}</p>
          </div>
        </section>

        <section className="section section--tight dark-field dark-field--quiet contact-page" id="contact-form">
          <div className="container contact-page__layout">
            {/* The same form component, validation and API as the home page. */}
            <div className="form reveal">
              <p className="label">{form.label}</p>
              <h2 className="contact-page__form-title">{form.title}</h2>
              <ContactForm location="contact_page" />
            </div>

            <aside className="contact-page__aside">
              <div className="contact-card surface reveal">
                <h2 className="contact-card__title">{direct.title}</h2>
                <dl className="contact__direct">
                  <div>
                    <dt>{direct.emailLabel}</dt>
                    <dd>
                      <a className="text-link" href={`mailto:${COMPANY.email}`}>
                        {COMPANY.email}
                      </a>
                    </dd>
                  </div>
                  {COMPANY.phone && (
                    <div>
                      <dt>Phone</dt>
                      <dd>
                        <a className="text-link" href={telHref(COMPANY.phone)}>
                          {COMPANY.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                {COMPANY.calendarUrl && (
                  <div className="contact-card__calendar">
                    <p>{direct.calendarTitle}</p>
                    <a
                      className="btn btn--ghost-light"
                      href={COMPANY.calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {direct.calendarButton}
                      <IconArrowRight />
                    </a>
                  </div>
                )}
              </div>

              <div className="contact-card surface reveal">
                <h2 className="contact-card__title">{nextSteps.title}</h2>
                <ol className="next-steps">
                  {nextSteps.steps.map((step, index) => (
                    <li key={step.title}>
                      <span className="next-steps__num" aria-hidden="true">
                        {index + 1}
                      </span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </section>

        <Faq id="contact-faq" label={faq.label} title={faq.title} items={faq.items} />
      </main>

      <Footer />
    </div>
  );
}
