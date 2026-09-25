# Security Marketing Company: Site Content Summary

Updated on 2026-09-26 for the expanded service page copy (problem, why it matters, what's included, what to expect), the service page graphics, the header Services dropdown and Google Analytics. Earlier update: 2026-09-24, for the US retargeting, the Services page and the individual service pages. The first version was compiled on 2026-09-23 from commit `da29ff0`.

**Sources:** `client/src/data/content.js` (almost all copy: every service and its detail page under `services`, the overview under `servicesPage`), the components in `client/src/components/` and `client/src/pages/`, `client/index.html` (home page meta and site-wide JSON-LD), `client/scripts/prerender.js` (meta for `/services` and each service page), and the server's lead routes and email templates.

**About this site:** the home page (`/`), the Services overview (`/services`) and one detail page per service (`/services/:slug`, 7 in total). Any other path, including an unknown service slug, shows a 404 page. There's no CMS and no blog.

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

All seven services are defined once, in the `services` array in `content.js`. That array feeds the home page cards (each links to its detail page), the `/services` overview blocks (each has a "Learn more" link and an anchor at `/services#slug`), the detail pages, the footer, the band ticker and the contact form dropdown.

| # | Service | Short description (cards) | Detail page |
| --- | --- | --- | --- |
| 01 | Website Design & Development | "Turn Your Website Into a Lead-Generating Asset" | `/services/website` |
| 02 | SEO & AI SEO | "Get Found on Google and AI Search" | `/services/seo` |
| 03 | Paid Ads | "Put Your Security Services in Front of High-Intent Buyers" | `/services/paid-ads` |
| 04 | Social Media Marketing | "Build a Security Brand People Remember and Trust" | `/services/social-media` |
| 05 | Email Marketing & Lead Generation | "Turn Marketing Attention Into Real Opportunities" | `/services/email-marketing` |
| 06 | Google Business Profile Management | "Improve Your Local Visibility on Google" | `/services/google-business-profile` |
| 07 | CRM Automation | "Stop Losing Leads After They Contact You" | `/services/crm-automation` |

### Service detail pages (`/services/:slug`)

Every detail page uses one template, in this order: breadcrumb (Home / Services / {Service}), hero (H1, subheadline, "Book Strategy Call" and "View All Services", with the service's illustration on the right, or below the copy on phones and tablets), the problem (2–3 paragraphs), why it matters for security companies (4 cards, one per type of security company), what's included (6 cards, each with an icon), how it works (numbered steps on a connecting line), what to expect (first month / months 2–3 / ongoing), what you get (deliverables plus pricing), best for, proof (**hidden**: no real testimonials or results have been supplied), FAQ (accordion), related services (cards), closing CTA. Any section a service has no data for is left out.

Shared section headings (from `serviceDetail`): "Why it matters" / "Why it matters for security companies"; "What’s included" / "Everything in the service"; "How it works" / "How we deliver it"; "What to expect" / "The first months, step by step", with the lead "The work we do in each phase. Exact timing depends on your starting point and scope, and is confirmed on the strategy call."; "What you get" / "What you receive"; "Best for" / "Who this service suits"; "FAQ" / "Common questions"; "Related services" / "Often paired with". The closing CTA reuses the overview's "Tell us what you want to win" card.

On the `/services` overview, each block shows the name, short description, "Learn more" link, the first problem paragraph, best-for list, the included titles, the pricing line and "Book Strategy Call".

### Service page graphics

Each hero has an illustration built in markup, in the same style as the home page mockups. Every window carries the visible "Example illustration" tag. The companies are fictional (Summit Guard Co., Ridgeline Alarm & Video, Keystone Access Systems, all on `.example` domains), and no graphic shows a ranking position, rating, count or any other result figure.

| Service | Graphic | Text shown |
| --- | --- | --- |
| Website | Security company homepage (the home page mockup) + "Sample report" card | "Summit Guard Co.", "Licensed Security Officers Serving the Greater Dallas Area", "Book a Site Survey"; card "Quote requests" |
| SEO & AI SEO | Search results for "security guard company near me" with the example listing near the top (the home page mockup) + "Sample report" card | Card "Search inquiries" |
| Paid Ads | Sponsored search result + "Sample dashboard" campaign card | "Commercial Access Control Installation \| Keystone Access Systems", sitelinks "Request a Quote", "Card & Mobile Access", "Service Areas"; campaigns "Search · Access control", "Search · Video surveillance", "Local Services Ads", each "Active" |
| Social Media | Company feed with two posts | "Summit Guard Co.", "Site team briefing", "Now hiring — Licensed Security Officers", "Apply now" |
| Email Marketing | Inbox + "Nurture sequence" card | Subjects "Your site security checklist", "What a site survey covers", "Quarterly security update"; "Book a Site Survey"; sequence "Day 0 Thanks for your inquiry", "Day 3 Site security checklist", "Day 10 Ready for a site survey?" |
| Google Business Profile | Map results + Business Profile with reviews | Search "alarm installer near me", "Ridgeline Alarm & Video", "Security system installer", Call / Directions / Website, star shapes (no rating), "Response from the owner" |
| CRM Automation | Pipeline board + "Automated text reply" card | Stages "New inquiry", "Contacted", "Survey booked", "Proposal sent"; sources "Web form", "Missed call", "Ad lead", "Referral", "Call"; text "Thanks for contacting Ridgeline Alarm & Video. We received your request and will call you to schedule a site survey." |

#### Website Design & Development — `/services/website`

- **H1:** "Website Design & Development for Security Companies"
- **Subheadline:** "A fast, credible website built to turn property managers, business owners and homeowners into quote requests — not a brochure with a phone number."
- **Hero graphic:** see "Service page graphics" above
- **Problem — Your website is where buyers decide whether to call:**
  - "Most security company websites list services and a phone number, then stop. A property manager comparing three guard companies, or a business owner pricing a camera system, leaves without a reason to call — or an easy way to ask for a quote."
  - "Buyers rarely tell you why they chose someone else. The company whose site looked current, explained the service clearly and made the next step obvious simply got the call. For a guard company, that is a lost bid. For an alarm or CCTV installer, it is an install that went to a competitor."
  - "Referrals check your website too. An outdated or slow site can undo a strong recommendation before the first conversation starts."
- **Why it matters for security companies:**
  - **Guard services — Commercial bids start with a website check:** Property managers and facilities directors usually look at a guard company’s site before inviting it to bid. Clear service pages, licensing and the types of posts you staff help you make the shortlist instead of being screened out.
  - **Alarm & CCTV installers — Residential buyers compare quickly:** Homeowners and small business owners often check several installers in one sitting. A site that explains packages, monitoring and the install process plainly gives them a reason to request your quote first.
  - **Access control & integrators — Complex systems need clear explanations:** Access control, video management and integration projects involve IT, facilities and management. A dedicated page for each system type helps every stakeholder find what they need and shows you have done this work before.
  - **Every security company — Your site supports every other channel:** Ads, search, social posts and referrals all send buyers to your website. If the site does not turn visitors into inquiries, every other marketing dollar has to work harder.
- **What's included:**
  - **Custom design** — Built around your services, your service area and your brand — not a generic template. The layout is planned for the buyers you sell to, whether that is a facilities director reviewing vendors or a homeowner comparing alarm companies. Every page ends with a clear next step.
  - **Service and city pages** — A page for each service you sell and each area you cover, written for how your buyers search. Guard services, patrol, alarm monitoring, video surveillance and access control each get their own explanation instead of sharing one list. The same pages give search engines something specific to rank.
  - **Quote and survey forms** — Quote, site survey and consultation requests on every key page, so a ready buyer never has to hunt for the next step. Forms ask for the details your team needs to respond, such as property type and service needed, without becoming a chore to fill in.
  - **Trust signals up front** — Licenses, certifications and insurance shown where commercial and residential buyers look for them. Industry memberships and the states you are licensed in can sit alongside them. For a buyer trusting you with their property, this is often what earns the call.
  - **Fast, mobile-first build** — Quick to load on a phone and easy for your team to update in-house. Many buyers first look you up on a phone, often between other tasks. The site stays fast and readable on any screen.
  - **Call and form tracking** — Every call and form submission is recorded, so you can see which pages produce inquiries. Tracking is set up in analytics from launch. That gives you a baseline to judge the site by and a clear view of what to improve next.
- **How it works:** 1. Discovery — We review your current site, your services, your service area and the buyers you want more of. 2. Structure and copy — We plan the pages and write the copy for each service and area, built around quote and survey requests. 3. Design and build — We design and build the site, set up forms and tracking, and share it with you for review. 4. Launch — We launch, redirect your old URLs so existing search visibility carries over, and test every form and call path.
- **What to expect:**
  - **First month — Discovery and planning:** Review of your current site, services and service area; Page structure and sitemap agreed with you; Copy drafted for the key service pages.
  - **Months 2–3 — Design, build and launch:** Design and build, with review rounds; Forms, call tracking and analytics set up; Launch, redirects and a test of every form and call path.
  - **Ongoing — Support and improvement:** Page updates as your services change; Review of which pages produce inquiries; Recommendations for new service or city pages.
- **What you get:**
  - A custom, mobile-first website on your domain
  - Service and service-area pages with written copy
  - Quote, survey and consultation forms connected to your inbox or CRM
  - Call and form tracking set up in analytics
  - Redirects from your old site’s URLs
  - A walkthrough so your team can update content in-house
- **Pricing:** "Custom quote"
- **Best for:**
  - Guard and patrol companies bidding on commercial contracts
  - Alarm and CCTV installers selling residential and commercial installs
  - Access control and systems integrators with complex service lines
  - Security companies whose current site is outdated, slow on mobile or not producing inquiries
- **FAQ:**
  - *Can you work with our existing website?* "Yes. After the audit we recommend either improving the site you have or rebuilding it, depending on its platform, speed and structure. Either way, the goal is the same: more quote and survey requests."
  - *Will we be able to edit the site ourselves?* "Yes. The site is built so your team can update text, photos and service pages without a developer, and we walk you through it at launch."
  - *Do you write the copy?* "Yes. We write the copy for every page from your services, licenses and service area. You review and approve it before launch."
  - *What happens to our current search rankings?* "We map your old URLs to the new pages and set up redirects, so the search visibility you already have carries over as far as possible."
  - *How do we know the site is working?* "Calls and form submissions are tracked from launch, so you can see how many inquiries the site produces and which pages they come from."
- **Related:** `/services/seo`, `/services/crm-automation`, `/services/paid-ads`
- **Proof:** none (section hidden)

#### SEO & AI SEO — `/services/seo`

- **H1:** "SEO & AI SEO for Security Companies"
- **Subheadline:** "Show up when facilities managers, property owners and homeowners search Google — or ask an AI assistant — for security services in your area."
- **Hero graphic:** see "Service page graphics" above
- **Problem — The shortlist is set before anyone visits your website:**
  - "When a facilities manager searches “security guard company near me” or a homeowner asks an AI assistant for an alarm installer, the shortlist is set before anyone visits a website. Buyers search by service and city, and the companies that show up for those searches get the calls."
  - "A competitor that appears above you does not need to be better at security. It only needs clearer service pages and a stronger presence in the cities you both cover. Over time, it collects the inquiries — and the contracts — that you never hear about."
  - "Relying on referrals alone ties growth to the people who already know you. Search reaches the buyers who do not, at the moment they are looking."
- **Why it matters for security companies:**
  - **Guard services — Commercial buyers search by city and service:** Facilities and property managers search for guard, patrol and event security in specific areas. A page for each service and city puts you in front of them while they are building a vendor list.
  - **Alarm & CCTV installers — Steady inquiries without paying per click:** Search visibility keeps bringing in installation and monitoring inquiries without a cost for every visit. It pairs well with paid ads, which can cover demand while search builds.
  - **Access control & integrators — Technical buyers research before they call:** IT and facilities teams often read in depth before contacting an integrator. Detailed content on systems, integrations and project types helps you show up in that research and answer their questions early.
  - **Every security company — AI assistants are a new shortlist:** More buyers now ask AI tools for recommendations. Clear, well-structured content makes it easier for those tools to understand what you do and where you do it.
- **What's included:**
  - **Technical SEO audit** — Site speed, indexing, structure and errors reviewed and fixed so search engines can crawl every page. Issues are ranked by impact, so the fixes that matter most happen first. You get a plain-English summary of what was found and what changed.
  - **Keyword research** — The searches your buyers actually use, mapped by service and by city. Commercial guard services, alarm monitoring and access control are searched for differently, so each gets its own targets. Terms that attract job seekers or DIY shoppers are flagged and left out.
  - **Service-area pages** — A dedicated page for each city and county you cover, so you can be found beyond your office address. Each page is written for that area and the services you offer there. They are built to be useful to a buyer, not copies with the city name swapped.
  - **AI search optimization** — Content structured to be understood and cited by AI search tools such as Google AI Overviews and ChatGPT. That means clear service descriptions, locations, licensing and direct answers to the questions buyers ask. The same clarity supports traditional search as well.
  - **Local citations** — Consistent business listings across local and security industry directories. Your name, address, phone number and services match everywhere they appear. Outdated or conflicting listings are found and corrected.
  - **Monthly reporting** — Rankings and traffic for context — and the inquiries search actually produces. Each report explains what was done that month and what comes next. You see how search contributes to calls and form submissions, not just visits.
- **How it works:** 1. Audit — We review your site’s technical health, your current rankings and the competitors that outrank you. 2. Plan — We map the searches to target by service and city, and plan the pages and content to win them. 3. Build — We fix technical issues, optimize existing pages and publish new service-area pages and content. 4. Grow — We keep publishing, build citations, track rankings and inquiries, and adjust the plan each month.
- **What to expect:**
  - **First month — Audit and plan:** Technical audit, with the most pressing fixes made first; Keyword and competitor research by service and city; A page and content plan agreed with you.
  - **Months 2–3 — Build the foundation:** Existing service pages optimized; First service-area pages published; Citations built and conflicting listings corrected.
  - **Ongoing — Publish, track and adjust:** New pages and content each month; Rankings, traffic and inquiries tracked; The plan adjusted to what the data shows.
- **What you get:**
  - Technical SEO fixes on your site
  - New and optimized service and service-area pages
  - Ongoing content aimed at your target searches
  - Local and security industry directory citations
  - A monthly report on rankings, traffic and inquiries
- **Pricing:** "Custom quote"
- **Best for:**
  - Guard and patrol companies competing for commercial contracts in a defined metro area
  - Alarm and CCTV installers who want steady inbound calls without paying for every click
  - Access control and systems integrators targeting commercial and facilities buyers
  - Security companies expanding into new cities or counties
- **FAQ:**
  - *How long does SEO take to work?* "SEO builds over months rather than weeks, and the pace depends on your market, your competitors and the state of your current site. We set expectations for your market after the audit, and paid ads can cover the gap in the meantime."
  - *What is AI SEO?* "More buyers now ask AI tools such as Google AI Overviews and ChatGPT for recommendations. AI SEO structures your content — clear service descriptions, locations, licensing and answers to common questions — so those tools can understand it and cite it."
  - *Can you help us rank in cities where we do not have an office?* "Service-area pages help you appear in searches for the cities and counties you serve, though map results favor your business address. We set out what is realistic for each area in the plan."
  - *Do you guarantee first-page rankings?* "No. No one controls Google’s rankings, and a guarantee is a warning sign. We commit to the work, report on it openly every month and focus on the inquiries search produces."
  - *How is SEO reported?* "A monthly report covering rankings for your target searches, traffic, and the calls and form submissions that came from search."
- **Related:** `/services/google-business-profile`, `/services/website`, `/services/paid-ads`
- **Proof:** none (section hidden)

#### Paid Ads — `/services/paid-ads`

- **H1:** "Paid Ads for Security Companies"
- **Subheadline:** "Reach buyers who are searching right now, with campaigns built around your services, your service area and your cost per lead."
- **Hero graphic:** see "Service page graphics" above
- **Problem — Urgent buyers call whoever shows up first:**
  - "SEO takes time to build. Buyers with an urgent need — a break-in, a new site opening, a failed inspection — search today and call whoever shows up first."
  - "Without careful targeting, security ads also attract job seekers looking for guard positions and DIY shoppers pricing cameras. Those are clicks you pay for that never turn into work, and they can use up a day’s budget before a real buyer searches."
  - "Many security companies try ads once, watch the budget disappear and decide ads do not work for them. Usually the problem is the setup: broad keywords, one generic landing page and no way to tell which clicks became calls."
- **Why it matters for security companies:**
  - **Guard services — Reach buyers with an urgent need:** Break-ins, new construction sites and upcoming events often need coverage quickly. Ads put your company in front of those buyers while they are still deciding who to call.
  - **Alarm & CCTV installers — Keep the install calendar full:** Installation work can be seasonal and uneven. Ads let you turn spend up when your technicians have capacity and down when they are booked.
  - **Access control & integrators — Target commercial projects precisely:** Campaigns can focus on specific systems, building types and areas, rather than broad security terms that attract homeowners and DIY buyers.
  - **Every security company — Test a new service or market:** Entering a new city or launching a new service? Ads show how buyers respond before you invest in longer-term channels such as SEO.
- **What's included:**
  - **Google Search Ads** — Campaigns targeting the searches buyers use when they need security services now. Ads are written for each service and area, with clear calls to action for quotes and site surveys. Ad schedules can follow the hours your team answers the phone.
  - **Local Services Ads** — Setup and management of Google Local Services Ads where your category and location qualify. We work through the profile, service areas and verification steps with you. Leads are reviewed, and ones that do not qualify can be disputed where Google allows it.
  - **Campaign structure** — Campaigns split by service, city and buyer type, so budget goes where the work is. Commercial guard services and residential alarm installs never compete for the same budget. You can raise or lower spend on each line of business separately.
  - **Negative keywords** — Filters that keep out job seekers, DIY searches and other clicks that will not become customers. Terms such as “jobs”, “hiring” and “training” are excluded from the start. The list grows as we review what people actually searched for.
  - **Landing pages** — A dedicated page for each campaign, built to turn a click into a call or quote request. The page matches the ad the buyer clicked, so they land on exactly what they searched for. Calls and forms on it are tracked separately from your main website.
  - **Conversion tracking** — Calls and form submissions tracked back to the campaign and keyword that produced them. That shows which searches bring in inquiries and which only spend money. Budget decisions are made on inquiries, not clicks.
- **How it works:** 1. Audit — We review any existing ad accounts, your services and the areas you want to grow in. 2. Build — We set up campaigns, negative keywords, landing pages and conversion tracking. 3. Launch — Campaigns go live on a budget you approve. 4. Optimize — We review search terms, bids and landing pages regularly and shift spend toward what produces inquiries.
- **What to expect:**
  - **First month — Audit, build and launch:** Review of any existing ad accounts and past campaigns; Campaigns, negative keywords and landing pages built; Conversion tracking tested, then launch on a budget you approve.
  - **Months 2–3 — Learn and refine:** Search terms reviewed and negative keywords added; Bids and budget shifted toward searches that produce inquiries; Ad copy and landing page tests.
  - **Ongoing — Manage and report:** Regular search term and budget reviews; New campaigns for services or areas you add; A monthly report on spend, cost per lead and inquiries.
- **What you get:**
  - Managed Google Search campaigns, plus Local Services Ads where eligible
  - A landing page for each campaign
  - Call and form conversion tracking
  - Ongoing search term reviews and negative keyword updates
  - A monthly report on spend, cost per lead and inquiries
- **Pricing:** "Custom quote"
- **Best for:**
  - Alarm and CCTV installers who want residential or commercial installs this quarter
  - Guard companies bidding on contracts in markets where they have little organic visibility
  - Security companies launching a new service or entering a new city
  - Any security company that needs inquiries while SEO builds
- **FAQ:**
  - *How much should we spend on ads?* "It depends on your market, your services and how much new work you can take on. We recommend a starting budget after the audit, and you approve every budget before it is spent."
  - *Do you manage Google Local Services Ads?* "Yes, where your category and location are eligible. Local Services Ads appear above standard search ads and charge per lead rather than per click. We handle setup and ongoing management."
  - *How do you stop job seekers from clicking our ads?* "With careful keyword choice and negative keywords. Searches that include terms such as “jobs”, “hiring” or “salary” are excluded, and we review the search terms report regularly to catch new ones."
  - *How quickly can ads produce inquiries?* "Ads can start producing calls soon after launch because they do not depend on rankings. The first weeks show which searches and areas convert, and the campaigns are refined from there."
  - *How do we know what we are getting for the spend?* "Every call and form submission is tracked to the campaign that produced it, and the monthly report shows spend, cost per lead and the number of inquiries."
- **Related:** `/services/seo`, `/services/google-business-profile`, `/services/crm-automation`
- **Proof:** none (section hidden)

#### Social Media Marketing — `/services/social-media`

- **H1:** "Social Media Marketing for Security Companies"
- **Subheadline:** "Keep your LinkedIn, Facebook and Instagram active and credible, so buyers who look you up see a company worth calling back."
- **Hero graphic:** see "Service page graphics" above
- **Problem — Buyers check you out before they call back:**
  - "Commercial buyers check you out before they call back. A dormant LinkedIn page or a Facebook feed last updated two years ago makes a company look smaller and less reliable than it is."
  - "It matters most at the end of a sale. A property manager holding your proposal and a competitor’s may look both companies up before deciding. An active, professional presence will not win the contract on its own, but a neglected one can quietly cost it."
  - "For guard companies, social media does a second job: it is often where officer candidates first hear about you. Staffing decides which contracts you can take on, so recruiting reach matters too."
- **Why it matters for security companies:**
  - **Guard services — Credibility and recruiting in one place:** The same feed can show commercial buyers a professional operation and show candidates a company worth working for.
  - **Alarm & CCTV installers — Show the work, not just the product:** Photos of clean installs, tidy cable runs and well-placed cameras show homeowners and businesses the quality of your work before they request a quote.
  - **Access control & integrators — LinkedIn reaches the people who sign off:** Facilities directors, property managers and IT leads use LinkedIn. Regular project and expertise posts keep your company familiar to them between projects.
  - **Every security company — An active page answers an unasked question:** Buyers rarely ask whether you are still active or growing. A current, consistent presence answers it for them.
- **What's included:**
  - **Profile setup and cleanup** — Complete, consistent profiles on LinkedIn, Facebook and Instagram. Descriptions, service areas, contact details and branding match across every channel. Old or duplicate pages are identified so they can be merged or removed.
  - **Content calendar** — A monthly plan built around your services, projects and team. The mix is set for your buyers, from commercial credibility on LinkedIn to community content on Facebook. You see and approve the whole month before it runs.
  - **Credibility posts** — Posts that show your licensing, training, installs and people. Buyers see how you work rather than generic security tips. Photos and details from your team make these the strongest posts in the calendar.
  - **Recruiting posts** — Posts that help fill open officer and technician roles. They show what it is like to work for you, alongside the job details. Each one can link to your careers page or job board listing.
  - **Comment and message monitoring** — Comments and messages watched, with inquiries passed to your team. Questions from potential buyers do not sit in an inbox nobody checks. Anything sensitive is flagged to you rather than answered on your behalf.
  - **Engagement reporting** — A monthly view of reach and engagement across your channels. The report shows which topics and formats work best for your audience. The next month’s calendar is adjusted to match.
- **How it works:** 1. Audit — We review your current profiles, what competitors post and who you want to reach. 2. Plan — We set the tone, content themes and a monthly calendar for your approval. 3. Publish — We create and schedule posts, using photos and details you share from the field. 4. Report — We report on reach and engagement each month and adjust the plan.
- **What to expect:**
  - **First month — Audit and setup:** Review of your current profiles and competitor activity; Profiles cleaned up and made consistent; Tone, content themes and the first monthly calendar agreed.
  - **Months 2–3 — Publish and learn:** Scheduled posts across your chosen channels; Recruiting posts for open roles; Comment and message monitoring in place.
  - **Ongoing — Refine:** Monthly calendars shaped by what works; Photos and updates from the field turned into posts; A monthly engagement report.
- **What you get:**
  - Updated LinkedIn, Facebook and Instagram profiles
  - A monthly content calendar for your approval
  - Scheduled posts across your channels
  - Recruiting posts for open roles
  - A monthly engagement report
- **Pricing:** "Custom quote"
- **Best for:**
  - Companies selling to commercial and HOA buyers who research vendors before shortlisting
  - Guard companies that also recruit officers online
  - Installers and integrators with project work worth showing
  - Security companies whose profiles have gone quiet
- **FAQ:**
  - *Which platforms should we be on?* "For most security companies: LinkedIn for commercial buyers and facilities managers, Facebook for residential and community audiences, and Instagram for project and team content. We recommend a mix based on who you sell to."
  - *Do we need to provide content?* "A little. Photos from the field, project details and team news make the strongest posts. We turn what you share into finished posts and fill the rest of the calendar ourselves."
  - *Do we approve posts before they go live?* "Yes. The monthly calendar is shared for your approval before anything is published."
  - *Can social media help with hiring?* "Yes. Recruiting posts for officer and technician roles are part of the service and can run alongside your job board listings."
  - *Will social media bring in contracts directly?* "Sometimes, but its main job is credibility: making sure a buyer who looks you up sees an active, professional company. Search and ads do more of the direct lead generation."
- **Related:** `/services/google-business-profile`, `/services/email-marketing`, `/services/website`
- **Proof:** none (section hidden)

#### Email Marketing & Lead Generation — `/services/email-marketing`

- **H1:** "Email Marketing & Lead Generation for Security Companies"
- **Subheadline:** "Stay in front of property managers, facilities directors and past inquiries through long buying cycles, so you are the first call when a contract comes up."
- **Hero graphic:** see "Service page graphics" above
- **Problem — Security contracts have long buying cycles:**
  - "A property manager may not switch guard providers until the current contract ends. A business owner who asked about cameras may wait for next quarter’s budget. An inquiry that goes quiet today can still become a job next year — if you stay in touch."
  - "Most security companies have a list of past inquiries and quotes that nobody follows up on. Sales time goes to the leads that are ready now, which makes sense, but the rest go cold and eventually call whoever reaches them when they are ready."
  - "Referrals and repeat work depend on staying in front of people too. Clients who hear from you regularly have a reason to remember your name when a colleague asks for a recommendation."
- **Why it matters for security companies:**
  - **Guard services — Be known before the contract comes up:** Guard contracts often renew on a fixed cycle. Regular, useful contact means you are already familiar when a property manager starts looking for a new provider.
  - **Alarm & CCTV installers — Turn open quotes into installs:** Many quotes that did not close were postponed rather than lost. A short follow-up sequence reopens the conversation without adding to your team’s workload.
  - **Access control & integrators — Support long commercial sales cycles:** Integration projects involve several decision makers and budget approvals. Well-timed, relevant emails keep your company in the conversation throughout.
  - **Every security company — Put an unused list to work:** Past inquiries, clients and contacts from events already know your name. Email is a simple, low-cost way to stay in touch with all of them.
- **What's included:**
  - **Lead magnets** — Offers such as security checklists and assessment requests that turn website visitors into contacts. They give a buyer who is not ready to call a reason to leave their details. Each one is written for a specific audience, such as property managers or retail owners.
  - **Nurture sequences** — Automated emails for commercial and residential prospects that move them toward a quote. Each sequence answers the questions buyers have at each stage, from what affects pricing to what a site survey involves. A sequence stops as soon as someone replies or books.
  - **Newsletters** — Regular updates to past inquiries and current clients. Content covers practical security topics, company news and seasonal reminders. It keeps your name in front of people between contracts.
  - **Outbound campaigns** — Targeted campaigns to commercial prospects such as property managers and general contractors. Messages are short, specific to the recipient’s industry and aimed at starting a conversation. Every campaign follows CAN-SPAM requirements.
  - **List setup and compliance** — List building, segmentation and CAN-SPAM compliant templates. Contacts are grouped by buyer type, service interest and stage. Unsubscribes are honored automatically, and sending health is monitored so your emails keep reaching inboxes.
  - **Reporting** — Open, click and reply reporting for every campaign. Replies and booked calls are tracked alongside the standard email metrics. What works feeds into the next round of subject lines, timing and targeting.
- **How it works:** 1. Audit — We review your existing contacts, your email tools and the buyers you want to reach. 2. Build — We set up lists, segments, templates and lead magnets. 3. Launch — Nurture sequences, newsletters and outbound campaigns go live after your approval. 4. Refine — We track opens, clicks and replies, and adjust subject lines, timing and targeting.
- **What to expect:**
  - **First month — Audit and setup:** Review of your existing contacts and email tools; Lists cleaned, segmented and made compliant; Lead magnets and first sequences drafted for your approval.
  - **Months 2–3 — Launch:** Nurture sequences switched on for new inquiries; First newsletters sent; Outbound campaigns started to an agreed target list.
  - **Ongoing — Refine:** Regular newsletters and new campaigns; Subject lines, timing and targeting adjusted; A monthly report on opens, clicks and replies.
- **What you get:**
  - Lead magnets and signup forms on your website
  - Automated nurture sequences
  - Regular newsletters
  - Targeted outbound campaigns to commercial prospects
  - A monthly report on opens, clicks and replies
- **Pricing:** "Custom quote"
- **Best for:**
  - Guard companies targeting property managers, facilities directors and general contractors
  - Integrators with a long commercial sales cycle
  - Alarm companies following up on past quotes and existing customers
  - Security companies with a contact list that is not being used
- **FAQ:**
  - *Is cold email allowed in the US?* "Commercial email is governed by the CAN-SPAM Act, which allows outreach to business contacts as long as messages are accurate, identify the sender, include a physical address and honor opt-outs. Every campaign we send is set up to meet those requirements."
  - *Where do the contacts come from?* "From your own inquiries and clients, from signups through lead magnets on your website and, for outbound campaigns, from targeted lists of commercial prospects in your service area."
  - *Which email platform do you use?* "We work with the platform you already have, or recommend one that fits your size and connects to your CRM."
  - *How often will emails go out?* "It depends on the audience. Nurture sequences run automatically after someone inquires, newsletters go out on a regular schedule, and outbound campaigns follow a plan agreed with you."
  - *Does this connect to our CRM?* "Yes. Contacts and replies can flow into your CRM so your team sees every conversation. It pairs naturally with CRM Automation."
- **Related:** `/services/crm-automation`, `/services/website`, `/services/social-media`
- **Proof:** none (section hidden)

#### Google Business Profile Management — `/services/google-business-profile`

- **H1:** "Google Business Profile Management for Security Companies"
- **Subheadline:** "Get into the map results for “near me” searches with a complete, active profile and a steady flow of reviews."
- **Hero graphic:** see "Service page graphics" above
- **Problem — The map results appear above the websites:**
  - "For “near me” searches, the map results appear above the websites. When a homeowner looks for an alarm installer or a business owner looks for mobile patrol, those few listings are often the only companies they consider."
  - "An incomplete profile, the wrong categories or service area, or a run of unanswered reviews is enough to keep you out of them. Meanwhile, competitors with active profiles — and sometimes spam listings with no real office — take the calls."
  - "Most profiles were set up once and never touched again. Recent photos, posts and review responses show buyers a company that is open for business and paying attention."
- **Why it matters for security companies:**
  - **Alarm & CCTV installers — Residential buyers start in the map results:** Homeowners looking for an alarm or camera system often search “near me” and call straight from the map listing, without visiting a website.
  - **Guard services — Patrol and site work is won locally:** Mobile patrol routes and local guard posts are won in a defined area. A complete profile with the right service area puts you in front of buyers there.
  - **Access control & integrators — Reviews reassure commercial buyers too:** Commercial buyers check reviews as well. Professional responses show how you treat clients, including when something goes wrong.
  - **Every security company — Often the first impression:** Many buyers see your profile before your website. Current photos, accurate hours and recent posts show a company that is active and reliable.
- **What's included:**
  - **Profile audit and setup** — A full review of your profile, with verification support and every field completed. Business details, hours, services and descriptions are checked for accuracy. Duplicate or outdated listings are found and resolved.
  - **Categories and service areas** — Primary and secondary categories, services and service areas configured correctly. Categories decide which searches you are eligible to appear for. Service areas are set to match where you actually work.
  - **Posts and photos** — Weekly posts and regular photo updates that keep the profile active. Posts cover services, projects, seasonal reminders and company news. Photos come from your team and your work, not stock libraries.
  - **Reviews** — A simple review request process for your team, plus responses to new reviews. Requests go out at a natural moment, such as after an install or a contract milestone. Every review, positive or negative, gets a professional reply.
  - **Profile monitoring** — Monitoring for unwanted edits and spam competitor listings. Anyone can suggest changes to your profile, and Google sometimes applies them without asking. We catch those changes and report listings that break Google’s guidelines.
  - **Reporting** — Monthly reporting on calls, direction requests and profile views. You can see how people find and use your profile. Each report notes what was done that month and what is planned next.
- **How it works:** 1. Audit — We review your profile, categories and reviews, and how you appear in map results against competitors. 2. Fix — We correct categories, services, service areas and business details, and complete every missing field. 3. Maintain — We publish posts and photos, respond to reviews and watch for unwanted edits. 4. Report — We report on calls, direction requests and profile views each month.
- **What to expect:**
  - **First month — Audit and fix:** Profile, categories and reviews compared with local competitors; Business details, categories and service areas corrected; Review request process set up with your team.
  - **Months 2–3 — Build activity:** Weekly posts and photo updates; A reply to every new review; Monitoring for edits and spam listings in place.
  - **Ongoing — Maintain and report:** Posts, photos and review replies continued; Spam listings reported when found; A monthly report on calls, direction requests and profile views.
- **What you get:**
  - A fully completed and verified Google Business Profile
  - Weekly posts and photo updates
  - A review request process and review responses
  - Ongoing monitoring for edits and spam listings
  - A monthly report on calls, direction requests and profile views
- **Pricing:** "Custom quote"
- **Best for:**
  - Alarm and CCTV installers who win work from “near me” searches
  - Mobile patrol companies serving a defined local area
  - Guard companies competing in a single metro area
  - Security companies with an incomplete or unmanaged profile
- **FAQ:**
  - *We already have a Google Business Profile. Why does it need managing?* "Most profiles are set up once and left alone. Categories, service areas, posts, photos and review responses all affect how often you appear in map results, and they need regular attention."
  - *Can you get us more reviews?* "We set up a simple way for your team to ask satisfied clients for a review at the right moment. We do not buy, write or incentivize reviews, which breaks Google’s rules."
  - *We work from a home office. Can we still show up?* "Yes. Service-area businesses can hide their address and list the areas they serve instead. We set this up so your profile follows Google’s guidelines."
  - *What if spam listings are outranking us?* "We monitor for spam and fake listings in your area and report them to Google when they break its guidelines."
  - *How does this relate to SEO?* "Your profile drives the map results; SEO drives the website results below them. The two support each other, and many security companies run both."
- **Related:** `/services/seo`, `/services/paid-ads`, `/services/website`
- **Proof:** none (section hidden)

#### CRM Automation — `/services/crm-automation`

- **H1:** "CRM Automation for Security Companies"
- **Subheadline:** "Capture every inquiry, reply instantly and follow up automatically, so leads you already paid for do not go to a competitor."
- **Hero graphic:** see "Service page graphics" above
- **Problem — A lead that waits a day has usually called someone else:**
  - "Inquiries arrive by phone, web form, email and ad platforms, often after hours or while your team is out on site. Without one system, follow-up depends on whoever happens to pick them up."
  - "Buyers with an urgent need contact several companies at once. The first to reply with a clear next step often books the site survey, and the rest end up chasing a job that is already gone."
  - "Open quotes and site surveys slip the same way. Without reminders, a proposal sent last month goes unchased — and nobody can say which marketing channel produced the work you actually won."
- **Why it matters for security companies:**
  - **Guard services — Bids have deadlines:** Proposals, site walk-throughs and bid deadlines are easy to lose in an inbox. A pipeline with reminders keeps every open opportunity moving.
  - **Alarm & CCTV installers — Speed wins residential jobs:** Homeowners and small businesses often contact several installers at once. An instant reply and a prompt follow-up keep you in the running.
  - **Access control & integrators — Many open quotes, many stakeholders:** Integration projects involve several contacts and long approval cycles. A CRM keeps every conversation and next step in one place.
  - **Every security company — Know what your marketing produces:** When every lead carries its source, you can see which channels lead to signed contracts and spend accordingly.
- **What's included:**
  - **CRM setup or cleanup** — Selection and setup of a CRM, or cleanup of the one you already use. Contacts are de-duplicated and organized, with fields for the details your team needs, such as property type and services requested. Nothing is changed without your sign-off.
  - **One pipeline** — Every web form, call and ad lead routed into a single pipeline. Your team works from one list instead of several inboxes and a notebook. Each lead carries its source, so you always know where it came from.
  - **Instant replies** — Automatic text and email replies the moment a new inquiry arrives, day or night. The message confirms the inquiry arrived and explains what happens next. Missed calls can trigger a text reply where your phone setup allows it.
  - **Follow-up reminders** — Automated reminders for open quotes and site surveys, so nothing slips. Tasks go to the right person with a due date. Leads that go quiet can move into an email nurture sequence.
  - **Pipeline stages** — Clear stages from first inquiry to signed contract. The stages match how your team sells, whether that involves site surveys, proposals or bid deadlines. Managers can see every open opportunity at a glance.
  - **Reporting** — Reporting on lead source, response time and close rate. You can see which channels produce signed contracts, not just inquiries. It also shows where leads stall, so the process can be fixed.
- **How it works:** 1. Audit — We map how inquiries reach you today and where they get lost. 2. Design — We design the pipeline stages, replies and follow-up rules around how your team sells. 3. Build — We set up the CRM, connect your forms, call tracking and ads, and build the automations. 4. Train and refine — We walk your team through it, then review response times and close rates and adjust.
- **What to expect:**
  - **First month — Audit and design:** A map of how inquiries reach you today; Pipeline stages and follow-up rules designed with your team; CRM selected, or your existing one cleaned up.
  - **Months 2–3 — Build and train:** Forms, call tracking and ad leads connected; Instant replies and reminders built and tested; Team walkthrough and go-live.
  - **Ongoing — Review and refine:** Response times and close rates reviewed; Automations adjusted as your process changes; A monthly report on lead source, response time and close rate.
- **What you get:**
  - A configured CRM with your pipeline stages
  - Forms, calls and ad leads connected to the pipeline
  - Automated text and email replies to new inquiries
  - Follow-up reminders for quotes and site surveys
  - A monthly report on lead source, response time and close rate
- **Pricing:** "Custom quote"
- **Best for:**
  - Security companies already getting inquiries but losing track of them
  - Installers and integrators managing many open quotes at once
  - Guard companies with long bid and proposal cycles
  - Teams where follow-up depends on one busy person
- **FAQ:**
  - *Which CRM do you use?* "We work with the CRM you already have where it can do the job, or recommend one that fits your team size and budget."
  - *Will automated replies feel impersonal?* "They are written in your voice and kept short: they confirm the inquiry arrived and tell the buyer what happens next. Your team still handles the real conversation."
  - *What about inquiries that arrive after hours?* "Automated replies go out immediately at any hour, and the inquiry is waiting in the pipeline for your team when they start work."
  - *Does this work with our phone system?* "In most cases. Call tracking numbers can log calls into the CRM, and missed calls can trigger a text reply. We confirm what is possible with your setup during the audit."
  - *What will we be able to see?* "Where each lead came from, how quickly it was answered, where it sits in the pipeline and which sources turn into signed contracts."
- **Related:** `/services/email-marketing`, `/services/website`, `/services/paid-ads`
- **Proof:** none (section hidden)

### Pricing

Each service has its own `pricing` string, shown on its overview block and its detail page under "Pricing" with the note "Scoped to your services and service area on a strategy call.". All seven are currently **"Custom quote"**. To publish a price, change that service's `pricing` to e.g. "Starting at $1,500/mo".

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
| "Book Strategy Call" | Header (desktop and mobile menu, every page), home hero, home services CTA card, home Feature 1, each overview block, overview hero, every detail page hero and pricing card, closing CTA on /services and every detail page, 404 page | `/#contact` (a calendar link instead, once `COMPANY.calendarUrl` is set) |
| "View Services" | Home hero, second button | `/services` |
| "Learn more" | Each home service card, each /services overview block, each related-service card | `/services/<slug>` |
| "View All Services" | Every detail page hero | `/services` |
| Breadcrumb "Home" / "Services" | Every detail page | `/` / `/services` |
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
| `/services` | Services overview: hero with a jump list, 7 service blocks with anchors and "Learn more" links, 5-step process, industries, FAQ, closing CTA |
| `/services/website` | Website Design & Development detail page |
| `/services/seo` | SEO & AI SEO detail page |
| `/services/paid-ads` | Paid Ads detail page |
| `/services/social-media` | Social Media Marketing detail page |
| `/services/email-marketing` | Email Marketing & Lead Generation detail page |
| `/services/google-business-profile` | Google Business Profile Management detail page |
| `/services/crm-automation` | CRM Automation detail page |
| any other path, including `/services/<unknown>` | 404 page (returns a 404 status and `noindex, follow`) |

**Header "Services" dropdown:** lists every service page (icon and name, current page highlighted) with "View all services" (`/services`) at the bottom. In the mobile menu it's an accordion, open by default on a service page.

**Navigation** (header and footer "Company" column): Services (`/services`), Approach (`/#approach`), Why Us (`/#why-us`), How It Works (`/#process`), Contact (`/#contact`). The home-section links work from any page and scroll to the section once the home page loads.

**Footer "Services" column:** the heading links to `/services`; each service links to its detail page.

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

**Service detail pages:** title format "{Service} for Security Companies | Security Marketing Company". Structured data: one `Service` (provider Security Marketing Company, areaServed United States) plus a `BreadcrumbList`.

| Page | Title | Meta description |
| --- | --- | --- |
| `/services/website` | "Website Design & Development for Security Companies | Security Marketing Company" | "Websites for US guard, alarm, CCTV and access control companies: service and city pages, quote forms, trust signals and call tracking built to win inquiries." |
| `/services/seo` | "SEO & AI SEO for Security Companies | Security Marketing Company" | "SEO and AI SEO for US security companies: service-area pages, technical fixes, citations and content that get guard, alarm and CCTV firms found in search." |
| `/services/paid-ads` | "Paid Ads for Security Companies | Security Marketing Company" | "Google Search and Local Services Ads for US security companies: campaigns by service and city, job-seeker filtering, landing pages and cost-per-lead reporting." |
| `/services/social-media` | "Social Media Marketing for Security Companies | Security Marketing Company" | "Social media for US security companies: LinkedIn, Facebook and Instagram content that builds credibility with commercial buyers and helps recruit officers." |
| `/services/email-marketing` | "Email Marketing & Lead Generation for Security Companies | Security Marketing Company" | "Email marketing for US security companies: lead magnets, nurture sequences, newsletters and CAN-SPAM compliant outbound campaigns to commercial buyers." |
| `/services/google-business-profile` | "Google Business Profile Management for Security Companies | Security Marketing Company" | "Google Business Profile management for US security companies: categories, service areas, posts, reviews and spam monitoring for “near me” map results." |
| `/services/crm-automation` | "CRM Automation for Security Companies | Security Marketing Company" | "CRM automation for US security companies: one pipeline for every inquiry, instant replies, quote follow-up reminders and response-time reporting." |

The meta for `/services` and every service page is written into static HTML at build time (`dist/services.html`, `dist/services/<slug>.html`), so it's present on a direct load, including for crawlers and link previews that don't run JavaScript. Several service titles run past 60 characters because the required format includes the full service name; search results may truncate them.

**Analytics:** Google Analytics 4, measurement ID `G-CBBT708R7T`. The tag is in the `<head>` of every page, including the prerendered HTML, but it only loads on securitymarketingcompany.com (with or without `www`). One `page_view` is sent per page, including in-app navigation. See the README for setup, and the GA admin setting that has to be switched off to avoid double counting.

**Crawling:** `/robots.txt` allows everything except `/api/` and points to `/sitemap.xml`. The sitemap is generated at build time and lists 9 URLs: `/`, `/services` and every service page.

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
