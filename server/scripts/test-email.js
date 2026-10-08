/**
 * Sends one test email: the real visitor confirmation ("We received your
 * strategy call request") filled with sample details, from the same sender
 * the site uses (RESEND_FROM). Then reads it back from Resend and prints
 * its From, Reply-To and subject, to confirm the sender setup.
 *
 *   npm run test:email                      -> sends to LEAD_NOTIFY_TO (else BUSINESS_EMAIL)
 *   npm run test:email -- you@example.com   -> sends to that address
 *
 * Reads RESEND_API_KEY (and optionally RESEND_FROM / LEAD_NOTIFY_TO) from
 * server/.env. Never paste the key into this file.
 */
import 'dotenv/config';
import { Resend } from 'resend';
import { BUSINESS_EMAIL } from '../src/config.js';
import { emailSender, sendLeadConfirmation } from '../src/notify.js';

const key = process.env.RESEND_API_KEY;
if (!key || key === 're_xxxxxxxxx') {
  console.error('Set RESEND_API_KEY in server/.env first (your real key, starting re_).');
  process.exit(1);
}

const to = process.argv[2] || process.env.LEAD_NOTIFY_TO?.split(',')[0].trim() || BUSINESS_EMAIL;
const from = emailSender();

let id;
try {
  id = await sendLeadConfirmation({
    name: 'Test Visitor',
    company: 'Example Security Ltd',
    email: to,
    service: 'SEO',
    message: 'This is a test of the strategy call confirmation email.',
  });
} catch (err) {
  console.error(`Failed to send to ${to} from ${from}: ${err.message}`);
  if (from.includes('@resend.dev')) {
    console.error('Note: from @resend.dev, Resend only delivers to the email you signed up with.');
  }
  process.exit(1);
}

console.log(`Sent to ${to} (id ${id}). Check the inbox.`);

// What Resend actually recorded for the email.
const { data, error } = await new Resend(key).emails.get(id);
if (error) {
  console.warn(`Could not read the email back from Resend: ${error.message}`);
} else {
  const replyTo = [].concat(data.reply_to ?? []).join(', ') || '(none)';
  console.log(`  From:     ${data.from}`);
  console.log(`  Reply-To: ${replyTo}`);
  console.log(`  Subject:  ${data.subject}`);
}
