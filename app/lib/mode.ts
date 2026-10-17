import type {HydrogenSession} from '@shopify/hydrogen';

/** UI or wireframe mode (04-ia-and-pages.md "Wireframe mode"): `?mode=wire` sticks for the session. */
export type Mode = 'ui' | 'wire';

const KEY = 'digsMode';

export function resolveMode(request: Request, session: HydrogenSession): Mode {
  const url = new URL(request.url);
  const param = url.searchParams.get('mode');
  if (param === 'wire' || param === 'ui') {
    if (session.get(KEY) !== param) session.set(KEY, param);
    return param;
  }
  const stored = session.get(KEY) as Mode | undefined;
  return stored === 'wire' ? 'wire' : 'ui';
}
