import {useState} from 'react';
import type {Product} from '~/lib/mock/types';
import {digs, photoFor, srcSetFor} from '~/lib/mock';
import {copy, text} from '~/lib/copy';
import {ProductCard, type ProductCardData} from '~/components/core/ProductCard';
import {Link} from '~/components/core/Link';
import {Button} from '~/components/core/Button';
import {NewsletterForm, type NewsletterStatus} from '~/components/core/NewsletterForm';
import {HeroWordmark} from '~/components/digs/HeroWordmark';
import {Manifesto} from '~/components/digs/Manifesto';
import {Overline} from '~/components/digs/Overline';
import {Sticker} from '~/components/digs/Sticker';
import {Script} from '~/components/digs/marks/Script';
import {BuiltLikeThis} from '~/components/digs/BuiltLikeThis';
import {BlueFrame} from '~/components/digs/BlueFrame';
import {PosterWall, type PosterTile} from '~/components/digs/PosterWall';
import {lineWithScript} from '~/components/digs/lineWithScript';
import {flatsFor, anchorsFor} from '~/components/digs/flats';
import './pages.css';

function slot(code: string, ratio: '4:5' | '3:4' | '9:16' | '16:9', colorway?: string | null) {
  const image = photoFor(code, colorway, ratio);
  return {code, ratio, image, srcSet: srcSetFor(image?.url), alt: image?.altText ?? ''};
}

export function HomePage({cards, thermal, newsletterStatus}: {cards: ProductCardData[]; thermal: Product | null; newsletterStatus?: NewsletterStatus}) {
  const [status, setStatus] = useState<NewsletterStatus>(newsletterStatus ?? 'idle');
  const hotspots = thermal ? digs.hotspots(thermal) : [];
  const footerLines = [copy.brand.instagram, copy.brand.domain, copy.brand.labelLine];
  const [p0, p1, p2, p3] = copy.home.posters;
  const posters: PosterTile[] = [
    {kind: 'blue', line: lineWithScript(p0, 'actually-dope-cap', 1)},
    {kind: 'photo', image: slot('E-03', '4:5')},
    {kind: 'black', line: p1, wallpaper: true},
    {kind: 'ice', line: lineWithScript(p2)},
    {kind: 'wordmark', tone: 'blue'},
    {kind: 'black', line: p3},
  ];
  return (
    <>
      <HeroWordmark overline={copy.home.heroOverline} sub={copy.home.heroSub} cta={{label: copy.cta.enterShop, to: '/collections/all'}} mobile={slot('H-01', '9:16')} desktop={slot('H-01', '16:9')} className="bleed" />

      <section className="sec" aria-labelledby="mani-head">
        <div className="inner">
          <h2 id="mani-head" className="type-display-xl home-manifesto-head">
            {copy.home.manifestoHead.replace(copy.home.manifestoScript + '.', '')}
            <Script word={copy.home.manifestoScript} drawOn />.
          </h2>
          <Manifesto items={copy.home.manifestos} layout="stacked" />
          <p className="home-manifesto-link">
            <Link to="/pages/manifesto" variant="inline">
              {copy.cta.readManifesto}
            </Link>
          </p>
        </div>
      </section>

      <section className="sec" aria-labelledby="capsule-head">
        <div className="inner">
          <div className="sec-head">
            <Overline>{copy.brand.season}</Overline>
            <div className="sec-head-row">
              <h2 id="capsule-head" className="type-display">
                {copy.home.capsuleHead}
              </h2>
              <p className="sec-sub">{text(copy.home.capsuleSub)}</p>
            </div>
          </div>
          <ul className="capsule-grid">
            {cards.map((c, i) => (
              <li key={c.handle}>
                <ProductCard product={c} labels={{priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}} overlay={i === 0 ? <Sticker kind="dd" rotate={-10} size="sm" tone="blue" className="capsule-sticker" /> : undefined} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {thermal ? (
        <section className="sec home-built" aria-labelledby="built-head">
          <div className="inner">
            <div className="sec-head">
              <Overline>{digs.styleCode(thermal)}</Overline>
              <h2 id="built-head" className="type-display">
                {copy.home.builtHead}
              </h2>
              <p className="sec-sub">{copy.home.builtSub}</p>
            </div>
            <BuiltLikeThis flats={flatsFor(thermal.handle)} hotspots={hotspots} anchors={anchorsFor(thermal.handle, hotspots.length)} limit={3} productName={thermal.title} labels={{hotspot: copy.a11y.hotspot, where: copy.product.builtWhere, spec: copy.product.builtSpec, front: copy.product.viewFront, back: copy.product.viewBack, allDetails: copy.product.builtAll}} />
            <p className="home-built-foot">
              <Button to={`/products/${thermal.handle}`} variant="secondary">
                {copy.home.builtCta}
              </Button>
            </p>
          </div>
        </section>
      ) : null}

      <section className="sec home-frame" aria-label={copy.home.blueFrameHead}>
        <BlueFrame image={slot('E-02', '4:5')} headline={lineWithScript(copy.home.blueFrameHead, copy.home.blueFrameScript, 1)} footer={footerLines} orientation="portrait" className="blueframe-adaptive" />
      </section>

      <section className="sec home-posters" aria-labelledby="posters-head">
        <div className="sec-head">
          <h2 id="posters-head" className="visually-hidden">
            {copy.home.posterLabel}
          </h2>
        </div>
        <PosterWall tiles={posters} label={copy.home.posterLabel} />
      </section>

      <section className="sec home-news" aria-labelledby="news-head">
        <div className="inner home-news-inner">
          <div>
            <Overline>{copy.cta.newsletter}</Overline>
            <h2 id="news-head" className="type-h1">
              {copy.home.newsletterHead}
            </h2>
          </div>
          <NewsletterForm status={status} onSubmit={(email) => setStatus(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? 'success' : 'error')} labels={{email: copy.a11y.email, placeholder: copy.a11y.emailPlaceholder, submit: copy.cta.newsletter, success: copy.home.newsletterSuccess, error: copy.home.newsletterError}} />
        </div>
      </section>
    </>
  );
}
