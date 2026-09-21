import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently under the sticky header so the nav can
 * mark it active. Takes the topmost section whose heading has passed the
 * header, which behaves better than pure intersection ratios on tall sections.
 */
export function useActiveSection(ids, offset = 120) {
  const [active, setActive] = useState('');

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ids, offset]);

  return active;
}
