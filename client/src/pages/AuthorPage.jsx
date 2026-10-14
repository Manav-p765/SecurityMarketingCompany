import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import CtaPanel from '../components/CtaPanel.jsx';
import NotFound from '../components/NotFound.jsx';
import { PostCard } from '../components/BlogCards.jsx';
import { AuthorAvatar, AuthorSocialLinks } from '../components/AuthorCards.jsx';
import { blogPage as copy } from '../data/content.js';
import { getAuthor, postsBy } from '../blog/posts.js';
import { authorMeta, authorSchema } from '../blog/schema.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';

function Author({ author }) {
  useReveal();
  const schema = useMemo(() => authorSchema(author), [author]);
  usePageMeta(authorMeta(author), schema);
  const list = postsBy(author);

  return (
    <div className="page detail-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <section className="svc-hero dark-field author-hero">
          <div className="container post__narrow">
            <Breadcrumb
              items={[
                { label: 'Home', to: '/' },
                { label: copy.breadcrumb, to: copy.meta.path },
                { label: author.name },
              ]}
            />
            <div className="author-hero__profile">
              <AuthorAvatar author={author} size="large" />
              <div>
                <p className="label">{copy.author.eyebrow}</p>
                <h1>{author.name}</h1>
                {author.role && <p className="author-hero__role">{author.role}</p>}
              </div>
            </div>
            {author.bio && <p className="svc-hero__subhead author-hero__bio">{author.bio}</p>}
            <AuthorSocialLinks author={author} />
          </div>
        </section>

        <section className="section section--tight dark-field dark-field--quiet blog-list" id="posts">
          <div className="container">
            <div className="section-head reveal">
              <h2>{copy.author.postsTitle.replace('{name}', author.name)}</h2>
            </div>
            <ul className="blog-grid">
              {list.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CtaPanel copy={copy.cta} />
      </main>

      <Footer />
    </div>
  );
}

/**
 * /blog/author/:slug. Only authors with a published post have a page; any
 * other slug renders the 404 page (and has no prerendered file).
 */
export default function AuthorPage() {
  const { slug } = useParams();
  const author = getAuthor(slug);
  return author ? <Author key={slug} author={author} /> : <NotFound />;
}
