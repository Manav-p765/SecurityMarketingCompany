import { PROCESS } from '../data/content.js';

export default function Process() {
  return (
    <section className="section section--screen light-wash" id="process">
      <div className="container">
        <div className="section-head section-head--split reveal">
          <div>
            <p className="label">How we work</p>
            <h2>Audit. Strategy. Build. Grow.</h2>
          </div>
          <p className="section-head__lead">
            A straight line from where your marketing sits today to a pipeline you can forecast
            against. No retainer theatre, no month-three surprises.
          </p>
        </div>

        <div className="process__grid">
          {PROCESS.map((item, index) => (
            <div
              key={item.step}
              className="process__step reveal"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="process__num">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
