import type {Route} from './+types/pages.shipping-returns';
import {copy} from '~/lib/copy';
import {ShippingReturnsPage} from '~/components/pages/UtilityPages';

export const meta: Route.MetaFunction = () => [{title: `${copy.pages.shippingReturns.head} · ${copy.brand.name}`}];

export default function Page() {
  return <ShippingReturnsPage />;
}
