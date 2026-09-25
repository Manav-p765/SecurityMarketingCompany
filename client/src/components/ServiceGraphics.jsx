import { FloatCard, SerpMockup, SiteMockup, WindowBar } from './Mockups.jsx';
import { IconLock, IconSearchSmall, IconShieldCheck } from './Icons.jsx';

/**
 * Hero graphics for the /services/:slug pages, one per service, in the same
 * markup-and-CSS style as the home page mockups (Mockups.jsx).
 *
 * The same rules apply: every company is fictional and on a reserved
 * ".example" domain, every window carries the "Example illustration" tag,
 * and nothing shows a ranking position, a count or any other figure that
 * could read as a result. Bars and lines are shapes, not data.
 *
 * Fictional firms used here: Summit Guard Co. (guard services, also on the
 * home page), Ridgeline Alarm & Video (alarm and CCTV) and Keystone Access
 * Systems (access control).
 */

/** Rows of grey placeholder text. `widths` are percentages. */
function Lines({ widths, className = 'gfx-lines' }) {
  return (
    <div className={className}>
      {widths.map((width, index) => (
        <i key={index} style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}

/** Five amber stars, as shapes. No rating value is shown anywhere. */
function Stars() {
  return (
    <span className="gfx-stars">
      <u />
      <u />
      <u />
      <u />
      <u />
    </span>
  );
}

/** Tilted window with an optional overlapping card, as on the home page. */
function Scene({ tilt = '', card, children }) {
  return (
    <>
      <div className={`tilt ${tilt}`}>
        <div className="tilt__inner">{children}</div>
      </div>
      {card}
    </>
  );
}

/* --------------------------------------------------------------------------
   website — a security company homepage (the home page mockup)
   -------------------------------------------------------------------------- */

function WebsiteGraphic() {
  return (
    <Scene
      card={<FloatCard className="float-card--bl" label="Sample report" value="Quote requests" bars />}
    >
      <SiteMockup />
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   seo — search results with the example listing near the top
   -------------------------------------------------------------------------- */

function SeoGraphic() {
  return (
    <Scene
      tilt="tilt--right"
      card={<FloatCard className="float-card--br" label="Sample report" value="Search inquiries" bars />}
    >
      <SerpMockup />
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   paid-ads — a search ad plus a campaign dashboard card
   -------------------------------------------------------------------------- */

const CAMPAIGNS = [
  { name: 'Search · Access control', bar: 82 },
  { name: 'Search · Video surveillance', bar: 64 },
  { name: 'Local Services Ads', bar: 48 },
];

function AdsGraphic() {
  const query = 'commercial access control installation';
  return (
    <Scene
      card={
        <div className="gfx-card gfx-card--br dash-card">
          <p className="float-card__label">
            <span className="chip__dot" />
            Sample dashboard
          </p>
          <p className="dash-card__title">Campaigns</p>
          <ul className="dash-card__rows">
            {CAMPAIGNS.map((campaign) => (
              <li key={campaign.name}>
                <span className="dash-card__name">{campaign.name}</span>
                <span className="dash-card__status">Active</span>
                <span className="dash-card__bar">
                  <i style={{ width: `${campaign.bar}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <div className="window window--light">
        <WindowBar>
          <IconLock />
          {query}
        </WindowBar>
        <div className="window__body serp-mock ads-mock">
          <div className="serp-mock__search">
            <IconSearchSmall />
            <span>{query}</span>
          </div>

          <div className="ads-mock__ad">
            <p className="ads-mock__sponsored">Sponsored</p>
            <p className="serp-mock__url">keystoneaccess.example › commercial</p>
            <p className="serp-mock__title">Commercial Access Control Installation | Keystone Access Systems</p>
            <div className="serp-mock__snippet">
              <i />
              <i />
            </div>
            <div className="ads-mock__links">
              <span>Request a Quote</span>
              <span>Card &amp; Mobile Access</span>
              <span>Service Areas</span>
            </div>
          </div>

          <div className="serp-mock__result">
            <p className="serp-mock__url">examplesecurity.example › access</p>
            <p className="serp-mock__title">Access Control Systems</p>
            <div className="serp-mock__snippet">
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   social-media — a company feed with a credibility post and a hiring post
   -------------------------------------------------------------------------- */

function SocialGraphic() {
  return (
    <Scene tilt="tilt--right">
      <div className="window">
        <WindowBar>Company feed · Summit Guard Co.</WindowBar>
        <div className="window__body social-mock">
          <article className="social-post">
            <header className="social-post__head">
              <span className="social-post__avatar" />
              <span>
                <b>Summit Guard Co.</b>
                <small>Security services</small>
              </span>
            </header>
            <Lines widths={[94, 72]} />
            <div className="social-post__media">
              <IconShieldCheck />
              <span>Site team briefing</span>
            </div>
            <footer className="social-post__actions">
              <i />
              <i />
              <i />
            </footer>
          </article>

          <article className="social-post social-post--offset">
            <header className="social-post__head">
              <span className="social-post__avatar" />
              <span>
                <b>Summit Guard Co.</b>
                <small>Careers</small>
              </span>
            </header>
            <div className="social-post__media social-post__media--hiring">
              <small>Now hiring</small>
              <strong>Licensed Security Officers</strong>
            </div>
            <Lines widths={[88, 60]} />
            <span className="social-post__cta">Apply now</span>
          </article>
        </div>
      </div>
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   email-marketing — an inbox plus a nurture sequence card
   -------------------------------------------------------------------------- */

const INBOX = [
  { from: 'Summit Guard Co.', subject: 'Your site security checklist', active: true },
  { from: 'Summit Guard Co.', subject: 'What a site survey covers' },
  { from: 'Summit Guard Co.', subject: 'Quarterly security update' },
];

const SEQUENCE = [
  { day: 'Day 0', label: 'Thanks for your inquiry' },
  { day: 'Day 3', label: 'Site security checklist' },
  { day: 'Day 10', label: 'Ready for a site survey?' },
];

function EmailGraphic() {
  return (
    <Scene
      card={
        <div className="gfx-card gfx-card--bl seq-card">
          <p className="float-card__label">
            <span className="chip__dot" />
            Nurture sequence
          </p>
          <ol className="seq-card__steps">
            {SEQUENCE.map((step) => (
              <li key={step.day}>
                <b>{step.day}</b>
                {step.label}
              </li>
            ))}
          </ol>
        </div>
      }
    >
      <div className="window">
        <WindowBar>Inbox · property.manager@example.com</WindowBar>
        <div className="window__body mail-mock">
          <ul className="mail-mock__list">
            {INBOX.map((mail) => (
              <li key={mail.subject} className={mail.active ? 'is-active' : undefined}>
                <b>{mail.from}</b>
                <span>{mail.subject}</span>
                <Lines widths={[90]} />
              </li>
            ))}
          </ul>

          <div className="mail-mock__open">
            <p className="mail-mock__subject">Your site security checklist</p>
            <p className="mail-mock__from">Summit Guard Co.</p>
            <Lines widths={[96, 88, 92, 54]} />
            <span className="mail-mock__cta">Book a Site Survey</span>
          </div>
        </div>
      </div>
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   google-business-profile — map results and a Business Profile with reviews
   -------------------------------------------------------------------------- */

function ProfileGraphic() {
  const query = 'alarm installer near me';
  return (
    <Scene tilt="tilt--right">
      <div className="window window--light">
        <WindowBar>
          <IconLock />
          {query}
        </WindowBar>
        <div className="window__body serp-mock gbp-mock">
          <div className="serp-mock__search">
            <IconSearchSmall />
            <span>{query}</span>
          </div>

          <div className="serp-mock__map gbp-mock__map">
            <span className="serp-mock__pin serp-mock__pin--active" style={{ top: '34%', left: '42%' }} />
            <span className="serp-mock__pin" style={{ top: '62%', left: '70%' }} />
            <span className="serp-mock__pin" style={{ top: '54%', left: '16%' }} />
          </div>

          <div className="gbp-mock__profile">
            <p className="serp-mock__title">Ridgeline Alarm &amp; Video</p>
            <p className="gbp-mock__meta">
              <Stars />
              Security system installer
            </p>
            <div className="gbp-mock__actions">
              <span>Call</span>
              <span>Directions</span>
              <span>Website</span>
            </div>

            <p className="serp-mock__meta">Reviews</p>
            {['J', 'M'].map((initial) => (
              <div key={initial} className="gbp-mock__review">
                <span className="gbp-mock__avatar">{initial}</span>
                <div>
                  <Stars />
                  <Lines widths={[92, 64]} />
                  <p className="gbp-mock__reply">Response from the owner</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   crm-automation — a pipeline board plus an automated text reply
   -------------------------------------------------------------------------- */

const PIPELINE = [
  { stage: 'New inquiry', cards: ['Web form', 'Missed call'] },
  { stage: 'Contacted', cards: ['Ad lead', 'Referral'] },
  { stage: 'Survey booked', cards: ['Web form'] },
  { stage: 'Proposal sent', cards: ['Call'] },
];

function CrmGraphic() {
  return (
    <Scene
      card={
        <div className="gfx-card gfx-card--bl sms-card">
          <p className="float-card__label">
            <span className="chip__dot" />
            Automated text reply
          </p>
          <p className="sms-card__bubble">
            Thanks for contacting Ridgeline Alarm &amp; Video. We received your request and will call
            you to schedule a site survey.
          </p>
          <p className="sms-card__meta">Sent automatically</p>
        </div>
      }
    >
      <div className="window">
        <WindowBar>Pipeline · Ridgeline Alarm &amp; Video</WindowBar>
        <div className="window__body crm-mock">
          {PIPELINE.map((column) => (
            <div key={column.stage} className="crm-mock__col">
              <p className="crm-mock__stage">{column.stage}</p>
              {column.cards.map((source, index) => (
                <div key={source + index} className="crm-mock__card">
                  <Lines widths={[86, 58]} />
                  <span className="crm-mock__source">{source}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}

/** Keyed by service slug. A service without an entry gets a text-only hero. */
const HERO_GRAPHICS = {
  website: WebsiteGraphic,
  seo: SeoGraphic,
  'paid-ads': AdsGraphic,
  'social-media': SocialGraphic,
  'email-marketing': EmailGraphic,
  'google-business-profile': ProfileGraphic,
  'crm-automation': CrmGraphic,
};

export const hasHeroGraphic = (slug) => slug in HERO_GRAPHICS;

export default function ServiceHeroGraphic({ slug }) {
  const Graphic = HERO_GRAPHICS[slug];
  return Graphic ? (
    <div className="detail-visual">
      <Graphic />
    </div>
  ) : null;
}
