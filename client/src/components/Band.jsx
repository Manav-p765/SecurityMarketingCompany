import { INDUSTRIES, services } from '../data/content.js';

/** One ticker row. The list is rendered twice so the loop has no seam. */
function Marquee({ items, reverse = false, outline = false }) {
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item}>
          {item}
          <span className="marquee__dot" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`marquee${reverse ? ' marquee--reverse' : ''}${outline ? ' marquee--outline' : ''}`}
    >
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/**
 * The single full-width run of the black -> red brand gradient: the promise,
 * then two ticker rows (services one way, industries the other).
 */
export default function Band() {
  return (
    <section className="band" aria-label="Our promise">
      <div className="container band__inner">
        <h2 className="band__promise">
          More visibility. <em>Bigger contracts.</em>
        </h2>
      </div>

      <Marquee items={services.map((service) => service.name)} />
      <Marquee items={INDUSTRIES} reverse outline />
    </section>
  );
}
