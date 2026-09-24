import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Stats from '../components/Stats.jsx';
import Industries from '../components/Industries.jsx';
import Services from '../components/Services.jsx';
import Band from '../components/Band.jsx';
import Feature from '../components/Feature.jsx';
import WhyUs from '../components/WhyUs.jsx';
import Process from '../components/Process.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import { SerpMockup, SiteMockup } from '../components/Mockups.jsx';
import { FEATURES, HOME_META } from '../data/content.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';

export default function HomePage() {
  useReveal();
  usePageMeta(HOME_META);

  return (
    /* `.page` carries the one continuous texture field for the whole
       document. Sections sit on it transparently, which is what keeps the
       boundaries between them seamless. */
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <Hero />
        <Stats />
        <Industries />
        <Services />
        <Band />

        {/* Feature 1 — the search work. */}
        <Feature {...FEATURES.search} wash>
          <div className="tilt tilt--right">
            <div className="tilt__inner">
              <SerpMockup />
            </div>
          </div>
        </Feature>

        {/* Feature 2 — the build work, screen flipped to the other side. */}
        <Feature {...FEATURES.website} reverse>
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
