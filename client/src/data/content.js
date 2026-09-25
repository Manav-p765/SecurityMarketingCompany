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
 * page (rendered as "/#section", so it works from any page). `menu: true`
 * turns the link into a dropdown (desktop) / accordion (mobile) listing every
 * entry in `services`, with `menuAllLabel` linking to `to` at the bottom.
 */
export const NAV_LINKS = [
  { id: 'services', label: 'Services', to: '/services', menu: true, menuAllLabel: 'View all services' },
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
 * The service list: the single source of truth for the home page cards, the
 * /services overview, each /services/:slug detail page, the footer, the
 * contact form dropdown, the sitemap and the Service schema.
 *
 * - `slug` is the URL (/services/seo) and the anchor on the overview
 *   (/services#seo). Lowercase and hyphenated; changing it changes the URL.
 * - `name` is also the contact form option, so keep it in step with SERVICES
 *   in server/src/models/Lead.js (the build fails if they drift apart).
 * - `shortDescription` is the one-line outcome on cards; keep it to one
 *   sentence so the home page cards stay four to a row.
 * - `icon` is a key in SERVICE_ICONS in components/Icons.jsx.
 * - `problem.paragraphs` 2–3 short paragraphs; the first one also appears on
 *   the /services overview, so it should stand on its own.
 * - `included` 4–6 items of 2–3 sentences; each item's optional `icon` is a
 *   key in FEATURE_ICONS (Icons.jsx), falling back to a check mark.
 * - `process` 3–5 steps, `faqs` 4–5 questions, `relatedSlugs` 2–3 other
 *   services.
 * - `whyItMatters` 3–4 `{ audience, title, body }` points for guard, alarm/
 *   CCTV and access control firms; `timeline` `{ period, title, activities }`
 *   phases (first month / months 2–3 / ongoing), described as activities,
 *   never as promised results. Either can be left out: the detail page hides
 *   any section with no data.
 * - `pricing` is the line shown on the overview and the detail page.
 * - Optional `proof: [{ quote, name, company }]` adds a Proof section to the
 *   detail page. Only add real, cleared testimonials or results; with no
 *   `proof` the section is left out.
 */
export const services = [
  {
    slug: 'website',
    name: 'Website Design & Development',
    shortDescription: 'Turn Your Website Into a Lead-Generating Asset',
    icon: 'browser',
    hero: {
      headline: 'Website Design & Development for Security Companies',
      subheadline:
        'A fast, credible website built to turn property managers, business owners and homeowners into quote requests — not a brochure with a phone number.',
    },
    problem: {
      heading: 'Your website is where buyers decide whether to call',
      paragraphs: [
        'Most security company websites list services and a phone number, then stop. A property manager comparing three guard companies, or a business owner pricing a camera system, leaves without a reason to call — or an easy way to ask for a quote.',
        'Buyers rarely tell you why they chose someone else. The company whose site looked current, explained the service clearly and made the next step obvious simply got the call. For a guard company, that is a lost bid. For an alarm or CCTV installer, it is an install that went to a competitor.',
        'Referrals check your website too. An outdated or slow site can undo a strong recommendation before the first conversation starts.',
      ],
    },
    included: [
      {
        icon: 'layout',
        title: 'Custom design',
        description:
          'Built around your services, your service area and your brand — not a generic template. The layout is planned for the buyers you sell to, whether that is a facilities director reviewing vendors or a homeowner comparing alarm companies. Every page ends with a clear next step.',
      },
      {
        icon: 'pages',
        title: 'Service and city pages',
        description:
          'A page for each service you sell and each area you cover, written for how your buyers search. Guard services, patrol, alarm monitoring, video surveillance and access control each get their own explanation instead of sharing one list. The same pages give search engines something specific to rank.',
      },
      {
        icon: 'form',
        title: 'Quote and survey forms',
        description:
          'Quote, site survey and consultation requests on every key page, so a ready buyer never has to hunt for the next step. Forms ask for the details your team needs to respond, such as property type and service needed, without becoming a chore to fill in.',
      },
      {
        icon: 'badge',
        title: 'Trust signals up front',
        description:
          'Licenses, certifications and insurance shown where commercial and residential buyers look for them. Industry memberships and the states you are licensed in can sit alongside them. For a buyer trusting you with their property, this is often what earns the call.',
      },
      {
        icon: 'mobile',
        title: 'Fast, mobile-first build',
        description:
          'Quick to load on a phone and easy for your team to update in-house. Many buyers first look you up on a phone, often between other tasks. The site stays fast and readable on any screen.',
      },
      {
        icon: 'chart',
        title: 'Call and form tracking',
        description:
          'Every call and form submission is recorded, so you can see which pages produce inquiries. Tracking is set up in analytics from launch. That gives you a baseline to judge the site by and a clear view of what to improve next.',
      },
    ],
    whyItMatters: [
      {
        audience: 'Guard services',
        title: 'Commercial bids start with a website check',
        body: 'Property managers and facilities directors usually look at a guard company’s site before inviting it to bid. Clear service pages, licensing and the types of posts you staff help you make the shortlist instead of being screened out.',
      },
      {
        audience: 'Alarm & CCTV installers',
        title: 'Residential buyers compare quickly',
        body: 'Homeowners and small business owners often check several installers in one sitting. A site that explains packages, monitoring and the install process plainly gives them a reason to request your quote first.',
      },
      {
        audience: 'Access control & integrators',
        title: 'Complex systems need clear explanations',
        body: 'Access control, video management and integration projects involve IT, facilities and management. A dedicated page for each system type helps every stakeholder find what they need and shows you have done this work before.',
      },
      {
        audience: 'Every security company',
        title: 'Your site supports every other channel',
        body: 'Ads, search, social posts and referrals all send buyers to your website. If the site does not turn visitors into inquiries, every other marketing dollar has to work harder.',
      },
    ],
    timeline: [
      {
        period: 'First month',
        title: 'Discovery and planning',
        activities: [
          'Review of your current site, services and service area',
          'Page structure and sitemap agreed with you',
          'Copy drafted for the key service pages',
        ],
      },
      {
        period: 'Months 2–3',
        title: 'Design, build and launch',
        activities: [
          'Design and build, with review rounds',
          'Forms, call tracking and analytics set up',
          'Launch, redirects and a test of every form and call path',
        ],
      },
      {
        period: 'Ongoing',
        title: 'Support and improvement',
        activities: [
          'Page updates as your services change',
          'Review of which pages produce inquiries',
          'Recommendations for new service or city pages',
        ],
      },
    ],
    process: [
      { step: 'Discovery', description: 'We review your current site, your services, your service area and the buyers you want more of.' },
      { step: 'Structure and copy', description: 'We plan the pages and write the copy for each service and area, built around quote and survey requests.' },
      { step: 'Design and build', description: 'We design and build the site, set up forms and tracking, and share it with you for review.' },
      { step: 'Launch', description: 'We launch, redirect your old URLs so existing search visibility carries over, and test every form and call path.' },
    ],
    deliverables: [
      'A custom, mobile-first website on your domain',
      'Service and service-area pages with written copy',
      'Quote, survey and consultation forms connected to your inbox or CRM',
      'Call and form tracking set up in analytics',
      'Redirects from your old site’s URLs',
      'A walkthrough so your team can update content in-house',
    ],
    bestFor: [
      'Guard and patrol companies bidding on commercial contracts',
      'Alarm and CCTV installers selling residential and commercial installs',
      'Access control and systems integrators with complex service lines',
      'Security companies whose current site is outdated, slow on mobile or not producing inquiries',
    ],
    faqs: [
      {
        q: 'Can you work with our existing website?',
        a: 'Yes. After the audit we recommend either improving the site you have or rebuilding it, depending on its platform, speed and structure. Either way, the goal is the same: more quote and survey requests.',
      },
      {
        q: 'Will we be able to edit the site ourselves?',
        a: 'Yes. The site is built so your team can update text, photos and service pages without a developer, and we walk you through it at launch.',
      },
      {
        q: 'Do you write the copy?',
        a: 'Yes. We write the copy for every page from your services, licenses and service area. You review and approve it before launch.',
      },
      {
        q: 'What happens to our current search rankings?',
        a: 'We map your old URLs to the new pages and set up redirects, so the search visibility you already have carries over as far as possible.',
      },
      {
        q: 'How do we know the site is working?',
        a: 'Calls and form submissions are tracked from launch, so you can see how many inquiries the site produces and which pages they come from.',
      },
    ],
    relatedSlugs: ['seo', 'crm-automation', 'paid-ads'],
    pricing: 'Custom quote',
    seo: {
      title: 'Website Design & Development for Security Companies | Security Marketing Company',
      description:
        'Websites for US guard, alarm, CCTV and access control companies: service and city pages, quote forms, trust signals and call tracking built to win inquiries.',
    },
  },
  {
    slug: 'seo',
    name: 'SEO & AI SEO',
    shortDescription: 'Get Found on Google and AI Search',
    icon: 'search',
    hero: {
      headline: 'SEO & AI SEO for Security Companies',
      subheadline:
        'Show up when facilities managers, property owners and homeowners search Google — or ask an AI assistant — for security services in your area.',
    },
    problem: {
      heading: 'The shortlist is set before anyone visits your website',
      paragraphs: [
        'When a facilities manager searches “security guard company near me” or a homeowner asks an AI assistant for an alarm installer, the shortlist is set before anyone visits a website. Buyers search by service and city, and the companies that show up for those searches get the calls.',
        'A competitor that appears above you does not need to be better at security. It only needs clearer service pages and a stronger presence in the cities you both cover. Over time, it collects the inquiries — and the contracts — that you never hear about.',
        'Relying on referrals alone ties growth to the people who already know you. Search reaches the buyers who do not, at the moment they are looking.',
      ],
    },
    included: [
      {
        icon: 'wrench',
        title: 'Technical SEO audit',
        description:
          'Site speed, indexing, structure and errors reviewed and fixed so search engines can crawl every page. Issues are ranked by impact, so the fixes that matter most happen first. You get a plain-English summary of what was found and what changed.',
      },
      {
        icon: 'target',
        title: 'Keyword research',
        description:
          'The searches your buyers actually use, mapped by service and by city. Commercial guard services, alarm monitoring and access control are searched for differently, so each gets its own targets. Terms that attract job seekers or DIY shoppers are flagged and left out.',
      },
      {
        icon: 'map',
        title: 'Service-area pages',
        description:
          'A dedicated page for each city and county you cover, so you can be found beyond your office address. Each page is written for that area and the services you offer there. They are built to be useful to a buyer, not copies with the city name swapped.',
      },
      {
        icon: 'sparkle',
        title: 'AI search optimization',
        description:
          'Content structured to be understood and cited by AI search tools such as Google AI Overviews and ChatGPT. That means clear service descriptions, locations, licensing and direct answers to the questions buyers ask. The same clarity supports traditional search as well.',
      },
      {
        icon: 'list',
        title: 'Local citations',
        description:
          'Consistent business listings across local and security industry directories. Your name, address, phone number and services match everywhere they appear. Outdated or conflicting listings are found and corrected.',
      },
      {
        icon: 'chart',
        title: 'Monthly reporting',
        description:
          'Rankings and traffic for context — and the inquiries search actually produces. Each report explains what was done that month and what comes next. You see how search contributes to calls and form submissions, not just visits.',
      },
    ],
    whyItMatters: [
      {
        audience: 'Guard services',
        title: 'Commercial buyers search by city and service',
        body: 'Facilities and property managers search for guard, patrol and event security in specific areas. A page for each service and city puts you in front of them while they are building a vendor list.',
      },
      {
        audience: 'Alarm & CCTV installers',
        title: 'Steady inquiries without paying per click',
        body: 'Search visibility keeps bringing in installation and monitoring inquiries without a cost for every visit. It pairs well with paid ads, which can cover demand while search builds.',
      },
      {
        audience: 'Access control & integrators',
        title: 'Technical buyers research before they call',
        body: 'IT and facilities teams often read in depth before contacting an integrator. Detailed content on systems, integrations and project types helps you show up in that research and answer their questions early.',
      },
      {
        audience: 'Every security company',
        title: 'AI assistants are a new shortlist',
        body: 'More buyers now ask AI tools for recommendations. Clear, well-structured content makes it easier for those tools to understand what you do and where you do it.',
      },
    ],
    timeline: [
      {
        period: 'First month',
        title: 'Audit and plan',
        activities: [
          'Technical audit, with the most pressing fixes made first',
          'Keyword and competitor research by service and city',
          'A page and content plan agreed with you',
        ],
      },
      {
        period: 'Months 2–3',
        title: 'Build the foundation',
        activities: [
          'Existing service pages optimized',
          'First service-area pages published',
          'Citations built and conflicting listings corrected',
        ],
      },
      {
        period: 'Ongoing',
        title: 'Publish, track and adjust',
        activities: [
          'New pages and content each month',
          'Rankings, traffic and inquiries tracked',
          'The plan adjusted to what the data shows',
        ],
      },
    ],
    process: [
      { step: 'Audit', description: 'We review your site’s technical health, your current rankings and the competitors that outrank you.' },
      { step: 'Plan', description: 'We map the searches to target by service and city, and plan the pages and content to win them.' },
      { step: 'Build', description: 'We fix technical issues, optimize existing pages and publish new service-area pages and content.' },
      { step: 'Grow', description: 'We keep publishing, build citations, track rankings and inquiries, and adjust the plan each month.' },
    ],
    deliverables: [
      'Technical SEO fixes on your site',
      'New and optimized service and service-area pages',
      'Ongoing content aimed at your target searches',
      'Local and security industry directory citations',
      'A monthly report on rankings, traffic and inquiries',
    ],
    bestFor: [
      'Guard and patrol companies competing for commercial contracts in a defined metro area',
      'Alarm and CCTV installers who want steady inbound calls without paying for every click',
      'Access control and systems integrators targeting commercial and facilities buyers',
      'Security companies expanding into new cities or counties',
    ],
    faqs: [
      {
        q: 'How long does SEO take to work?',
        a: 'SEO builds over months rather than weeks, and the pace depends on your market, your competitors and the state of your current site. We set expectations for your market after the audit, and paid ads can cover the gap in the meantime.',
      },
      {
        q: 'What is AI SEO?',
        a: 'More buyers now ask AI tools such as Google AI Overviews and ChatGPT for recommendations. AI SEO structures your content — clear service descriptions, locations, licensing and answers to common questions — so those tools can understand it and cite it.',
      },
      {
        q: 'Can you help us rank in cities where we do not have an office?',
        a: 'Service-area pages help you appear in searches for the cities and counties you serve, though map results favor your business address. We set out what is realistic for each area in the plan.',
      },
      {
        q: 'Do you guarantee first-page rankings?',
        a: 'No. No one controls Google’s rankings, and a guarantee is a warning sign. We commit to the work, report on it openly every month and focus on the inquiries search produces.',
      },
      {
        q: 'How is SEO reported?',
        a: 'A monthly report covering rankings for your target searches, traffic, and the calls and form submissions that came from search.',
      },
    ],
    relatedSlugs: ['google-business-profile', 'website', 'paid-ads'],
    pricing: 'Custom quote',
    seo: {
      title: 'SEO & AI SEO for Security Companies | Security Marketing Company',
      description:
        'SEO and AI SEO for US security companies: service-area pages, technical fixes, citations and content that get guard, alarm and CCTV firms found in search.',
    },
  },
  {
    slug: 'paid-ads',
    name: 'Paid Ads',
    shortDescription: 'Put Your Security Services in Front of High-Intent Buyers',
    icon: 'megaphone',
    hero: {
      headline: 'Paid Ads for Security Companies',
      subheadline:
        'Reach buyers who are searching right now, with campaigns built around your services, your service area and your cost per lead.',
    },
    problem: {
      heading: 'Urgent buyers call whoever shows up first',
      paragraphs: [
        'SEO takes time to build. Buyers with an urgent need — a break-in, a new site opening, a failed inspection — search today and call whoever shows up first.',
        'Without careful targeting, security ads also attract job seekers looking for guard positions and DIY shoppers pricing cameras. Those are clicks you pay for that never turn into work, and they can use up a day’s budget before a real buyer searches.',
        'Many security companies try ads once, watch the budget disappear and decide ads do not work for them. Usually the problem is the setup: broad keywords, one generic landing page and no way to tell which clicks became calls.',
      ],
    },
    included: [
      {
        icon: 'search',
        title: 'Google Search Ads',
        description:
          'Campaigns targeting the searches buyers use when they need security services now. Ads are written for each service and area, with clear calls to action for quotes and site surveys. Ad schedules can follow the hours your team answers the phone.',
      },
      {
        icon: 'map',
        title: 'Local Services Ads',
        description:
          'Setup and management of Google Local Services Ads where your category and location qualify. We work through the profile, service areas and verification steps with you. Leads are reviewed, and ones that do not qualify can be disputed where Google allows it.',
      },
      {
        icon: 'layers',
        title: 'Campaign structure',
        description:
          'Campaigns split by service, city and buyer type, so budget goes where the work is. Commercial guard services and residential alarm installs never compete for the same budget. You can raise or lower spend on each line of business separately.',
      },
      {
        icon: 'filter',
        title: 'Negative keywords',
        description:
          'Filters that keep out job seekers, DIY searches and other clicks that will not become customers. Terms such as “jobs”, “hiring” and “training” are excluded from the start. The list grows as we review what people actually searched for.',
      },
      {
        icon: 'layout',
        title: 'Landing pages',
        description:
          'A dedicated page for each campaign, built to turn a click into a call or quote request. The page matches the ad the buyer clicked, so they land on exactly what they searched for. Calls and forms on it are tracked separately from your main website.',
      },
      {
        icon: 'chart',
        title: 'Conversion tracking',
        description:
          'Calls and form submissions tracked back to the campaign and keyword that produced them. That shows which searches bring in inquiries and which only spend money. Budget decisions are made on inquiries, not clicks.',
      },
    ],
    whyItMatters: [
      {
        audience: 'Guard services',
        title: 'Reach buyers with an urgent need',
        body: 'Break-ins, new construction sites and upcoming events often need coverage quickly. Ads put your company in front of those buyers while they are still deciding who to call.',
      },
      {
        audience: 'Alarm & CCTV installers',
        title: 'Keep the install calendar full',
        body: 'Installation work can be seasonal and uneven. Ads let you turn spend up when your technicians have capacity and down when they are booked.',
      },
      {
        audience: 'Access control & integrators',
        title: 'Target commercial projects precisely',
        body: 'Campaigns can focus on specific systems, building types and areas, rather than broad security terms that attract homeowners and DIY buyers.',
      },
      {
        audience: 'Every security company',
        title: 'Test a new service or market',
        body: 'Entering a new city or launching a new service? Ads show how buyers respond before you invest in longer-term channels such as SEO.',
      },
    ],
    timeline: [
      {
        period: 'First month',
        title: 'Audit, build and launch',
        activities: [
          'Review of any existing ad accounts and past campaigns',
          'Campaigns, negative keywords and landing pages built',
          'Conversion tracking tested, then launch on a budget you approve',
        ],
      },
      {
        period: 'Months 2–3',
        title: 'Learn and refine',
        activities: [
          'Search terms reviewed and negative keywords added',
          'Bids and budget shifted toward searches that produce inquiries',
          'Ad copy and landing page tests',
        ],
      },
      {
        period: 'Ongoing',
        title: 'Manage and report',
        activities: [
          'Regular search term and budget reviews',
          'New campaigns for services or areas you add',
          'A monthly report on spend, cost per lead and inquiries',
        ],
      },
    ],
    process: [
      { step: 'Audit', description: 'We review any existing ad accounts, your services and the areas you want to grow in.' },
      { step: 'Build', description: 'We set up campaigns, negative keywords, landing pages and conversion tracking.' },
      { step: 'Launch', description: 'Campaigns go live on a budget you approve.' },
      { step: 'Optimize', description: 'We review search terms, bids and landing pages regularly and shift spend toward what produces inquiries.' },
    ],
    deliverables: [
      'Managed Google Search campaigns, plus Local Services Ads where eligible',
      'A landing page for each campaign',
      'Call and form conversion tracking',
      'Ongoing search term reviews and negative keyword updates',
      'A monthly report on spend, cost per lead and inquiries',
    ],
    bestFor: [
      'Alarm and CCTV installers who want residential or commercial installs this quarter',
      'Guard companies bidding on contracts in markets where they have little organic visibility',
      'Security companies launching a new service or entering a new city',
      'Any security company that needs inquiries while SEO builds',
    ],
    faqs: [
      {
        q: 'How much should we spend on ads?',
        a: 'It depends on your market, your services and how much new work you can take on. We recommend a starting budget after the audit, and you approve every budget before it is spent.',
      },
      {
        q: 'Do you manage Google Local Services Ads?',
        a: 'Yes, where your category and location are eligible. Local Services Ads appear above standard search ads and charge per lead rather than per click. We handle setup and ongoing management.',
      },
      {
        q: 'How do you stop job seekers from clicking our ads?',
        a: 'With careful keyword choice and negative keywords. Searches that include terms such as “jobs”, “hiring” or “salary” are excluded, and we review the search terms report regularly to catch new ones.',
      },
      {
        q: 'How quickly can ads produce inquiries?',
        a: 'Ads can start producing calls soon after launch because they do not depend on rankings. The first weeks show which searches and areas convert, and the campaigns are refined from there.',
      },
      {
        q: 'How do we know what we are getting for the spend?',
        a: 'Every call and form submission is tracked to the campaign that produced it, and the monthly report shows spend, cost per lead and the number of inquiries.',
      },
    ],
    relatedSlugs: ['seo', 'google-business-profile', 'crm-automation'],
    pricing: 'Custom quote',
    seo: {
      title: 'Paid Ads for Security Companies | Security Marketing Company',
      description:
        'Google Search and Local Services Ads for US security companies: campaigns by service and city, job-seeker filtering, landing pages and cost-per-lead reporting.',
    },
  },
  {
    slug: 'social-media',
    name: 'Social Media Marketing',
    shortDescription: 'Build a Security Brand People Remember and Trust',
    icon: 'social',
    hero: {
      headline: 'Social Media Marketing for Security Companies',
      subheadline:
        'Keep your LinkedIn, Facebook and Instagram active and credible, so buyers who look you up see a company worth calling back.',
    },
    problem: {
      heading: 'Buyers check you out before they call back',
      paragraphs: [
        'Commercial buyers check you out before they call back. A dormant LinkedIn page or a Facebook feed last updated two years ago makes a company look smaller and less reliable than it is.',
        'It matters most at the end of a sale. A property manager holding your proposal and a competitor’s may look both companies up before deciding. An active, professional presence will not win the contract on its own, but a neglected one can quietly cost it.',
        'For guard companies, social media does a second job: it is often where officer candidates first hear about you. Staffing decides which contracts you can take on, so recruiting reach matters too.',
      ],
    },
    included: [
      {
        icon: 'user',
        title: 'Profile setup and cleanup',
        description:
          'Complete, consistent profiles on LinkedIn, Facebook and Instagram. Descriptions, service areas, contact details and branding match across every channel. Old or duplicate pages are identified so they can be merged or removed.',
      },
      {
        icon: 'calendar',
        title: 'Content calendar',
        description:
          'A monthly plan built around your services, projects and team. The mix is set for your buyers, from commercial credibility on LinkedIn to community content on Facebook. You see and approve the whole month before it runs.',
      },
      {
        icon: 'badge',
        title: 'Credibility posts',
        description:
          'Posts that show your licensing, training, installs and people. Buyers see how you work rather than generic security tips. Photos and details from your team make these the strongest posts in the calendar.',
      },
      {
        icon: 'users',
        title: 'Recruiting posts',
        description:
          'Posts that help fill open officer and technician roles. They show what it is like to work for you, alongside the job details. Each one can link to your careers page or job board listing.',
      },
      {
        icon: 'chat',
        title: 'Comment and message monitoring',
        description:
          'Comments and messages watched, with inquiries passed to your team. Questions from potential buyers do not sit in an inbox nobody checks. Anything sensitive is flagged to you rather than answered on your behalf.',
      },
      {
        icon: 'chart',
        title: 'Engagement reporting',
        description:
          'A monthly view of reach and engagement across your channels. The report shows which topics and formats work best for your audience. The next month’s calendar is adjusted to match.',
      },
    ],
    whyItMatters: [
      {
        audience: 'Guard services',
        title: 'Credibility and recruiting in one place',
        body: 'The same feed can show commercial buyers a professional operation and show candidates a company worth working for.',
      },
      {
        audience: 'Alarm & CCTV installers',
        title: 'Show the work, not just the product',
        body: 'Photos of clean installs, tidy cable runs and well-placed cameras show homeowners and businesses the quality of your work before they request a quote.',
      },
      {
        audience: 'Access control & integrators',
        title: 'LinkedIn reaches the people who sign off',
        body: 'Facilities directors, property managers and IT leads use LinkedIn. Regular project and expertise posts keep your company familiar to them between projects.',
      },
      {
        audience: 'Every security company',
        title: 'An active page answers an unasked question',
        body: 'Buyers rarely ask whether you are still active or growing. A current, consistent presence answers it for them.',
      },
    ],
    timeline: [
      {
        period: 'First month',
        title: 'Audit and setup',
        activities: [
          'Review of your current profiles and competitor activity',
          'Profiles cleaned up and made consistent',
          'Tone, content themes and the first monthly calendar agreed',
        ],
      },
      {
        period: 'Months 2–3',
        title: 'Publish and learn',
        activities: [
          'Scheduled posts across your chosen channels',
          'Recruiting posts for open roles',
          'Comment and message monitoring in place',
        ],
      },
      {
        period: 'Ongoing',
        title: 'Refine',
        activities: [
          'Monthly calendars shaped by what works',
          'Photos and updates from the field turned into posts',
          'A monthly engagement report',
        ],
      },
    ],
    process: [
      { step: 'Audit', description: 'We review your current profiles, what competitors post and who you want to reach.' },
      { step: 'Plan', description: 'We set the tone, content themes and a monthly calendar for your approval.' },
      { step: 'Publish', description: 'We create and schedule posts, using photos and details you share from the field.' },
      { step: 'Report', description: 'We report on reach and engagement each month and adjust the plan.' },
    ],
    deliverables: [
      'Updated LinkedIn, Facebook and Instagram profiles',
      'A monthly content calendar for your approval',
      'Scheduled posts across your channels',
      'Recruiting posts for open roles',
      'A monthly engagement report',
    ],
    bestFor: [
      'Companies selling to commercial and HOA buyers who research vendors before shortlisting',
      'Guard companies that also recruit officers online',
      'Installers and integrators with project work worth showing',
      'Security companies whose profiles have gone quiet',
    ],
    faqs: [
      {
        q: 'Which platforms should we be on?',
        a: 'For most security companies: LinkedIn for commercial buyers and facilities managers, Facebook for residential and community audiences, and Instagram for project and team content. We recommend a mix based on who you sell to.',
      },
      {
        q: 'Do we need to provide content?',
        a: 'A little. Photos from the field, project details and team news make the strongest posts. We turn what you share into finished posts and fill the rest of the calendar ourselves.',
      },
      {
        q: 'Do we approve posts before they go live?',
        a: 'Yes. The monthly calendar is shared for your approval before anything is published.',
      },
      {
        q: 'Can social media help with hiring?',
        a: 'Yes. Recruiting posts for officer and technician roles are part of the service and can run alongside your job board listings.',
      },
      {
        q: 'Will social media bring in contracts directly?',
        a: 'Sometimes, but its main job is credibility: making sure a buyer who looks you up sees an active, professional company. Search and ads do more of the direct lead generation.',
      },
    ],
    relatedSlugs: ['google-business-profile', 'email-marketing', 'website'],
    pricing: 'Custom quote',
    seo: {
      title: 'Social Media Marketing for Security Companies | Security Marketing Company',
      description:
        'Social media for US security companies: LinkedIn, Facebook and Instagram content that builds credibility with commercial buyers and helps recruit officers.',
    },
  },
  {
    slug: 'email-marketing',
    name: 'Email Marketing & Lead Generation',
    shortDescription: 'Turn Marketing Attention Into Real Opportunities',
    icon: 'mail',
    hero: {
      headline: 'Email Marketing & Lead Generation for Security Companies',
      subheadline:
        'Stay in front of property managers, facilities directors and past inquiries through long buying cycles, so you are the first call when a contract comes up.',
    },
    problem: {
      heading: 'Security contracts have long buying cycles',
      paragraphs: [
        'A property manager may not switch guard providers until the current contract ends. A business owner who asked about cameras may wait for next quarter’s budget. An inquiry that goes quiet today can still become a job next year — if you stay in touch.',
        'Most security companies have a list of past inquiries and quotes that nobody follows up on. Sales time goes to the leads that are ready now, which makes sense, but the rest go cold and eventually call whoever reaches them when they are ready.',
        'Referrals and repeat work depend on staying in front of people too. Clients who hear from you regularly have a reason to remember your name when a colleague asks for a recommendation.',
      ],
    },
    included: [
      {
        icon: 'magnet',
        title: 'Lead magnets',
        description:
          'Offers such as security checklists and assessment requests that turn website visitors into contacts. They give a buyer who is not ready to call a reason to leave their details. Each one is written for a specific audience, such as property managers or retail owners.',
      },
      {
        icon: 'flow',
        title: 'Nurture sequences',
        description:
          'Automated emails for commercial and residential prospects that move them toward a quote. Each sequence answers the questions buyers have at each stage, from what affects pricing to what a site survey involves. A sequence stops as soon as someone replies or books.',
      },
      {
        icon: 'mail',
        title: 'Newsletters',
        description:
          'Regular updates to past inquiries and current clients. Content covers practical security topics, company news and seasonal reminders. It keeps your name in front of people between contracts.',
      },
      {
        icon: 'send',
        title: 'Outbound campaigns',
        description:
          'Targeted campaigns to commercial prospects such as property managers and general contractors. Messages are short, specific to the recipient’s industry and aimed at starting a conversation. Every campaign follows CAN-SPAM requirements.',
      },
      {
        icon: 'shield',
        title: 'List setup and compliance',
        description:
          'List building, segmentation and CAN-SPAM compliant templates. Contacts are grouped by buyer type, service interest and stage. Unsubscribes are honored automatically, and sending health is monitored so your emails keep reaching inboxes.',
      },
      {
        icon: 'chart',
        title: 'Reporting',
        description:
          'Open, click and reply reporting for every campaign. Replies and booked calls are tracked alongside the standard email metrics. What works feeds into the next round of subject lines, timing and targeting.',
      },
    ],
    whyItMatters: [
      {
        audience: 'Guard services',
        title: 'Be known before the contract comes up',
        body: 'Guard contracts often renew on a fixed cycle. Regular, useful contact means you are already familiar when a property manager starts looking for a new provider.',
      },
      {
        audience: 'Alarm & CCTV installers',
        title: 'Turn open quotes into installs',
        body: 'Many quotes that did not close were postponed rather than lost. A short follow-up sequence reopens the conversation without adding to your team’s workload.',
      },
      {
        audience: 'Access control & integrators',
        title: 'Support long commercial sales cycles',
        body: 'Integration projects involve several decision makers and budget approvals. Well-timed, relevant emails keep your company in the conversation throughout.',
      },
      {
        audience: 'Every security company',
        title: 'Put an unused list to work',
        body: 'Past inquiries, clients and contacts from events already know your name. Email is a simple, low-cost way to stay in touch with all of them.',
      },
    ],
    timeline: [
      {
        period: 'First month',
        title: 'Audit and setup',
        activities: [
          'Review of your existing contacts and email tools',
          'Lists cleaned, segmented and made compliant',
          'Lead magnets and first sequences drafted for your approval',
        ],
      },
      {
        period: 'Months 2–3',
        title: 'Launch',
        activities: [
          'Nurture sequences switched on for new inquiries',
          'First newsletters sent',
          'Outbound campaigns started to an agreed target list',
        ],
      },
      {
        period: 'Ongoing',
        title: 'Refine',
        activities: [
          'Regular newsletters and new campaigns',
          'Subject lines, timing and targeting adjusted',
          'A monthly report on opens, clicks and replies',
        ],
      },
    ],
    process: [
      { step: 'Audit', description: 'We review your existing contacts, your email tools and the buyers you want to reach.' },
      { step: 'Build', description: 'We set up lists, segments, templates and lead magnets.' },
      { step: 'Launch', description: 'Nurture sequences, newsletters and outbound campaigns go live after your approval.' },
      { step: 'Refine', description: 'We track opens, clicks and replies, and adjust subject lines, timing and targeting.' },
    ],
    deliverables: [
      'Lead magnets and signup forms on your website',
      'Automated nurture sequences',
      'Regular newsletters',
      'Targeted outbound campaigns to commercial prospects',
      'A monthly report on opens, clicks and replies',
    ],
    bestFor: [
      'Guard companies targeting property managers, facilities directors and general contractors',
      'Integrators with a long commercial sales cycle',
      'Alarm companies following up on past quotes and existing customers',
      'Security companies with a contact list that is not being used',
    ],
    faqs: [
      {
        q: 'Is cold email allowed in the US?',
        a: 'Commercial email is governed by the CAN-SPAM Act, which allows outreach to business contacts as long as messages are accurate, identify the sender, include a physical address and honor opt-outs. Every campaign we send is set up to meet those requirements.',
      },
      {
        q: 'Where do the contacts come from?',
        a: 'From your own inquiries and clients, from signups through lead magnets on your website and, for outbound campaigns, from targeted lists of commercial prospects in your service area.',
      },
      {
        q: 'Which email platform do you use?',
        a: 'We work with the platform you already have, or recommend one that fits your size and connects to your CRM.',
      },
      {
        q: 'How often will emails go out?',
        a: 'It depends on the audience. Nurture sequences run automatically after someone inquires, newsletters go out on a regular schedule, and outbound campaigns follow a plan agreed with you.',
      },
      {
        q: 'Does this connect to our CRM?',
        a: 'Yes. Contacts and replies can flow into your CRM so your team sees every conversation. It pairs naturally with CRM Automation.',
      },
    ],
    relatedSlugs: ['crm-automation', 'website', 'social-media'],
    pricing: 'Custom quote',
    seo: {
      title: 'Email Marketing & Lead Generation for Security Companies | Security Marketing Company',
      description:
        'Email marketing for US security companies: lead magnets, nurture sequences, newsletters and CAN-SPAM compliant outbound campaigns to commercial buyers.',
    },
  },
  {
    slug: 'google-business-profile',
    name: 'Google Business Profile Management',
    shortDescription: 'Improve Your Local Visibility on Google',
    icon: 'map-pin',
    hero: {
      headline: 'Google Business Profile Management for Security Companies',
      subheadline:
        'Get into the map results for “near me” searches with a complete, active profile and a steady flow of reviews.',
    },
    problem: {
      heading: 'The map results appear above the websites',
      paragraphs: [
        'For “near me” searches, the map results appear above the websites. When a homeowner looks for an alarm installer or a business owner looks for mobile patrol, those few listings are often the only companies they consider.',
        'An incomplete profile, the wrong categories or service area, or a run of unanswered reviews is enough to keep you out of them. Meanwhile, competitors with active profiles — and sometimes spam listings with no real office — take the calls.',
        'Most profiles were set up once and never touched again. Recent photos, posts and review responses show buyers a company that is open for business and paying attention.',
      ],
    },
    included: [
      {
        icon: 'store',
        title: 'Profile audit and setup',
        description:
          'A full review of your profile, with verification support and every field completed. Business details, hours, services and descriptions are checked for accuracy. Duplicate or outdated listings are found and resolved.',
      },
      {
        icon: 'tag',
        title: 'Categories and service areas',
        description:
          'Primary and secondary categories, services and service areas configured correctly. Categories decide which searches you are eligible to appear for. Service areas are set to match where you actually work.',
      },
      {
        icon: 'camera',
        title: 'Posts and photos',
        description:
          'Weekly posts and regular photo updates that keep the profile active. Posts cover services, projects, seasonal reminders and company news. Photos come from your team and your work, not stock libraries.',
      },
      {
        icon: 'star',
        title: 'Reviews',
        description:
          'A simple review request process for your team, plus responses to new reviews. Requests go out at a natural moment, such as after an install or a contract milestone. Every review, positive or negative, gets a professional reply.',
      },
      {
        icon: 'eye',
        title: 'Profile monitoring',
        description:
          'Monitoring for unwanted edits and spam competitor listings. Anyone can suggest changes to your profile, and Google sometimes applies them without asking. We catch those changes and report listings that break Google’s guidelines.',
      },
      {
        icon: 'chart',
        title: 'Reporting',
        description:
          'Monthly reporting on calls, direction requests and profile views. You can see how people find and use your profile. Each report notes what was done that month and what is planned next.',
      },
    ],
    whyItMatters: [
      {
        audience: 'Alarm & CCTV installers',
        title: 'Residential buyers start in the map results',
        body: 'Homeowners looking for an alarm or camera system often search “near me” and call straight from the map listing, without visiting a website.',
      },
      {
        audience: 'Guard services',
        title: 'Patrol and site work is won locally',
        body: 'Mobile patrol routes and local guard posts are won in a defined area. A complete profile with the right service area puts you in front of buyers there.',
      },
      {
        audience: 'Access control & integrators',
        title: 'Reviews reassure commercial buyers too',
        body: 'Commercial buyers check reviews as well. Professional responses show how you treat clients, including when something goes wrong.',
      },
      {
        audience: 'Every security company',
        title: 'Often the first impression',
        body: 'Many buyers see your profile before your website. Current photos, accurate hours and recent posts show a company that is active and reliable.',
      },
    ],
    timeline: [
      {
        period: 'First month',
        title: 'Audit and fix',
        activities: [
          'Profile, categories and reviews compared with local competitors',
          'Business details, categories and service areas corrected',
          'Review request process set up with your team',
        ],
      },
      {
        period: 'Months 2–3',
        title: 'Build activity',
        activities: [
          'Weekly posts and photo updates',
          'A reply to every new review',
          'Monitoring for edits and spam listings in place',
        ],
      },
      {
        period: 'Ongoing',
        title: 'Maintain and report',
        activities: [
          'Posts, photos and review replies continued',
          'Spam listings reported when found',
          'A monthly report on calls, direction requests and profile views',
        ],
      },
    ],
    process: [
      { step: 'Audit', description: 'We review your profile, categories and reviews, and how you appear in map results against competitors.' },
      { step: 'Fix', description: 'We correct categories, services, service areas and business details, and complete every missing field.' },
      { step: 'Maintain', description: 'We publish posts and photos, respond to reviews and watch for unwanted edits.' },
      { step: 'Report', description: 'We report on calls, direction requests and profile views each month.' },
    ],
    deliverables: [
      'A fully completed and verified Google Business Profile',
      'Weekly posts and photo updates',
      'A review request process and review responses',
      'Ongoing monitoring for edits and spam listings',
      'A monthly report on calls, direction requests and profile views',
    ],
    bestFor: [
      'Alarm and CCTV installers who win work from “near me” searches',
      'Mobile patrol companies serving a defined local area',
      'Guard companies competing in a single metro area',
      'Security companies with an incomplete or unmanaged profile',
    ],
    faqs: [
      {
        q: 'We already have a Google Business Profile. Why does it need managing?',
        a: 'Most profiles are set up once and left alone. Categories, service areas, posts, photos and review responses all affect how often you appear in map results, and they need regular attention.',
      },
      {
        q: 'Can you get us more reviews?',
        a: 'We set up a simple way for your team to ask satisfied clients for a review at the right moment. We do not buy, write or incentivize reviews, which breaks Google’s rules.',
      },
      {
        q: 'We work from a home office. Can we still show up?',
        a: 'Yes. Service-area businesses can hide their address and list the areas they serve instead. We set this up so your profile follows Google’s guidelines.',
      },
      {
        q: 'What if spam listings are outranking us?',
        a: 'We monitor for spam and fake listings in your area and report them to Google when they break its guidelines.',
      },
      {
        q: 'How does this relate to SEO?',
        a: 'Your profile drives the map results; SEO drives the website results below them. The two support each other, and many security companies run both.',
      },
    ],
    relatedSlugs: ['seo', 'paid-ads', 'website'],
    pricing: 'Custom quote',
    seo: {
      title: 'Google Business Profile Management for Security Companies | Security Marketing Company',
      description:
        'Google Business Profile management for US security companies: categories, service areas, posts, reviews and spam monitoring for “near me” map results.',
    },
  },
  {
    slug: 'crm-automation',
    name: 'CRM Automation',
    shortDescription: 'Stop Losing Leads After They Contact You',
    icon: 'flow',
    hero: {
      headline: 'CRM Automation for Security Companies',
      subheadline:
        'Capture every inquiry, reply instantly and follow up automatically, so leads you already paid for do not go to a competitor.',
    },
    problem: {
      heading: 'A lead that waits a day has usually called someone else',
      paragraphs: [
        'Inquiries arrive by phone, web form, email and ad platforms, often after hours or while your team is out on site. Without one system, follow-up depends on whoever happens to pick them up.',
        'Buyers with an urgent need contact several companies at once. The first to reply with a clear next step often books the site survey, and the rest end up chasing a job that is already gone.',
        'Open quotes and site surveys slip the same way. Without reminders, a proposal sent last month goes unchased — and nobody can say which marketing channel produced the work you actually won.',
      ],
    },
    included: [
      {
        icon: 'database',
        title: 'CRM setup or cleanup',
        description:
          'Selection and setup of a CRM, or cleanup of the one you already use. Contacts are de-duplicated and organized, with fields for the details your team needs, such as property type and services requested. Nothing is changed without your sign-off.',
      },
      {
        icon: 'flow',
        title: 'One pipeline',
        description:
          'Every web form, call and ad lead routed into a single pipeline. Your team works from one list instead of several inboxes and a notebook. Each lead carries its source, so you always know where it came from.',
      },
      {
        icon: 'bolt',
        title: 'Instant replies',
        description:
          'Automatic text and email replies the moment a new inquiry arrives, day or night. The message confirms the inquiry arrived and explains what happens next. Missed calls can trigger a text reply where your phone setup allows it.',
      },
      {
        icon: 'bell',
        title: 'Follow-up reminders',
        description:
          'Automated reminders for open quotes and site surveys, so nothing slips. Tasks go to the right person with a due date. Leads that go quiet can move into an email nurture sequence.',
      },
      {
        icon: 'layers',
        title: 'Pipeline stages',
        description:
          'Clear stages from first inquiry to signed contract. The stages match how your team sells, whether that involves site surveys, proposals or bid deadlines. Managers can see every open opportunity at a glance.',
      },
      {
        icon: 'chart',
        title: 'Reporting',
        description:
          'Reporting on lead source, response time and close rate. You can see which channels produce signed contracts, not just inquiries. It also shows where leads stall, so the process can be fixed.',
      },
    ],
    whyItMatters: [
      {
        audience: 'Guard services',
        title: 'Bids have deadlines',
        body: 'Proposals, site walk-throughs and bid deadlines are easy to lose in an inbox. A pipeline with reminders keeps every open opportunity moving.',
      },
      {
        audience: 'Alarm & CCTV installers',
        title: 'Speed wins residential jobs',
        body: 'Homeowners and small businesses often contact several installers at once. An instant reply and a prompt follow-up keep you in the running.',
      },
      {
        audience: 'Access control & integrators',
        title: 'Many open quotes, many stakeholders',
        body: 'Integration projects involve several contacts and long approval cycles. A CRM keeps every conversation and next step in one place.',
      },
      {
        audience: 'Every security company',
        title: 'Know what your marketing produces',
        body: 'When every lead carries its source, you can see which channels lead to signed contracts and spend accordingly.',
      },
    ],
    timeline: [
      {
        period: 'First month',
        title: 'Audit and design',
        activities: [
          'A map of how inquiries reach you today',
          'Pipeline stages and follow-up rules designed with your team',
          'CRM selected, or your existing one cleaned up',
        ],
      },
      {
        period: 'Months 2–3',
        title: 'Build and train',
        activities: [
          'Forms, call tracking and ad leads connected',
          'Instant replies and reminders built and tested',
          'Team walkthrough and go-live',
        ],
      },
      {
        period: 'Ongoing',
        title: 'Review and refine',
        activities: [
          'Response times and close rates reviewed',
          'Automations adjusted as your process changes',
          'A monthly report on lead source, response time and close rate',
        ],
      },
    ],
    process: [
      { step: 'Audit', description: 'We map how inquiries reach you today and where they get lost.' },
      { step: 'Design', description: 'We design the pipeline stages, replies and follow-up rules around how your team sells.' },
      { step: 'Build', description: 'We set up the CRM, connect your forms, call tracking and ads, and build the automations.' },
      { step: 'Train and refine', description: 'We walk your team through it, then review response times and close rates and adjust.' },
    ],
    deliverables: [
      'A configured CRM with your pipeline stages',
      'Forms, calls and ad leads connected to the pipeline',
      'Automated text and email replies to new inquiries',
      'Follow-up reminders for quotes and site surveys',
      'A monthly report on lead source, response time and close rate',
    ],
    bestFor: [
      'Security companies already getting inquiries but losing track of them',
      'Installers and integrators managing many open quotes at once',
      'Guard companies with long bid and proposal cycles',
      'Teams where follow-up depends on one busy person',
    ],
    faqs: [
      {
        q: 'Which CRM do you use?',
        a: 'We work with the CRM you already have where it can do the job, or recommend one that fits your team size and budget.',
      },
      {
        q: 'Will automated replies feel impersonal?',
        a: 'They are written in your voice and kept short: they confirm the inquiry arrived and tell the buyer what happens next. Your team still handles the real conversation.',
      },
      {
        q: 'What about inquiries that arrive after hours?',
        a: 'Automated replies go out immediately at any hour, and the inquiry is waiting in the pipeline for your team when they start work.',
      },
      {
        q: 'Does this work with our phone system?',
        a: 'In most cases. Call tracking numbers can log calls into the CRM, and missed calls can trigger a text reply. We confirm what is possible with your setup during the audit.',
      },
      {
        q: 'What will we be able to see?',
        a: 'Where each lead came from, how quickly it was answered, where it sits in the pipeline and which sources turn into signed contracts.',
      },
    ],
    relatedSlugs: ['email-marketing', 'website', 'paid-ads'],
    pricing: 'Custom quote',
    seo: {
      title: 'CRM Automation for Security Companies | Security Marketing Company',
      description:
        'CRM automation for US security companies: one pipeline for every inquiry, instant replies, quote follow-up reminders and response-time reporting.',
    },
  },
];

/** Look up a service by its URL slug; undefined for an unknown slug. */
export const getService = (slug) => services.find((service) => service.slug === slug);

/** Display number on cards and blocks ("01"–"07"), from list order. */
export const serviceNumber = (service) => String(services.indexOf(service) + 1).padStart(2, '0');

/** Shared copy on every /services/:slug page. Section H2s come from here. */
export const serviceDetail = {
  breadcrumb: { home: 'Home', services: 'Services' },
  ctaPrimary: 'Book Strategy Call',
  ctaSecondary: 'View All Services',
  problem: { label: 'The problem' },
  whyItMatters: { label: 'Why it matters', title: 'Why it matters for security companies' },
  included: { label: 'What’s included', title: 'Everything in the service' },
  process: { label: 'How it works', title: 'How we deliver it' },
  timeline: {
    label: 'What to expect',
    title: 'The first months, step by step',
    lead: 'The work we do in each phase. Exact timing depends on your starting point and scope, and is confirmed on the strategy call.',
  },
  deliverables: { label: 'What you get', title: 'What you receive' },
  bestFor: { label: 'Best for', title: 'Who this service suits' },
  proof: { label: 'Proof', title: 'What clients say' },
  faq: { label: 'FAQ', title: 'Common questions' },
  related: { label: 'Related services', title: 'Often paired with' },
  learnMore: 'Learn more',
};

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
export const SERVICE_OPTIONS = [...services.map((service) => service.name), 'Not sure yet'];

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

  /** Label and note around each service's `pricing` line (overview and detail pages). */
  pricing: {
    label: 'Pricing',
    note: 'Scoped to your services and service area on a strategy call.',
  },

  /** Labels on each overview block. The block content comes from `services`. */
  blockLabels: {
    problem: 'The problem',
    included: 'What’s included',
    bestFor: 'Best for',
    cta: 'Book Strategy Call',
    learnMore: 'Learn more',
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
