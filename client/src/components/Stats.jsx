import { STATS } from '../data/content.js';

/** Proof row directly under the hero. */
export default function Stats() {
  return (
    <section className="stats dark-field dark-field--quiet" aria-label="Results at a glance">
      <div className="container container--wide">
        <dl className="stats__grid">
          {STATS.map((stat) => {
            // The trailing "+" carries the red accent.
            const plus = stat.value.endsWith('+');
            return (
              <div className="stats__item" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>
                  {plus ? stat.value.slice(0, -1) : stat.value}
                  {plus && <span aria-hidden="true">+</span>}
                  {plus && <span className="visually-hidden">plus</span>}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
