import type {ReactNode} from 'react';
import {useLocation} from 'react-router';
import type {Cart, Product} from '~/lib/mock/types';
import {OverlayProvider, useOverlay} from '~/components/core/OverlayProvider';
import {AnnouncementBar} from '~/components/core/AnnouncementBar';
import {ToastRegion} from '~/components/core/Toast';
import {MarginRails} from '~/components/digs/MarginRails';
import {Menu} from '~/components/digs/Menu';
import {TaglineBand} from '~/components/digs/TaglineBand';
import {SiteHeader} from './SiteHeader';
import {SiteFooter} from './SiteFooter';
import {CartDrawer} from './CartDrawer';
import {copy, text} from '~/lib/copy';
import './chrome.css';

export type PageLayoutProps = {
  cart: Cart | null;
  products: Product[];
  children: ReactNode;
  /** Home: transparent header over the hero. */
  transparentHeader?: boolean;
  /** Which approved tagline the band shows (deterministic per page). */
  taglineIndex?: number;
  /** Stories: open an overlay at first render. */
  initialOpen?: 'menu' | 'cart' | null;
};

/**
 * Global chrome (04-ia-and-pages.md): announcement bar, header, full-screen menu, cart drawer,
 * desktop margin rails, tagline band, footer, edge-to-edge wordmark.
 */
export function PageLayout(props: PageLayoutProps) {
  return (
    <OverlayProvider initialOpen={props.initialOpen ?? null}>
      <Frame {...props} />
    </OverlayProvider>
  );
}

function Frame({cart, products, children, transparentHeader, taglineIndex}: PageLayoutProps) {
  const {open, setOpen, close, toasts, dismissToast} = useOverlay();
  const location = useLocation();
  const index = taglineIndex ?? Math.abs(hash(location.pathname)) % copy.taglineBand.length;
  const home = transparentHeader ?? location.pathname === '/';
  const announcement = copy.announcement.enabled ? text(copy.announcement) : null;
  const cartCount = cart?.totalQuantity ?? 0;
  return (
    <div className="page">
      <a href="#main" className="skip-link type-ui">
        {copy.a11y.skipToContent}
      </a>
      {announcement && !home ? <AnnouncementBar dismissLabel={copy.a11y.dismiss}>{announcement}</AnnouncementBar> : null}
      <SiteHeader cartCount={cartCount} transparent={home} />
      <MarginRails left={copy.rails.left} right={copy.rails.right} />
      <main id="main" tabIndex={-1} className="page-main">
        {children}
      </main>
      <TaglineBand lines={copy.taglineBand} index={index} cta={{label: copy.cta.enterShop, to: '/collections/all'}} className="bleed" />
      <SiteFooter />
      <Menu
        open={open === 'menu'}
        onClose={close}
        items={[
          {label: copy.nav.shop, to: '/collections/all'},
          {label: copy.nav.manifesto, to: '/pages/manifesto'},
          {label: copy.nav.cart, to: '/cart', count: cartCount, onClick: () => setOpen('cart')},
          {label: copy.nav.instagram, to: copy.brand.instagramUrl, external: true},
        ]}
        smallPrint={copy.menu.smallPrint}
        labels={{close: copy.a11y.closeMenu, menu: copy.a11y.menu}}
      />
      <CartDrawer cart={cart} products={products} />
      <ToastRegion toasts={toasts} onDismiss={dismissToast} dismissLabel={copy.a11y.dismiss} />
    </div>
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
