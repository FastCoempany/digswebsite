import type {Route} from './+types/$';

/** Catch-all: a 404 that renders the DIGS not-found page through the root ErrorBoundary. */
export async function loader({request}: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {status: 404});
}

export default function CatchAll() {
  return null;
}
