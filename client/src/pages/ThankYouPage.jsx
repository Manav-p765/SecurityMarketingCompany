import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { LEAD_SESSION_KEY } from '../components/ContactForm.jsx';
import { IconArrowRight, IconCheck } from '../components/Icons.jsx';
import { COMPANY, thankYouPage as copy } from '../data/content.js';
import { usePageMeta } from '../hooks/usePageMeta.js';

/** First name saved by ContactForm on submit, if any. Personalization only. */
function readFirstName() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(LEAD_SESSION_KEY) || 'null');
    return typeof saved?.firstName === 'string' ? saved.firstName.slice(0, 40) : '';
  } catch {
    return '';
  }
}

/**
 * /thank-you. Shown after a successful form submission, and normally on a
 * direct visit too. It sends no lead event: `generate_lead` fires in
 * ContactForm on submit, so a refresh or a bookmarked visit never counts as
 * a lead. The usual page_view still fires (App.jsx). noindex, nofollow.
 */
export default function ThankYouPage() {
  usePageMeta(copy.meta);
  const [firstName] = useState(readFirstName);
  const heading = firstName ? copy.headingWithName.replace('{name}', firstName) : copy.heading;

  return (
    <div className="page detail-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <section className="svc-hero dark-field thanks">
          <div className="container thanks__inner">
            <span className="thanks__icon" aria-hidden="true">
              <IconCheck />
            </span>
            <p className="label">{copy.eyebrow}</p>
            <h1>{heading}</h1>
            <p className="svc-hero__subhead">{copy.body}</p>

            <div className="thanks__grid">
              <div className="contact-card surface">
                <h2 className="contact-card__title">{copy.nextSteps.title}</h2>
                <ol className="next-steps">
                  {copy.nextSteps.steps.map((step, index) => (
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

              <div className="thanks__side">
                {COMPANY.calendarUrl && (
                  <div className="contact-card surface">
                    <h2 className="contact-card__title">{copy.calendar.title}</h2>
                    <a
                      className="btn btn--primary thanks__calendar"
                      href={COMPANY.calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {copy.calendar.button}
                      <IconArrowRight />
                    </a>
                  </div>
                )}

                <nav className="contact-card surface" aria-label={copy.links.title}>
                  <h2 className="contact-card__title">{copy.links.title}</h2>
                  <ul className="thanks__links">
                    {copy.links.items.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to}>
                          {link.label}
                          <IconArrowRight />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
