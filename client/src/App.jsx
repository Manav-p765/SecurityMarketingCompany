import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import NotFound from './components/NotFound.jsx';
import { trackPageView } from './analytics.js';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scroll handling for in-app navigation. React Router swaps pages without a
 * reload, so the browser never jumps to a hash on its own:
 *  - "/#contact" from another page: render home, then jump to the section.
 *  - A hash on the current page: smooth-scroll to it.
 *  - A new page with no hash: start at the top.
 * On the very first load the hash is honored without animation, and a plain
 * load is left alone so a refresh keeps its scroll position.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    const firstLoad = previousPath.current === null;
    const samePage = previousPath.current === pathname;
    previousPath.current = pathname;

    const behavior = samePage && !prefersReducedMotion() ? 'smooth' : 'instant';

    if (!hash) {
      if (!firstLoad) window.scrollTo({ top: 0, behavior });
      return undefined;
    }

    const scrollToTarget = () =>
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior });

    // Wait a frame so the page that owns the section has rendered.
    const frame = requestAnimationFrame(scrollToTarget);

    // On a direct load the web fonts are usually still arriving; when they
    // swap in, text above the target reflows and pushes it off position.
    // Land on it again once they are ready.
    let cancelled = false;
    if (firstLoad) {
      document.fonts?.ready.then(() => {
        if (!cancelled) requestAnimationFrame(scrollToTarget);
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [pathname, hash, key]);

  return null;
}

// Module scope rather than a ref, so StrictMode's double run of effects in
// development cannot count the same page twice either.
let lastTrackedPage = null;

/**
 * One GA4 page_view per page. Rendered after <Routes>, so its effect runs
 * after the page's own effects: usePageMeta (or NotFound) has already set
 * document.title for the new page. A hash-only change (a jump to a section
 * on the same page) or a click on the link to the current page is not a new
 * page and sends nothing.
 */
function PageViews() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const page = pathname + search;
    if (page === lastTrackedPage) return;
    lastTrackedPage = page;
    trackPageView();
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/index.html" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        {/* Unknown slugs render the 404 page from inside ServiceDetailPage. */}
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <PageViews />
    </>
  );
}
