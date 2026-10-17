import type {Route} from './+types/pages.faq';
import {copy} from '~/lib/copy';
import {FaqPage} from '~/components/pages/UtilityPages';

export const meta: Route.MetaFunction = () => [{title: `${copy.pages.faq.head} · ${copy.brand.name}`}];

export default function Page() {
  return <FaqPage />;
}
