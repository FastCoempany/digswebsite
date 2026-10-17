import type {Route} from './+types/pages.$handle';

/** Unknown page handles 404 (the known pages have their own route files). */
export function loader({params}: Route.LoaderArgs) {
  throw new Response(`Page ${params.handle} not found`, {status: 404});
}
