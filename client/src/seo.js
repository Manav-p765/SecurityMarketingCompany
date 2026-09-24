import { COMPANY, SERVICES, servicesPage } from './data/content.js';

/**
 * Plain data helpers, no React — also imported by scripts/prerender.js at
 * build time, so the static HTML and the in-app tags come from one source.
 */

export const US = { '@type': 'Country', name: 'United States' };

export const absoluteUrl = (path) => `${COMPANY.siteUrl}${path === '/' ? '/' : path}`;

/** JSON-LD for /services: one Service per offering, all provided by us. */
export function servicesSchema() {
  const provider = { '@type': 'ProfessionalService', name: COMPANY.name, url: COMPANY.siteUrl };

  return {
    '@context': 'https://schema.org',
    '@graph': SERVICES.map((service) => ({
      '@type': 'Service',
      '@id': `${absoluteUrl(servicesPage.meta.path)}#${service.id}`,
      name: service.title,
      serviceType: service.title,
      description: `${service.lead}. ${servicesPage.details[service.id].problem}`,
      url: `${absoluteUrl(servicesPage.meta.path)}#${service.id}`,
      provider,
      areaServed: US,
      audience: { '@type': 'BusinessAudience', audienceType: 'Security companies' },
    })),
  };
}
