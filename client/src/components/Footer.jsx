import { Link } from 'react-router-dom';
import { COMPANY, LEGAL_LINKS, NAV_LINKS, QUICK_LINKS, SOCIALS, services } from '../data/content.js';
import { SOCIAL_ICONS } from './Icons.jsx';
import { EmailText, sectionPath, telHref } from './Links.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  // Only profiles with a URL (and an icon) are shown; with none, the block is
  // left out entirely so the column keeps its normal height.
  const socials = SOCIALS.filter((social) => social.href && SOCIAL_ICONS[social.id]);

  return (
    <footer className="footer dark-field dark-field--quiet">
      <div className="container footer__top">
        <div className="footer__brand">
          {/* DROP-IN: /public/logo/logo-lockup-light.png — transparent, so it sits
              on the textured field without a visible black plate behind it. */}
          <img
            src="/logo/logo-lockup-light.png"
            alt="Security Marketing Company"
            width="260"
            height="87"
          />
          <p className="footer__tagline">{COMPANY.tagline}</p>
          <p>
            A B2B digital marketing agency for security companies in the US, UK, Australia and beyond. We market security companies —
            we do not provide security services.
          </p>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Home page sections — linked from here now that the header only
            carries the main pages. */}
        <div className="footer__col">
          <h4>Quick links</h4>
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.section}>
                <Link to={sectionPath(link.section)}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>
            <Link to="/services">Services</Link>
          </h4>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`}>{service.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col footer__contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href={`mailto:${COMPANY.email}`}>
                <EmailText />
              </a>
            </li>
            {COMPANY.phone && (
              <li>
                <a href={telHref(COMPANY.phone)}>{COMPANY.phone}</a>
              </li>
            )}
            <li>
              <a href={COMPANY.siteUrl}>{COMPANY.site}</a>
            </li>
          </ul>

          {socials.length > 0 && (
            <div className="footer__socials">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.id];
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={`${COMPANY.name} on ${social.label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {COMPANY.name}. All rights reserved.
        </p>
        <nav className="footer__legal" aria-label="Legal">
          {LEGAL_LINKS.map((link, index) => (
            <span key={link.to}>
              {index > 0 && <span aria-hidden="true"> · </span>}
              <Link to={link.to}>{link.label}</Link>
            </span>
          ))}
        </nav>
        <p>{COMPANY.promise}</p>
      </div>
    </footer>
  );
}
