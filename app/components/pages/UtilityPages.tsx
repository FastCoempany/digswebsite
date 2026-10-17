import type {ReactNode} from 'react';
import type {Product, ShopPolicy} from '~/lib/mock/types';
import {digs} from '~/lib/mock';
import {copy, isDraft, text} from '~/lib/copy';
import {Accordion} from '~/components/core/Accordion';
import {Button} from '~/components/core/Button';
import {Field} from '~/components/core/Field';
import {Link} from '~/components/core/Link';
import {SizeChart} from '~/components/core/SizeChart';
import {Overline} from '~/components/digs/Overline';
import {flatsFor} from '~/components/digs/flats';
import './pages.css';

type Draft = string | {status?: string; text: string};

function Draftable({field}: {field: Draft}) {
  return (
    <>
      {text(field)}
      {isDraft(field) ? <span className="draft-flag">draft</span> : null}
    </>
  );
}

function Shell({title, overline, intro, children, wide}: {title: string; overline?: string; intro?: Draft; children?: ReactNode; wide?: boolean}) {
  return (
    <section className="sec" aria-labelledby="util-head">
      <div className={`inner util ${wide ? 'util-wide' : ''}`} style={wide ? {maxWidth: 'none'} : undefined}>
        <div>
          <Overline>{overline ?? copy.brand.name}</Overline>
          <h1 id="util-head" className="type-display">
            {title}
          </h1>
        </div>
        {intro ? (
          <p className="util-intro">
            <Draftable field={intro} />
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function ShippingReturnsPage() {
  const c = copy.pages.shippingReturns;
  return (
    <Shell title={c.head} intro={c.intro}>
      <div className="util-sections">
        {c.sections.map((s) => (
          <div key={s.title} className="util-section">
            <h2 className="type-h3">{s.title}</h2>
            <p>
              <Draftable field={s.body} />
            </p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function FaqPage() {
  const c = copy.pages.faq;
  return (
    <Shell title={c.head}>
      <Accordion items={c.items.map((it, i) => ({id: `q${i}`, title: it.q, content: <p><Draftable field={it.a} /></p>}))} defaultOpen={['q0']} headingLevel="h2" />
    </Shell>
  );
}

export function ContactPage() {
  const c = copy.pages.contact;
  return (
    <Shell title={c.head} intro={c.intro}>
      <p>
        {c.instagramLine.replace('{handle}', '')}
        <Link to={copy.brand.instagramUrl} external variant="inline">
          {copy.brand.instagram}
        </Link>
      </p>
      <form className="contact-form" onSubmit={(e) => e.preventDefault()} aria-describedby="contact-note">
        <Field label={c.form.name} name="name" autoComplete="name" />
        <Field label={c.form.email} name="email" type="email" autoComplete="email" />
        <div className="field">
          <label htmlFor="contact-message" className="field-label">
            {c.form.message}
          </label>
          <textarea id="contact-message" name="message" />
        </div>
        <div>
          <Button type="submit" disabled>
            {c.form.send}
          </Button>
        </div>
        <p id="contact-note" className="type-small" style={{color: 'var(--color-text-secondary)'}}>
          <Draftable field={c.form.note} />
        </p>
      </form>
    </Shell>
  );
}

export function AccessibilityPage() {
  const c = copy.pages.accessibility;
  return (
    <Shell title={c.head}>
      <div className="util-sections prose">
        {c.body.map((b, i) => (
          <p key={i}>
            <Draftable field={b} />
          </p>
        ))}
        <p>
          <Link to="/pages/contact" variant="inline">
            {copy.pages.contact.head}
          </Link>
        </p>
      </div>
    </Shell>
  );
}

export function PoliciesPage({policies}: {policies: ShopPolicy[]}) {
  const c = copy.pages.policies;
  return (
    <Shell title={c.head} intro={c.intro}>
      <ul className="policy-list">
        {policies.map((p) => (
          <li key={p.handle}>
            <Link to={p.url} variant="inline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

export function PolicyPage({policy}: {policy: ShopPolicy}) {
  const c = copy.pages.policies;
  return (
    <Shell title={policy.title} overline={c.head}>
      {policy.body ? <div className="prose" dangerouslySetInnerHTML={{__html: policy.body}} /> : <p className="util-intro"><Draftable field={c.placeholder} /></p>}
      <p>
        <Link to="/policies" variant="inline">
          {c.head}
        </Link>
      </p>
    </Shell>
  );
}

export function AccountPage() {
  const c = copy.pages.account;
  return (
    <Shell title={c.head} intro={c.body}>
      <p>
        <Button to="/collections/all">{c.cta}</Button>
      </p>
    </Shell>
  );
}

export function SizeGuidePage({products}: {products: Product[]}) {
  const c = copy.pages.sizeGuide;
  return (
    <Shell title={c.head} intro={c.intro} wide>
      <p className="util-intro">{c.sampleNote}</p>
      <div className="sizeguide-tables">
        {products.map((p) => {
          const chart = digs.sizeChart(p);
          if (!chart) return null;
          const flats = flatsFor(p.handle);
          return (
            <div key={p.handle} id={p.handle} className="util-sections">
              <SizeChart title={p.title} headingLevel="h2" sizes={chart.sizes} rows={chart.rows} note={chart.note} labels={{units: copy.a11y.unitToggle, inches: copy.a11y.inches, centimetres: copy.a11y.centimetres, measurement: copy.product.measurementsHeadNoSize, laidFlat: copy.a11y.laidFlat}} />
              <div className="sizeguide-howto">
                <h3 className="type-h3">{c.howTo}</h3>
                <div className="sizeguide-howto-flats" aria-hidden="true">
                  {(['front', 'back'] as const).map((v) => {
                    const f = flats[v];
                    if (!f) return null;
                    const [, , w, h] = f.viewBox.split(' ').map(Number);
                    return <span key={v} className="blt-flat" style={{position: 'relative', aspectRatio: `${w} / ${h}`, ['--flat-mask' as string]: `url(${f.url})`}} />;
                  })}
                </div>
                <dl className="sizeguide-legend">
                  {chart.rows.map((r) => (
                    <div key={r.pom}>
                      <dt>{r.pom}</dt>
                      <dd>
                        {r.label}: {r.description.toLowerCase()}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          );
        })}
      </div>
      <p className="type-small" style={{color: 'var(--color-text-secondary)'}}>
        <Draftable field={c.howToBody} />
      </p>
      <p className="type-small" style={{color: 'var(--color-text-secondary)'}}>
        {copy.product.sizeNoteLaidFlat}
      </p>
    </Shell>
  );
}
