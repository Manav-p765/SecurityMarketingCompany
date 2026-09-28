import { reviews } from './data/content.js';

/**
 * Which hostnames count as the live site. Used by the Google tag (see
 * analytics.js) and by the reviews display rule below. No React, no DOM at
 * import time, so vite.config.js and scripts/prerender.js can import it.
 */
export const PRODUCTION_HOSTNAMES = ['securitymarketingcompany.com', 'www.securitymarketingcompany.com'];

export const isProductionHost = (hostname) => PRODUCTION_HOSTNAMES.includes(hostname);

/** Real client reviews: the only ones that may appear live or in Review schema. */
export const publishedReviews = () => reviews.filter((review) => !review.isSample);

/**
 * The one place that decides which reviews are displayed.
 *  - Production: real reviews only. With none, the section is hidden.
 *  - Anywhere else (localhost, `vite preview`, Vercel preview deployments):
 *    real and sample reviews, so the design can be reviewed.
 * Going live needs no code change: replace the samples in `reviews`
 * (content.js) with real ones and set `isSample: false`.
 */
export function displayedReviews(hostname = window.location.hostname) {
  return isProductionHost(hostname) ? publishedReviews() : reviews;
}
