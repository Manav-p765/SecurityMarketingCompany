# Security Marketing Company: Site Content Summary

Updated on 2026-09-24 for the US retargeting and the new Services page. The first version was compiled on 2026-09-23 from commit `da29ff0`.

**Sources:** `client/src/data/content.js` (almost all copy, including the Services page under `servicesPage`), the components in `client/src/components/` and `client/src/pages/`, `client/index.html` (home page meta and site-wide JSON-LD), `client/scripts/prerender.js` (Services page meta), and the server's lead routes and email templates.

**About this site:** two pages, the home page (`/`) and the Services page (`/services`). Any other path shows a 404 page. There's no CMS and no blog.

Quotes are copied exactly from the source. Items marked **⚠** still need your input.

---

## 1. Company & Positioning

| Item | Exact copy |
| --- | --- |
| Brand name | "Security Marketing Company" (the web manifest uses "SMC") |
| Tagline | "Growing security companies online." |
| Brand promise | "More visibility. Bigger contracts." |
| Home hero eyebrow | "B2B marketing for the US security industry" |
| Footer description | "A B2B digital marketing agency for US security companies. We market security companies — we do not provide security services." |
| JSON-LD description | "Digital marketing agency for US security companies — guard and patrol services, alarm installers, CCTV providers, access control and security systems integrators: website design, SEO and AI SEO, paid ads, social media, email marketing and lead generation, Google Business Profile management and CRM automation." |
| Positioning line (home hero) | "**One industry. One focus.** We market security companies — we never sell security." |

### Core value proposition

> "We help security companies generate qualified leads, improve online visibility, and build a digital presence that turns prospects into long-term clients." (Home hero)

> "Guard companies, alarm installers, CCTV providers and access control integrators each sell to different buyers. We build the websites, search visibility, advertising and follow-up that put you in front of them — and turn inquiries into signed work." (Services hero)

### Target audience

The target is US security companies of these kinds: guard and patrol services, alarm installers, CCTV and video surveillance providers, access control integrators, and security systems integrators. Cybersecurity firms are **not** included.

These are the 12 industries listed on the site. They appear in the "Industries we serve / Security Companies We Help" grid on both pages and in the ticker band on the home page.

- Security Guard Services
- Armed & Unarmed Security
- Mobile Patrol
- Event Security
- Construction Site Security
- Retail & Commercial Security
- HOA & Residential Security
- Healthcare Security
- Alarm Installation & Monitoring
- CCTV & Video Surveillance
- Access Control
- Security Systems Integration

### Differentiators (home page, "Why Security Companies Choose Us")

Lead: "Most agencies learn your industry on your budget. We built the whole practice around it."

1. **We know the security industry.** "Licensing, guard-service margins, install versus monitoring — we start from there, not from scratch."
2. **We speak your clients' language.** "Facilities managers, property owners and IT directors each buy differently. We write for each."
3. **Built around lead generation.** "We build around booked surveys and signed contracts — and report on those, not traffic." (This was titled "Proven lead generation". It was retitled because nothing on the site backs up "proven".)
4. **Specialists, not generalists.** "No three months of guessing at your market. We start with a clear view of it."

Side panel: "**One industry. One focus.** We work only with companies that protect people and property — and we never compete with our clients for their work."

---

## 2. Services & Offerings

All seven services appear on the home page (as cards that link through to the Services page) and on `/services` (as full blocks). They're defined in `SERVICES` in `content.js`.

| # | Service | Outcome line | Services page anchor |
| --- | --- | --- | --- |
| 01 | Website Design & Development | "Turn Your Website Into a Lead-Generating Asset" | `/services#website` |
| 02 | SEO & AI SEO | "Get Found on Google and AI Search" | `/services#seo` |
| 03 | Paid Ads | "Put Your Security Services in Front of High-Intent Buyers" | `/services#paid-ads` |
| 04 | Social Media Marketing | "Build a Security Brand People Remember and Trust" | `/services#social-media` |
| 05 | Email Marketing & Lead Generation | "Turn Marketing Attention Into Real Opportunities" | `/services#email-marketing` |
| 06 | Google Business Profile Management | "Improve Your Local Visibility on Google" | `/services#google-business-profile` |
| 07 | CRM Automation | "Stop Losing Leads After They Contact You" | `/services#crm-automation` |

