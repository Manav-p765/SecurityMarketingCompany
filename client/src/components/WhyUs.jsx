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
            Most agencies treat your industry as one more vertical to learn on your budget. We built
            the entire practice around it.
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

            <div className="prose">
              <p>
                <strong>One industry. One focus.</strong> Security Marketing Company works
                exclusively with companies that protect people, property and data.
              </p>
              <p>
                Which is why our first strategy call sounds nothing like a discovery questionnaire.
              </p>
            </div>

            <p className="why__disclaimer">
              We are a marketing agency. We do not provide guarding, installation, monitoring or
              cybersecurity services, and we never compete with our clients for their work.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
