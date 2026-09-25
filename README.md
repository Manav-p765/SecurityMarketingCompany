# Security Marketing Company

Marketing site for **Security Marketing Company** — a B2B digital marketing agency for US security
companies: guard and patrol services, alarm installers, CCTV/video surveillance providers, access
control integrators and security systems integrators.

Pages: the home page (`/`), a Services overview (`/services`) and a detail page for each service
(`/services/:slug`, e.g. `/services/seo`). Anything else, including an unknown slug, shows a 404.

> **Positioning note for anyone editing copy:** we are the *marketing partner* for security
> companies. We do not provide guarding, installation, monitoring or cybersecurity services. Every
> line of copy on this site should read that way.

**Tagline:** Growing security companies online.
**Brand promise:** More visibility. Bigger contracts.

---

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite + React Router (`/`, `/services`, `/services/:slug`) |
| Analytics | Google Analytics 4 (gtag.js), production domain only — see "Google Analytics (GA4)" |
| Backend | Node + Express (contact-form endpoint) |
| Database | MongoDB via Mongoose (stores leads) |
| Styling | Hand-written CSS with brand tokens — no UI framework, no icon library |

---

## Project structure

```
securitymarketingcompany/
├── package.json              # Root scripts — runs client + server together
├── .env.example              # Copy to server/.env
├── client/                   # Vite + React app
│   ├── index.html            # Home page meta tags, fonts, site-wide JSON-LD
│   ├── vite.config.js        # Dev proxy: /api -> localhost:5000
│   ├── vercel.json           # cleanUrls: serves dist/services.html at /services
│   ├── scripts/prerender.js  # Post-build: writes dist/services.html and dist/404.html
│   ├── public/
│   │   ├── logo/             # ← LOGO FILES (see logo/README.md)
│   │   └── hero/             # ← OPTIONAL HERO PHOTO (see hero/README.md)
│   └── src/
│       ├── main.jsx          # Router + stylesheet import order
│       ├── App.jsx           # Routes and hash-link scrolling
│       ├── seo.js            # Page meta + Service/BreadcrumbList JSON-LD (app and prerender.js)
│       ├── data/content.js   # ← ALL SITE COPY. Edit text here, not in JSX.
│       ├── pages/
│       │   ├── HomePage.jsx      # Home section order
│       │   ├── ServicesPage.jsx  # /services: hero, service blocks, process, industries, FAQ, CTA
│       │   └── ServiceDetailPage.jsx # /services/:slug template (unknown slug → 404)
│       ├── components/
│       │   ├── Header.jsx Hero.jsx Stats.jsx Industries.jsx Services.jsx Band.jsx
│       │   ├── Feature.jsx   # Reusable split section: copy + tilted screen
│       │   ├── Mockups.jsx   # The tilted browser / search-results screens
│       │   ├── WhyUs.jsx Process.jsx Contact.jsx Footer.jsx NotFound.jsx
│       │   ├── Links.jsx     # StrategyCallLink (calendar or contact form) + helpers
│       │   ├── ServiceCard.jsx # Service card (home grid, related services)
│       │   ├── Faq.jsx       # Accessible FAQ accordion section
│       │   ├── CtaPanel.jsx  # Closing red CTA card (/services and detail pages)
│       │   └── Breadcrumb.jsx
│       │   └── Icons.jsx     # All inline SVG icons
│       ├── hooks/            # Scroll reveal, active-nav tracking, per-page meta tags
│       └── styles/
│           ├── tokens.css    # ← COLORS, TYPE SCALE, SPACING, TEXTURE VALUES
│           ├── base.css      # Reset, buttons, shared type, layout helpers
│           ├── texture.css   # ← CONTINUOUS PAGE FIELD. Read the note in it first.
│           ├── sections.css  # Header, hero, stats, industries, services, band, feature, why, process
│           ├── mockups.css   # Tilted screens and floating cards
│           ├── contact.css   # Contact form + footer
│           └── services-page.css # /services and /services/:slug
└── server/
    ├── src/index.js          # Express app
    ├── src/db.js             # Mongo connection
    ├── src/models/Lead.js    # Lead schema
    └── src/routes/leads.js   # POST /api/leads
```

---

## Running it

### 1. Prerequisites

- Node 20 or newer (React Router 7 requires it)
- MongoDB — a local `mongod`, or a free MongoDB Atlas cluster

### 2. Install

```bash
npm run install:all
```

### 3. Configure

```bash
cp .env.example server/.env
```

