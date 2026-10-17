import {useState} from 'react';
import {photoFor, srcSetFor} from '~/lib/mock';
import {copy, text} from '~/lib/copy';
import {ProductCard, type ProductCardData} from '~/components/core/ProductCard';
import {SegmentedControl} from '~/components/core/SegmentedControl';
import {EmptyState} from '~/components/core/EmptyState';
import {Link} from '~/components/core/Link';
import {Overline} from '~/components/digs/Overline';
import {BlueFrame} from '~/components/digs/BlueFrame';
import {lineWithScript} from '~/components/digs/lineWithScript';
import {Draftable} from '~/components/digs/Draftable';
import './pages.css';

export type ShopFilter = 'all' | 'tops' | 'bottoms';

export function ShopPage({cards, filter: initial = 'all', loading, allSoldOut}: {cards: ProductCardData[]; filter?: ShopFilter; loading?: boolean; allSoldOut?: boolean}) {
  const [filter, setFilter] = useState<ShopFilter>(initial);
  const options = copy.shop.filters.map((label) => ({value: label.toLowerCase() as ShopFilter, label, count: label === 'All' ? cards.length : cards.filter((c) => (c.category ?? '').toLowerCase() === label.toLowerCase()).length}));
  const shown = cards.filter((c) => filter === 'all' || (c.category ?? '').toLowerCase() === filter);
  const e02 = photoFor('E-02', null, '4:5');
  const items = loading ? Array.from({length: 4}).map(() => null) : shown;
  return (
    <section className="sec" aria-labelledby="shop-head">
      <div className="inner">
        <div className="shop-head">
          <Overline>{copy.shop.overline}</Overline>
          <h1 id="shop-head" className="type-display">
            {copy.shop.head}
          </h1>
          <p className="shop-note"><Draftable field={copy.shop.dropNote} /></p>
        </div>
        <SegmentedControl label={copy.a11y.mainNav} options={options} value={filter} onChange={(v) => setFilter(v as ShopFilter)} />
        {!loading && shown.length === 0 ? (
          <EmptyState variant="filter" heading={copy.shop.emptyFilter} action={<Link to="/collections/all" variant="inline" onClick={() => setFilter('all')}>{copy.shop.seeAll}</Link>} />
        ) : (
          <ul className="shop-grid" aria-busy={loading || undefined}>
            {items.flatMap((c, i) => {
              const items = [];
              if (i === 2) {
                items.push(
                  <li key="editorial" className="shop-editorial" aria-hidden="true">
                    <BlueFrame image={{code: 'E-02', ratio: '4:5', image: e02, srcSet: srcSetFor(e02?.url), alt: e02?.altText ?? ''}} headline={lineWithScript(copy.shop.editorialLine)} footer={[copy.brand.instagram, copy.brand.domain]} headingLevel="p" />
                  </li>,
                );
              }
              items.push(
                <li key={c ? c.handle : `skeleton-${i}`}>
                  {c ? <ProductCard product={{...c, soldOut: allSoldOut || c.soldOut, badge: allSoldOut ? {status: 'sold-out', label: copy.product.soldOut} : c.badge}} labels={{priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}} priority={i < 2} headingLevel="h2" /> : <ProductCard loading labels={{priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}} />}
                </li>,
              );
              return items;
            })}
          </ul>
        )}
        {allSoldOut ? <p className="sec-sub" style={{marginTop: 'var(--space-6)'}}><Draftable field={copy.shop.emptyAll} /></p> : null}
      </div>
    </section>
  );
}