### Service detail (Services page)

Each block has a problem statement, what's included, who it's best for, a pricing line and a "Book Strategy Call" button.

**Website Design & Development**
- *Problem:* "Most security company websites list services and a phone number, then stop. A property manager comparing three guard companies, or a business owner pricing a camera system, leaves without a reason to call — or an easy way to ask for a quote."
- *Included:*
  - Custom design built around your services and service area
  - Service and city pages written for how your buyers search
  - Quote, site survey and consultation forms on every key page
  - Licenses, certifications and insurance shown where buyers look for them
  - Fast, mobile-first build you can update in-house
  - Call and form tracking so every inquiry is counted
- *Best for:* "Companies whose current site is outdated, slow on mobile or not producing inquiries — whether you sell guard contracts or residential and commercial installs."

**SEO & AI SEO**
- *Problem:* "When a facilities manager searches "security guard company near me" or a homeowner asks an AI assistant for an alarm installer, the shortlist is set before anyone visits a website. If you are not in the top results or the answer, you are not in the running."
- *Included:*
  - Technical SEO audit and fixes
  - Keyword research by service and city
  - Service-area pages for each city and county you cover
  - Content structured to be cited by AI search tools such as Google AI Overviews and ChatGPT
  - Local citations and security industry directory listings
  - Monthly ranking and inquiry reporting
- *Best for:* "Guard and patrol companies competing for commercial contracts in a defined metro area, and installers who want steady inbound calls without paying for every click."

**Paid Ads**
- *Problem:* "SEO takes time to build. Buyers with an urgent need — a break-in, a new site opening, a failed inspection — search today and call whoever shows up first."
- *Included:*
  - Google Search Ads, plus Local Services Ads where your category qualifies
  - Campaigns split by service, city and buyer type
  - Negative keywords that filter out job seekers and DIY searches
  - A dedicated landing page for each campaign
  - Call and form conversion tracking
  - Monthly spend, cost-per-lead and inquiry reporting
- *Best for:* "Alarm and CCTV installers who want residential or commercial installs this quarter, and guard companies bidding on contracts in markets where they have little organic visibility."

**Social Media Marketing**
- *Problem:* "Commercial buyers check you out before they call back. A dormant LinkedIn page or a Facebook feed last updated two years ago makes a company look smaller and less reliable than it is."
- *Included:*
  - Profile setup and cleanup on LinkedIn, Facebook and Instagram
  - A monthly content calendar built around your services and projects
  - Posts that show your licensing, training, installs and team
  - Recruiting posts to help fill open officer and technician roles
  - Comment and message monitoring
  - Monthly engagement reporting
- *Best for:* "Companies selling to commercial and HOA buyers who research vendors before shortlisting, and guard companies that also recruit officers online."

**Email Marketing & Lead Generation**
- *Problem:* "Security contracts have long buying cycles. A property manager may not switch providers until the current contract ends, and an inquiry that goes quiet today can still become a job next year — if you stay in touch."
- *Included:*
  - Lead magnets such as security checklists and assessment offers
  - Nurture sequences for commercial and residential prospects
  - Regular newsletters to past inquiries and current clients
  - Targeted outbound campaigns to commercial prospects
  - List setup, segmentation and CAN-SPAM compliant templates
  - Open, click and reply reporting
- *Best for:* "Guard companies targeting property managers, facilities directors and general contractors, and integrators with a long commercial sales cycle."

**Google Business Profile Management**
- *Problem:* "For "near me" searches, the map results appear above the websites. An incomplete profile, the wrong service area or a run of unanswered reviews is enough to keep you out of them."
- *Included:*
  - Profile audit, verification support and full setup
  - Categories, services and service areas configured correctly
  - Weekly posts and photo updates
  - A review request process and review responses
  - Monitoring for unwanted edits and spam competitor listings
  - Monthly reporting on calls, direction requests and profile views
- *Best for:* "Any security company that serves a local area — especially alarm and CCTV installers and mobile patrol companies that win work from "near me" searches."

