import { COMPANY } from '../data/content.js';
import ContactForm from './ContactForm.jsx';
import { telHref } from './Links.jsx';

/** Home page contact section: intro and direct details beside the shared lead form. */
export default function Contact() {
  return (
    <section className="section section--screen contact dark-field" id="contact">
      <div className="container contact__layout">
        <div className="contact__intro reveal">
          <p className="label">Book a strategy call</p>
          <h2>Tell us what you want to win</h2>
          <div className="prose">
            <p>
              Tell us the contracts you are chasing and the areas you cover. We will come back with
              a straight assessment of what it takes to win them — no obligation.
            </p>
          </div>

          <dl className="contact__direct">
            <div>
              <dt>Email</dt>
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
            {COMPANY.calendarUrl && (
              <div>
                <dt>Prefer to pick a time?</dt>
                <dd>
                  <a
                    className="text-link"
                    href={COMPANY.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book on our calendar
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt>Response time</dt>
              <dd>Same business day</dd>
            </div>
          </dl>
        </div>

        <div className="form reveal">
          <ContactForm location="homepage" />
        </div>
      </div>
    </section>
  );
}
