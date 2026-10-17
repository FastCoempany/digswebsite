import {RouterContextProvider} from 'react-router';
import {AppSession} from '~/lib/session';
import {createDigsAdapter, type DigsAdapter} from '~/lib/mock';

/**
 * The request context for this phase: a session plus the DIGS mock adapter (app/lib/mock/).
 *
 * No Shopify Storefront client is created on purpose (decision 2: no live store connection).
 * When the store exists, swap this for Hydrogen's `createHydrogenContext(...)` and re-implement
 * the adapter on `context.storefront.query` (06-products.md: a one-file change).
 */
export type DigsContext = {
  session: AppSession;
  digs: DigsAdapter;
  env: Env;
  waitUntil: ExecutionContext['waitUntil'];
};

export async function createDigsRouterContext(request: Request, env: Env, executionContext: ExecutionContext) {
  const waitUntil = executionContext.waitUntil.bind(executionContext);
  // A fixed dev secret keeps `npm run dev` prompt-free (Codespaces); set SESSION_SECRET for real.
  const secret = env?.SESSION_SECRET || 'digs-dev-session-secret-not-for-production';
  const session = await AppSession.init(request, [secret]);
  const context = new RouterContextProvider() as RouterContextProvider & DigsContext;
  Object.assign(context, {
    session,
    digs: createDigsAdapter(session),
    env,
    waitUntil,
  } satisfies DigsContext);
  return context;
}

declare module 'react-router' {
  interface RouterContextProvider extends DigsContext {}
  interface AppLoadContext extends DigsContext {}
}
