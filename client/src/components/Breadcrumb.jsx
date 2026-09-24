import { Link } from 'react-router-dom';

/**
 * Breadcrumb trail. `items` are { label, to }; the last item is the current
 * page and is rendered as text with aria-current. The matching
 * BreadcrumbList schema is built in seo.js.
 */
export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.label}>
              {current ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
