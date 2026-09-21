import { COMPANY } from '../data/content.js';

/**
 * The single full-width run of the black -> red brand gradient. Keep it to
 * this one band; the hero uses the darker textured field instead.
 */
export default function Band() {
  return (
    <section className="band">
      <div className="container band__inner">
        <h2 className="band__promise">
          More visibility.
          <em>Bigger contracts.</em>
        </h2>

        <div className="prose band__note">
          <p>
            That is the whole promise, and it is the only thing we measure against. Rankings,
            sessions and impressions are how we get there — <strong>booked site surveys and signed
            contracts</strong> are how we know it worked.
          </p>
          <p>{COMPANY.tagline}</p>
        </div>
      </div>
    </section>
  );
}
