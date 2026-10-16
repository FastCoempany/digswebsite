import type {ReactNode} from 'react';
import type {Cart, Product} from '~/lib/mock/types';
import {Wordmark} from '~/components/digs/marks';
import {copy} from '~/lib/copy';

export type PageLayoutProps = {
  cart: Cart | null;
  products: Product[];
  children: ReactNode;
};

/**
 * Global chrome (04-ia-and-pages.md): announcement bar, header, menu, cart drawer, margin rails,
 * tagline band, footer, edge-to-edge wordmark. Phase 0 ships the skeleton; phases 1–3 fill it.
 */
export function PageLayout({children}: PageLayoutProps) {
  return (
    <div className="page">
      <a href="#main" className="skip-link type-ui">
        {copy.a11y.skipToContent}
      </a>
      <header className="site-header container-x">
        <a href="/" className="site-header-mark" aria-label={copy.brand.name}>
          <Wordmark color="blue" height="28px" />
        </a>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-foot">
        <div className="site-foot-wordmark" aria-hidden="true">
          <Wordmark color="blue" edgeToEdge decorative />
        </div>
      </footer>
    </div>
  );
}
