import {redirect} from 'react-router';
import type {Route} from './+types/collections.$handle';

/** Any other collection handle resolves to the capsule (tops/bottoms are filters, not collections). */
export function loader({params}: Route.LoaderArgs) {
  if (params.handle === 'all') return redirect('/collections/all', 301);
  throw new Response('Not found', {status: 404});
}
