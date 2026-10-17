import type {Route} from './+types/products.$handle';
import {copy} from '~/lib/copy';
import {ProductPage} from '~/components/pages/ProductPage';

export const meta: Route.MetaFunction = ({data}) => [
  {title: data ? `${data.product.title} · ${copy.brand.name}` : copy.brand.name},
  {name: 'description', content: data?.product.seo.description ?? ''},
];

export async function loader({params, request, context}: Route.LoaderArgs) {
  const [product, all] = await Promise.all([context.digs.product(params.handle), context.digs.products()]);
  if (!product) throw new Response(`Product ${params.handle} not found`, {status: 404});
  const color = new URL(request.url).searchParams.get('color');
  return {product, others: all.filter((p) => p.handle !== product.handle), color};
}

export default function Product({loaderData}: Route.ComponentProps) {
  return <ProductPage key={loaderData.product.handle} product={loaderData.product} others={loaderData.others} color={loaderData.color} />;
}
