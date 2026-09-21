import { useEffect } from 'react';

/**
 * Adds `is-visible` to every `.reveal` element once it scrolls into view.
 * One observer for the whole page; elements are unobserved after revealing
 * so nothing re-animates on the way back up.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}