**CRM Automation**
- *Problem:* "Inquiries arrive by phone, form and email, often after hours. Without a system, follow-up depends on whoever picks it up — and a lead that waits a day for a reply has usually called someone else."
- *Included:*
  - CRM selection and setup, or cleanup of the one you already use
  - Every web form, call and ad lead routed into one pipeline
  - Instant text and email replies to new inquiries
  - Automated follow-up reminders for quotes and site surveys
  - Pipeline stages from first inquiry to signed contract
  - Reporting on lead source, response time and close rate
- *Best for:* "Companies already getting inquiries but losing track of them, and installers and integrators managing many open quotes at once."

> **⚠ Check the deliverables.** These inclusion lists are new copy written from the service names. Make sure each item matches what you actually deliver, particularly "Weekly posts", "Instant text and email replies" and "Local Services Ads where your category qualifies".

### Pricing

Every block shows **"Pricing: Custom quote"**, with the note "Scoped to your services and service area on a strategy call." To publish prices, set `servicesPage.pricing.showPrices` to `true` and add a price per service; each one then shows as "Starting at $X".

### Guarantees / trials

None. The softer commitments are:
- "no obligation" (contact section and the Services page CTA)
- "No padded retainers, no month-three surprises." (home Process section; this replaces "No retainer theatre")
- "We reply the same business day. Your details are never sold or shared." (form note)

### Process

**Home page:** "Audit. Strategy. Build. Grow."
- Lead: "A straight line from where your marketing sits today to a pipeline you can forecast against. No padded retainers, no month-three surprises."
- Steps: Audit, Strategy, Build and Grow, with the same copy as before.

**Services page:** "Audit. Strategy. Launch. Optimize. Report."
- Lead: "The same five steps for every engagement, whether we are building one website or running your whole marketing program."
- Steps 1–4 reuse the home page step copy.
- Step 5, Report: "Monthly reports tie our work to inquiries, booked surveys and signed contracts — not traffic alone."

### FAQ (Services page)

1. **"Do you require a long-term contract?"** "Terms depend on the work. A website build is scoped as a project; ongoing services such as SEO, paid ads and Google Business Profile management run on an agreed monthly basis. The term, scope and notice period are set out in writing before any work starts."
2. **"How long before we see results?"** "It depends on the channel. Paid ads can produce inquiries soon after launch. Google Business Profile improvements often show within the first few months. SEO builds over a longer period, depending on your market and competition. We set expectations for each channel after the audit."
3. **"Do you work with small or regional security companies?"** "Yes. Many security companies serve one metro area or a handful of counties, and local SEO, Google Business Profile and service-area pages are built for exactly that. Each engagement is scoped to your size and the areas you cover."
4. **"Do you only work with guard companies?"** "No. We work with guard and patrol companies and with alarm, CCTV, access control and systems integration firms. Their buyers differ — service contracts versus residential and commercial installs — so the strategy does too."
5. **"What do you need from us?"** "A kickoff call; access to your website, Google Business Profile, ad accounts and analytics; and details of your licenses, service areas and the work you want more of. After that, a quick review of key pages and campaigns before they go live, and a monthly check-in."
6. **"How do you report on results?"** "A monthly report built around inquiries: calls, form submissions, booked surveys and where each one came from. Traffic and rankings are included for context, but the focus is the leads that turn into contracts."

> **⚠ Confirm answers 1, 3 and 5.** They describe how you engage clients (monthly terms, taking on small firms, the kickoff process). Check them against how you actually sell before launch.

---

## 3. Messaging & Copy Assets

### Headlines by section

