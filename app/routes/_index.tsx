import type {Route} from './+types/_index';
import {copy} from '~/lib/copy';
import {HomePage} from '~/components/pages/HomePage';
import {cardData} from '~/lib/view';

export const meta: Route.MetaFunction = () => [
  {title: `${copy.brand.name} · ${copy.brand.ethos}`},
  {name: 'description', content: copy.home.heroSub},
];

export async function loader({context}: Route.LoaderArgs) {
  const products = await context.digs.products();
  return {cards: products.map((p) => cardData(p)), thermal: products.find((p) => p.handle === 'thermal-long-sleeve') ?? null};
}

export default function Home({loaderData}: Route.ComponentProps) {
  return <HomePage cards={loaderData.cards} thermal={loaderData.thermal} />;
}
