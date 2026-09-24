import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../data/content.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { StrategyCallLink, sectionPath } from './Links.jsx';

const SECTION_IDS = NAV_LINKS.filter((link) => link.section).map((link) => link.section);
const NO_SECTIONS = [];

/** Page links go to their route; section links go to "/#section" from any page. */
const linkTarget = (link) => link.to ?? sectionPath(link.section);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === '/' || pathname === '/index.html';
  // Section tracking only means something on the page that has the sections.
  const activeSection = useActiveSection(onHome ? SECTION_IDS : NO_SECTIONS);

  const isActive = (link) =>
    link.to ? pathname.startsWith(link.to) : onHome && activeSection === link.section;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep the page from scrolling behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Escape closes the menu; so does widening past the breakpoint, where the
  // toggle disappears and would otherwise leave the page scroll-locked.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1120px)');
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={`header${scrolled || menuOpen ? ' is-scrolled' : ''}`}>
      <div className="container container--wide header__inner">
        <Link
          className="header__logo"
          to="/"
          onClick={close}
          aria-label="Security Marketing Company — home"
        >
          {/* DROP-IN: /public/logo/logo-lockup-light.png — the light lockup that
              reads on the dark header. Derived from your horizontal logo. */}
          <img
            src="/logo/logo-lockup-light.png"
            alt="Security Marketing Company"
            width="260"
            height="87"
          />
        </Link>

        <nav className="header__nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              className={`header__link${isActive(link) ? ' is-active' : ''}`}
              to={linkTarget(link)}
              aria-current={link.to && isActive(link) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <StrategyCallLink className="btn btn--primary header__cta">Book Strategy Call</StrategyCallLink>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="header__mobile" aria-label="Mobile">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.id}
              className={isActive(link) ? 'is-active' : undefined}
              to={linkTarget(link)}
              aria-current={isActive(link) ? (link.to ? 'page' : 'true') : undefined}
              onClick={close}
            >
              {link.label}
              <span>{String(index + 1).padStart(2, '0')}</span>
            </Link>
          ))}
          <StrategyCallLink className="btn btn--primary" onClick={close}>
            Book Strategy Call
          </StrategyCallLink>
        </nav>
      )}
    </header>
  );
}
