import { Link } from 'react-router-dom';
import { blogPage } from '../data/content.js';
import { authorPath } from '../blog/posts.js';
import { IconArrowRight, SOCIAL_ICONS } from './Icons.jsx';

const copy = blogPage.author;
const fill = (text, author) => text.replace('{name}', author.name);

/** "Jane Doe" -> "JD", for authors without a photo. */
const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

/** Round author photo (square uploads, cropped to a circle), or initials. */
export function AuthorAvatar({ author, size = 'small' }) {
  return (
    <span className={`author-avatar author-avatar--${size}`} aria-hidden="true">
      {author.photo ? (
        <img src={author.photo} alt="" loading="lazy" decoding="async" width="400" height="400" />
      ) : (
        initials(author.name)
      )}
    </span>
  );
}

/** Icon buttons for the author's LinkedIn, X and website; nothing if none is set. */
export function AuthorSocialLinks({ author }) {
  const links = ['linkedin', 'x', 'website'].filter((id) => author.links[id]);
  if (!links.length) return null;
  return (
    <ul className="author-social">
      {links.map((id) => {
        const Icon = SOCIAL_ICONS[id];
        return (
          <li key={id}>
            <a
              href={author.links[id]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${author.name} on ${copy.social[id]}`}
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Byline in the post hero: avatar and name, linking to the author page. */
export function AuthorByline({ author }) {
  return (
    <Link className="author-byline" to={authorPath(author)}>
      <AuthorAvatar author={author} />
      <span>
        {blogPage.post.by} <span className="author-byline__name">{author.name}</span>
      </span>
    </Link>
  );
}

/** "About the author" box at the end of a post. */
export function AuthorBio({ author }) {
  return (
    <aside className="author-bio" aria-labelledby="author-bio-name">
      <AuthorAvatar author={author} size="medium" />
      <div className="author-bio__text">
        <p className="author-bio__label">{blogPage.post.aboutAuthorLabel}</p>
        <p className="author-bio__name" id="author-bio-name">
          <Link to={authorPath(author)}>{author.name}</Link>
        </p>
        {author.role && <p className="author-bio__role">{author.role}</p>}
        {author.bio && <p className="author-bio__bio">{author.bio}</p>}
        <div className="author-bio__foot">
          <AuthorSocialLinks author={author} />
          <Link className="author-bio__more" to={authorPath(author)}>
            {fill(blogPage.post.moreByAuthor, author)}
            <IconArrowRight />
          </Link>
        </div>
      </div>
    </aside>
  );
}
