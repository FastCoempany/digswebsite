import type {Route} from './+types/collections.all';
import {copy, text} from '~/lib/copy';
import {ShopPage} from '~/components/pages/ShopPage';

export const meta: Route.MetaFunction = () => [{title: `${copy.shop.head} · ${copy.brand.name}`}, {name: 'description', content: text(copy.shop.dropNote)}];

export async function loader({context}: Route.LoaderArgs) {
  const collection = await context.digs.collection('all');
  if (!collection) throw new Response('Not found', {status: 404});
  return {products: collection.products.nodes};
}

export default function Shop({loaderData}: Route.ComponentProps) {
  return <ShopPage products={loaderData.products} />;
}
