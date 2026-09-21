import { IconLock, IconSearchSmall } from './Icons.jsx';

/**
 * Illustrative screen mockups, built in markup rather than dropped in as
 * screenshots. They show the kind of work we do — they are not captures of
 * a real client site or a real search results page.
 */

/** A security firm's website, as we would build it. */
export function SiteMockup() {
  return (
    <div className="window">
      <div className="window__bar">
        <div className="window__dots">
          <i />
          <i />
          <i />
        </div>
        <div className="window__url">
          <IconLock />
          northgatesecurity.co.uk
        </div>
      </div>

      <div className="window__body site-mock">
        <div className="site-mock__nav">
          <div className="site-mock__logo">
            <span />
            Northgate
          </div>
          <div className="site-mock__navlinks">
            <i />
            <i />
            <i />
          </div>
          <div className="site-mock__pill">Get a Survey</div>
        </div>

        <div className="site-mock__hero">
          <h4>
            Manned Guarding <em>Across Three Counties</em>
          </h4>
          <div className="site-mock__lines">
            <i />
            <i />
            <i />
          </div>
          <div className="site-mock__cta">
            <b>Book a Site Survey</b>
            <s>Our Accreditations</s>
          </div>
        </div>

        <div className="site-mock__cards">
          {['a', 'b', 'c'].map((key) => (
            <div className="site-mock__card" key={key}>
              <u />
              <i />
              <i />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Search results, illustrating what ranking work is aiming at. */
export function SerpMockup() {
  return (
    <div className="window window--light">
      <div className="window__bar">
        <div className="window__dots">
          <i />
          <i />
          <i />
        </div>
        <div className="window__url">
          <IconLock />
          security guard company near me
        </div>
      </div>

      <div className="window__body serp-mock">
        <span className="serp-mock__rank">Position 1</span>

        <div className="serp-mock__search">
          <IconSearchSmall />
          <span>security guard company near me</span>
        </div>

        <p className="serp-mock__meta">Local results</p>

        <div className="serp-mock__pack">
          <div className="serp-mock__map">
            <span className="serp-mock__pin serp-mock__pin--active" style={{ top: '26%', left: '34%' }} />
            <span className="serp-mock__pin" style={{ top: '58%', left: '64%' }} />
            <span className="serp-mock__pin" style={{ top: '70%', left: '20%' }} />
          </div>

          <div className="serp-mock__listings">
            <div className="serp-mock__listing serp-mock__listing--active">
              <b>Northgate Security Services</b>
              <div className="serp-mock__stars">
                <u />
                <u />
                <u />
                <u />
                <u />
                <span>Security guard service</span>
              </div>
            </div>
            <div className="serp-mock__listing">
              <b>Competitor Security Ltd</b>
              <div className="serp-mock__stars">
                <u />
                <u />
                <u />
                <u />
                <span>Security guard service</span>
              </div>
            </div>
          </div>
        </div>

        <div className="serp-mock__result serp-mock__result--active">
          <p className="serp-mock__url">northgatesecurity.co.uk › manned-guarding</p>
          <p className="serp-mock__title">Manned Guarding &amp; Security Officers | Northgate</p>
          <div className="serp-mock__snippet">
            <i />
            <i />
          </div>
        </div>

        <div className="serp-mock__result">
          <p className="serp-mock__url">competitor-security.co.uk › services</p>
          <p className="serp-mock__title">Security Services</p>
          <div className="serp-mock__snippet">
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small stat card that overlaps a mockup's edge. */
export function FloatCard({ className, label, value, suffix, bars = false }) {
  return (
    <div className={`float-card ${className}`}>
      <p className="float-card__label">
        <span className="chip__dot" />
        {label}
      </p>
      <p className="float-card__value">
        {value}
        {suffix && <em>{suffix}</em>}
      </p>
      {bars && (
        <div className="float-card__bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      )}
    </div>
  );
}
