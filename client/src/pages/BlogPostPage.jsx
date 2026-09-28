import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import CtaPanel from '../components/CtaPanel.jsx';
import NotFound from '../components/NotFound.jsx';
import { PostCard, PostCover, PostMeta } from '../components/BlogCards.jsx';
import { IconArrowRight, SERVICE_ICONS } from '../components/Icons.jsx';
import { blogPage as copy, getService } from '../data/content.js';
import { getPost, relatedPosts } from '../blog/posts.js';
import { postMeta, postSchema } from '../blog/schema.js';
import { servicePath } from '../seo.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useReveal } from '../hooks/useReveal.js';

/** The service a post's in-content CTA points to: frontmatter `service`, else by category. */
function serviceFor(post) {
  return (
    getService(post.service) ??
    getService(copy.categoryServices[post.category]) ??
    getService(copy.defaultService)
  );
}

/**
 * Splits the article HTML before the h2 nearest its middle, so the CTA box
 * sits inside the article rather than after it. Short posts (fewer than two
 * h2s) get the box at the end.
 */
function splitForCta(html) {
  const starts = [...html.matchAll(/<h2[\s>]/g)].map((match) => match.index);
  if (starts.length < 2) return [html, ''];
  const at = starts[Math.floor(starts.length / 2)];
  return [html.slice(0, at), html.slice(at)];
}

function ServiceCta({ service }) {
  const Icon = SERVICE_ICONS[service.icon];
  return (
    <aside className="post-cta" aria-label={copy.post.ctaKicker}>
      <span className="service-card__icon">
        <Icon />
      </span>
      <div>
        <p className="post-cta__kicker">{copy.post.ctaKicker}</p>
        <p className="post-cta__title">{copy.post.ctaTitle.replace('{service}', service.name)}</p>
        <p className="post-cta__body">{copy.post.ctaBody}</p>
      </div>
      <Link className="btn btn--primary" to={servicePath(service)}>
        {copy.post.ctaButton}
        <span className="visually-hidden"> about {service.name}</span>
        <IconArrowRight />
      </Link>
    </aside>
  );
}

function Post({ post }) {
  useReveal();
  const schema = useMemo(() => postSchema(post), [post]);
  usePageMeta(postMeta(post), schema);
  const navigate = useNavigate();
  const [before, after] = useMemo(() => splitForCta(post.html), [post]);
  const related = relatedPosts(post);
  const service = serviceFor(post);

  // Internal links inside the markdown are plain <a> tags; route them in the
  // app instead of reloading the page.
  const onProseClick = (event) => {
    const link = event.target.closest('a');
    const href = link?.getAttribute('href');
    if (!href || !href.startsWith('/') || link.target || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigate(href);
  };

  return (
    <div className="page detail-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <article className="post">
          <header className="svc-hero dark-field post__hero">
            <div className="container post__narrow">
              <Breadcrumb
                items={[
                  { label: 'Home', to: '/' },
                  { label: copy.breadcrumb, to: copy.meta.path },
                  { label: post.title },
                ]}
              />
              <p className="post-card__category post__category">{post.category}</p>
              <h1>{post.title}</h1>
              <p className="svc-hero__subhead">{post.excerpt}</p>
              <PostMeta post={post} author />
            </div>
          </header>

          <div className="dark-field dark-field--quiet post__body">
            <div className="container post__narrow">
              <PostCover post={post} large />
              {/* Markdown rendered to HTML at build time from our own files.
                  The click handler only reroutes internal links (keyboard
                  Enter on a link fires click too). */}
              <div className="prose-text post__content" onClick={onProseClick}>
                <div dangerouslySetInnerHTML={{ __html: before }} />
                {service && <ServiceCta service={service} />}
                {after && <div dangerouslySetInnerHTML={{ __html: after }} />}
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="section section--tight dark-field" id="related-posts">
            <div className="container">
              <div className="section-head reveal">
                <p className="label">{copy.post.relatedLabel}</p>
                <h2>{copy.post.relatedTitle}</h2>
              </div>
              <ul className="blog-grid">
                {related.map((item) => (
                  <li key={item.slug}>
                    <PostCard post={item} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <CtaPanel copy={copy.cta} />
      </main>

      <Footer />
    </div>
  );
}

/** /blog/:slug. An unknown slug renders the 404 page (and has no prerendered file). */
export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPost(slug);
  return post ? <Post key={slug} post={post} /> : <NotFound />;
}
