import type {Route} from './+types/policies._index';
import {copy} from '~/lib/copy';
import {PoliciesPage} from '~/components/pages/UtilityPages';

export const meta: Route.MetaFunction = () => [{title: `${copy.pages.policies.head} · ${copy.brand.name}`}];

export async function loader({context}: Route.LoaderArgs) {
  return {policies: await context.digs.policies()};
}

export default function Policies({loaderData}: Route.ComponentProps) {
  return <PoliciesPage policies={loaderData.policies} />;
}
