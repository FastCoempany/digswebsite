import {Link} from 'react-router';
import {Header} from '~/components/core/Header';
import {IconButton} from '~/components/core/IconButton';
import {Link as UiLink} from '~/components/core/Link';
import {useOverlay} from '~/components/core/OverlayProvider';
import {Wordmark} from '~/components/digs/marks/Wordmark';
import {copy} from '~/lib/copy';
import './chrome.css';

export type SiteHeaderProps = {
  cartCount: number;
  /** Transparent over the home hero. */
  transparent?: boolean;
  scrolled?: boolean;
};

/** Mobile: menu · wordmark · Your Digs (n). Desktop: Shop · Manifesto · wordmark · Account · Your Digs (n). */
export function SiteHeader({cartCount, transparent, scrolled}: SiteHeaderProps) {
  const {open, setOpen} = useOverlay();
  const cartLabel = `${copy.cta.cart} (${cartCount})`;
  return (
    <Header
      variant={transparent ? 'transparent' : 'solid'}
      scrolled={scrolled}
      menuOpen={open === 'menu'}
      leadingMobile={<IconButton icon="menu" label={copy.a11y.openMenu} aria-expanded={open === 'menu'} aria-controls="site-menu" aria-haspopup="dialog" onClick={() => setOpen('menu')} className="hdr-btn" />}
      leading={
        <>
          <UiLink to="/collections/all" variant="nav" nav>
            {copy.nav.shop}
          </UiLink>
          <UiLink to="/pages/manifesto" variant="nav" nav>
            {copy.nav.manifesto}
          </UiLink>
        </>
      }
      center={
        <Link to="/" className="hdr-brand" aria-label={copy.a11y.home}>
          <Wordmark color="current" height="28px" decorative />
        </Link>
      }
      trailing={
        <>
          <span className="hdr-desktop-only">
            <UiLink to="/account" variant="nav">
              {copy.nav.account}
            </UiLink>
          </span>
          <button type="button" className="hdr-cart lnk lnk-nav" aria-haspopup="dialog" aria-expanded={open === 'cart'} aria-controls="site-cart" onClick={() => setOpen('cart')}>
            <span className="hdr-cart-long">{cartLabel}</span>
            <span className="hdr-cart-short" aria-hidden="true">
              {copy.cta.cartShort} ({cartCount})
            </span>
          </button>
        </>
      }
    />
  );
}
