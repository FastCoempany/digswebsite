import type {Route} from './+types/pages.size-guide';
import {copy} from '~/lib/copy';
import {SizeGuidePage} from '~/components/pages/UtilityPages';

export const meta: Route.MetaFunction = () => [{title: `${copy.pages.sizeGuide.head} · ${copy.brand.name}`}];

export async function loader({context}: Route.LoaderArgs) {
  return {products: await context.digs.products()};
}

export default function Page({loaderData}: Route.ComponentProps) {
  return <SizeGuidePage products={loaderData.products} />;
}