Then set `MONGODB_URI` in `server/.env`:

```
# Local
MONGODB_URI=mongodb://127.0.0.1:27017/security-marketing

# Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/security-marketing?retryWrites=true&w=majority
```

### 4. Develop

```bash
npm run dev
```

- Site: <http://localhost:5173>
- API: <http://localhost:5000>

Vite proxies `/api` to Express, so there is no CORS setup in development. Run them separately with
`npm run dev:client` / `npm run dev:server`.

### 5. Build and deploy

```bash
npm run build      # Builds client/dist
NODE_ENV=production npm start
```

In production Express serves `client/dist` and the API from the same origin — the simplest option,
one service.

**Routes on a direct load or refresh.** The build runs `client/scripts/prerender.js` after Vite. It
writes, from `content.js`:

- `dist/services.html` and `dist/services/<slug>.html` for every service — index.html with that
  page's title, description, canonical, Open Graph tags and JSON-LD (`Service`, plus
  `BreadcrumbList` on detail pages) swapped in;
- `dist/404.html`;
- `dist/sitemap.xml` — the home page, `/services` and every service page.

It also **fails the build** if the contact form options in `server/src/models/Lead.js` no longer match
the service names in `content.js`. `client/public/robots.txt` allows everything except `/api/` and
points to the sitemap. Then:

- **Express** serves `services.html` for `/services`, `services/<slug>.html` for each known slug
  (200) and `404.html` for anything else, including unknown slugs (404).
- **Vercel** serves the same files at `/services` and `/services/<slug>` through `cleanUrls` in
  `client/vercel.json`; an unknown slug has no file, so Vercel's `404.html` handling covers it.
- **Vite dev / preview** fall back to index.html; React Router then renders the right page, and
  `ServiceDetailPage` renders the 404 page for an unknown slug.

A new service needs no routing work — adding it to `services` creates its page, prerendered HTML and
sitemap entry. For a new *kind* of page, add a route in `App.jsx`, meta in `content.js`, and extend
`prerender.js` and the Express routes the same way.

#### Split hosting: frontend on Vercel, API on Render

The only backend work is the contact form (`POST /api/leads` into MongoDB), so the frontend can be
hosted as a static site.

