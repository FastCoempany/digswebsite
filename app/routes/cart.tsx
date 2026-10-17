import {data} from 'react-router';
import type {Route} from './+types/cart';
import {CartPage} from '~/components/pages/CartPage';
import {copy} from '~/lib/copy';

export const meta: Route.MetaFunction = () => [{title: `${copy.cart.head} · ${copy.brand.name}`}];

/** Mock cart mutations (Storefront-shaped). Nothing talks to Shopify in this phase. */
export async function action({request, context}: Route.ActionArgs) {
  const form = await request.formData();
  const intent = String(form.get('intent') ?? '');
  const {digs} = context;
  try {
    switch (intent) {
      case 'LinesAdd': {
        const merchandiseId = String(form.get('merchandiseId') ?? '');
        const quantity = Number(form.get('quantity') ?? 1) || 1;
        const cart = await digs.cart.apply({action: 'LinesAdd', lines: [{merchandiseId, quantity}]});
        return data({cart, ok: true});
      }
      case 'LinesUpdate': {
        const cart = await digs.cart.apply({action: 'LinesUpdate', lines: [{id: String(form.get('lineId')), quantity: Number(form.get('quantity') ?? 1)}]});
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
  return {cart, products};
}

/** No-JS fallback page for the drawer. */
export default function Cart({loaderData}: Route.ComponentProps) {
  return <CartPage cart={loaderData.cart} products={loaderData.products} />;
}
