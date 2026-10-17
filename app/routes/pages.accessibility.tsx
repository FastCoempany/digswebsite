import type {Route} from './+types/pages.accessibility';
import {copy} from '~/lib/copy';
import {AccessibilityPage} from '~/components/pages/UtilityPages';

export const meta: Route.MetaFunction = () => [{title: `${copy.pages.accessibility.head} · ${copy.brand.name}`}];

export default function Page() {
  return <AccessibilityPage />;
}
