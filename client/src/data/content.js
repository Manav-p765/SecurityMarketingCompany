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
  { id: 'process', label: 'How It Works' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Hero copy. The headline is split so the second line can carry the red
 * accent — same structure as a two-tone display headline.
 */
export const HERO = {
  eyebrow: 'B2B marketing for the security industry',
  headlineTop: 'Marketing Built to Help Security Companies',
  headlineBottom: 'Win More Contracts',
  paragraphs: [
    'We help security companies generate qualified leads, improve online visibility, and build a digital presence that turns prospects into long-term clients.',
  ],
  ctaPrimary: 'Book Strategy Call',
  ctaSecondary: 'See What We Do',
};

/**
 * Proof row directly under the hero. Every figure here is a public claim —
 * keep them accurate and update them as they grow.
 */
export const STATS = [
  { value: '10+', label: 'Security Companies Served' },
  { value: '500+', label: 'Leads Generated' },
  { value: '5+', label: 'Years Marketing Experience' },
  { value: '50+', label: 'Experienced team' },
];

/** "Industries we serve" — the security businesses we market. */
export const INDUSTRIES = [
  'Security Guard Companies',
  'Armed & Unarmed Security',
  'Mobile Patrol',
  'Corporate Security',
  'Construction Security',
  'Event Security',
  'Retail Security',
  'Warehouse & Distribution Security',
  'HOA & Residential Security',
  'Healthcare Security',
  'Industrial Security',
];

/**
 * Each service renders as a compact card: `title` and `lead` (the one-line
 * promise). `id` picks the icon in Icons.jsx; `title` is also the contact
 * form option, so keep it in step with server/src/models/Lead.js.
 */
export const SERVICES = [
  {
    id: 'website',
    number: '01',
    title: "Website Design & Development",
    lead: "Turn Your Website Into a Lead-Generating Asset",
  },
  {
    id: 'seo',
    number: '02',
    title: "SEO & AI SEO",
    lead: "Get Found on Google and AI Search",
  },
  {
    id: 'ads',
    number: '03',
    title: "Paid Ads",
    lead: "Put Your Security Services in Front of High-Intent Buyers",
  },
  {
    id: 'social',
    number: '04',
    title: "Social Media Marketing",
    lead: "Build a Security Brand People Remember and Trust",
  },
  {
    id: 'email',
    number: '05',
    title: "Email Marketing & Lead Generation",
    lead: "Turn Marketing Attention Into Real Opportunities",
  },
  {
    id: 'gmb',
    number: '06',
    title: "GMB Management",
    lead: "Improve Your Local Visibility on Google",
  },
  {
    id: 'crm',
    number: '07',
    title: "CRM Automation",
    lead: "Stop Losing Leads After They Contact You",
  },
];

/** Kept to roughly two lines each so all four fit one screen with the aside. */
export const REASONS = [
  {
    title: 'We know the security industry',
    body: 'Licensing, guarding margins, install versus monitoring — we start from there, not from scratch.',
  },
  {
    title: 'We speak your clients’ language',
    body: 'Facilities managers, property owners and IT directors each buy differently. We write for each.',
  },
  {
    title: 'Proven lead generation',
    body: 'We build around booked surveys and signed contracts — and report on those, not traffic.',
  },
  {
    title: 'Specialists, not generalists',
    body: 'No three months of guessing at your market. We start with a clear view of it.',
  },
];

export const PROCESS = [
  {
    step: '01',
    title: 'Audit',
    body: 'We review your current website, Google visibility, advertising and lead-generation system.',
  },
  {
    step: '02',
    title: 'Strategy',
    body: 'We identify the biggest opportunities and build a marketing plan around your goals.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'We implement the website, SEO, advertising, content, CRM and automation systems you need.',
  },
  {
    step: '04',
    title: 'Grow',
    body: 'We continuously optimize campaigns, improve conversion and scale what is working.',
  },
];

/** Contact form choices. Must match SERVICES in server/src/models/Lead.js. */
export const SERVICE_OPTIONS = [...SERVICES.map((service) => service.title), 'Not sure yet'];

/** Paste each profile URL into `href`. Entries left empty are not rendered. */
export const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', href: '' },
  { id: 'x', label: 'X', href: '' },
  { id: 'instagram', label: 'Instagram', href: '' },
  { id: 'youtube', label: 'YouTube', href: '' },
];
