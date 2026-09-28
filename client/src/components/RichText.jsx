import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY } from '../data/content.js';

/**
 * Renders the small text markup used by the legal pages (data/legal/):
 *   {email}        the business email from COMPANY, as a mailto link
 *   {company}      COMPANY.name
 *   [label](href)  a link — internal paths ("/terms", "#section") stay in the app
 *   **bold**, `code`
 * Anything else is plain text, so copy can be edited without touching JSX.
 */
const TOKEN = /(\{email\}|\{company\}|\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;

function renderLink(label, href, key) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a key={key} className="text-link" href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  if (href.startsWith('#') || href.startsWith('mailto:')) {
    return (
      <a key={key} className="text-link" href={href}>
        {label}
      </a>
    );
  }
  return (
    <Link key={key} className="text-link" to={href}>
      {label}
    </Link>
  );
}

export function renderInline(text) {
  return text.split(TOKEN).map((part, index) => {
    if (part === '{email}') return renderLink(COMPANY.email, `mailto:${COMPANY.email}`, index);
    if (part === '{company}') return <Fragment key={index}>{COMPANY.name}</Fragment>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) return renderLink(link[1], link[2], index);
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(part)) return <code key={index}>{part.slice(1, -1)}</code>;
    return part ? <Fragment key={index}>{part}</Fragment> : null;
  });
}

/** One block: a paragraph string or { list: [strings] }. */
export default function RichBlock({ block }) {
  if (typeof block === 'string') return <p>{renderInline(block)}</p>;
  if (block.list) {
    return (
      <ul>
        {block.list.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  }
  return null;
}
