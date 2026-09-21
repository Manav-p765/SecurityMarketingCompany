import { useState } from 'react';
import { COMPANY, SERVICE_OPTIONS } from '../data/content.js';
import { IconAlert, IconArrowRight, IconCheck } from './Icons.jsx';

const EMPTY = { name: '', company: '', email: '', service: '', message: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mirrors the server-side rules in server/src/routes/leads.js. */
function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (values.company.trim().length < 2) errors.company = 'Please enter your company name.';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid work email address.';
  if (!SERVICE_OPTIONS.includes(values.service)) errors.service = 'Please choose a service.';
  if (values.message.trim().length < 10) {
    errors.message = 'Tell us a little more — at least 10 characters.';
  }
  return errors;
}

function Field({ id, label, error, children, full = false }) {
  return (
    <div className={`field${error ? ' has-error' : ''}${full ? ' field--full' : ''}`}>
      <label htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          <IconAlert />
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverMessage, setServerMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the visitor starts correcting it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerMessage('');

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus('idle');
      const first = document.getElementById(Object.keys(nextErrors)[0]);
      first?.focus();
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload.errors) setErrors(payload.errors);
        setServerMessage(
          payload.message || 'We could not send that. Please check the highlighted fields.'
        );
        setStatus('error');
        return;
      }

      setValues(EMPTY);
      setErrors({});
      setStatus('success');
    } catch {
      setServerMessage(
        `Network error — please email ${COMPANY.email} and we will pick it up from there.`
      );
      setStatus('error');
    }
  };

  const describedBy = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <section className="section section--screen contact dark-field" id="contact">
      <div className="container contact__layout">
        <div className="contact__intro reveal">
          <p className="label">Get a quote</p>
          <h2>Tell us what you want to win</h2>
          <div className="prose">
            <p>
              Send us the contracts you are chasing and the areas you cover. We will come back with
              a straight assessment of what it takes to get there — no obligation, and no
              three-week discovery phase before you hear anything useful.
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
            <div>
              <dt>Website</dt>
              <dd>
                <a className="text-link" href={COMPANY.siteUrl}>
                  {COMPANY.site}
                </a>
              </dd>
            </div>
            <div>
              <dt>Response time</dt>
              <dd>Same business day</dd>
            </div>
          </dl>
        </div>

        <div className="form reveal">
          {status === 'success' ? (
            <div className="form__success" role="status">
              <span className="form__success-icon">
                <IconCheck />
              </span>
              <h3>Request received</h3>
              <p>
                Thanks — your details are with us. Andy will reply from{' '}
                <a className="text-link" href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>{' '}
                the same business day with next steps.
              </p>
              <button type="button" onClick={() => setStatus('idle')}>
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {status === 'error' && serverMessage && (
                <p className="form__alert" role="alert">
                  {serverMessage}
                </p>
              )}

              <div className="form__grid">
                <Field id="name" label="Your name" error={errors.name}>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Anand Kumar"
                    value={values.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy('name')}
                  />
                </Field>

                <Field id="company" label="Company" error={errors.company}>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Northgate Security Services"
                    value={values.company}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={describedBy('company')}
                  />
                </Field>

                <Field id="email" label="Work email" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@yourcompany.com"
                    value={values.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={describedBy('email')}
                  />
                </Field>

                <Field id="service" label="Service interested in" error={errors.service}>
                  <select
                    id="service"
                    name="service"
                    value={values.service}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.service)}
                    aria-describedby={describedBy('service')}
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="message" label="What do you need?" error={errors.message} full>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="We run manned guarding across three counties and want more commercial contracts. Our site gets almost no enquiries."
                    value={values.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={describedBy('message')}
                  />
                </Field>

                {/* Honeypot — left empty by real visitors. */}
                <div className="field--trap" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form__footer">
                <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Get a Quote'}
                  {status !== 'sending' && <IconArrowRight />}
                </button>
                <p className="form__note">
                  We reply the same business day. Your details are never sold or shared.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
