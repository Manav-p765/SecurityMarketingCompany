import { useEffect, useRef, useState } from 'react';
import { STATS } from '../data/content.js';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Counts up from zero the first time the row scrolls into view. */
function useCountUp(target, start) {
  // Reduced motion: show the final figure straight away, no count.
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (!start || prefersReducedMotion()) return undefined;

    let frame;
    const began = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const progress = Math.min((now - began) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start]);

  return value;
}

function Stat({ stat, start }) {
  // "500+" -> 500 and a red "+".
  const plus = stat.value.endsWith('+');
  const target = parseInt(stat.value, 10);
  const value = useCountUp(target, start);

  return (
    <div className="stats__item">
      <dt>{stat.label}</dt>
      <dd>
        {/* Screen readers get the final figure, not the ticking one. */}
        <span className="visually-hidden">{stat.value}</span>
        <span aria-hidden="true">
          {value}
          {plus && <span className="stats__plus">+</span>}
        </span>
      </dd>
    </div>
  );
}

/** Proof row directly under the hero. */
export default function Stats() {
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!('IntersectionObserver' in window)) {
      setStart(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats dark-field dark-field--quiet" aria-label="Results at a glance">
      <div className="container container--wide">
        <dl className="stats__grid" ref={ref}>
          {STATS.map((stat) => (
            <Stat key={stat.label} stat={stat} start={start} />
          ))}
        </dl>
      </div>
    </section>
  );
}
