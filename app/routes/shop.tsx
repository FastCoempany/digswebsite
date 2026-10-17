import {redirect} from 'react-router';

/** /shop is an alias of the capsule listing (04-ia-and-pages.md). */
export function loader() {
  return redirect('/collections/all', 301);
}
