/**
 * Sends one "Hello World" email to check the Resend API key works.
 *
 *   npm run test:email                      -> sends to LEAD_NOTIFY_TO
 *   npm run test:email -- you@example.com   -> sends to that address
 *
 * Reads RESEND_API_KEY (and optionally LEAD_NOTIFY_FROM / LEAD_NOTIFY_TO)
 * from server/.env. Never paste the key into this file.
 */
import 'dotenv/config';
import { Resend } from 'resend';

const key = process.env.RESEND_API_KEY;
if (!key || key === 're_xxxxxxxxx') {
  console.error('Set RESEND_API_KEY in server/.env first (your real key, starting re_).');
  process.exit(1);
}

const to =
  process.argv[2] ||
  process.env.LEAD_NOTIFY_TO?.split(',')[0].trim() ||
  'andy@securitymarketingcompany.com';
const from = process.env.LEAD_NOTIFY_FROM || 'onboarding@resend.dev';

const resend = new Resend(key);

const { data, error } = await resend.emails.send({
  from,
  to,
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
});

if (error) {
  console.error(`Failed to send to ${to}: ${error.name ?? 'error'} — ${error.message}`);
  if (from.includes('@resend.dev')) {
    console.error(
      'Note: from onboarding@resend.dev, Resend only delivers to the email you signed up with.'
    );
  }
  process.exit(1);
}

console.log(`Sent to ${to} from ${from} (id ${data.id}). Check the inbox.`);
