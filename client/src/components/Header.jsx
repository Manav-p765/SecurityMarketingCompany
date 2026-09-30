import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT_PATH, NAV_LINKS, services } from '../data/content.js';
import { servicePath } from '../seo.js';
import { IconArrowRight, IconChevronDown, SERVICE_ICONS } from './Icons.jsx';
import { StrategyCallLink } from './Links.jsx';

const isHomePath = (pathname) => pathname === '/' || pathname === '/index.html';

/**
 * Home is active on the home page only; every other link on its own page and
 * any page below it (Services on /services/:slug, Blog on /blog/:slug).
 */
function isLinkActive(link, pathname) {
  if (link.to === '/') return isHomePath(pathname);
  return pathname === link.to || pathname.startsWith(`${link.to}/`);
}

/** Pointer that can actually hover (not a touch screen faking it on tap). */
const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** One row per service: icon and name, marked when it is the current page. */
function ServiceLinks({ pathname, itemClass, onNavigate }) {
  return services.map((service) => {
    const Icon = SERVICE_ICONS[service.icon];
    const to = servicePath(service);
    const current = pathname === to;
    return (
      <li key={service.slug}>
        <Link
          className={`${itemClass}${current ? ' is-active' : ''}`}
          to={to}
          aria-current={current ? 'page' : undefined}
          onClick={onNavigate}
        >
          <span className={`${itemClass}-icon`}>
            <Icon />
          </span>
          <span className={`${itemClass}-name`}>{service.name}</span>
        </Link>
      </li>
    );
  });
}

/**
 * Desktop "Services" dropdown. A disclosure button (not a link) so a click or
 * Enter opens it; the overview page is the "View all services" link at the
 * bottom. Opens on hover for mouse users. A hover-opened panel closes when
 * the pointer leaves; one opened (or kept open) with a click stays until a
 * second click, Escape, a click outside, focus leaving it, or navigation.
 */
function ServicesMenu({ link, pathname, active }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const leaveTimer = useRef(0);
  const { key } = useLocation();
  const panelId = `${link.id}-menu`;

  const close = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    setOpen(false);
    setPinned(false);
  }, []);

  // Any navigation, including to the page already showing, closes it.
  useEffect(close, [key, close]);
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) close();
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      close();
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const onTriggerClick = () => {
    if (open && !pinned) {
      // Already open from hover: the click keeps it open.
      setPinned(true);
    } else if (open) {
      close();
    } else {
      setOpen(true);
      setPinned(true);
    }
  };

  const onMouseEnter = () => {
    if (!canHover()) return;
    window.clearTimeout(leaveTimer.current);
    setOpen(true);
  };

  const onMouseLeave = () => {
    if (!canHover() || pinned) return;
    // A short grace period so a pointer cutting across the gap does not close it.
    leaveTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  // Tabbing past the last link (or back past the button) closes it.
  const onBlur = (event) => {
    if (event.relatedTarget && !wrapRef.current?.contains(event.relatedTarget)) close();
  };

  // Arrow keys: down from the button opens the panel and moves into it;
  // up and down step through the links.
  const onKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const links = [...wrapRef.current.querySelectorAll('.nav-menu__panel a')];
    const index = links.indexOf(document.activeElement);
    event.preventDefault();

    if (index === -1) {
      if (event.key !== 'ArrowDown') return;
      setOpen(true);
      setPinned(true);
      // The panel turns visible on this render; focus once it can take it.
      requestAnimationFrame(() => links[0]?.focus());
      return;
    }
    const step = event.key === 'ArrowDown' ? 1 : -1;
    links[(index + step + links.length) % links.length].focus();
  };

  return (
    <div
      ref={wrapRef}
      className={`nav-menu${open ? ' is-open' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`header__link nav-menu__trigger${active ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={onTriggerClick}
      >
        {link.label}
        <IconChevronDown />
      </button>

      <div id={panelId} className="nav-menu__panel">
        <div className="nav-menu__card">
          <ul className="nav-menu__list">
            <ServiceLinks pathname={pathname} itemClass="nav-menu__item" onNavigate={close} />
          </ul>
          <Link
            className="nav-menu__all"
            to={link.to}
            aria-current={pathname === link.to ? 'page' : undefined}
            onClick={close}
          >
            {link.menuAllLabel}
            <IconArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const isActive = (link) => isLinkActive(link, pathname);

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
    const desktop = window.matchMedia('(min-width: 1024px)');
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

  /**
   * Home (and the logo) on the home page itself: scroll back to the top
   * instead of navigating. With a hash in the URL ("/#contact") the normal
   * navigation to "/" clears it, and App.jsx scrolls to the top.
   */
  const onHomeClick = (event) => {
    close();
    if (!isHomePath(pathname) || hash) return;
    event.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'instant' });
  };

  const onLinkClick = (link) => (link.to === '/' ? onHomeClick : close);

  const toggleMenu = () => {
    // The Services accordion starts open on a service page, so the current
    // page is visible in the list straight away.
    if (!menuOpen) setServicesOpen(pathname.startsWith('/services/'));
    setMenuOpen((open) => !open);
  };

  return (
    <header className={`header${scrolled || menuOpen ? ' is-scrolled' : ''}`}>
      <div className="container container--wide header__inner">
        <Link
          className="header__logo"
          to="/"
          onClick={onHomeClick}
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
          {NAV_LINKS.map((link) =>
            link.menu ? (
              <ServicesMenu key={link.id} link={link} pathname={pathname} active={isActive(link)} />
            ) : (
              <Link
                key={link.id}
                className={`header__link${isActive(link) ? ' is-active' : ''}`}
                to={link.to}
                aria-current={isActive(link) ? 'page' : undefined}
                onClick={onLinkClick(link)}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <StrategyCallLink className="btn btn--primary header__cta" to={CONTACT_PATH}>
          Book Strategy Call
        </StrategyCallLink>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="header__mobile" aria-label="Mobile">
          {NAV_LINKS.map((link, index) => {
            const number = <span>{String(index + 1).padStart(2, '0')}</span>;

            if (link.menu) {
              const groupId = `mobile-${link.id}`;
              return (
                <div key={link.id} className="header__mobile-group">
                  <button
                    type="button"
                    className={`header__mobile-toggle${isActive(link) ? ' is-active' : ''}`}
                    aria-expanded={servicesOpen}
                    aria-controls={groupId}
                    onClick={() => setServicesOpen((open) => !open)}
                  >
                    {link.label}
                    <span className="header__mobile-meta">
                      {number}
                      <IconChevronDown />
                    </span>
                  </button>

                  {servicesOpen && (
                    <ul id={groupId} className="header__mobile-sub">
                      <ServiceLinks pathname={pathname} itemClass="header__sub-link" onNavigate={close} />
                      <li>
                        <Link
                          className="header__sub-all"
                          to={link.to}
                          aria-current={pathname === link.to ? 'page' : undefined}
                          onClick={close}
                        >
                          {link.menuAllLabel}
                          <IconArrowRight />
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.id}
                className={isActive(link) ? 'is-active' : undefined}
                to={link.to}
                aria-current={isActive(link) ? 'page' : undefined}
                onClick={onLinkClick(link)}
              >
                {link.label}
                {number}
              </Link>
            );
          })}
          <StrategyCallLink className="btn btn--primary" to={CONTACT_PATH} onClick={close}>
            Book Strategy Call
          </StrategyCallLink>
        </nav>
      )}
    </header>
  );
}
