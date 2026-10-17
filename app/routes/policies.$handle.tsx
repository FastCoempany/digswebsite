import type {Route} from './+types/policies.$handle';
import {copy} from '~/lib/copy';
import {PolicyPage} from '~/components/pages/UtilityPages';

export const meta: Route.MetaFunction = ({data}) => [{title: `${data?.policy.title ?? copy.pages.policies.head} · ${copy.brand.name}`}];

export async function loader({params, context}: Route.LoaderArgs) {
  const policy = await context.digs.policy(params.handle);
  if (!policy) throw new Response(`Policy ${params.handle} not found`, {status: 404});
  return {policy};
}

export default function Policy({loaderData}: Route.ComponentProps) {
  return <PolicyPage policy={loaderData.policy} />;
}
