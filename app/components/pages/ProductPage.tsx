import {useEffect, useRef, useState} from 'react';
import {useFetcher, useSearchParams} from 'react-router';
import type {Product, ProductStatus} from '~/lib/mock/types';
import {digs, srcSetFor} from '~/lib/mock';
import {copy, fill, text} from '~/lib/copy';
import {Breadcrumb} from '~/components/core/Breadcrumb';
import {ProductGallery} from '~/components/core/ProductGallery';
import {Price} from '~/components/core/Price';
import {SwatchGroup} from '~/components/core/SwatchGroup';
import {SizeSelector} from '~/components/core/SizeSelector';
import {Button} from '~/components/core/Button';
import {Accordion} from '~/components/core/Accordion';
import {Modal} from '~/components/core/Modal';
import {SizeChart, type SizeChartUnit} from '~/components/core/SizeChart';
import {ProductCard, type ProductCardData} from '~/components/core/ProductCard';
import {Badge} from '~/components/core/Badge';
import {useOverlay} from '~/components/core/OverlayProvider';
import {StyleString} from '~/components/digs/StyleString';
import {Overline} from '~/components/digs/Overline';
import {BuiltLikeThis} from '~/components/digs/BuiltLikeThis';
import {flatsFor, anchorsFor} from '~/components/digs/flats';
import {badgeFor} from '~/lib/view';
import './pages.css';

export type ProductPageProps = {
  product: Product;
  others: ProductCardData[];
  /** Initial colorway (from ?color=). */
  color?: string | null;
  /** Stories: force a state. */
  forceStatus?: ProductStatus;
  forceSize?: string | null;
  forceError?: boolean;
  forceAdding?: boolean;
  sizeGuideOpen?: boolean;
};

