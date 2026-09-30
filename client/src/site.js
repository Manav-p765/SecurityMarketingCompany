import { reviews } from './data/content.js';

/**
 * Which hostnames count as the live site. Used by the Google tag (see
 * analytics.js). No React, no DOM at import time, so vite.config.js and
 * scripts/prerender.js can import it.
 */
export const PRODUCTION_HOSTNAMES = ['securitymarketingcompany.com', 'www.securitymarketingcompany.com'];

export const isProductionHost = (hostname) => PRODUCTION_HOSTNAMES.includes(hostname);

/** Real client reviews: the only ones that may appear in Review schema. */
export const publishedReviews = () => reviews.filter((review) => !review.isSample);

/**
 * Reviews shown on the home page: all of them, on every environment
 * including production. While any of them is a sample (`isSample: true`),
 * Reviews.jsx shows a small "Sample reviews shown" line under the heading;
 * it disappears once every review is real. Samples never reach the Review
 * schema (seo.js uses publishedReviews).
 */
export const displayedReviews = () => reviews;

export const hasSampleReviews = (items) => items.some((review) => review.isSample);
