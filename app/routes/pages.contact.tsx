import type {Route} from './+types/pages.contact';
import {copy} from '~/lib/copy';
import {ContactPage} from '~/components/pages/UtilityPages';

export const meta: Route.MetaFunction = () => [{title: `${copy.pages.contact.head} · ${copy.brand.name}`}];

export default function Page() {
  return <ContactPage />;
}