| Page / section | Label | Headline | Lead |
| --- | --- | --- | --- |
| Home hero | "B2B marketing for the US security industry" | "Marketing Built to Help Security Companies **Win More Contracts**" | See §1 |
| Home industries | "Industries we serve" | "Security Companies We Help" | none |
| Home services | "What we do" | "Marketing Services Built for Security Companies" | "From your website and Google visibility to paid advertising, lead generation and automated follow-up, we build the digital systems security companies need to generate consistent opportunities and grow." |
| Home band | none | "More visibility. *Bigger contracts.*" | Service and industry tickers |
| Home feature 1 | "Get found first" | "Own the search your buyers already make" | "Buyers search for a guard company in their city or an alarm installer who can be on site this week. That contest is settled in the top three results and the map pack." |
| Home feature 2 | "Sites that sell" | "A site built to book the survey" | "Your website has one job: give a buyer who has never heard of you the confidence to ask for a quote." |
| Home Why Us | "Why us" | "Why Security Companies Choose Us" | See §1 |
| Home process | "How it works" | "Audit. Strategy. Build. Grow." | See §2 |
| Home contact | "Book a strategy call" | "Tell us what you want to win" | "Tell us the contracts you are chasing and the areas you cover. We will come back with a straight assessment of what it takes to win them — no obligation." |
| Services hero | "Services" | "Marketing Services for **US Security Companies**" | See §1 |
| Services process | "How we work" | "Audit. Strategy. Launch. Optimize. Report." | See §2 |
| Services FAQ | "FAQ" | "Questions security company owners ask us" | none |
| Services CTA | "Next step" | "Tell us what you want to win" | Same text as the home contact lead, plus "We reply the same business day." |
| 404 | "Error 404" | "Nothing on this page. **Plenty on the home page.**" | "The link may be old, or the address mistyped. Head back to the home page, see our services, or tell us what you were looking for at andy@securitymarketingcompany.com." |

**Feature bullet points:**
- Feature 1: "Map pack and local rankings, city by city" / "A service-area page for every city you cover" / "Reporting tied to inquiries, not keyword screenshots"
- Feature 2: "Licenses and certifications shown up front" / "Quote and survey requests on every service page" / "Fast, mobile-first and easy to update in-house"

### CTAs

| CTA text | Where it appears | Where it goes |
| --- | --- | --- |
| "Book Strategy Call" | Header (desktop and mobile menu, both pages), home hero, home services CTA card, home Feature 1, each Services page block, Services hero, Services closing CTA, 404 page | `/#contact` (a calendar link instead, once `COMPANY.calendarUrl` is set) |
| "View Services" | Home hero, second button | `/services` |
| "Learn more" | Each home service card | `/services#<service>` |
| "Start a Project" | Home Feature 2 | `/#contact` (or the calendar) |
| "Book Strategy Call" (submit) | Contact form | Submits the form |
| "Back to Home" | 404 page | `/` |

---

## 4. Social Proof

- **Testimonials, case studies, client logos:** none yet.
- **Stats row (under the home hero):** "10+" Security Companies Served · "500+" Leads Generated · "5+" Years Marketing Experience · "50+" Experienced Team. These are public claims; keep them accurate.
- **Example mockups:** these show a fictional firm, "Summit Guard Co." (`summitguardco.example`). Its example site reads "Licensed Security Officers Serving the Greater Dallas Area", with "Get a Quote", "Book a Site Survey" and "Licenses & Certifications". The search mockup shows the "security guard company near me" query against "Example Security LLC". Every window shows a visible **"Example illustration"** tag. The "Position 1" and "Top 3" claims are gone, and the floating card now reads "Sample report — Monthly inquiries" with no figure.

---

## 5. Contact & Business Info

| Item | As shown on the site |
| --- | --- |
| Business name | Security Marketing Company |
| Email | andy@securitymarketingcompany.com |
| Website | www.securitymarketingcompany.com |
| Named contact | "Andy" |
| Response time | "Same business day" |
| Phone | ⚠ Not set. Add it in `COMPANY.phone` and it will appear in the contact section and footer. |
| Calendar link | ⚠ Not set. Add it in `COMPANY.calendarUrl` and every "Book Strategy Call" button will open it. |
| Street address | Not shown (none provided) |

**Contact form fields:** "Your name" (required), "Company" (required), "Work email" (required), "Service interested in" (required), "What do you need?" (optional), plus a hidden honeypot field that catches spam bots.

**Service dropdown:** "Website Design & Development", "SEO & AI SEO", "Paid Ads", "Social Media Marketing", "Email Marketing & Lead Generation", "Google Business Profile Management", "CRM Automation", "Not sure yet". The server validates against this same list.

