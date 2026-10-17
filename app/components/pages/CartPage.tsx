import {useFetcher} from 'react-router';
import type {Cart, Product} from '~/lib/mock/types';
import {copy, text} from '~/lib/copy';
import {cardData} from '~/lib/view';
import {CartLine} from '~/components/core/CartLine';
import {CartSummary} from '~/components/core/CartSummary';
import {EmptyState} from '~/components/core/EmptyState';
import {ProductCard} from '~/components/core/ProductCard';
import {Button} from '~/components/core/Button';
import {Script} from '~/components/digs/marks/Script';
import {cartLineData} from '~/components/digs/chrome/CartDrawer';
import './pages.css';

/** /cart: the no-JS fallback for the drawer. */
export function CartPage({cart, products}: {cart: Cart | null; products: Product[]}) {
  const fetcher = useFetcher();
  const lines = cart ? cartLineData(cart) : [];
  const labels = {remove: copy.cart.remove, quantity: copy.a11y.quantity, increase: copy.a11y.increase, decrease: copy.a11y.decrease, priceTBA: copy.product.priceTBA, colorway: copy.a11y.colorway, size: copy.a11y.size};
  return (
    <section className="sec" aria-labelledby="cart-head">
      <div className="inner cart-page">
        <h1 id="cart-head" className="type-display">
          {copy.cart.head}
        </h1>
        {lines.length ? (
          <>
            <ul className="cart-lines">
              {lines.map((l) => (
                <CartLine key={l.id} line={l} labels={labels} onQuantity={(id, q) => fetcher.submit({intent: 'LinesUpdate', lineId: id, quantity: String(q)}, {method: 'post', action: '/cart'})} onRemove={(id) => fetcher.submit({intent: 'LinesRemove', lineId: id}, {method: 'post', action: '/cart'})} />
              ))}
            </ul>
            <CartSummary subtotal={cart?.cost.subtotalAmount ?? null} labels={{subtotal: copy.cart.subtotal, taxNote: copy.cart.taxNote, checkout: copy.cta.checkout, priceTBA: copy.product.priceTBA, checkoutNote: text(copy.cart.checkoutNote)}} checkoutDisabled />
          </>
        ) : (
          <>
            <EmptyState variant="cart" heading={copy.cart.empty} body={text(copy.cart.emptyBody)} art={<span className="type-display"><Script word={copy.cart.emptyScript} /></span>} action={<Button to="/collections/all">{copy.cta.enterShop}</Button>} />
            <ul className="capsule-grid">
              {products.map((p) => (
                <li key={p.handle}>
                  <ProductCard product={cardData(p)} labels={{priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}} headingLevel="h2" />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
