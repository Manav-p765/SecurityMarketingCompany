import { HERO } from '../data/content.js';
import { IconArrowRight } from './Icons.jsx';
import { FloatCard, SiteMockup } from './Mockups.jsx';

export default function Hero() {
  return (
    <section className="hero dark-field" id="top">
      <div className="container hero__inner">
        <div>
          <p className="label hero__eyebrow">{HERO.eyebrow}</p>

          <h1>
            {HERO.headlineTop}{' '}
            <span className="accent">{HERO.headlineBottom}</span>
          </h1>

          <div className="hero__copy prose">
            {HERO.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact">
              {HERO.ctaPrimary}
              <IconArrowRight />
            </a>

            {/* Proof block. This is where a real Clutch or Google rating goes
                once you have one — see README, "Adding real proof". */}
            <div className="hero__proof">
              <img src="/logo/logo-mark-light.png" alt="" aria-hidden="true" />
              <div className="hero__proof-text">
                <strong>One industry. One focus.</strong>
                <span>We market security companies — we never sell security.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="tilt">
            <div className="tilt__inner">
              <SiteMockup />
            </div>
          </div>

          {/* Belongs to the illustrated example site above, not to us — the
              label carries the example firm's name so it cannot be read as a
              claim about our own results. */}
          <FloatCard
            className="float-card--bl"
            label="Northgate · local pack"
            value="Top 3"
            suffix="in-area"
            bars
          />
        </div>
      </div>
    </section>
  );
}
