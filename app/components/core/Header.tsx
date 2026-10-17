import {useEffect, useState, type ReactNode} from 'react';
import './Header.css';

export type HeaderProps = {
  /** transparent sits over the home hero and turns solid after 24px of scroll. */
  variant?: 'transparent' | 'solid';
  /** Force the scrolled look (stories, tests). */
  scrolled?: boolean;
  menuOpen?: boolean;
  /** Slots: leading (menu button / desktop nav), center (brand), trailing (account, cart). */
  leading?: ReactNode;
  center?: ReactNode;
  trailing?: ReactNode;
  /** Mobile-only leading slot (menu button) when desktop shows nav instead. */
  leadingMobile?: ReactNode;
  className?: string;
  id?: string;
};

/**
 * 56px header shell. Mobile: menu · brand · cart. Desktop: nav · brand · utilities.
 * Brand-agnostic: the DIGS chrome passes the wordmark and labels.
 */
export function Header({variant = 'solid', scrolled, menuOpen, leading, leadingMobile, center, trailing, className = '', id}: HeaderProps) {
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    if (variant !== 'transparent') return;
    const on = () => setAuto(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, {passive: true});
    return () => window.removeEventListener('scroll', on);
  }, [variant]);
  const isScrolled = scrolled ?? auto;
  return (
    <header id={id} className={`hdr hdr-${variant} ${isScrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-menu-open' : ''} ${className}`} data-surface={variant === 'transparent' && !isScrolled ? 'brand' : undefined}>
      <div className="hdr-inner">
        <div className="hdr-leading">
          {leadingMobile ? <div className="hdr-mobile-only">{leadingMobile}</div> : null}
          {leading ? <div className={leadingMobile ? 'hdr-desktop-only' : ''}>{leading}</div> : null}
        </div>
        <div className="hdr-center">{center}</div>
        <div className="hdr-trailing">{trailing}</div>
      </div>
    </header>
  );
}