1. **Database — MongoDB Atlas.** Create a free cluster and a database user. Under Network Access,
   allow `0.0.0.0/0` (Render's free plan has no fixed outbound IP). Copy the `mongodb+srv://…`
   connection string, with `/security-marketing` as the database name.
2. **API — Render.** New → Blueprint → select this repo; `render.yaml` sets up the service. Fill in
   `MONGODB_URI`, and leave `CORS_ORIGIN` as a placeholder until step 4. Once live, check
   `https://<service>.onrender.com/api/health` returns `"db":"connected"`.
3. **Frontend — Vercel.** Import the repo, set **Root Directory** to `client` (Vite is
   auto-detected). Add the environment variable `VITE_API_URL=https://<service>.onrender.com`, then
   deploy.
4. **Connect them.** Set `CORS_ORIGIN` on Render to the Vercel site's origin — and the custom domain
   once added, comma-separated, no trailing slash. Render redeploys on save.

#### Lead notification emails

Every submission is saved to MongoDB and emailed through [Resend](https://resend.com) (an HTTP
API — Render's free plan blocks SMTP, so Gmail/Nodemailer won't work there). A lead counts as
received if either succeeds, so a database outage doesn't lose leads.

1. Sign up at resend.com and create an API key.
2. On Render set `RESEND_API_KEY`, and `LEAD_NOTIFY_TO` to the inbox(es) that should get leads.
3. Until you verify a domain in Resend, the sender must stay `onboarding@resend.dev` and
   `LEAD_NOTIFY_TO` can only be the address you signed up to Resend with. Verify
   `securitymarketingcompany.com` (a few DNS records) to send from e.g.
   `leads@securitymarketingcompany.com` to any address, then update `LEAD_NOTIFY_FROM`.

Emails set Reply-To to the visitor, so replying goes straight to them.

Once `LEAD_NOTIFY_FROM` is on a verified domain, each visitor also gets a confirmation email ("your
request is in, Andy will reply the same business day") with a copy of what they sent. Their replies go
to `LEAD_REPLY_TO` (default `andy@securitymarketingcompany.com`). It sends after the form responds,
so a failure there never shows the visitor an error.

`VITE_API_URL` is baked in at build time, so redeploy Vercel after changing it. Vercel preview
deployments get their own URLs; add one to `CORS_ORIGIN` if you want to test the form there.

Render's free plan sleeps after 15 minutes idle and takes up to a minute to wake. The page pings
`/api/health` on load to wake it early, but a paid instance removes the delay entirely.

---

## Google Analytics (GA4)

Measurement ID **`G-CBBT708R7T`**. It lives in one place, `client/src/analytics.js`, together with
the list of production hostnames (`securitymarketingcompany.com` and
`www.securitymarketingcompany.com`).

**How the tag gets onto every page.** A small Vite plugin in `client/vite.config.js` writes the
Google tag snippet into the `<head>` of `index.html`, right after the charset and viewport tags.
`prerender.js` copies the built `index.html` for `/services`, every `/services/<slug>` and
`404.html`, so every page carries the snippet in its static HTML.

**Production only.** The snippet checks `window.location.hostname` first. On any other host
(localhost, `vite preview`, Vercel preview deployments on `*.vercel.app`, the Render URL) it returns
straight away: no `gtag.js` request, no `window.gtag`, and nothing sent. To add a domain, add it to
`GA_HOSTNAMES`.

**Page views in a single-page app.** The config call sets `send_page_view: false`, so the tag does
not count the first load by itself. `PageViews` in `client/src/App.jsx` sends one `page_view`
(`page_path`, `page_title`, `page_location`) on the first load and on every route change. It runs
after the page has set its title, so the title always matches the page. It only fires when the
path or query string changes. A jump to a section on the same page (`/#process` while on `/`) or a
click on the link to the page you are already on is not counted, and React StrictMode's double
effects in development cannot count a page twice.

**Required GA admin setting.** In GA4, go to Admin → Data streams → (the web stream) → Enhanced
measurement → Page views → Show advanced settings, and **turn off "Page changes based on browser
history events"**. While it is on, GA sends its own `page_view` on every route change *in addition
to* the app's, so every page after the first one is counted twice. Leave the other enhanced
measurement options (scrolls, outbound clicks and so on) as you like.

**Content Security Policy.** The site does not set one at the moment (no `helmet`, no `headers`
in `vercel.json`). If you add one, allow `https://www.googletagmanager.com` in `script-src` and
`https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com` in
`connect-src` and `img-src`. The inline snippet also needs a nonce or hash in `script-src`.

**Checking it.** Run `npm run build`, then confirm the snippet is in the `<head>` of
`client/dist/index.html`, `dist/services.html` and `dist/services/*.html`. On the live domain, open
DevTools → Network, filter on `collect`, and click through the site: each new page sends one
request with `en=page_view` (once the admin setting above is off). Google Tag Assistant
(tagassistant.google.com) or GA4 → Admin → DebugView show the same thing.

---

## Design system

### Colors

Defined once in `client/src/styles/tokens.css`. **Do not add colors outside this set.**

| Variable | Hex | Use |
| --- | --- | --- |
| `--security-black` | `#111111` | Primary — the gradient band, dark UI |
| `--security-red` | `#E31B23` | Accent — CTAs, highlights, active states |
| `--pure-white` | `#FFFFFF` | |
| `--dark-gray` | `#2B2B2B` | |
| `--medium-gray` | `#6B6B6B` | Body and secondary text |
| `--light-gray` | `#F3F4F6` | Reserved for light surfaces; currently unused (the page is one dark field) |
| `--border-gray` | `#E5E7EB` | Borders, dividers, cards |
| `--success-green` | `#16A34A` | Form success state only |
| `--warning-amber` | `#F59E0B` | Inline validation only |
| `--link-blue` | `#2563EB` | Inline text links on light sections only — **never buttons** |

`--ink-900` (`#0B0B0B`) is the base of the dark field, derived from the palette, not an addition to
it. On the dark contact column, inline links use brand red instead of blue — blue on near-black
fails contrast.

The black → red gradient runs full width in exactly one place: the accent band between Services and
the first Feature on the home page. The Services page closes with a red card instead. Keep it that way.

### Type

**Archivo** for display and headings, **Manrope** for body copy. Both load from Google Fonts in
`client/index.html`. Uppercase letter-spaced labels (`.label`) carry the brand sheet's lockup style.

### Background texture — and why sections have no edges

**The texture belongs to the page, not to each section.** `.page` (the wrapper in each file under `pages/`) carries one
continuous field for the whole document:

1. base ink color (`.page`)
2. particle field (`.page::before`, a tiled 620px pattern)
3. fine grain (`.page::after`, soft-light blended)

Sections then sit on that field **transparently**. This is the whole reason the boundaries between
them are seamless. Two rules keep it that way:

- **No section gets an opaque background-color.** An opaque fill covers the continuous field and
  puts a hard edge back at every boundary.
- **No section gets a vignette.** A per-section vignette darkens toward that section's own edges,
  so the boundary reads as a step even when both sides are the same color. There is deliberately
  no vignette token any more.

A section's only local treatment is `::before`, which must fade to fully transparent well before
the section edge:

- `.dark-field` — a soft red glow.
- `.light-wash` — a white lift plus a hairline grid, double-masked so neither reaches a boundary.
  This replaces the old opaque light-grey sections; it gives the same tonal change without an edge.

The gradient `.band` is feathered top and bottom with a `mask-image` for the same reason.

**Within `.dark-field`, each layer group must hold only backgrounds that share a size and repeat.**
Mixing a full-bleed gradient with a tiled one in a single `background-image` makes the
`background-size` / `background-repeat` lists cycle out of step, and the tile becomes visible as a
seam grid across the page.

### One section, one screen

`.section--screen` makes a section fill the viewport and center its content, so landing on it from
the nav shows the whole thing without scrolling. It uses `min-height`, so a short viewport degrades
to scrolling rather than clipping, and it is switched off below 1000px — a phone cannot hold a
section's worth of content in one screen, and forcing it would only shrink the type.

**This puts a hard budget on copy length.** At a 900px viewport each section has roughly 740px of
content height to work with. If you add a paragraph or a list item, re-check the section still
fits. The tightest ones are Why us and Contact.

The service cards are especially constrained: four sit in a single row on desktop, so `lead` must
stay one sentence and `body` two. Longer copy breaks the row.

### Section rhythm

Every section sits on the same continuous field. Variation comes from glow and wash intensity
rather than background swaps, which is what keeps it seamless:

`Hero (glow) → Stats (quiet) → Industries (glow) → Services (glow) → Band (gradient, feathered) → Approach (wash) → Build (quiet) → Why us (quiet) → Process (wash) → Contact (glow) → Footer (quiet)`

---

## The tilted screen mockups

`client/src/components/Mockups.jsx` holds two screens — a security firm's website and a search
results page — built in markup and CSS rather than dropped in as screenshots. They stay sharp at any
size and theme with the brand tokens.

**They are illustrative devices, not evidence.** The example firm ("Summit Guard Co.",
`summitguardco.example` — `.example` is a reserved domain) is fictional. Every window bar carries a
visible **"Example illustration"** tag, and the floating card reads "Sample report" with no figure, so
nothing can be read as a claim about our results. If you replace them with real screenshots or
client data, make sure you have permission and that the figures are accurate.

Tilt angles are CSS custom properties on `.tilt` (`--tilt-x/y/z`), with `.tilt--right` and
`.tilt--flat` variants. Perspective is switched off below 900px, where it costs legibility.

**Service page graphics.** `client/src/components/ServiceGraphics.jsx` holds one hero graphic per
service, keyed by slug and styled in `mockups.css`. Website and SEO reuse the two home page
mockups. The others are a search ad with a campaign card (Paid Ads), a company feed (Social), an
inbox with a nurture sequence (Email), map results with a Business Profile and reviews (Google
Business Profile), and a pipeline board with an automated text reply (CRM). The same rules apply:
fictional firms only (Summit Guard Co., Ridgeline Alarm & Video, Keystone Access Systems) on
`.example` domains, the "Example illustration" tag on every window, and no figures, rankings or
ratings. A new service without an entry gets a text-only hero.

---

## Brand assets

### Logo — `client/public/logo/`

| File | Where it appears |
| --- | --- |
| `logo-lockup-light.png` | Header and footer |
| `logo-mark-light.png` | Hero proof block, "Why us" panel |
| `logo-horizontal.png` | Your original — kept for light surfaces |
| `logo-mark.png` | Favicon |

The two `-light` files were derived from your originals: white ink, brand red preserved, transparent
background. Your supplied logos are dark-on-white and vanish on the dark sections. If you have
proper light-on-dark originals — ideally SVG — drop them in over these under the same filenames.
See `client/public/logo/README.md`.

### Hero photo — `client/public/hero/` (optional)

The hero now leads with the tilted website mockup rather than a photograph, so no image is required.
If you want the guard photo somewhere, `client/public/hero/README.md` has the notes and the
`.hero__visual` hook is still in `sections.css`.

---

## Editing the copy

Site copy lives in **`client/src/data/content.js`**. Components read from it, so you can rewrite
the site without touching JSX.

| Export in content.js | What it controls |
| --- | --- |
| `COMPANY` | Name, tagline, promise, email, site URL, optional `phone` and `calendarUrl` |
| `NAV_LINKS` | Header nav and the footer "Company" column |
| `HOME_META` | Home page title/description re-applied on in-app navigation (mirror of `index.html`) |
| `HERO` | Home hero, including both buttons |
| `STATS` | Proof row under the hero (blank values are hidden) |
| `INDUSTRIES` | "Industries we serve" grid (home and /services) and the band ticker |
| `services` | **The service list and all per-service copy** — see below |
| `serviceDetail` | Section labels and headings shared by every /services/:slug page |
| `FEATURES` | The two split sections on the home page (search and website) |
| `REASONS` | "Why us" |
| `PROCESS`, `PROCESS_SECTION` | Home "How it works" |
| `SOCIALS` | Footer social icons (empty `href` = hidden) |
| `servicesPage` | /services overview: meta, hero, pricing label/note, block labels, process, FAQ, closing CTA |

Still inline in JSX: the section headings for home Services, Industries, Why us and Contact, the
contact form labels and messages, the footer blurb, and the 404 copy.

### Services — the source of truth

`services` in content.js is an array with one entry per service. It feeds the home page cards, the
/services overview, every detail page, the footer, the band ticker, the contact form dropdown, the
sitemap and the `Service` schema. Nothing else lists services (apart from the server copy below).

```js
{
  slug: 'google-business-profile',     // URL: /services/google-business-profile (and /services#slug)
  name: 'Google Business Profile Management', // also the contact form option
  shortDescription: '…',               // one line, used on cards
  icon: 'map-pin',                     // key in SERVICE_ICONS (Icons.jsx)
  hero: { headline: '… for Security Companies', subheadline: '…' }, // H1; text after " for " is red
  problem: { heading: '…', paragraphs: ['…', '…'] }, // 2–3; the first also shows on /services
  whyItMatters: [{ audience: 'Guard services', title: '…', body: '…' }], // 3–4 cards
  included: [{ icon: 'chart', title: '…', description: '…' }], // 4–6 cards, 2–3 sentences each;
                                        // icon = key in FEATURE_ICONS (Icons.jsx), optional
  process: [{ step: 'Audit', description: '…' }], // 3–5 numbered steps
  timeline: [{ period: 'First month', title: '…', activities: ['…'] }], // "What to expect":
                                        // activities, never promised results
  deliverables: ['…'],                  // "What you get" list
  bestFor: ['…'],                       // segments this suits
  faqs: [{ q: '…', a: '…' }],           // 4–5, accordion
  relatedSlugs: ['seo', 'paid-ads'],    // 2–3 other services
  pricing: 'Custom quote',              // or e.g. 'Starting at $1,500/mo'
  seo: { title: '{Service} for Security Companies | Security Marketing Company', description: '…' },
  proof: [{ quote, name, company }],    // OPTIONAL — real, cleared testimonials only
}
```

The detail page shows its sections in order: breadcrumb, hero (with the service's illustration),
problem, why it matters, what's included, how it works, what to expect, what you get (with
pricing), best for, proof (**only when `proof` is set**), FAQ, related services, closing CTA. Any
section whose data is missing or empty is left out. The shared section headings are in
`serviceDetail`.

The header's "Services" item is a dropdown (desktop) and an accordion (mobile menu), generated
from `services`. It comes from `menu: true` on the Services entry in `NAV_LINKS`.

| Service | Detail page | Overview anchor |
| --- | --- | --- |
| Website Design & Development | `/services/website` | `/services#website` |
| SEO & AI SEO | `/services/seo` | `/services#seo` |
| Paid Ads | `/services/paid-ads` | `/services#paid-ads` |
| Social Media Marketing | `/services/social-media` | `/services#social-media` |
| Email Marketing & Lead Generation | `/services/email-marketing` | `/services#email-marketing` |
| Google Business Profile Management | `/services/google-business-profile` | `/services#google-business-profile` |
| CRM Automation | `/services/crm-automation` | `/services#crm-automation` |

**Adding or renaming a service:** add or edit its entry in `services`, then update `SERVICES` in
`server/src/models/Lead.js` to match (the API deploys on its own and cannot import `content.js`; the
client build fails until the two lists agree). A new `icon` value needs an entry in `SERVICE_ICONS`.
Changing a `slug` changes the page URL, so avoid it once a page is live.

### Pricing

Each service's `pricing` string is shown on its overview block and on its detail page, under the
label and note in `servicesPage.pricing`. All seven currently say "Custom quote".

### Phone and calendar

Set `COMPANY.phone` to show it in the contact section and footer. Set `COMPANY.calendarUrl` (e.g. a
Calendly link) and every "Book Strategy Call" button opens it in a new tab instead of scrolling to the
contact form; the contact section also gets a calendar link. Both are empty now.

---

## Two things to fill in

### Keeping the stats honest

The figures under the hero (`STATS` in `content.js`) are public claims: "10+" security companies
served, "500+" leads generated, "5+" years of experience and a "50+" team. Keep them accurate and
update them as they grow. Blanking a value hides that stat and the row resizes to fit; blanking all
four hides the row. A trailing "+" is styled in red automatically.

### Adding real proof

The hero proof block next to the CTA currently carries a positioning line rather than a rating,
because inventing a Clutch score or a client count for a real business is not something to ship.
When you have a genuine Google or Clutch rating, awards, or client numbers, that block in
`Hero.jsx` is sized for it.

---

## Contact form

`POST /api/leads`

```json
{
  "name": "Anand Kumar",
  "company": "Summit Guard Co.",
  "email": "you@yourcompany.com",
  "service": "SEO & AI SEO",
  "message": "We want more commercial guarding contracts."
}
```

`service` must be one of the seven service titles above, or `Not sure yet`.

| Status | Meaning |
| --- | --- |
| `201` | Lead saved. Form shows the green success state. |
| `400` | Validation failed. Returns `{ errors: { field: message } }`, shown inline in amber. |
| `429` | Rate limited — 10 submissions per IP per 15 minutes. |
| `503` | Database unreachable. Visitor is told to email us directly. |

Validation rules are duplicated in `server/src/routes/leads.js` and
`client/src/components/Contact.jsx` so the messages match on both sides. **If you change one, change
the other.**

Built in: a honeypot field that silently accepts and discards bot submissions, request rate
limiting, a 32kb body cap, and graceful degradation — the marketing site stays up even if MongoDB is
down.

`GET /api/health` returns `{ ok: true, db: "connected" | "disconnected" }`.

### Reading the leads

```bash
mongosh "mongodb://127.0.0.1:27017/security-marketing"
db.leads.find().sort({ createdAt: -1 }).limit(20)
```

---

## Accessibility and performance notes

- Skip link, labelled form fields, `aria-invalid` / `aria-describedby` on errors, focus moved to the
  first invalid field on submit.
- Visible focus rings in brand red.
- `prefers-reduced-motion` disables the scroll reveal, the smooth scrolling and the tilt transition.
- Scroll reveal uses one `IntersectionObserver` and unobserves each element after it fires.
- No UI framework and no icon library — every icon is inline SVG. Production bundle is ~300kb JS and
  ~68kb CSS before gzip (~93kb / ~13kb gzipped).
- Header "Services" dropdown: a disclosure button with `aria-expanded`, `aria-haspopup` and
  `aria-controls`. It opens on hover (mouse only) and on click, Enter or Space, and ArrowDown
  moves into the list. Escape closes it and returns focus to the button, and so do a click outside,
  tabbing out and any navigation. The current service carries `aria-current="page"`.

---

## Still to do

- Social profiles: LinkedIn, Instagram and Facebook are live. X and YouTube are set up but empty
  (hidden) — add URLs in `SOCIALS` if you open those accounts.
- Fill in `COMPANY.phone` and `COMPANY.calendarUrl` when ready.
- Review the FAQ answers on /services (contract terms in particular) and the per-service copy in
  `services` (inclusions, process, deliverables, FAQs) against how you actually deliver.
- Add real testimonials or results as `proof` on a service when you have cleared ones.
- New services land in `sitemap.xml` automatically. A new kind of page needs its meta added to
  `PAGES` in `client/scripts/prerender.js`.
- Supply light-on-dark logo originals (SVG if possible) to replace the derived `-light` PNGs.
- Add client logos, case studies or results figures once cleared — see "Two things to fill in".

---

## A note on the original uploads

The files you uploaded are still in the repo root at `public/logo/` for reference. The site serves
from `client/public/logo/`. The root `public/` folder is not used by the build — delete it whenever
you like.
