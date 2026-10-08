import { Resend } from 'resend';
import { BUSINESS_EMAIL, COMPANY_NAME, SITE_URL } from './config.js';

/**
 * Lead emails through Resend (the `resend` SDK, which calls its HTTP API —
 * Render's free tier blocks outbound SMTP ports).
 *
 * Two emails per submission, both from emailSender() (RESEND_FROM, default
 * DEFAULT_FROM below — the business address on the domain verified in
 * Resend):
 *  - sendLeadEmail: the lead's details to the team (LEAD_NOTIFY_TO,
 *    comma-separated). Reply-To is the visitor.
 *  - sendLeadConfirmation: a "we got it" note to the visitor, with Reply-To
 *    set to the business email (BUSINESS_EMAIL in config.js), so a visitor's
 *    reply reaches the same inbox shown on the website.
 *
 * Needs RESEND_API_KEY and LEAD_NOTIFY_TO. Visitor confirmations are skipped
 * if RESEND_FROM is set to Resend's shared test sender (@resend.dev), which
 * can only deliver to the Resend account's own address.
 */

export const DEFAULT_FROM = `${COMPANY_NAME} <${BUSINESS_EMAIL}>`;

/** The From header for every email the site sends. */
export const emailSender = () => process.env.RESEND_FROM?.trim() || DEFAULT_FROM;

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_TO);
}

/** Visitor confirmations need a sender on a domain verified in Resend. */
export function isConfirmationConfigured() {
  return isEmailConfigured() && !emailSender().includes('@resend.dev');
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const FONT = 'font-family:Arial,Helvetica,sans-serif';
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');

// Created on first use, so the API key is read after dotenv has loaded it.
let client;
const resend = () => (client ??= new Resend(process.env.RESEND_API_KEY));

/** Sends one email from emailSender(). Resolves Resend's email id. */
async function send(payload) {
  // The SDK returns errors rather than throwing; throw so callers can log them.
  const { data, error } = await resend().emails.send({ from: emailSender(), ...payload });
  if (error) {
    throw new Error(`Resend: ${error.name ?? 'error'} — ${error.message}`);
  }
  return data.id;
}

const detailRows = (lead) => [
  ['Name', lead.name],
  ['Company', lead.company],
  ['Email', lead.email],
  ['Service', lead.service],
  ['Message', lead.message || '—'],
];

// The visitor's email renders as a mailto link so it can be clicked.
const cell = (label, value) =>
  label === 'Email'
    ? `<a href="mailto:${escapeHtml(value)}" style="color:#e31b23">${escapeHtml(value)}</a>`
    : escapeHtml(value);

const detailTable = (rows) => `
    <table cellpadding="8" style="border-collapse:collapse;${FONT};font-size:14px">
      ${rows
        .map(
          ([label, value]) => `<tr>
        <td style="border:1px solid #ddd;font-weight:bold;vertical-align:top">${label}</td>
        <td style="border:1px solid #ddd;white-space:pre-wrap">${cell(label, value)}</td>
      </tr>`
        )
        .join('')}
    </table>`;

/** The lead's details, to the team. Reply goes straight to the visitor. */
export async function sendLeadEmail(lead) {
  const rows = detailRows(lead);

  return send({
    to: process.env.LEAD_NOTIFY_TO.split(',').map((address) => address.trim()),
    replyTo: lead.email,
    subject: `New strategy call request — ${lead.name}, ${lead.company}`,
    html: `
    <h2 style="margin:0 0 16px;${FONT}">New strategy call request</h2>
    ${detailTable(rows)}
    <p style="${FONT};font-size:13px;color:#666">Reply to this email to answer ${escapeHtml(lead.name)} directly.</p>`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
  });
}

/** "We got it" note to the visitor. Replies go to the business email. */
export async function sendLeadConfirmation(lead) {
  const firstName = lead.name.split(/\s+/)[0];
  const rows = detailRows(lead).filter(([label]) => label !== 'Email');

  return send({
    to: [lead.email],
    replyTo: BUSINESS_EMAIL,
    subject: `We received your strategy call request — ${COMPANY_NAME}`,
    html: `
    <p style="${FONT};font-size:15px">Hi ${escapeHtml(firstName)},</p>
    <p style="${FONT};font-size:15px;line-height:1.6">Thanks for getting in touch. Your request is with us, and we will reply the same business day to arrange a time for your strategy call.</p>
    <p style="${FONT};font-size:15px;line-height:1.6">Here is what you sent:</p>
    ${detailTable(rows)}
    <p style="${FONT};font-size:15px;line-height:1.6">If you have anything to add, just reply to this email.</p>
    <p style="${FONT};font-size:15px;line-height:1.6">Best regards,<br />The ${COMPANY_NAME} team</p>
    <p style="${FONT};font-size:12px;line-height:1.5;color:#666;border-top:1px solid #ddd;padding-top:12px;margin-top:24px">
      ${COMPANY_NAME} · <a href="${SITE_URL}" style="color:#e31b23">${SITE_HOST}</a> · <a href="mailto:${BUSINESS_EMAIL}" style="color:#e31b23">${BUSINESS_EMAIL}</a>
    </p>`,
    text: [
      `Hi ${firstName},`,
      '',
      'Thanks for getting in touch. Your request is with us, and we will reply the same business day to arrange a time for your strategy call.',
      '',
      'Here is what you sent:',
      ...rows.map(([label, value]) => `${label}: ${value}`),
      '',
      'If you have anything to add, just reply to this email.',
      '',
      'Best regards,',
      `The ${COMPANY_NAME} team`,
      '',
      '--',
      `${COMPANY_NAME} · ${SITE_HOST} · ${BUSINESS_EMAIL}`,
    ].join('\n'),
  });
}
