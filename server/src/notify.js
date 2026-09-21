/**
 * Emails each new lead to the team through Resend's HTTP API. HTTP rather
 * than SMTP because Render's free tier blocks outbound SMTP ports.
 *
 * Needs RESEND_API_KEY and LEAD_NOTIFY_TO. LEAD_NOTIFY_FROM defaults to
 * Resend's shared test sender, which can only deliver to the address the
 * Resend account was created with — verify a domain to send from your own.
 */

const DEFAULT_FROM = 'Security Marketing Company <onboarding@resend.dev>';

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_TO);
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function sendLeadEmail(lead) {
  const rows = [
    ['Name', lead.name],
    ['Company', lead.company],
    ['Email', lead.email],
    ['Service', lead.service],
    ['Message', lead.message || '—'],
  ];

  const html = `
    <h2 style="margin:0 0 16px;font-family:Arial,sans-serif">New quote request</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${rows
        .map(
          ([label, value]) => `<tr>
        <td style="border:1px solid #ddd;font-weight:bold;vertical-align:top">${label}</td>
        <td style="border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td>
      </tr>`
        )
        .join('')}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#666">Reply to this email to answer ${escapeHtml(lead.name)} directly.</p>`;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM,
      to: process.env.LEAD_NOTIFY_TO.split(',').map((address) => address.trim()),
      reply_to: lead.email,
      subject: `New quote request — ${lead.name}, ${lead.company}`,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}
