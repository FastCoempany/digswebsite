import {useFetcher} from 'react-router';
import type {Cart} from '~/lib/mock/types';
import {cartLineData} from '~/lib/cartLine';
import {Drawer} from '~/components/core/Drawer';
import {CartLine} from '~/components/core/CartLine';
import {CartSummary} from '~/components/core/CartSummary';
import {EmptyState} from '~/components/core/EmptyState';
import {ProductCard, type ProductCardData} from '~/components/core/ProductCard';
import {Button} from '~/components/core/Button';
import {useOverlay} from '~/components/core/OverlayProvider';
import {Script} from '~/components/digs/marks/Script';
import {Draftable} from '~/components/digs/Draftable';
import {copy} from '~/lib/copy';
import './chrome.css';

export type CartDrawerProps = {cart: Cart | null; cards: ProductCardData[]; open?: boolean; onClose?: () => void; slot?: React.ReactNode};

/** "Your Digs": right drawer on desktop, full screen on mobile. Empty state shows the capsule. */
export function CartDrawer({cart, cards, open, onClose, slot}: CartDrawerProps) {
  const overlay = useOverlay();
  const isOpen = open ?? overlay.open === 'cart';
  const close = onClose ?? overlay.close;
  const fetcher = useFetcher({key: 'cart'});
  const lines = cart ? cartLineData(cart) : [];
  const busyId = fetcher.formData?.get('lineId') as string | null;
  const intent = fetcher.formData?.get('intent') as string | null;
  // The cart lives in the session cookie, so mutations must not overlap: while one line's request
  // is pending every other line ignores input (the fetcher would otherwise race the same snapshot).
  const pending = fetcher.state !== 'idle';

  const update = (lineId: string, quantity: number) => {
    fetcher.submit({intent: 'LinesUpdate', lineId, quantity: String(quantity)}, {method: 'post', action: '/cart'});
  };
  const remove = (lineId: string) => {
    fetcher.submit({intent: 'LinesRemove', lineId}, {method: 'post', action: '/cart'});
  };
  const labels = {remove: copy.cart.remove, quantity: copy.a11y.quantity, increase: copy.a11y.increase, decrease: copy.a11y.decrease, priceTBA: copy.product.priceTBA, colorway: copy.a11y.colorway, size: copy.a11y.size};

  return (
    <Drawer open={isOpen} onClose={close} slot={slot} side="right" label={copy.cart.head} closeLabel={copy.a11y.closeCart} id="site-cart" title={<span className="type-h3">{copy.cart.head}{cart && cart.totalQuantity ? ` (${cart.totalQuantity})` : ''}</span>} footer={lines.length ? <CartSummary subtotal={cart?.cost.subtotalAmount ?? null} labels={{subtotal: copy.cart.subtotal, taxNote: copy.cart.taxNote, checkout: copy.cta.checkout, priceTBA: copy.product.priceTBA, checkoutNote: <Draftable field={copy.cart.checkoutNote} />}} freeShipping={null} checkoutDisabled /> : undefined}>
      {lines.length ? (
        <ul className="cart-lines">
          {lines.map((l) => (
            <CartLine key={l.id} line={l} labels={labels} headingLevel="h2" onQuantity={update} onRemove={remove} locked={pending && busyId !== l.id} state={busyId === l.id ? (intent === 'LinesRemove' ? 'removing' : 'updating') : 'default'} error={fetcher.data && (fetcher.data as {error?: string}).error && busyId === l.id ? <Draftable field={copy.cart.lineError} /> : null} />
          ))}
        </ul>
      ) : (
        <div className="cart-empty">
          <EmptyState variant="cart" heading={copy.cart.empty} body={<Draftable field={copy.cart.emptyBody} />} art={<span className="type-display"><Script word={copy.cart.emptyScript} /></span>} action={<Button to="/collections/all" onClick={close}>{copy.cta.enterShop}</Button>} />
          <ul className="cart-mini-grid" aria-label={copy.home.capsuleHead}>
            {cards.map((c) => (
              <li key={c.handle} onClick={close}>
                <ProductCard product={c} variant="mini" labels={{priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
