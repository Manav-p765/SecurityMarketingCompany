import { Link } from 'react-router-dom';
import { COMPANY } from '../data/content.js';

/** A home page section as a path that works from any page, e.g. "/#contact". */
export const sectionPath = (id) => `/#${id}`;

/**
 * Every "Book Strategy Call" button goes through here. With a calendar link
 * set in content.js it opens the calendar in a new tab; otherwise it takes
 * the visitor to the contact form on the home page.
 */
export function StrategyCallLink({ children, ...props }) {
  if (COMPANY.calendarUrl) {
    return (
      <a {...props} href={COMPANY.calendarUrl} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link {...props} to={sectionPath('contact')}>
      {children}
    </Link>
  );
}

/** "tel:" href from a display number such as "(214) 555-0100". */
export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;
