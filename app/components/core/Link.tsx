import type {AnchorHTMLAttributes, ReactNode} from 'react';
import {Link as RouterLink, NavLink} from 'react-router';
import './Link.css';

export type LinkProps = {
  to: string;
  variant?: 'inline' | 'nav' | 'footer';
  external?: boolean;
  /** For nav links: marks the current route (aria-current="page"). */
  nav?: boolean;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>;

/** Inline links are underlined; nav and footer links are quiet until hover/focus. */
export function Link({to, variant = 'inline', external, nav, className = '', children, ...rest}: LinkProps) {
  const cls = `lnk lnk-${variant} ${className}`.trim();
  if (external || /^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a href={to} className={cls} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} {...rest}>
        {children}
      </a>
    );
  }
  if (nav) {
    return (
      <NavLink to={to} className={({isActive}) => `${cls} ${isActive ? 'is-active' : ''}`} {...rest}>
        {children}
      </NavLink>
    );
  }
  return (
    <RouterLink to={to} className={cls} {...rest}>
      {children}
    </RouterLink>
  );
}
