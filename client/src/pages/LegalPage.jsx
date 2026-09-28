import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import RichBlock, { renderInline } from '../components/RichText.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';

/**
 * /privacy and /terms: a plain, readable text page. `doc` is privacyPolicy
 * or termsPage (data/legal/). Every section heading carries an anchor link,
 * and the contents list at the top links to each one.
 */
export default function LegalPage({ doc }) {
  usePageMeta(doc.meta);

  return (
    <div className="page detail-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <article className="legal dark-field">
          <div className="container legal__inner">
            <header className="legal__head">
              <h1>{doc.title}</h1>
              <p className="legal__updated">
                Last updated: <time>{doc.lastUpdated}</time>
              </p>
            </header>

            <div className="legal__intro prose-text">
              {doc.intro.map((paragraph) => (
                <p key={paragraph}>{renderInline(paragraph)}</p>
              ))}
            </div>

            <nav className="legal__toc" aria-label="On this page">
              <p>On this page</p>
              <ol>
                {doc.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="prose-text">
              {doc.sections.map((section) => (
                <section key={section.id} aria-labelledby={section.id}>
                  <h2 id={section.id}>
                    {section.heading}
                    <a className="anchor" href={`#${section.id}`} aria-label={`Link to “${section.heading}”`}>
                      #
                    </a>
                  </h2>
                  {section.blocks.map((block, index) => (
                    <RichBlock key={index} block={block} />
                  ))}
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
