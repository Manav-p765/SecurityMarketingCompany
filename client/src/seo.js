import {
  aboutPage,
  COMPANY,
  contactPage,
  serviceDetail,
  services,
  servicesPage,
} from './data/content.js';
import { publishedReviews } from './site.js';

/**
 * Plain data helpers, no React — also imported by scripts/prerender.js at
 * build time, so the static HTML and the in-app tags come from one source.
 */

/** Markets we serve: areaServed in every schema here (client/index.html has the same list — keep in step). */
export const AREA_SERVED = ['United States', 'United Kingdom', 'Australia', 'Canada'].map((name) => ({
  '@type': 'Country',
  name,
}));

export const absoluteUrl = (path) => `${COMPANY.siteUrl}${path === '/' ? '/' : path}`;

export const servicePath = (service) => `/services/${service.slug}`;

/** Page meta for a service detail page, in the shape usePageMeta takes. */
export const serviceMeta = (service) => ({
  path: servicePath(service),
  title: service.seo.title,
  description: service.seo.description,
});

const provider = { '@type': 'ProfessionalService', name: COMPANY.name, url: COMPANY.siteUrl };

/** One Service node. Its @id is the detail page, so every page refers to the same entity. */
function serviceNode(service) {
  const url = absoluteUrl(servicePath(service));
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.hero.subheadline,
    url,
    provider,
    areaServed: AREA_SERVED,
    audience: { '@type': 'BusinessAudience', audienceType: 'Security companies' },
  };
}

/** WebPage-type JSON-LD (AboutPage, ContactPage) about the agency itself. */
function pageSchema(type, meta, extra = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${absoluteUrl(meta.path)}#webpage`,
    url: absoluteUrl(meta.path),
    name: meta.title,
    description: meta.description,
    inLanguage: 'en-US',
    about: { ...provider, areaServed: AREA_SERVED },
    ...extra,
  };
}

export const aboutSchema = () => pageSchema('AboutPage', aboutPage.meta);

export const contactSchema = () =>
  pageSchema('ContactPage', contactPage.meta, {
    mainEntity: {
      ...provider,
      email: COMPANY.email,
      ...(COMPANY.phone && { telephone: COMPANY.phone }),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: COMPANY.email,
        areaServed: AREA_SERVED,
        availableLanguage: 'English',
      },
    },
  });

/**
 * Review JSON-LD for the home page, built from real reviews only (see
 * publishedReviews in site.js). Returns null while there are none, so sample
 * reviews never reach structured data.
 */
export function reviewsSchema() {
  const real = publishedReviews();
  if (real.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    ...provider,
    review: real.map((review) => ({
      '@type': 'Review',
      reviewBody: review.quote,
      author: { '@type': 'Person', name: review.name },
      ...(review.rating && {
        reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 },
      }),
    })),
  };
}

/** JSON-LD for /services: every Service. */
export function servicesSchema() {
  return { '@context': 'https://schema.org', '@graph': services.map(serviceNode) };
}

/** JSON-LD for /services/:slug: the Service plus its BreadcrumbList. */
export function serviceDetailSchema(service) {
  const crumbs = [
    [serviceDetail.breadcrumb.home, '/'],
    [serviceDetail.breadcrumb.services, servicesPage.meta.path],
    [service.name, servicePath(service)],
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      serviceNode(service),
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map(([name, path], index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          item: absoluteUrl(path),
        })),
      },
    ],
  };
}
