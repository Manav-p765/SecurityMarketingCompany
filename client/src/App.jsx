import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Strip from './components/Strip.jsx';
import Services from './components/Services.jsx';
import Band from './components/Band.jsx';
import Feature from './components/Feature.jsx';
import WhyUs from './components/WhyUs.jsx';
import Process from './components/Process.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { SerpMockup, SiteMockup } from './components/Mockups.jsx';
import { useReveal } from './hooks/useReveal.js';

export default function App() {
  useReveal();

  return (
    /* `.page` carries the one continuous texture field for the whole
       document. Sections sit on it transparently, which is what keeps the
       boundaries between them seamless. */
    <div className="page">
      <a className="skip-link" href="#services">
        Skip to content
      </a>

      <Header />

      <main>
        <Hero />
        <Strip />
        <Services />
        <Band />

        {/* Feature 1 — the search work. */}
        <Feature
          id="approach"
          label="Get found first"
          title="Own the search your buyers already make"
          paragraphs={[
            'Nobody wakes up and decides to hire a security firm by name. They search — for a guarding company in their town, for a CCTV installer who can be on site this week.',
            'That search is the whole contest, and it is settled in the first three results and the map pack above them.',
          ]}
          points={[
            'Map pack and local ranking work, town by town',
            'A service-area page for every place you cover',
            'Technical SEO, site speed and Core Web Vitals',
            'Reporting tied to enquiries, not keyword screenshots',
          ]}
          cta={{ label: 'Get a Quote', href: '#contact' }}
          wash
        >
          <div className="tilt tilt--right">
            <div className="tilt__inner">
              <SerpMockup />
            </div>
          </div>
        </Feature>

        {/* Feature 2 — the build work, screen flipped to the other side. */}
        <Feature
          label="Sites that sell"
          title="A site built to book the survey"
          paragraphs={[
            'Your website has one job, and it is not to look busy. It is to give a facilities manager who has never heard of you enough confidence to ask for a quote.',
            'So we lead with what they check first — licensing, accreditations, response times, coverage — and put the survey request where the decision gets made.',
          ]}
          points={[
            'Licensing and accreditation shown up front',
            'Coverage areas that double as ranking pages',
            'Quote and survey flows on every service page',
            'WordPress or Shopify, easy to update in-house',
          ]}
          cta={{ label: 'Start a Project', href: '#contact' }}
          reverse
        >
          <div className="tilt tilt--flat">
            <div className="tilt__inner">
              <SiteMockup />
            </div>
          </div>
        </Feature>

        <WhyUs />
        <Process />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
