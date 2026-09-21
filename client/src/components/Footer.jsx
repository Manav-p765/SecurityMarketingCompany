import { COMPANY, NAV_LINKS, SERVICES, SOCIALS } from '../data/content.js';
import { SOCIAL_ICONS } from './Icons.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

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
            A B2B digital marketing agency for the security industry. We market security companies —
            we do not provide security services.
          </p>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Services</h4>
          <ul>
            {SERVICES.map((service) => (
              <li key={service.id}>
                <a href="#services">{service.title}</a>
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
            <li>
              <a href={COMPANY.siteUrl}>{COMPANY.site}</a>
            </li>
          </ul>

          <div className="footer__socials">
            {SOCIALS.map((social) => {
              const Icon = SOCIAL_ICONS[social.id];
              return (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
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
