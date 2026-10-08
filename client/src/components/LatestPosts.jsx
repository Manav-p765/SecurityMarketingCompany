import { Link } from 'react-router-dom';
import { blogPage, HOME_BLOG_SECTION } from '../data/content.js';
import { posts } from '../blog/posts.js';
import { CompactPostCard } from './BlogCards.jsx';
import { IconArrowRight } from './Icons.jsx';

/**
 * Home page: the newest published posts (HOME_BLOG_SECTION.count), between
 * the reviews and the contact form. Posts are baked in at build time
 * (blog/posts.js), and publishing in /admin rebuilds the site, so this
 * updates on its own. Hidden when there are no posts.
 *
 * One "View all articles" link: beside the heading on desktop, under the
 * cards on phones (CSS grid areas, see .latest-posts in pages.css).
 */
export default function LatestPosts() {
  const latest = posts.slice(0, HOME_BLOG_SECTION.count);
  if (latest.length === 0) return null;

  return (
    <section className="section section--tight dark-field latest-posts" id="blog" aria-labelledby="latest-posts-title">
      <div className="container latest-posts__layout">
        <div className="section-head latest-posts__head reveal">
          <p className="label">{HOME_BLOG_SECTION.label}</p>
          <h2 id="latest-posts-title">{HOME_BLOG_SECTION.title}</h2>
        </div>

        <Link className="latest-posts__all" to={blogPage.meta.path}>
          {HOME_BLOG_SECTION.viewAll}
          <IconArrowRight />
        </Link>

        <ul className="latest-posts__grid" role="list">
          {latest.map((post, index) => (
            <li key={post.slug} className="reveal" style={{ transitionDelay: `${index * 70}ms` }}>
              <CompactPostCard post={post} readMore={HOME_BLOG_SECTION.readMore} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
