import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COMPANY, CONTACT_FORM, SERVICE_OPTIONS, privacyPolicy, thankYouPage } from '../data/content.js';
import { trackLead } from '../analytics.js';
import { IconAlert, IconArrowRight } from './Icons.jsx';

const EMPTY = { name: '', company: '', email: '', service: '', message: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// The API is always called at relative /api URLs: on the live site a Vercel
// rewrite (client/vercel.json) forwards them to the API on Render; locally
// the Vite dev/preview servers proxy them to Express.
const API_URL = '';

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

const EmailLink = () => (
  <a className="text-link" href={`mailto:${COMPANY.email}`}>
    {COMPANY.email}
  </a>
);

/**
 * Session storage key read by the thank-you page, only to greet the visitor
 * by first name. It never gates the page: a direct visit shows it normally.
 */
export const LEAD_SESSION_KEY = 'smc:lead';

function rememberFirstName(name) {
  try {
    const firstName = name.trim().split(/\s+/)[0] || '';
    sessionStorage.setItem(LEAD_SESSION_KEY, JSON.stringify({ firstName }));
  } catch {
    // Storage blocked (private mode, settings): the page just skips the name.
  }
}

/** "By submitting, you agree to our {privacy}." with the link. */
function PrivacyNotice() {
  const [before, after = ''] = CONTACT_FORM.privacyNotice.split('{privacy}');
  return (
    <p className="form__privacy">
      {before}
      <Link className="text-link" to={privacyPolicy.meta.path}>
        {CONTACT_FORM.privacyLinkLabel}
      </Link>
      {after}
    </p>
  );
}

/**
 * The lead form: validation, submission to /api/leads and error states.
 * Used by the home page contact section and the /contact page. On success it
 * sends GA4 `generate_lead` (once, here — never on the thank-you page) and
 * then goes to /thank-you. On an error the visitor stays on the form.
 * `location` ("homepage" or "contact_page") picks the note in CONTACT_FORM
 * and is sent to GA4 as `form_location`.
 */
export default function ContactForm({ location }) {
  const copy = CONTACT_FORM[location];
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [serverMessage, setServerMessage] = useState('');
  const navigate = useNavigate();

  // A separately hosted API (Render's free tier) sleeps when idle and takes
  // up to a minute to wake. Nudge it on page load so it is awake by the time
  // someone finishes the form.
  useEffect(() => {
    fetch(`${API_URL}/api/health`).catch(() => {});
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
                We could not send that just now. Please try again, or email <EmailLink />.
              </>
            ))
        );
        setStatus('error');
        return;
      }

      rememberFirstName(values.name);
      // Before navigating, so the event is queued while this page is current.
      trackLead(location);
      navigate(thankYouPage.meta.path);
    } catch {
      setServerMessage(
        <>
          Network error — please email <EmailLink /> and we will pick it up from there.
        </>
      );
      setStatus('error');
    }
  };

  const describedBy = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
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

        <Field id="message" label="What do you need?" error={errors.message} full optional>
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
          {status === 'sending' ? CONTACT_FORM.sending : CONTACT_FORM.submit}
          {status !== 'sending' && <IconArrowRight />}
        </button>
        <p className="form__note">{copy.note}</p>
      </div>
      <PrivacyNotice />
    </form>
  );
}
