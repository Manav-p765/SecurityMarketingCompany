/**
 * The business email shown to visitors (API error messages) and used as the
 * Reply-To on visitor confirmation emails.
 *
 * The API deploys on its own (Render, rootDir: server), so it cannot import
 * the client's config. This must match COMPANY.email in
 * client/src/data/content.js — the client build (scripts/prerender.js) fails
 * if the two differ.
 */
export const BUSINESS_EMAIL = 'info@securitymarketingcompany.com';
