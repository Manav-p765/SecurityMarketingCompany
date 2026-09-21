import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/content.js';
import { useActiveSection } from '../hooks/useActiveSection.js';

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

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
    const desktop = window.matchMedia('(min-width: 1000px)');
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
        <a
          className="header__logo"
          href="#top"
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
        </a>

        <nav className="header__nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              className={`header__link${active === link.id ? ' is-active' : ''}`}
              href={`#${link.id}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--primary header__cta" href="#contact">
          Get a Quote
        </a>

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
            <a
              key={link.id}
              className={active === link.id ? 'is-active' : undefined}
              href={`#${link.id}`}
              aria-current={active === link.id ? 'true' : undefined}
              onClick={close}
            >
              {link.label}
              <span>{String(index + 1).padStart(2, '0')}</span>
            </a>
          ))}
          <a className="btn btn--primary" href="#contact" onClick={close}>
            Get a Quote
          </a>
        </nav>
      )}
    </header>
  );
}
