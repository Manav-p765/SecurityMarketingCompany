import { Link } from 'react-router-dom';
import { COMPANY, NAV_LINKS, SOCIALS, services } from '../data/content.js';
import { SOCIAL_ICONS } from './Icons.jsx';
import { sectionPath, telHref } from './Links.jsx';

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
            A B2B digital marketing agency for US security companies. We market security companies —
            we do not provide security services.
          </p>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link to={link.to ?? sectionPath(link.section)}>{link.label}</Link>
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
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
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
        <p>{COMPANY.promise}</p>
      </div>
    </footer>
  );
}
