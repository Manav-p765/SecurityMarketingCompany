import { Link, useLocation } from 'react-router-dom';
import { COMPANY, CONTACT_PATH } from '../data/content.js';

/** A home page section as a path that works from any page, e.g. "/#contact". */
export const sectionPath = (id) => `/#${id}`;

const isHomePath = (pathname) => pathname === '/' || pathname === '/index.html';

/**
 * Every "Book Strategy Call" button goes through here. With a calendar link
 * set in content.js it opens the calendar in a new tab. Otherwise buttons on
 * the home page scroll to its contact form, and buttons anywhere else go to
 * the /contact page. `to` overrides that (the header always uses /contact).
 */
export function StrategyCallLink({ children, to, ...props }) {
  const { pathname } = useLocation();

  if (COMPANY.calendarUrl) {
    return (
      <a {...props} href={COMPANY.calendarUrl} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link {...props} to={to ?? (isHomePath(pathname) ? sectionPath('contact') : CONTACT_PATH)}>
      {children}
    </Link>
  );
}

/** "tel:" href from a display number such as "(214) 555-0100". */
export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;
