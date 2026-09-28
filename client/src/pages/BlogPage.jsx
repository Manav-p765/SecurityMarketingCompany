import { useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CtaPanel from '../components/CtaPanel.jsx';
import { PostCard } from '../components/BlogCards.jsx';
import { blogPage as copy } from '../data/content.js';
import { categories, posts } from '../blog/posts.js';
import { blogSchema } from '../blog/schema.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';

const PAGE_SIZE = 9;
const SCHEMA = blogSchema();

/**
 * /blog: hero, the newest post featured, then the rest as a card grid.
 * Category chips filter on the client (a filtered view is a plain grid,
 * no featured post). Pagination appears only with more than 9 posts.
 */
export default function BlogPage() {
  useReveal();
  usePageMeta(copy.meta, SCHEMA);
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);

  const featured = category ? null : posts[0];
  const list = category ? posts.filter((post) => post.category === category) : posts.slice(1);
  const paginate = posts.length > PAGE_SIZE;
  const pageCount = paginate ? Math.max(1, Math.ceil(list.length / PAGE_SIZE)) : 1;
  const current = Math.min(page, pageCount);
  const visible = paginate ? list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE) : list;

  const choose = (next) => {
    setCategory(next);
    setPage(1);
  };

  const goTo = (next) => {
    setPage(next);
    document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page detail-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <section className="svc-hero dark-field blog-hero">
          <div className="container">
            <p className="label">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <p className="svc-hero__subhead">{copy.hero.intro}</p>
          </div>
        </section>

        <section className="section section--tight dark-field dark-field--quiet blog-list" id="posts">
          <div className="container">
            {categories.length > 1 && (
              <div className="blog-filter" role="group" aria-label={copy.filterLabel}>
                <button
                  type="button"
                  className="chip blog-filter__chip"
                  aria-pressed={category === null}
                  onClick={() => choose(null)}
                >
                  {copy.allLabel}
                </button>
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="chip blog-filter__chip"
                    aria-pressed={category === item}
                    onClick={() => choose(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            {featured && current === 1 && (
              <div className="blog-featured">
                <p className="label">{copy.featuredLabel}</p>
                <PostCard post={featured} headingLevel="h2" featured />
              </div>
            )}

            {visible.length > 0 ? (
              <ul className="blog-grid" aria-live="polite">
                {visible.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} headingLevel={featured ? 'h3' : 'h2'} />
                  </li>
                ))}
              </ul>
            ) : (
              !featured && <p className="blog-empty">{copy.empty}</p>
            )}

            {pageCount > 1 && (
              <nav className="blog-pages" aria-label="Pagination">
                <button type="button" className="chip" disabled={current === 1} onClick={() => goTo(current - 1)}>
                  {copy.previous}
                </button>
                <span>
                  {copy.pageLabel} {current} / {pageCount}
                </span>
                <button
                  type="button"
                  className="chip"
                  disabled={current === pageCount}
                  onClick={() => goTo(current + 1)}
                >
                  {copy.next}
                </button>
              </nav>
            )}
          </div>
        </section>

        <CtaPanel copy={copy.cta} />
      </main>

      <Footer />
    </div>
  );
}
