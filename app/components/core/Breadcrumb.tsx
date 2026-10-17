import {Link} from 'react-router';
import './Breadcrumb.css';

export type Crumb = {label: string; to?: string};

/** Small breadcrumb: `Shop / Thermal Long Sleeve`. The last item is the current page. */
export function Breadcrumb({items, label}: {items: Crumb[]; label: string}) {
  return (
    <nav className="crumbs" aria-label={label}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`}>
              {item.to && !last ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
              {!last && <span className="crumbs-sep" aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
