import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Stats from './components/Stats.jsx';
import Industries from './components/Industries.jsx';
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
        <Stats />
        <Industries />
        <Services />
        <Band />

        {/* Feature 1 — the search work. */}
        <Feature
          id="approach"
          label="Get found first"
          title="Own the search your buyers already make"
          paragraphs={[
            'Buyers search for a guarding company in their town or an installer who can be on site this week. That contest is settled in the top three results and the map pack.',
          ]}
          points={[
            'Map pack and local rankings, town by town',
            'A service-area page for every place you cover',
            'Reporting tied to enquiries, not keyword screenshots',
          ]}
          cta={{ label: 'Book Strategy Call', href: '#contact' }}
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
            'Your website has one job: give a buyer who has never heard of you the confidence to ask for a quote.',
          ]}
          points={[
            'Licensing and accreditations shown up front',
            'Quote and survey requests on every service page',
            'Fast, mobile-first and easy to update in-house',
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
