import type {Route} from './+types/pages.manifesto';
import {copy} from '~/lib/copy';
import {ManifestoPage} from '~/components/pages/ManifestoPage';

export const meta: Route.MetaFunction = () => [{title: `${copy.nav.manifesto} · ${copy.brand.name}`}];

export default function Page() {
  return <ManifestoPage />;
}
