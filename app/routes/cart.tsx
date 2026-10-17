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
  const qty = (v: FormDataEntryValue | null, lo: number) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= lo && n <= 99 ? n : lo;
  };
  try {
    switch (intent) {
      case 'LinesAdd': {
        const merchandiseId = String(form.get('merchandiseId') ?? '');
        const quantity = qty(form.get('quantity'), 1);
        const before = await digs.cart.get();
        const cart = await digs.cart.apply({action: 'LinesAdd', lines: [{merchandiseId, quantity}]});
        if (cart.totalQuantity === before.totalQuantity) return data({cart, error: `Unknown variant ${merchandiseId}`}, {status: 400});
        return data({cart, ok: true});
      }
      case 'LinesUpdate': {
        const cart = await digs.cart.apply({action: 'LinesUpdate', lines: [{id: String(form.get('lineId')), quantity: qty(form.get('quantity'), 0)}]});
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
