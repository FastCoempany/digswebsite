import type {Route} from './+types/account';
import {copy} from '~/lib/copy';
import {AccountPage} from '~/components/pages/UtilityPages';

export const meta: Route.MetaFunction = () => [{title: `${copy.pages.account.head} · ${copy.brand.name}`}];

/** /account hands off to Shopify customer accounts once the store exists (03-represent-mechanics.md). */
export default function Account() {
  return <AccountPage />;
}
