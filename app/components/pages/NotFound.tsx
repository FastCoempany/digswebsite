import type {Product} from '~/lib/mock/types';
import {copy} from '~/lib/copy';

export function NotFound({status = 404, message, products}: {status?: number; message?: string; products: Product[]}) {
  return (
    <section className="container-x section" aria-labelledby="nf-head">
      <p className="type-micro type-caps">{status}</p>
      <h1 id="nf-head" className="type-display">
        {status === 404 ? copy.notFound.head : copy.errors.generic}
      </h1>
      <p className="type-body-lg">{status === 404 ? copy.notFound.sub : message}</p>
      <p>
        <a className="link-inline" href="/collections/all">
          {copy.notFound.cta}
        </a>
      </p>
      <ul>
        {products.map((p) => (
          <li key={p.handle}>
            <a className="link-inline" href={`/products/${p.handle}`}>
              {p.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
