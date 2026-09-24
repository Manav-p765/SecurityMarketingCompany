export const COMPANY = {
  name: 'Security Marketing Company',
  tagline: 'Growing security companies online.',
  promise: 'More visibility. Bigger contracts.',
  email: 'andy@securitymarketingcompany.com',
  site: 'www.securitymarketingcompany.com',
  siteUrl: 'https://www.securitymarketingcompany.com',
  /**
   * Optional. Leave empty to hide. `phone` shows in the contact section and
   * footer. `calendarUrl` (e.g. a Calendly link) makes every "Book Strategy
   * Call" button open the calendar instead of scrolling to the contact form.
   */
  phone: '',
  calendarUrl: '',
};

/**
 * Main navigation. `to` is a page route; `section` is an anchor on the home
 * page (rendered as "/#section", so it works from any page).
 */
export const NAV_LINKS = [
  { id: 'services', label: 'Services', to: '/services' },
  { id: 'approach', label: 'Approach', section: 'approach' },
  { id: 'why-us', label: 'Why Us', section: 'why-us' },
  { id: 'process', label: 'How It Works', section: 'process' },
  { id: 'contact', label: 'Contact', section: 'contact' },
];

/**
 * Per-page SEO. The home values mirror the static tags in client/index.html
 * (keep the two in step); they are re-applied when someone navigates back to
 * "/" inside the app. The services page values are also written into
 * dist/services.html at build time by scripts/prerender.js.
 */
export const HOME_META = {
  path: '/',
  title: 'Security Marketing Company — Marketing Built for Security Companies',
  description:
    'Marketing for US security companies: websites, SEO & AI SEO, paid ads, social, lead generation, Google Business Profile and CRM automation to win more contracts.',
  socialDescription: 'More visibility. Bigger contracts. We grow security companies online.',
};

/**
 * Hero copy. The headline is split so the second line can carry the red
 * accent — same structure as a two-tone display headline.
 */
export const HERO = {
  eyebrow: 'B2B marketing for the US security industry',
  headlineTop: 'Marketing Built to Help Security Companies',
  headlineBottom: 'Win More Contracts',
  paragraphs: [
    'We help security companies generate qualified leads, improve online visibility, and build a digital presence that turns prospects into long-term clients.',
  ],
  ctaPrimary: 'Book Strategy Call',
  ctaSecondary: 'View Services',
};

/**
 * Proof row directly under the hero. Every figure here is a public claim, so
 * only fill in a value you can stand behind. A stat with an empty `value` is
 * not shown, and the whole row is hidden while all four are empty.
 * Format: '25+' or '120' — a trailing "+" is styled in red automatically.
 */
export const STATS = [
  { value: '10+', label: 'Security Companies Served' },
  { value: '500+', label: 'Leads Generated' },
  { value: '5+', label: 'Years Marketing Experience' },
  { value: '50+', label: 'Experienced Team' },
];

/** "Industries we serve" — the US security businesses we market. */
export const INDUSTRIES = [
  'Security Guard Services',
  'Armed & Unarmed Security',
  'Mobile Patrol',
  'Event Security',
  'Construction Site Security',
  'Retail & Commercial Security',
  'HOA & Residential Security',
  'Healthcare Security',
  'Alarm Installation & Monitoring',
  'CCTV & Video Surveillance',
  'Access Control',
  'Security Systems Integration',
];

/**
 * The service list — the source of truth for the home page cards, the
 * Services page, the footer and the contact form.
 *
 * `id` is the anchor on /services (e.g. /services#seo) and picks the icon in
 * Icons.jsx. `title` is also the contact form option, so keep it in step with
 * SERVICES in server/src/models/Lead.js. `lead` is the one-line outcome; keep
 * it to one sentence so the home page cards stay four to a row.
 */