export function ProductPage({product, others, color, forceStatus, forceSize = null, forceError, forceAdding, sizeGuideOpen}: ProductPageProps) {
  const colorways = digs.colorways(product);
  const [params, setParams] = useSearchParams();
  const paramColor = color ?? params.get('color');
  const selectedColor = colorways.find((c) => c.name === paramColor)?.name ?? colorways[0]?.name ?? null;
  const [size, setSize] = useState<string | null>(forceSize);
  const [error, setError] = useState<string | null>(forceError ? copy.cta.selectSize : null);
  const [guide, setGuide] = useState(Boolean(sizeGuideOpen));
  const [unit, setUnit] = useState<SizeChartUnit>('in');
  const status = forceStatus ?? digs.status(product);
  const gallery = digs.galleryFor(product, selectedColor);
  const sizes = digs.sizes(product);
  const variant = digs.variantFor(product, selectedColor, size ?? sizes[0] ?? null);
  const chosen = size ? digs.variantFor(product, selectedColor, size) : null;
  const chart = digs.sizeChart(product);
  const hotspots = digs.hotspots(product);
  const fetcher = useFetcher();
  const {setOpen, toast} = useOverlay();
  const buyRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  const [galleryKey, setGalleryKey] = useState(selectedColor);
  const adding = forceAdding || fetcher.state !== 'idle';
  const preorderDate = digs.preorderShipDate(product);
  const laterColorways = digs.laterColorways(product);

  useEffect(() => {
    const el = buyRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0), {threshold: 0});
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && (fetcher.data as {ok?: boolean}).ok) {
      toast(copy.product.added, 'added-to-cart');
      setOpen('cart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  const chooseColor = (name: string) => {
    const next = new URLSearchParams(params);
    next.set('color', name);
    setParams(next, {preventScrollReset: true, replace: true});
    setGalleryKey(name);
  };

  const sizeOptions = sizes.map((s) => {
    const v = digs.variantFor(product, selectedColor, s);
    const available = status === 'sold-out' ? false : status === 'coming-soon' || status === 'pre-order' || status === 'new' ? true : Boolean(v?.availableForSale);
    return {value: s, available};
  });

  const ctaLabel =
    status === 'coming-soon' ? copy.cta.comingSoon : status === 'sold-out' || (chosen && !sizeOptions.find((o) => o.value === chosen.selectedOptions[1]?.value)?.available) ? copy.cta.backInStock : size ? copy.cta.addToCart : copy.cta.selectSize;

  const primary = () => {
    if (status === 'coming-soon') {
      toast(copy.product.listConfirm);
      return;
    }
    if (!size) {
      setError(copy.cta.selectSize);
      return;
    }
    setError(null);
    if (status === 'sold-out') {
      toast(copy.product.holdConfirm);
      return;
    }
    if (!chosen) return;
    fetcher.submit({intent: 'LinesAdd', merchandiseId: chosen.id, quantity: '1'}, {method: 'post', action: '/cart'});
  };

  const measurementsFor = (s: string | null) =>
    chart && s
      ? chart.rows.map((r) => ({label: r.label, value: r.sizes[s] ? (unit === 'in' ? `${r.sizes[s].label} in` : `${r.sizes[s].cm} cm`) : '–'}))
      : [];

  const accordion = [
    {
      id: 'details',
      title: copy.product.accordions[0],
      content: (
        <>
          <p>
            <strong>{copy.product.fabricHead}.</strong>
          </p>
          <ul>
            {digs.fabric(product).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p>
            <strong>{copy.product.finishHead}.</strong> {digs.finish(product)}
          </p>
          <ul>
            {digs.details(product).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'fit',
      title: copy.product.accordions[1],
      content: (
        <>
          <p>{digs.fit(product)}</p>
          {chart?.note ? <p>{chart.note}</p> : null}
          <div className="pdp-measure">
            <p>
              <strong>{size ? fill(copy.product.measurementsHead, {size}) : copy.product.measurementsHeadNoSize}</strong>
            </p>
            {size ? (
              <dl>
                {measurementsFor(size).map((m) => (
                  <div key={m.label} style={{display: 'contents'}}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>{copy.cta.selectSize}.</p>
            )}
            <p>
              <button type="button" className="link-inline" onClick={() => setGuide(true)}>
                {copy.cta.sizeGuide}
              </button>
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'care',
      title: copy.product.accordions[2],
      content: (
        <>
          <ul>
            {digs.care(product).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            <strong>{copy.product.contentHead}.</strong> {digs.content(product)}
          </p>
          <p>{digs.origin(product)}</p>
        </>
      ),
    },
    {id: 'shipping', title: copy.product.accordions[3], content: <p>{text(copy.product.shippingReturnsBody)}</p>},
  ];

  const badge = badgeFor(status);
  const labels = {priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway};

  return (
    <article className="pdp" aria-labelledby="pdp-title">
      <div className="pdp-crumbs">
        <Breadcrumb label={copy.a11y.breadcrumb} items={[{label: copy.nav.shop, to: '/collections/all'}, {label: product.title}]} />
      </div>

      <div className="pdp-gallery bleed" key={galleryKey}>
        <div className="pdp-gallery-fade">
          <ProductGallery
            items={gallery.map((g) => ({code: g.code, ratio: g.ratio, image: g.image, srcSet: srcSetFor(g.image?.url), alt: g.image?.altText ?? `${product.title}${g.colorway ? `, ${g.colorway}` : ''}`}))}
            labels={{previous: copy.a11y.previousImage, next: copy.a11y.nextImage, counter: copy.a11y.imageCounter, zoom: copy.a11y.zoomImage, close: copy.a11y.close, gallery: product.title}}
            rail={<span className="pdp-rail type-micro type-caps">{copy.rails.gallery}</span>}
            caption={copy.product.imageDisclosure}
          />
        </div>
      </div>

      <div className="pdp-info">
        <StyleString value={digs.styleString(product)} />
        <div>
          <h1 id="pdp-title" className="pdp-title">
            {product.title}
            {selectedColor ? `, ${selectedColor}` : ''}
          </h1>
        </div>
        <div className="pdp-price-row">
          <div style={{display: 'flex', gap: 'var(--space-3)', alignItems: 'center'}}>
            <Price price={variant?.price ?? null} compareAtPrice={variant?.compareAtPrice ?? null} labels={{tba: copy.product.priceTBA}} size="lg" />
            {badge ? <Badge status={badge.status}>{badge.label}</Badge> : null}
          </div>
          {status === 'pre-order' && preorderDate ? <p className="pdp-preorder">{fill(copy.product.preorder, {date: preorderDate})}</p> : null}
        </div>
        <p className="pdp-short">{text((copy.product.short as Record<string, {status?: string; text: string}>)[product.handle] ?? {text: ''})}</p>

        <SwatchGroup label={copy.a11y.colorway} options={colorways.map((c) => ({value: c.name, label: c.name, color: c.color, available: true}))} value={selectedColor} onChange={chooseColor} size="md" showName />
        {laterColorways.length ? <p className="type-small" style={{color: 'var(--color-text-secondary)'}}>{fill(text(copy.product.moreColorways), {names: laterColorways.join(', ')})}</p> : null}

        <SizeSelector
          label={copy.a11y.size}
          sizes={sizeOptions}
          value={size}
          onChange={(s) => {
            setSize(s);
            setError(null);
          }}
          error={error}
          holdLabel={copy.cta.backInStock}
          onHold={() => toast(copy.product.holdConfirm)}
          soldOutLabel={copy.product.soldOut}
          aside={
            <button type="button" className="link-inline" onClick={() => setGuide(true)}>
              {copy.cta.sizeGuide}
            </button>
          }
        />

        <div className="pdp-buy" ref={buyRef}>
          <Button size="lg" fullWidth onClick={primary} loading={adding} variant={status === 'coming-soon' ? 'secondary' : 'primary'}>
            {ctaLabel}
          </Button>
          {text(copy.product.shippingLine) ? <p className="type-small">{text(copy.product.shippingLine)}</p> : null}
        </div>

        <Accordion items={accordion} defaultOpen={['details']} headingLevel="h2" />
        <p className="pdp-origin">{digs.origin(product)}</p>
      </div>

      <div className="pdp-below">
        <section className="sec pdp-built" aria-labelledby="pdp-built-head">
          <div className="inner">
            <div className="sec-head">
              <Overline>{digs.styleCode(product)}</Overline>
              <h2 id="pdp-built-head" className="type-display">
                {copy.product.builtHead}
              </h2>
            </div>
            <BuiltLikeThis flats={flatsFor(product.handle)} hotspots={hotspots} anchors={anchorsFor(product.handle, hotspots.length)} productName={product.title} labels={{hotspot: copy.a11y.hotspot, where: copy.product.builtWhere, spec: copy.product.builtSpec, front: copy.product.viewFront, back: copy.product.viewBack, allDetails: copy.product.builtAll}} />
            <p className="pdp-tech" style={{marginTop: 'var(--space-5)'}}>
              {fill(copy.product.techPackLine, {code: digs.styleCode(product), revision: (JSON.parse(product.metafields.find((m) => m?.key === 'tech_pack')?.value ?? '{}') as {revision?: string}).revision ?? ''})}
            </p>
          </div>
        </section>

        <section className="sec pdp-complete" aria-labelledby="pdp-complete-head">
          <div className="inner">
            <div className="sec-head">
              <Overline>{copy.brand.season}</Overline>
              <h2 id="pdp-complete-head" className="type-display">
                {copy.product.completeHead}
              </h2>
            </div>
            <ul className="capsule-grid">
              {others.map((c) => (
                <li key={c.handle}>
                  <ProductCard product={c} labels={labels} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className={`pdp-sticky ${sticky ? 'is-visible' : ''}`} aria-hidden={!sticky}>
        <div className="pdp-sticky-meta">
          <span className="type-ui">{product.title}</span>
          <span>
            <Price price={variant?.price ?? null} labels={{tba: copy.product.priceTBA}} size="sm" />
            {size ? ` · ${size}` : ''}
          </span>
        </div>
        <Button onClick={primary} loading={adding} tabIndex={sticky ? 0 : -1} variant={status === 'coming-soon' ? 'secondary' : 'primary'}>
          {ctaLabel}
        </Button>
      </div>

      {chart ? (
        <Modal open={guide} onClose={() => setGuide(false)} title={copy.cta.sizeGuide} closeLabel={copy.a11y.close} size="lg">
          <SizeChart title={product.title} sizes={chart.sizes} rows={chart.rows} unit={unit} onUnitChange={setUnit} selectedSize={size} note={chart.note} labels={{units: copy.a11y.unitToggle, inches: copy.a11y.inches, centimetres: copy.a11y.centimetres, measurement: copy.product.measurementsHeadNoSize, laidFlat: copy.a11y.laidFlat, note: copy.product.sizeNoteLaidFlat}} />
        </Modal>
      ) : null}
    </article>
  );
}
