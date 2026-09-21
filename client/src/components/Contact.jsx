import { useEffect, useState } from 'react';
import { COMPANY, SERVICE_OPTIONS } from '../data/content.js';
import { IconAlert, IconArrowRight, IconCheck } from './Icons.jsx';

const EMPTY = { name: '', company: '', email: '', service: '', message: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Where the API lives. Empty = same origin (dev proxy, or Express serving the
// build). Set VITE_API_URL when the API is hosted separately, e.g. on Render.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/** Mirrors the server-side rules in server/src/routes/leads.js. */
function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (values.company.trim().length < 2) errors.company = 'Please enter your company name.';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid work email address.';
  if (!SERVICE_OPTIONS.includes(values.service)) errors.service = 'Please choose a service.';
  if (values.message.trim().length > 4000) {
    errors.message = 'Please keep this under 4,000 characters.';
  }
  return errors;
}

function Field({ id, label, error, children, full = false, optional = false }) {
  return (
    <div className={`field${error ? ' has-error' : ''}${full ? ' field--full' : ''}`}>
      <label htmlFor={id}>
        {label}{' '}
        {optional ? (
          <em className="field__optional">(optional)</em>
        ) : (
          <span aria-hidden="true">*</span>
        )}
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

  // A separately hosted API (Render's free tier) sleeps when idle and takes
  // up to a minute to wake. Nudge it on page load so it is awake by the time
  // someone finishes the form.
  useEffect(() => {
    if (API_URL) fetch(`${API_URL}/api/health`).catch(() => {});
  }, []);

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
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload.errors) setErrors(payload.errors);
        setServerMessage(
          payload.message ||
            (payload.errors ? (
              'We could not send that. Please check the highlighted fields.'
            ) : (
              <>
                We could not send that just now. Please try again, or email{' '}
                <a className="text-link" href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
                .
              </>
            ))
        );
        setStatus('error');
        return;
      }

      setValues(EMPTY);
      setErrors({});
      setStatus('success');
    } catch {
      setServerMessage(
        <>
          Network error — please email{' '}
          <a className="text-link" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>{' '}
          and we will pick it up from there.
        </>
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

                <Field
                  id="message"
                  label="What do you need?"
                  error={errors.message}
                  full
                  optional
                >
                  <textarea
                    id="message"
                    name="message"
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
