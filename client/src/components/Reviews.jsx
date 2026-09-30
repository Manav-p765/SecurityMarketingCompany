import { REVIEWS_SECTION } from '../data/content.js';
import { displayedReviews, hasSampleReviews } from '../site.js';

const initials = (name) =>
  name
    .replace(/\./g, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

function Stars({ rating }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <p className="review__stars" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < value ? 'is-on' : undefined} aria-hidden="true" />
      ))}
    </p>
  );
}

function ReviewCard({ review, index }) {
  return (
    <li className="review surface reveal" style={{ transitionDelay: `${(index % 4) * 70}ms` }}>
      <figure>
        {review.rating ? <Stars rating={review.rating} /> : null}
        <blockquote className="review__quote">
          <p>{review.quote}</p>
        </blockquote>
        <figcaption className="review__author">
          {review.photo ? (
            <img className="review__avatar" src={review.photo} alt="" width="44" height="44" />
          ) : (
            <span className="review__avatar" aria-hidden="true">
              {initials(review.name)}
            </span>
          )}
          <span>
            <b>{review.name}</b>
            <small>
              {review.role}, {review.company}
            </small>
            <small>{review.location}</small>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

/**
 * Home page client reviews, shown on every environment (displayedReviews in
 * site.js). While any review is a sample, a small line under the heading
 * says so; it goes away once every review has `isSample: false`.
 */
export default function Reviews() {
  const items = displayedReviews();
  if (items.length === 0) return null;
  const showingSamples = hasSampleReviews(items);

  return (
    <section className="section section--tight dark-field reviews" id="reviews">
      <div className="container">
        <div className="section-head section-head--split reveal">
          <div>
            <p className="label">{REVIEWS_SECTION.label}</p>
            <h2>{REVIEWS_SECTION.title}</h2>
            {showingSamples && <p className="reviews__sample-note">{REVIEWS_SECTION.sampleNote}</p>}
          </div>
          <p className="section-head__lead">{REVIEWS_SECTION.lead}</p>
        </div>

        <ul className="reviews__grid">
          {items.map((review, index) => (
            <ReviewCard key={`${review.name}-${review.company}`} review={review} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
