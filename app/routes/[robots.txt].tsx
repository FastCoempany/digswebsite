import type {Route} from './+types/[robots.txt]';

export async function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  // Pre-launch: nothing is indexed until the store is live.
  const body = `User-agent: *\nDisallow: /\n\nSitemap: ${url.origin}/sitemap.xml\n`;
  return new Response(body, {headers: {'Content-Type': 'text/plain'}});
}
