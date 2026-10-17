import type {Route} from './+types/[robots.txt]';

export async function loader(_args: Route.LoaderArgs) {
  // Pre-launch: nothing is indexed until the store is live (no sitemap is served yet).
  const body = `User-agent: *\nDisallow: /\n`;
  return new Response(body, {headers: {'Content-Type': 'text/plain'}});
}
