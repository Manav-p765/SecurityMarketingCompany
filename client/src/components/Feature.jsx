import { IconArrowRight, IconCheckSmall } from './Icons.jsx';
import { StrategyCallLink } from './Links.jsx';

/**
 * Split section: copy on one side, a tilted screen on the other.
 * Used twice with `reverse` alternating so the page does not fall into a
 * single repeated rhythm. Copy comes from FEATURES in content.js; `cta` is a
 * button label, and the button goes wherever "Book Strategy Call" goes.
 */
export default function Feature({
  id,
  label,
  title,
  paragraphs = [],
  points = [],
  cta,
  reverse = false,
  wash = false,
  children,
}) {
  // `wash` lifts the section slightly instead of switching it to an opaque
  // light background — a tonal change with no edge to cut against.
  const toneClass = wash ? 'light-wash' : 'dark-field dark-field--quiet';

  return (
    <section className={`section section--screen feature ${toneClass}`} id={id}>
      <div className={`container feature__inner${reverse ? ' feature--reverse' : ''}`}>
        <div className="feature__copy reveal">
          <p className="label">{label}</p>
          <h2>{title}</h2>

          <div className="prose">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {points.length > 0 && (
            <ul className="feature__list">
              {points.map((point) => (
                <li key={point}>
                  <IconCheckSmall />
                  {point}
                </li>
              ))}
            </ul>
          )}

          {cta && (
            <div className="feature__actions">
              <StrategyCallLink className="btn btn--primary">
                {cta}
                <IconArrowRight />
              </StrategyCallLink>
            </div>
          )}
        </div>

        <div className="feature__visual reveal">{children}</div>
      </div>
    </section>
  );
}
