import { PROCESS_SECTION } from '../data/content.js';

/** Numbered steps. Home uses the four-step copy; /services passes its own five. */
export default function Process({ id = 'process', copy = PROCESS_SECTION }) {
  const { label, title, lead, steps } = copy;

  return (
    <section className="section section--screen light-wash" id={id}>
      <div className="container">
        <div className="section-head section-head--split reveal">
          <div>
            <p className="label">{label}</p>
            <h2>{title}</h2>
          </div>
          <p className="section-head__lead">{lead}</p>
        </div>

        <div className="process__grid" style={{ '--step-count': steps.length }}>
          {steps.map((item, index) => (
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
