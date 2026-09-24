import { useId, useState } from 'react';
import { IconPlus } from './Icons.jsx';

/**
 * Disclosure-pattern accordion: each question is a real button inside a
 * heading, with aria-expanded and aria-controls pointing at its answer.
 * Items open independently, so opening one never hides another.
 */
function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const buttonId = `${id}-q`;
  const panelId = `${id}-a`;

  return (
    <div className={`faq__item${open ? ' is-open' : ''}`}>
      <h3>
        <button
          type="button"
          id={buttonId}
          className="faq__question"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{item.q}</span>
          <IconPlus />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="faq__answer"
        hidden={!open}
      >
        <p>{item.a}</p>
      </div>
    </div>
  );
}

/** FAQ section: heading on the left, accordion on the right. `items` are { q, a }. */
export default function Faq({ id = 'faq', label, title, items }) {
  return (
    <section className="section faq dark-field dark-field--quiet" id={id}>
      <div className="container faq__layout">
        <div className="section-head reveal">
          <p className="label">{label}</p>
          <h2>{title}</h2>
        </div>
        <div className="faq__list reveal">
          {items.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
