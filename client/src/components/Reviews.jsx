import { useMemo } from 'react';
import { REVIEWS_SECTION } from '../data/content.js';
import { displayedReviews } from '../site.js';

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
 * Home page client reviews. Which reviews appear (and whether the section
 * appears at all) is decided by displayedReviews() in site.js: samples show
 * on local and preview builds only, so the live site shows real reviews or
 * nothing.
 */
export default function Reviews() {
  const items = useMemo(() => displayedReviews(), []);
  if (items.length === 0) return null;
  const showingSamples = items.some((review) => review.isSample);

  return (
    <section className="section section--tight dark-field reviews" id="reviews">
      <div className="container">
        <div className="section-head section-head--split reveal">
          <div>
            <p className="label">{REVIEWS_SECTION.label}</p>
            <h2>{REVIEWS_SECTION.title}</h2>
          </div>
          <p className="section-head__lead">{REVIEWS_SECTION.lead}</p>
        </div>

        {showingSamples && <p className="reviews__notice">{REVIEWS_SECTION.sampleNotice}</p>}

        <ul className="reviews__grid">
          {items.map((review, index) => (
            <ReviewCard key={`${review.name}-${review.company}`} review={review} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
