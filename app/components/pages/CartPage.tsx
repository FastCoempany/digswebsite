import {useFetcher} from 'react-router';
import type {Cart} from '~/lib/mock/types';
import {copy, text} from '~/lib/copy';
import {CartLine} from '~/components/core/CartLine';
import {CartSummary} from '~/components/core/CartSummary';
import {EmptyState} from '~/components/core/EmptyState';
import {ProductCard, type ProductCardData} from '~/components/core/ProductCard';
import {Button} from '~/components/core/Button';
import {Script} from '~/components/digs/marks/Script';
import {cartLineData} from '~/lib/cartLine';
import {Draftable} from '~/components/digs/Draftable';
import './pages.css';

/** /cart: the no-JS fallback for the drawer. */
export function CartPage({cart, cards}: {cart: Cart | null; cards: ProductCardData[]}) {
  // Shares the drawer's fetcher (same key) so a mutation on either surface locks both.
  const fetcher = useFetcher({key: 'cart'});
  const lines = cart ? cartLineData(cart) : [];
  // One mutation at a time (the cart is cookie-backed): the busy line shows its state, the others lock.
  const busyId = fetcher.formData?.get('lineId') as string | null;
  const intent = fetcher.formData?.get('intent') as string | null;
  const pending = fetcher.state !== 'idle';
  const formIdFor = (id: string) => `cart-line-${id.split('/').pop()}`;
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
                <CartLine key={l.id} line={l} labels={labels} headingLevel="h2" formId={formIdFor(l.id)} locked={pending && busyId !== l.id} state={busyId === l.id ? (intent === 'LinesRemove' ? 'removing' : 'updating') : 'default'} error={fetcher.data && (fetcher.data as {error?: string}).error && busyId === l.id ? <Draftable field={copy.cart.lineError} /> : null} />
              ))}
            </ul>
            {/* No-JS path: each line's stepper and remove button are submit buttons of one of these forms
                (the stepper submits a quantity, the remove button intent=LinesRemove); with JS the
                fetcher handles the same submission in place. */}
            {lines.map((l) => (
              <fetcher.Form key={l.id} id={formIdFor(l.id)} method="post" action="/cart" hidden>
                <input type="hidden" name="lineId" value={l.id} />
              </fetcher.Form>
            ))}
            <CartSummary subtotal={cart?.cost.subtotalAmount ?? null} labels={{subtotal: copy.cart.subtotal, taxNote: copy.cart.taxNote, checkout: copy.cta.checkout, priceTBA: copy.product.priceTBA, checkoutNote: <Draftable field={copy.cart.checkoutNote} />}} checkoutDisabled />
          </>
        ) : (
          <>
            <EmptyState variant="cart" heading={copy.cart.empty} body={<Draftable field={copy.cart.emptyBody} />} art={<span className="type-display"><Script word={copy.cart.emptyScript} /></span>} action={<Button to="/collections/all">{copy.cta.enterShop}</Button>} />
            <ul className="capsule-grid">
              {cards.map((c) => (
                <li key={c.handle}>
                  <ProductCard product={c} labels={{priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}} headingLevel="h2" />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