export const SERVICES = [
  {
    id: 'website',
    number: '01',
    title: 'Website Design & Development',
    lead: 'Turn Your Website Into a Lead-Generating Asset',
  },
  {
    id: 'seo',
    number: '02',
    title: 'SEO & AI SEO',
    lead: 'Get Found on Google and AI Search',
  },
  {
    id: 'paid-ads',
    number: '03',
    title: 'Paid Ads',
    lead: 'Put Your Security Services in Front of High-Intent Buyers',
  },
  {
    id: 'social-media',
    number: '04',
    title: 'Social Media Marketing',
    lead: 'Build a Security Brand People Remember and Trust',
  },
  {
    id: 'email-marketing',
    number: '05',
    title: 'Email Marketing & Lead Generation',
    lead: 'Turn Marketing Attention Into Real Opportunities',
  },
  {
    id: 'google-business-profile',
    number: '06',
    title: 'Google Business Profile Management',
    lead: 'Improve Your Local Visibility on Google',
  },
  {
    id: 'crm-automation',
    number: '07',
    title: 'CRM Automation',
    lead: 'Stop Losing Leads After They Contact You',
  },
];

/** The two split sections on the home page (copy + tilted screen). */
export const FEATURES = {
  search: {
    id: 'approach',
    label: 'Get found first',
    title: 'Own the search your buyers already make',
    paragraphs: [
      'Buyers search for a guard company in their city or an alarm installer who can be on site this week. That contest is settled in the top three results and the map pack.',
    ],
    points: [
      'Map pack and local rankings, city by city',
      'A service-area page for every city you cover',
      'Reporting tied to inquiries, not keyword screenshots',
    ],
    cta: 'Book Strategy Call',
  },
  website: {
    label: 'Sites that sell',
    title: 'A site built to book the survey',
    paragraphs: [
      'Your website has one job: give a buyer who has never heard of you the confidence to ask for a quote.',
    ],
    points: [
      'Licenses and certifications shown up front',
      'Quote and survey requests on every service page',
      'Fast, mobile-first and easy to update in-house',
    ],
    cta: 'Start a Project',
  },
};

