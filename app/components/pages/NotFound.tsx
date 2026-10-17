import {copy} from '~/lib/copy';
import {EmptyState} from '~/components/core/EmptyState';
import {Button} from '~/components/core/Button';
import {ProductCard, type ProductCardData} from '~/components/core/ProductCard';
import {Script} from '~/components/digs/marks/Script';
import './pages.css';

/** 404: "This page doesn't exist. The capsule does." + the four products. */
export function NotFound({status = 404, message, cards}: {status?: number; message?: string; cards: ProductCardData[]}) {
  return (
    <section className="sec" aria-labelledby="nf-head">
      <div className="inner">
        <EmptyState variant="404" heading={<span id="nf-head" role="heading" aria-level={1}>{status === 404 ? copy.notFound.head : copy.errors.generic}</span>} body={status === 404 ? <>{copy.notFound.sub} <Script word="dope" /></> : message} action={<Button to="/collections/all" size="lg">{copy.notFound.cta}</Button>} />
        <ul className="capsule-grid nf-grid">
          {cards.map((c) => (
            <li key={c.handle}>
              <ProductCard product={c} labels={{priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
