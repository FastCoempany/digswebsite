import {redirect} from 'react-router';

/** One collection: the capsule. */
export function loader() {
  return redirect('/collections/all', 301);
}
