import {useFetcher} from 'react-router';
import type {Cart, Product} from '~/lib/mock/types';
import {digs, srcSetFor} from '~/lib/mock';
import {Drawer} from '~/components/core/Drawer';
import {CartLine, type CartLineData} from '~/components/core/CartLine';
import {CartSummary} from '~/components/core/CartSummary';
import {EmptyState} from '~/components/core/EmptyState';
import {ProductCard} from '~/components/core/ProductCard';
import {Button} from '~/components/core/Button';
import {useOverlay} from '~/components/core/OverlayProvider';
import {Script} from '~/components/digs/marks/Script';
import {copy, text} from '~/lib/copy';
import {cardData} from '~/lib/view';
import './chrome.css';

export type CartDrawerProps = {cart: Cart | null; products: Product[]; open?: boolean; onClose?: () => void};

export function cartLineData(cart: Cart): CartLineData[] {
  return cart.lines.nodes.map((l) => {
    const colorway = l.merchandise.selectedOptions.find((o) => o.name === 'Color')?.value ?? null;
    const size = l.merchandise.selectedOptions.find((o) => o.name === 'Size')?.value ?? null;
    const img = l.merchandise.image;
    return {
      id: l.id,
      title: l.merchandise.product.title,
      href: `/products/${l.merchandise.product.handle}${colorway ? `?color=${encodeURIComponent(colorway)}` : ''}`,
      colorway,
      size,
      quantity: l.quantity,
      price: l.merchandise.price,
      lineTotal: l.cost.totalAmount,
      image: {code: `P-${l.merchandise.sku?.split('-')[1] ?? 'XX'}-01`, ratio: '4:5', image: img, srcSet: srcSetFor(img?.url), alt: img?.altText ?? ''},
    };
  });
}

/** "Your Digs": right drawer on desktop, full screen on mobile. Empty state shows the capsule. */
export function CartDrawer({cart, products, open, onClose}: CartDrawerProps) {
  const overlay = useOverlay();
  const isOpen = open ?? overlay.open === 'cart';
  const close = onClose ?? overlay.close;
  const fetcher = useFetcher();
  const lines = cart ? cartLineData(cart) : [];
  const busyId = fetcher.formData?.get('lineId') as string | null;
  const intent = fetcher.formData?.get('intent') as string | null;

  const update = (lineId: string, quantity: number) => {
    fetcher.submit({intent: 'LinesUpdate', lineId, quantity: String(quantity)}, {method: 'post', action: '/cart'});
  };
  const remove = (lineId: string) => {
    fetcher.submit({intent: 'LinesRemove', lineId}, {method: 'post', action: '/cart'});
  };
  const labels = {remove: copy.cart.remove, quantity: copy.a11y.quantity, increase: copy.a11y.increase, decrease: copy.a11y.decrease, priceTBA: copy.product.priceTBA, colorway: copy.a11y.colorway, size: copy.a11y.size};

  return (
    <Drawer open={isOpen} onClose={close} side="right" label={copy.cart.head} closeLabel={copy.a11y.closeCart} id="site-cart" title={<span className="type-h3">{copy.cart.head}{cart && cart.totalQuantity ? ` (${cart.totalQuantity})` : ''}</span>} footer={lines.length ? <CartSummary subtotal={cart?.cost.subtotalAmount ?? null} labels={{subtotal: copy.cart.subtotal, taxNote: copy.cart.taxNote, checkout: copy.cta.checkout, priceTBA: copy.product.priceTBA, checkoutNote: text(copy.cart.checkoutNote)}} freeShipping={null} checkoutDisabled /> : undefined}>
      {lines.length ? (
        <ul className="cart-lines">
          {lines.map((l) => (
            <CartLine key={l.id} line={l} labels={labels} onQuantity={update} onRemove={remove} state={busyId === l.id ? (intent === 'LinesRemove' ? 'removing' : 'updating') : 'default'} error={fetcher.data && (fetcher.data as {error?: string}).error && busyId === l.id ? text(copy.cart.lineError) : null} />
          ))}
        </ul>
      ) : (
        <div className="cart-empty">
          <EmptyState variant="cart" heading={copy.cart.empty} body={text(copy.cart.emptyBody)} art={<span className="type-display"><Script word={copy.cart.emptyScript} /></span>} action={<Button to="/collections/all" onClick={close}>{copy.cta.enterShop}</Button>} />
          <ul className="cart-mini-grid" aria-label={copy.home.capsuleHead}>
            {products.map((p) => (
              <li key={p.handle} onClick={close}>
                <ProductCard product={cardData(p)} variant="mini" labels={{priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