**Social links (footer icons and JSON-LD `sameAs`):**
- LinkedIn: https://www.linkedin.com/company/security-marketing-company/
- Instagram: https://www.instagram.com/securitymarketingcompany/
- Facebook: https://www.facebook.com/securitymarketingcompany/
- X and YouTube are set up but have no URLs, so they're hidden.

---

## 6. Site Structure

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, industries, service cards, promise band, local-search and website features, Why Us, process, contact form |
| `/services` | Services page: hero with a jump list, 7 service blocks with anchors, 5-step process, industries, FAQ, closing CTA |
| any other path | 404 page (returns a 404 status and `noindex, follow`) |

**Navigation** (header and footer "Company" column): Services (`/services`), Approach (`/#approach`), Why Us (`/#why-us`), How It Works (`/#process`), Contact (`/#contact`). The home-section links work from any page and scroll to the section once the home page loads.

**Footer "Services" column:** each service links to its block on `/services`.

**Blog / resources:** none.

---

## 7. Technical / SEO Metadata

| | Home (`/`) | Services (`/services`) |
| --- | --- | --- |
| Title | "Security Marketing Company — Marketing Built for Security Companies" | "Security Company Marketing Services \| Security Marketing Company" |
| Meta description | "Marketing for US security companies: websites, SEO & AI SEO, paid ads, social, lead generation, Google Business Profile and CRM automation to win more contracts." | "Websites, SEO & AI SEO, paid ads, Google Business Profile, social, email and CRM automation for US guard, alarm, CCTV and access control companies." |
| Canonical | https://www.securitymarketingcompany.com/ | https://www.securitymarketingcompany.com/services |
| OG / Twitter description | "More visibility. Bigger contracts. We grow security companies online." | Same as the meta description |
| Structured data | `ProfessionalService`, areaServed United States, `sameAs` social profiles | Plus 7 `Service` entries, each with areaServed United States |

The Services page meta is written into `dist/services.html` at build time, so it's present on a direct load, including for crawlers and link previews that don't run JavaScript.

**Crawling:** `/robots.txt` allows everything except `/api/` and points to `/sitemap.xml`. The sitemap is generated at build time and lists `/` and `/services`.

---

## Checklist Status (the 13 items from the first audit)

| # | Item | Status |
| --- | --- | --- |
| 1 | Social URLs empty | **Done.** LinkedIn, Instagram and Facebook are live. X and YouTube stay hidden until they have URLs. |
| 2 | No testimonials, case studies, logos or ratings | **Still open.** Needs real, cleared proof. |
| 3 | The four stats need checking | **Changed.** Restored at your request: 10+, 500+, 5+ and 50+. The last label is now "Experienced Team" (Title Case, like the others). Make sure all four stay accurate. |
| 4 | Fictional "Northgate" mockups with UK domains | **Done.** Replaced with "Summit Guard Co." on a `.example` domain, with a visible "Example illustration" tag and no ranking claims. |
| 5 | ICP left out electronic security | **Done.** Industries now include alarm, CCTV, access control and systems integration (12 in total). |
| 6 | US market not reflected | **Done.** US English throughout ("inquiries", "city by city", "guard-service margins"), a Dallas example, `areaServed` set to United States, and "US" in the eyebrow and meta. |
| 7 | No pricing, tiers or guarantees | **Changed.** "Custom quote" shows on every service block, and the pricing config is ready for "Starting at $X". There are still no tiers or guarantees, by design. |
| 8 | No phone, address or calendar link | **Changed.** The site now supports a phone number and calendar link. Both are still open until you provide them. |
| 9 | Services had no descriptions or deliverables | **Done.** The Services page has a problem, 6 inclusions and a "best for" line per service. Please review them (see §2). |
| 10 | Unused "See What We Do" CTA | **Done.** Now shown as "View Services", linking to `/services`. |
| 11 | "protect people, property and data" | **Done.** Now "protect people and property" (cybersecurity isn't targeted). |
| 12 | "GMB Management" vs "Google Business Profile" | **Done.** "Google Business Profile" is used everywhere, including the form, the server validation and the anchors. |
| 13 | README contact form section outdated | **Done.** The README now lists the current services, the `/services` route, hosting, and where each piece of copy lives. |
