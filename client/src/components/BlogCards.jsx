import { Link } from 'react-router-dom';
import { blogPage } from '../data/content.js';
import { formatDate, postPath } from '../blog/posts.js';
import { FEATURE_ICONS, IconArrowRight } from './Icons.jsx';

/** Icon on the generated cover, by category. Unknown categories get "pages". */
const CATEGORY_ICONS = {
  'Local SEO': 'map',
  Websites: 'layout',
  'Lead Follow-Up': 'bolt',
};

/** Small stable hash, so each post's generated cover is different but never changes. */
function hash(text) {
  let value = 7;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

/**
 * A post's cover: its `coverImage`, or a graphic generated in the site style
 * (dark field, red glow, hairline grid, category icon) when there is none.
 */
export function PostCover({ post, large = false }) {
  if (post.coverImage) {
    return (
      <div className={`post-cover${large ? ' post-cover--large' : ''}`}>
        {/* width/height give the browser the 16:9 ratio before the image loads. */}
        <img src={post.coverImage} alt="" loading="lazy" decoding="async" width="1600" height="900" />
      </div>
    );
  }
  const seed = hash(post.slug);
  const Icon = FEATURE_ICONS[CATEGORY_ICONS[post.category] ?? 'pages'];
  const style = {
    '--glow-x': `${20 + (seed % 60)}%`,
    '--glow-y': `${15 + ((seed >> 5) % 50)}%`,
    '--angle': `${100 + ((seed >> 9) % 60)}deg`,
  };
  return (
    <div className={`post-cover post-cover--generated${large ? ' post-cover--large' : ''}`} style={style} aria-hidden="true">
      <span className="post-cover__icon">
        <Icon />
      </span>
      <span className="post-cover__label">{post.category}</span>
    </div>
  );
}

/** Date, read time (and optionally author) line. */
export function PostMeta({ post, author = false }) {
  return (
    <p className="post-meta">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>
        {post.readingTime} {blogPage.post.readSuffix}
      </span>
      {author && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            {blogPage.post.by} {post.author}
          </span>
        </>
      )}
    </p>
  );
}

/**
 * Compact card (home page): category tag and date on one line, title up to
 * three lines, a two-line excerpt and "Read more". Same cover, surface and
 * whole-card link as PostCard, so the two stay consistent.
 */
export function CompactPostCard({ post, readMore = blogPage.readMore, headingLevel: Heading = 'h3' }) {
  return (
    <article className="post-card post-card--compact surface">
      <PostCover post={post} />
      <div className="post-card__body">
        <p className="post-card__top">
          <span className="post-card__tag">{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <Heading className="post-card__title">
          <Link to={postPath(post)} className="post-card__link">
            {post.title}
          </Link>
        </Heading>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <span className="post-card__more" aria-hidden="true">
          {readMore}
          <IconArrowRight />
        </span>
      </div>
    </article>
  );
}

/** Blog card: the whole card links to the post. */
export function PostCard({ post, headingLevel: Heading = 'h3', featured = false }) {
  return (
    <article className={`post-card surface${featured ? ' post-card--featured' : ''}`}>
      <PostCover post={post} large={featured} />
      <div className="post-card__body">
        <p className="post-card__category">{post.category}</p>
        <Heading className="post-card__title">
          <Link to={postPath(post)} className="post-card__link">
            {post.title}
          </Link>
        </Heading>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <PostMeta post={post} />
        {featured && (
          <span className="post-card__more" aria-hidden="true">
            {blogPage.readMore}
            <IconArrowRight />
          </span>
        )}
      </div>
    </article>
  );
}
