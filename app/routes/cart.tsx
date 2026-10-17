import {data} from 'react-router';
import type {Route} from './+types/cart';
import {CartPage} from '~/components/pages/CartPage';
import {copy} from '~/lib/copy';
import {cardData} from '~/lib/view';

export const meta: Route.MetaFunction = () => [{title: `${copy.cart.head} · ${copy.brand.name}`}];

/** Mock cart mutations (Storefront-shaped). Nothing talks to Shopify in this phase. */
export async function action({request, context}: Route.ActionArgs) {
  const form = await request.formData();
  const intent = String(form.get('intent') ?? '');
  const {digs} = context;
  // A quantity must be a whole number in range; anything else is rejected, never rounded or defaulted.
  const qty = (v: FormDataEntryValue | null, lo: number): number | null => {
    if (typeof v !== 'string' || !/^\d+$/.test(v.trim())) return null;
    const n = Number(v);
    return n >= lo && n <= 99 ? n : null;
  };
  const invalid = (v: FormDataEntryValue | null) => data({error: `Invalid quantity ${v === null ? '(missing)' : JSON.stringify(String(v))}`}, {status: 400});
  try {
    switch (intent) {
      case 'LinesAdd': {
        const merchandiseId = String(form.get('merchandiseId') ?? '');
        const quantity = qty(form.get('quantity'), 1);
        if (quantity === null) return invalid(form.get('quantity'));
        const before = await digs.cart.get();
        const cart = await digs.cart.apply({action: 'LinesAdd', lines: [{merchandiseId, quantity}]});
        if (cart.totalQuantity === before.totalQuantity) return data({cart, error: `Variant unknown or unavailable: ${merchandiseId}`}, {status: 400});
        return data({cart, ok: true});
      }
      case 'LinesUpdate': {
        const quantity = qty(form.get('quantity'), 0);
        if (quantity === null) return invalid(form.get('quantity'));
        const cart = await digs.cart.apply({action: 'LinesUpdate', lines: [{id: String(form.get('lineId')), quantity}]});
        return data({cart, ok: true});
      }
      case 'LinesRemove': {
        const cart = await digs.cart.apply({action: 'LinesRemove', lineIds: [String(form.get('lineId'))]});
        return data({cart, ok: true});
      }
      default:
        return data({error: `Unknown intent ${intent}`}, {status: 400});
    }
  } catch (e) {
    return data({error: e instanceof Error ? e.message : 'error'}, {status: 500});
  }
}

export async function loader({context}: Route.LoaderArgs) {
  const [cart, products] = await Promise.all([context.digs.cart.get(), context.digs.products()]);
  return {cart, cards: products.map((p) => cardData(p))};
}

/** No-JS fallback page for the drawer. */
export default function Cart({loaderData}: Route.ComponentProps) {
  return <CartPage cart={loaderData.cart} cards={loaderData.cards} />;
}
