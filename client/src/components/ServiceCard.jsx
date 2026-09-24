import { Link } from 'react-router-dom';
import { serviceDetail, serviceNumber } from '../data/content.js';
import { IconArrowRight, SERVICE_ICONS } from './Icons.jsx';

/**
 * Compact service card linking to its detail page. Used for the home page
 * grid and the "Related services" row on each detail page.
 */
export default function ServiceCard({ service, headingLevel: Heading = 'h3', style }) {
  const Icon = SERVICE_ICONS[service.icon];

  return (
    <Link to={`/services/${service.slug}`} className="service-card surface reveal" style={style}>
      <div className="service-card__top">
        <span className="service-card__icon">
          <Icon />
        </span>
        <span className="service-card__num">{serviceNumber(service)}</span>
      </div>

      <Heading>{service.name}</Heading>

      <p className="service-card__lead">{service.shortDescription}</p>

      <span className="service-card__more">
        {serviceDetail.learnMore}
        <IconArrowRight />
      </span>
    </Link>
  );
}
