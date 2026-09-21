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

        <ul className="industries__grid reveal">
          {INDUSTRIES.map((industry) => (
            <li className="industries__item" key={industry}>
              <IconShieldCheck />
              <span>{industry}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
