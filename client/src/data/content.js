export const COMPANY = {
  name: 'Security Marketing Company',
  tagline: 'Growing security companies online.',
  promise: 'More visibility. Bigger contracts.',
  email: 'andy@securitymarketingcompany.com',
  site: 'www.securitymarketingcompany.com',
  siteUrl: 'https://www.securitymarketingcompany.com',
};

export const NAV_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'approach', label: 'Approach' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Hero copy. The headline is split so the second line can carry the red
 * accent — same structure as a two-tone display headline.
 */
export const HERO = {
  eyebrow: 'B2B marketing for the security industry',
  headlineTop: 'Marketing Built for',
  headlineBottom: 'Security Companies.',
  paragraphs: [
    'We are the growth partner for guard firms, CCTV and alarm installers, access control specialists and cybersecurity providers.',
    'More visibility. Bigger contracts. Nothing else on the invoice.',
  ],
  ctaPrimary: 'Get a Quote',
  ctaSecondary: 'See What We Do',
};

/**
 * The strip under the hero. This is the structural slot for a client logo
 * wall — until logos are cleared for publication it carries the four buyer
 * segments instead. See README: "Turning the strip into a logo wall".
 */
export const STRIP_LABEL = 'Built for every corner of the security industry';

export const AUDIENCE = [
  { id: 'guarding', title: 'Security Guard Firms', note: 'Manned guarding & patrol' },
  { id: 'cctv', title: 'CCTV & Alarm Installers', note: 'Install, service & monitor' },
  { id: 'access', title: 'Access Control', note: 'Readers, doors & credentials' },
  { id: 'cyber', title: 'Cybersecurity Providers', note: 'MSSP & managed detection' },
];

/**
 * Copy here is written short on purpose: the four cards sit in a single row
 * on desktop, in a section sized to one screen. Keep `lead` to one sentence
 * and `body` to two — longer copy breaks the row.
 */
export const SERVICES = [
  {
    id: 'seo',
    number: '01',
    title: 'SEO',
    kicker: 'Get found first',
    lead: 'Your buyers search long before they call.',
    body: 'We rank you for the terms that end in a signed contract, in every town you cover — and keep you there once competitors notice.',
    points: ['Local & map pack rankings', 'Service-area page architecture', 'Technical SEO and site speed'],
  },
  {
    id: 'wordpress',
    number: '02',
    title: 'WordPress',
    kicker: 'Sites that sell',
    lead: 'Your site has one job: book the survey.',
    body: 'Fast, credible builds around what buyers actually check — licensing, accreditations, coverage and proof you have done this before.',
    points: ['Lead-focused page structure', 'Quote and survey request flows', 'Easy to update in-house'],
  },
  {
    id: 'shopify',
    number: '03',
    title: 'Shopify',
    kicker: 'Sell your hardware',
    lead: 'Cameras, panels, readers, monitoring plans.',
    body: 'Spec-heavy product pages that answer installer questions up front, trade pricing for resale accounts, and a checkout that holds up at volume.',
    points: ['Technical product catalogues', 'Trade & B2B pricing tiers', 'Subscription monitoring plans'],
  },
  {
    id: 'marketing',
    number: '04',
    title: 'Marketing',
    kicker: 'Fill the pipeline',
    lead: 'Aimed at the contracts worth winning.',
    body: 'Paid search, LSAs, email and content built for the people who sign — facilities managers, property owners, IT directors.',
    points: ['Google Ads & LSA management', 'Email nurture for long cycles', 'Content that earns trust'],
  },
];

/** Kept to roughly two lines each so all four fit one screen with the aside. */
export const REASONS = [
  {
    title: 'We know the security industry',
    body: 'We do not learn your business on your budget. Licensing, guarding margins, install versus monitoring — we start from there.',
  },
  {
    title: 'We speak your clients’ language',
    body: 'Facilities managers, property owners, IT directors. Each buys against a different fear. We write to that, not to a "solutions provider" template.',
  },
  {
    title: 'Proven lead generation',
    body: 'Rankings and traffic are the means, never the point. We build around booked surveys and signed contracts, and report on those.',
  },
  {
    title: 'Specialists, not generalists',
    body: 'A generic agency spends three months guessing at your market. We start with a view of it. That is the whole difference.',
  },
];

export const PROCESS = [
  {
    step: '01',
    title: 'Audit',
    body: 'We review your rankings, site, competitors and current lead flow, then map where your best contracts actually come from today.',
  },
  {
    step: '02',
    title: 'Strategy',
    body: 'A written plan: services to lead with, areas to own, buyers to target, and exactly what each channel is accountable for.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'Site, store, content and campaigns built to that plan and engineered to turn enquiries into surveys and quotes.',
  },
  {
    step: '04',
    title: 'Grow',
    body: 'We expand what works — more service areas, more keywords, tighter campaigns — with monthly reporting tied to leads and revenue.',
  },
];

export const SERVICE_OPTIONS = [
  'SEO',
  'WordPress Development',
  'Shopify Development',
  'Marketing',
  'Not sure yet',
];

export const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { id: 'x', label: 'X', href: 'https://x.com/' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
];
