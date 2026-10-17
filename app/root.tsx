import {useNonce} from '@shopify/hydrogen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
  type ShouldRevalidateFunction,
} from 'react-router';
import type {Route} from './+types/root';
import appStyles from '~/styles/app.css?url';
import {resolveMode} from '~/lib/mode';
import {copy} from '~/lib/copy';
import {cardData} from '~/lib/view';
import {PageLayout} from '~/components/digs/chrome/PageLayout';
import {NotFound} from '~/components/pages/NotFound';

export type RootLoader = typeof loader;

/** Default title; routes override it. Error pages (404) get a title through the error branch. */
export const meta: Route.MetaFunction = ({error}) => {
  if (error) {
    const status = isRouteErrorResponse(error) ? error.status : 500;
    return [{title: `${status === 404 ? copy.notFound.head : copy.errors.generic} · ${copy.brand.name}`}];
  }
  return [{title: `${copy.brand.name} · ${copy.brand.ethos}`}];
};

export const shouldRevalidate: ShouldRevalidateFunction = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  if (nextUrl.searchParams.has('mode')) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preload', href: '/fonts/alexandria-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous'},
    {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
  ];
}

export async function loader({request, context}: Route.LoaderArgs) {
  const mode = resolveMode(request, context.session);
  const [cart, products] = await Promise.all([context.digs.cart.get(), context.digs.products()]);
  return {
    mode,
    cart,
    // Card data only (the cart drawer's empty state and the 404 grid); whole products would
    // serialize ~100 KB into every page.
    cards: products.map((p) => cardData(p)),
    siteName: copy.brand.name,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  return (
    <html lang="en" data-mode={data?.mode ?? 'ui'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={appStyles} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  if (!data) return <Outlet />;
  return (
    <PageLayout cart={data.cart} cards={data.cards}>
      <Outlet />
    </PageLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const data = useRouteLoaderData<RootLoader>('root');
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message = isRouteErrorResponse(error)
    ? (error.data as {message?: string})?.message ?? String(error.data ?? '')
    : error instanceof Error
      ? error.message
      : '';
  return (
    <PageLayout cart={data?.cart ?? null} cards={data?.cards ?? []}>
      <NotFound status={status} message={status === 404 ? undefined : message} cards={data?.cards ?? []} />
    </PageLayout>
  );
}
