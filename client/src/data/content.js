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
  ctaPrimary: 'Get a Quote',
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
 * Each service renders as a card: `title`, `lead` (the one-line promise),
 * `body`, then `points`. `id` picks the icon in Icons.jsx; `title` is also
 * the contact form option, so keep it in step with server/src/models/Lead.js.
 */
export const SERVICES = [
  {
    id: 'website',
    number: '01',
    title: "Website Design & Development",
    lead: "Turn Your Website Into a Lead-Generating Asset",
    body: "Your website is often the first place a potential client evaluates your security company. We build fast, professional, conversion-focused websites designed to communicate trust, experience, services and credibility.",
    points: [
      "Security company website design",
      "Website redesigns",
      "Service and location pages",
      "Landing pages",
      "Mobile optimization",
      "Conversion-focused layouts",
      "Lead forms and call tracking",
      "Ongoing website support",
    ],
  },
  {
    id: 'seo',
    number: '02',
    title: "SEO & AI SEO",
    lead: "Get Found on Google and AI Search",
    body: "We help security companies improve their visibility across traditional search engines and emerging AI search platforms. Our approach combines technical SEO, local SEO, content and AI-focused optimization to help your company get discovered by the right buyers.",
    points: [
      "Technical SEO",
      "Local SEO",
      "Keyword and competitor research",
      "Service and location page optimization",
      "Content strategy",
      "Google Business Profile optimization",
      "AI SEO / GEO",
      "Search visibility tracking",
    ],
  },
  {
    id: 'ads',
    number: '03',
    title: "Paid Ads",
    lead: "Put Your Security Services in Front of High-Intent Buyers",
    body: "We create and manage targeted advertising campaigns designed to reach businesses and decision-makers actively looking for security services.",
    points: [
      "Google Ads",
      "Meta Ads",
      "Campaign strategy",
      "Landing pages",
      "Audience targeting",
      "Conversion tracking",
      "Remarketing",
      "Ongoing campaign optimization",
    ],
  },
  {
    id: 'social',
    number: '04',
    title: "Social Media Marketing",
    lead: "Build a Security Brand People Remember and Trust",
    body: "A professional social presence helps demonstrate your company's experience, capabilities and credibility before a prospect ever contacts you. We create consistent, industry-focused content that keeps your company visible and professional.",
    points: [
      "Social media strategy",
      "Content creation",
      "LinkedIn marketing",
      "Facebook and Instagram management",
      "Industry-focused graphics",
      "Educational content",
      "Company updates",
      "Engagement management",
    ],
  },
  {
    id: 'email',
    number: '05',
    title: "Email Marketing & Lead Generation",
    lead: "Turn Marketing Attention Into Real Opportunities",
    body: "Generating a lead is only the beginning. We help security companies build targeted lead generation campaigns and email follow-up systems that keep prospects engaged and move qualified opportunities toward a conversation.",
    points: [
      "B2B lead generation",
      "Target account campaigns",
      "Email outreach",
      "Lead nurturing",
      "Follow-up sequences",
      "Landing pages",
      "Lead qualification",
      "Campaign reporting",
    ],
  },
  {
    id: 'gmb',
    number: '06',
    title: "GMB Management",
    lead: "Improve Your Local Visibility on Google",
    body: "Your Google Business Profile can play an important role when prospects search for security companies in their area. We optimize and manage your profile to improve local visibility, strengthen credibility and make it easier for prospects to contact you.",
    points: [
      "Google Business Profile optimization",
      "Category and service optimization",
      "Business information management",
      "Google Posts",
      "Review management",
      "Photo and content updates",
      "Local visibility monitoring",
      "Performance reporting",
    ],
  },
  {
    id: 'crm',
    number: '07',
    title: "CRM Automation",
    lead: "Stop Losing Leads After They Contact You",
    body: "A good lead is only valuable if your team follows up. We connect your marketing and CRM systems so new inquiries can be captured, organized and followed up automatically.",
    points: [
      "CRM setup and optimization",
      "Lead capture",
      "Automated email and SMS follow-ups",
      "Lead routing",
      "Pipeline management",
      "Appointment automation",
      "Lead nurturing",
      "Marketing and sales reporting",
    ],
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
