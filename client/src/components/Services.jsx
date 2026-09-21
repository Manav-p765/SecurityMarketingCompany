import { SERVICES } from '../data/content.js';
import { SERVICE_ICONS } from './Icons.jsx';

export default function Services() {
  return (
    <section className="section section--screen dark-field" id="services">
      <div className="container">
        <div className="section-head section-head--split reveal">
          <div>
            <p className="label">What we do</p>
            <h2>Marketing Services Built for Security Companies</h2>
          </div>
          <p className="section-head__lead">
            From your website and Google visibility to paid advertising, lead generation and
            automated follow-up, we build the digital systems security companies need to generate
            consistent opportunities and grow.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.id];
            return (
              <article
                key={service.id}
                className="service-card surface reveal"
                style={{ transitionDelay: `${(index % 4) * 80}ms` }}
              >
                <div className="service-card__top">
                  <span className="service-card__icon">
                    <Icon />
                  </span>
                  <span className="service-card__num">{service.number}</span>
                </div>

                <h3>{service.title}</h3>

                <p className="service-card__lead">{service.lead}</p>
                <p className="service-card__body">{service.body}</p>

                <ul className="service-card__points">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
