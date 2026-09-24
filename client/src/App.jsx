import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import NotFound from './components/NotFound.jsx';

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

    // Wait a frame so the page that owns the section has rendered.
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
