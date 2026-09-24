import { COMPANY, serviceDetail, services, servicesPage } from './data/content.js';

/**
 * Plain data helpers, no React — also imported by scripts/prerender.js at
 * build time, so the static HTML and the in-app tags come from one source.
 */

export const US = { '@type': 'Country', name: 'United States' };

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
    areaServed: US,
    audience: { '@type': 'BusinessAudience', audienceType: 'Security companies' },
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
