/**
 * Lead emails through Resend's HTTP API. HTTP rather than SMTP because
 * Render's free tier blocks outbound SMTP ports.
 *
 * Two emails per submission:
 *  - sendLeadEmail: the lead's details to the team (LEAD_NOTIFY_TO).
 *  - sendLeadConfirmation: a "we got it" note to the visitor.
 *
 * Needs RESEND_API_KEY and LEAD_NOTIFY_TO. LEAD_NOTIFY_FROM defaults to
 * Resend's shared test sender, which can only deliver to the address the
 * Resend account was created with. That is enough for the team email, but
 * the visitor confirmation needs a verified domain, so it only sends once
 * LEAD_NOTIFY_FROM is on one.
 */

const DEFAULT_FROM = 'Security Marketing Company <onboarding@resend.dev>';
const DEFAULT_REPLY_TO = 'andy@securitymarketingcompany.com';

const sender = () => process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM;

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_TO);
}

/** Visitor confirmations need a sender on a domain verified in Resend. */
export function isConfirmationConfigured() {
  return isEmailConfigured() && !sender().includes('@resend.dev');
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const FONT = 'font-family:Arial,Helvetica,sans-serif';

async function send(payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: sender(), ...payload }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}

const detailRows = (lead) => [
  ['Name', lead.name],
  ['Company', lead.company],
  ['Email', lead.email],
  ['Service', lead.service],
  ['Message', lead.message || '—'],
];

const detailTable = (rows) => `
    <table cellpadding="8" style="border-collapse:collapse;${FONT};font-size:14px">
      ${rows
        .map(
          ([label, value]) => `<tr>
        <td style="border:1px solid #ddd;font-weight:bold;vertical-align:top">${label}</td>
        <td style="border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td>
      </tr>`
        )
        .join('')}
    </table>`;

/** The lead's details, to the team. Reply goes straight to the visitor. */
export async function sendLeadEmail(lead) {
  const rows = detailRows(lead);

  await send({
    to: process.env.LEAD_NOTIFY_TO.split(',').map((address) => address.trim()),
    reply_to: lead.email,
    subject: `New quote request — ${lead.name}, ${lead.company}`,
    html: `
    <h2 style="margin:0 0 16px;${FONT}">New quote request</h2>
    ${detailTable(rows)}
    <p style="${FONT};font-size:13px;color:#666">Reply to this email to answer ${escapeHtml(lead.name)} directly.</p>`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
  });
}

/** "We got it" note to the visitor. Replies go to Andy. */
export async function sendLeadConfirmation(lead) {
  const firstName = lead.name.split(/\s+/)[0];
  const rows = detailRows(lead).filter(([label]) => label !== 'Email');

  await send({
    to: [lead.email],
    reply_to: process.env.LEAD_REPLY_TO || DEFAULT_REPLY_TO,
    subject: 'We received your quote request — Security Marketing Company',
    html: `
    <p style="${FONT};font-size:15px">Hi ${escapeHtml(firstName)},</p>
    <p style="${FONT};font-size:15px;line-height:1.6">Thanks for getting in touch. Your request is with us, and Andy will reply the same business day with next steps.</p>
    <p style="${FONT};font-size:15px;line-height:1.6">Here is what you sent:</p>
    ${detailTable(rows)}
    <p style="${FONT};font-size:15px;line-height:1.6">If you have anything to add, just reply to this email.</p>
    <p style="${FONT};font-size:15px;line-height:1.6">Best,<br />Andy<br />Security Marketing Company</p>`,
    text: [
      `Hi ${firstName},`,
      '',
      'Thanks for getting in touch. Your request is with us, and Andy will reply the same business day with next steps.',
      '',
      'Here is what you sent:',
      ...rows.map(([label, value]) => `${label}: ${value}`),
      '',
      'If you have anything to add, just reply to this email.',
      '',
      'Best,',
      'Andy',
      'Security Marketing Company',
    ].join('\n'),
  });
}
