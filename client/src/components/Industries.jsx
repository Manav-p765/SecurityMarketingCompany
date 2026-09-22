import { INDUSTRIES } from '../data/content.js';
import { IconShieldCheck } from './Icons.jsx';

export default function Industries() {
  return (
    <section className="section industries dark-field" id="industries">
      <div className="container">
        <div className="section-head section-head--centered reveal">
          <p className="label label--centered">Industries we serve</p>
          <h2>Security Companies We Help</h2>
        </div>

        <ul className="industries__grid">
          {INDUSTRIES.map((industry, index) => (
            <li
              className="industries__item reveal"
              key={industry}
              style={{ transitionDelay: `${index * 45}ms` }}
            >
              <IconShieldCheck />
              <span>{industry}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
