import type {Route} from './+types/_index';
import {copy} from '~/lib/copy';
import {HomePage} from '~/components/pages/HomePage';

export const meta: Route.MetaFunction = () => [
  {title: `${copy.brand.name} · ${copy.brand.ethos}`},
  {name: 'description', content: copy.home.heroSub},
];

export async function loader({context}: Route.LoaderArgs) {
  const products = await context.digs.products();
  return {products};
}

export default function Home({loaderData}: Route.ComponentProps) {
  return <HomePage products={loaderData.products} />;
}