/** Kept to roughly two lines each so all four fit one screen with the aside. */
export const REASONS = [
  {
    title: 'We know the security industry',
    body: 'Licensing, guard-service margins, install versus monitoring — we start from there, not from scratch.',
  },
  {
    title: 'We speak your clients’ language',
    body: 'Facilities managers, property owners and IT directors each buy differently. We write for each.',
  },
  {
    title: 'Built around lead generation',
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

/** Home page "How it works" section. */
export const PROCESS_SECTION = {
  label: 'How it works',
  title: 'Audit. Strategy. Build. Grow.',
  lead: 'A straight line from where your marketing sits today to a pipeline you can forecast against. No padded retainers, no month-three surprises.',
  steps: PROCESS,
};

/** Contact form choices. Must match SERVICES in server/src/models/Lead.js. */
export const SERVICE_OPTIONS = [...SERVICES.map((service) => service.title), 'Not sure yet'];

/** Paste each profile URL into `href`. Entries left empty are not rendered. */
export const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/security-marketing-company/' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/securitymarketingcompany/' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/securitymarketingcompany/' },
  { id: 'x', label: 'X', href: '' },
  { id: 'youtube', label: 'YouTube', href: '' },
];

/* ==========================================================================
   /services
   ========================================================================== */

export const servicesPage = {
  meta: {
    path: '/services',
    title: 'Security Company Marketing Services | Security Marketing Company',
    description:
      'Websites, SEO & AI SEO, paid ads, Google Business Profile, social, email and CRM automation for US guard, alarm, CCTV and access control companies.',
  },

  hero: {
    eyebrow: 'Services',
    headlineTop: 'Marketing Services for',
    headlineBottom: 'US Security Companies',
    subhead:
      'Guard companies, alarm installers, CCTV providers and access control integrators each sell to different buyers. We build the websites, search visibility, advertising and follow-up that put you in front of them — and turn inquiries into signed work.',
    cta: 'Book Strategy Call',
    indexLabel: 'Jump to a service',
  },

  /**
   * Pricing line on each service block. With `showPrices: false` every block
   * shows `customLabel`. To publish prices, set `showPrices: true` and add
   * one entry per service id to `prices`, e.g. { seo: '$1,500/mo' } — shown
   * as "Starting at $1,500/mo". A service with no entry falls back to
   * `customLabel`.
   */
  pricing: {
    label: 'Pricing',
    showPrices: false,
    customLabel: 'Custom quote',
    note: 'Scoped to your services and service area on a strategy call.',
    prices: {},
  },

  /** Labels shared by every service block. */
  blockLabels: {
    problem: 'The problem',
    included: 'What’s included',
    bestFor: 'Best for',
    cta: 'Book Strategy Call',
  },

  /** Detail for each service, keyed by the `id` in SERVICES above. */
  details: {
    website: {
      problem:
        'Most security company websites list services and a phone number, then stop. A property manager comparing three guard companies, or a business owner pricing a camera system, leaves without a reason to call — or an easy way to ask for a quote.',
      included: [
        'Custom design built around your services and service area',
        'Service and city pages written for how your buyers search',
        'Quote, site survey and consultation forms on every key page',
        'Licenses, certifications and insurance shown where buyers look for them',
        'Fast, mobile-first build you can update in-house',
        'Call and form tracking so every inquiry is counted',
      ],
      bestFor:
        'Companies whose current site is outdated, slow on mobile or not producing inquiries — whether you sell guard contracts or residential and commercial installs.',
    },
    seo: {
      problem:
        'When a facilities manager searches “security guard company near me” or a homeowner asks an AI assistant for an alarm installer, the shortlist is set before anyone visits a website. If you are not in the top results or the answer, you are not in the running.',
      included: [
        'Technical SEO audit and fixes',
        'Keyword research by service and city',
        'Service-area pages for each city and county you cover',
        'Content structured to be cited by AI search tools such as Google AI Overviews and ChatGPT',
        'Local citations and security industry directory listings',
        'Monthly ranking and inquiry reporting',
      ],
      bestFor:
        'Guard and patrol companies competing for commercial contracts in a defined metro area, and installers who want steady inbound calls without paying for every click.',
    },
    'paid-ads': {
      problem:
        'SEO takes time to build. Buyers with an urgent need — a break-in, a new site opening, a failed inspection — search today and call whoever shows up first.',
      included: [
        'Google Search Ads, plus Local Services Ads where your category qualifies',
        'Campaigns split by service, city and buyer type',
        'Negative keywords that filter out job seekers and DIY searches',
        'A dedicated landing page for each campaign',
        'Call and form conversion tracking',
        'Monthly spend, cost-per-lead and inquiry reporting',
      ],
      bestFor:
        'Alarm and CCTV installers who want residential or commercial installs this quarter, and guard companies bidding on contracts in markets where they have little organic visibility.',
    },
    'social-media': {
      problem:
        'Commercial buyers check you out before they call back. A dormant LinkedIn page or a Facebook feed last updated two years ago makes a company look smaller and less reliable than it is.',
      included: [
        'Profile setup and cleanup on LinkedIn, Facebook and Instagram',
        'A monthly content calendar built around your services and projects',
        'Posts that show your licensing, training, installs and team',
        'Recruiting posts to help fill open officer and technician roles',
        'Comment and message monitoring',
        'Monthly engagement reporting',
      ],
      bestFor:
        'Companies selling to commercial and HOA buyers who research vendors before shortlisting, and guard companies that also recruit officers online.',
    },
    'email-marketing': {
      problem:
        'Security contracts have long buying cycles. A property manager may not switch providers until the current contract ends, and an inquiry that goes quiet today can still become a job next year — if you stay in touch.',
      included: [
        'Lead magnets such as security checklists and assessment offers',
        'Nurture sequences for commercial and residential prospects',
        'Regular newsletters to past inquiries and current clients',
        'Targeted outbound campaigns to commercial prospects',
        'List setup, segmentation and CAN-SPAM compliant templates',
        'Open, click and reply reporting',
      ],
      bestFor:
        'Guard companies targeting property managers, facilities directors and general contractors, and integrators with a long commercial sales cycle.',
    },
    'google-business-profile': {
      problem:
        'For “near me” searches, the map results appear above the websites. An incomplete profile, the wrong service area or a run of unanswered reviews is enough to keep you out of them.',
      included: [
        'Profile audit, verification support and full setup',
        'Categories, services and service areas configured correctly',
        'Weekly posts and photo updates',
        'A review request process and review responses',
        'Monitoring for unwanted edits and spam competitor listings',
        'Monthly reporting on calls, direction requests and profile views',
      ],
      bestFor:
        'Any security company that serves a local area — especially alarm and CCTV installers and mobile patrol companies that win work from “near me” searches.',
    },
    'crm-automation': {
      problem:
        'Inquiries arrive by phone, form and email, often after hours. Without a system, follow-up depends on whoever picks it up — and a lead that waits a day for a reply has usually called someone else.',
      included: [
        'CRM selection and setup, or cleanup of the one you already use',
        'Every web form, call and ad lead routed into one pipeline',
        'Instant text and email replies to new inquiries',
        'Automated follow-up reminders for quotes and site surveys',
        'Pipeline stages from first inquiry to signed contract',
        'Reporting on lead source, response time and close rate',
      ],
      bestFor:
        'Companies already getting inquiries but losing track of them, and installers and integrators managing many open quotes at once.',
    },
  },

  process: {
    label: 'How we work',
    title: 'Audit. Strategy. Launch. Optimize. Report.',
    lead: 'The same five steps for every engagement, whether we are building one website or running your whole marketing program.',
    steps: [
      { step: '01', title: 'Audit', body: PROCESS[0].body },
      { step: '02', title: 'Strategy', body: PROCESS[1].body },
      { step: '03', title: 'Launch', body: PROCESS[2].body },
      { step: '04', title: 'Optimize', body: PROCESS[3].body },
      {
        step: '05',
        title: 'Report',
        body: 'Monthly reports tie our work to inquiries, booked surveys and signed contracts — not traffic alone.',
      },
    ],
  },

  faq: {
    label: 'FAQ',
    title: 'Questions security company owners ask us',
    items: [
      {
        q: 'Do you require a long-term contract?',
        a: 'Terms depend on the work. A website build is scoped as a project; ongoing services such as SEO, paid ads and Google Business Profile management run on an agreed monthly basis. The term, scope and notice period are set out in writing before any work starts.',
      },
      {
        q: 'How long before we see results?',
        a: 'It depends on the channel. Paid ads can produce inquiries soon after launch. Google Business Profile improvements often show within the first few months. SEO builds over a longer period, depending on your market and competition. We set expectations for each channel after the audit.',
      },
      {
        q: 'Do you work with small or regional security companies?',
        a: 'Yes. Many security companies serve one metro area or a handful of counties, and local SEO, Google Business Profile and service-area pages are built for exactly that. Each engagement is scoped to your size and the areas you cover.',
      },
      {
        q: 'Do you only work with guard companies?',
        a: 'No. We work with guard and patrol companies and with alarm, CCTV, access control and systems integration firms. Their buyers differ — service contracts versus residential and commercial installs — so the strategy does too.',
      },
      {
        q: 'What do you need from us?',
        a: 'A kickoff call; access to your website, Google Business Profile, ad accounts and analytics; and details of your licenses, service areas and the work you want more of. After that, a quick review of key pages and campaigns before they go live, and a monthly check-in.',
      },
      {
        q: 'How do you report on results?',
        a: 'A monthly report built around inquiries: calls, form submissions, booked surveys and where each one came from. Traffic and rankings are included for context, but the focus is the leads that turn into contracts.',
      },
    ],
  },

  cta: {
    label: 'Next step',
    title: 'Tell us what you want to win',
    body: 'Tell us the contracts you are chasing and the areas you cover. We will come back with a straight assessment of what it takes to win them — no obligation.',
    button: 'Book Strategy Call',
    note: 'We reply the same business day.',
  },
};
