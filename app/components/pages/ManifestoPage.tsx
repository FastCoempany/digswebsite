import {photoFor, srcSetFor} from '~/lib/mock';
import {copy, text} from '~/lib/copy';
import {Button} from '~/components/core/Button';
import {Manifesto} from '~/components/digs/Manifesto';
import {Overline} from '~/components/digs/Overline';
import {Script} from '~/components/digs/marks/Script';
import {StrikeRewrite} from '~/components/digs/StrikeRewrite';
import {lineWithScript} from '~/components/digs/lineWithScript';
import './pages.css';

const EDITORIAL_CODES = ['E-01', 'E-02', 'E-03', 'E-04'];

export function ManifestoPage() {
  const m = copy.manifestoPage;
  const headParts = m.head.split(m.headScript);
  const images = EDITORIAL_CODES.map((code) => {
    const image = photoFor(code, null, '4:5');
    return {code, ratio: '3:4', image, srcSet: srcSetFor(image?.url), alt: image?.altText ?? ''};
  });
  return (
    <>
      <section className="sec mani-hero" aria-labelledby="mani-title">
        <div className="inner">
          <Overline>{copy.brand.season}</Overline>
          <h1 id="mani-title" className="type-display-xl">
            {headParts[0]}
            <Script word={m.headScript} drawOn />
            {headParts[1]}
          </h1>
        </div>
      </section>
      <section className="sec sec-tight" aria-label={copy.brand.positioning}>
        <div className="inner mani-narr">
          {m.narrative.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
      <section className="sec" aria-labelledby="mani-list-head">
        <div className="inner">
          <h2 id="mani-list-head" className="visually-hidden">
            {copy.nav.manifesto}
          </h2>
          <Manifesto items={copy.home.manifestos} layout="fullscreen" images={images} />
        </div>
      </section>
      <section className="sec" aria-labelledby="standard-head">
        <div className="inner">
          <div className="sec-head">
            <Overline>{copy.brand.name}</Overline>
            <h2 id="standard-head" className="type-display">
              {m.standardHead}
            </h2>
          </div>
          <ol className="mani-standard">
            {m.standard.map((s, i) => (
              <li key={s}>
                <span className="type-micro type-caps" aria-hidden="true">
                  0{i + 1}
                </span>
                <span>{lineWithScript(s)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="sec" aria-labelledby="pairs-head">
        <div className="inner">
          <h2 id="pairs-head" className="visually-hidden">
            {m.weAreHead}, {m.weAreNotHead}
          </h2>
          <div className="mani-pairs">
            <div>
              <h3 className="type-micro type-caps">{m.weAreHead}</h3>
              <ul>
                {m.weAre.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
            <div className="mani-not">
              <h3 className="type-micro type-caps">{m.weAreNotHead}</h3>
              <ul>
                {m.weAreNot.map((w) => (
                  <li key={w}>
                    <StrikeRewrite struck={w} word="" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="sec" aria-label={m.quietHead}>
        <div className="inner">
          <p className="mani-quiet">{text(m.quiet)}</p>
          <p className="mani-quiet-attr type-small">{m.quietAttribution}</p>
          <p style={{marginTop: 'var(--space-7)'}}>
            <Button to="/collections/all" size="lg">
              {copy.cta.enterShop}
            </Button>
          </p>
        </div>
      </section>
    </>
  );
}
