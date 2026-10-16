import type {Route} from './+types/_index';
import {copy} from '~/lib/copy';

export const meta: Route.MetaFunction = () => [
  {title: `${copy.brand.name} · ${copy.brand.ethos}`},
  {name: 'description', content: copy.home.heroSub},
];

export async function loader({context}: Route.LoaderArgs) {
  const products = await context.digs.products();
  return {products};
}

export default function Home({loaderData}: Route.ComponentProps) {
  return (
    <section className="container-x section">
      <p className="type-micro type-caps">{copy.home.heroOverline}</p>
      <h1 className="type-display-xl">{copy.home.manifestoHead}</h1>
      <p className="type-body-lg">{copy.home.heroSub}</p>
      <ul>
        {loaderData.products.map((p) => (
          <li key={p.handle}>
            <a className="link-inline" href={`/products/${p.handle}`}>
              {p.title}
            </a>
          </li>
        ))}
      </ul>
      <p>
        <a className="link-inline" href="/dev/tokens">
          Token test page
        </a>
      </p>
    </section>
  );
}
