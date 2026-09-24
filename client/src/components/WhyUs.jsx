import { REASONS } from '../data/content.js';

export default function WhyUs() {
  return (
    <section className="section section--screen dark-field dark-field--quiet why" id="why-us">
      <div className="container">
        <div className="section-head section-head--split reveal">
          <div>
            <p className="label">Why us</p>
            <h2>Why Security Companies Choose Us</h2>
          </div>
          <p className="section-head__lead">
            Most agencies learn your industry on your budget. We built the whole practice around
            it.
          </p>
        </div>

        <div className="why__layout">
          <div className="why__list">
            {REASONS.map((reason, index) => (
              <div
                key={reason.title}
                className="why__item reveal"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <h3>
                  <i>{String(index + 1).padStart(2, '0')}</i>
                  {reason.title}
                </h3>
                <p>{reason.body}</p>
              </div>
            ))}
          </div>

          <aside className="why__aside surface reveal">
            {/* DROP-IN: /public/logo/logo-mark-light.png */}
            <img src="/logo/logo-mark-light.png" alt="" aria-hidden="true" />

            <p className="why__aside-title">One industry. One focus.</p>
            <p>
              We work only with companies that protect people and property — and we never
              compete with our clients for their work.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
