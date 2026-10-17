import {Link} from 'react-router';
import {Drawer} from '~/components/core/Drawer';
import {Wordmark} from './marks/Wordmark';
import {Sticker} from './Sticker';
import './Menu.css';

export type MenuItem = {label: string; to: string; external?: boolean; count?: number; onClick?: () => void};

export type MenuProps = {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  /** Two lines of small print under the blocks (shipping, contact). */
  smallPrint: Array<{label: string; to: string}>;
  labels: {close: string; menu: string};
  /** Force the hover/focus look on an item (stories). */
  activeIndex?: number;
};

/**
 * Full-screen menu: stacked full-width blocks, each a single huge Alexandria word. Blue on ice;
 * the hovered or focused block flips to ice on blue with a scrawl underline. Focus is trapped in
 * the dialog; Esc closes.
 */
export function Menu({open, onClose, items, smallPrint, labels, activeIndex}: MenuProps) {
  return (
    <Drawer open={open} onClose={onClose} side="full" tone="page" label={labels.menu} closeLabel={labels.close} id="site-menu" className="menu-drawer" title={<Wordmark color="blue" height="28px" />}>
      <nav className="menu" aria-label={labels.menu}>
        <ul className="menu-blocks">
          {items.map((item, i) => {
            const inner = (
              <>
                <span className="menu-word type-display-xl">{item.label}</span>
                {typeof item.count === 'number' ? <span className="menu-count type-h3">({item.count})</span> : null}
                <svg className="menu-underline" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <path d="M1 6 C 25 2, 45 9, 70 4 S 95 6, 99 3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </svg>
              </>
            );
            const cls = `menu-block ${activeIndex === i ? 'is-active' : ''}`;
            return (
              <li key={item.label}>
                {item.onClick ? (
                  <button type="button" className={cls} onClick={item.onClick}>
                    {inner}
                  </button>
                ) : item.external ? (
                  <a className={cls} href={item.to} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <Link className={cls} to={item.to} onClick={onClose}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="menu-foot">
          <ul className="menu-small type-small">
            {smallPrint.map((s) => (
              <li key={s.label}>
                <Link to={s.to} onClick={onClose}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <Sticker kind="dd" rotate={9} size="md" tone="blue" />
        </div>
      </nav>
    </Drawer>
  );
}
