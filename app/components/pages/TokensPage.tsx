import {Brandmark, Lockup, Script, Wordmark} from '~/components/digs/marks';
import scriptIndex from '~/assets/script/index.json';
import {copy} from '~/lib/copy';

const COLOR_ROLES = [
  'surface-page', 'surface-raised', 'surface-sunken', 'surface-inverse', 'surface-brand',
  'text-primary', 'text-secondary', 'text-muted', 'text-on-inverse', 'text-on-brand', 'text-link',
  'text-sale', 'text-success', 'text-low-stock', 'border-hairline', 'border-control', 'border-strong',
  'action-primary', 'action-primary-hover', 'action-primary-pressed', 'action-primary-text',
  'action-secondary', 'action-secondary-hover', 'action-secondary-text', 'action-disabled',
  'action-disabled-text', 'focus-ring', 'focus-ring-on-dark', 'brand-scrawl', 'brand-tint',
];
const SCALES = {
  blue: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
  ink: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
};
const CLOTH = ['thermal-off-white', 'thermal-sand-blue', 'pincord-mustard', 'needlecord-light-grey', 'pant-salmon', 'embroidery-bellwether-blue'];
const SIGNAL = ['sale', 'sale-tint', 'success', 'success-tint', 'low-stock', 'low-stock-tint'];
const TYPE = ['display-xl', 'display', 'h1', 'h2', 'h3', 'body-lg', 'body', 'small', 'micro'];
const SPACE = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

function Swatch({name, varName}: {name: string; varName: string}) {
  return (
    <li className="token-swatch">
      <span className="token-chip" style={{background: `var(${varName})`}} />
      <code className="type-micro">{name}</code>
    </li>
  );
}

/** Every token, rendered from the CSS variables, plus the four brand marks. */
export function TokensPage() {
  return (
    <div className="container-x section tokens-page">
      <h1 className="type-h1">Tokens</h1>
      <p className="type-body">
        Generated from <code>design/tokens/</code>. Add <code>?mode=wire</code> to see wireframe mode.
      </p>

      <h2 className="type-h2">Marks</h2>
      <div className="tokens-marks">
        <div className="tokens-mark-cell" style={{background: 'var(--color-core-ice)'}}>
          <Wordmark color="blue" height="48px" />
          <Lockup layout="inline" surface="light" width="200px" />
          <Brandmark color="blue" size="48px" />
        </div>
        <div className="tokens-mark-cell" style={{background: 'var(--color-core-digs-blue)'}}>
          <Wordmark color="ice" height="48px" />
          <Lockup layout="stacked" surface="blue" width="140px" />
          <Brandmark color="ice" size="48px" />
        </div>
        <div className="tokens-mark-cell" style={{background: 'var(--color-core-ink)'}}>
          <Wordmark color="ice" height="48px" />
          <Lockup layout="inline" surface="dark" width="200px" />
          <Brandmark color="blue" size="48px" />
        </div>
      </div>

      <h2 className="type-h2">Script words</h2>
      <p className="type-display-xl">
        Dope is <Script word="good" />.
      </p>
      <ul className="tokens-scripts type-h2">
        {Object.keys(scriptIndex).map((w) => (
          <li key={w}>
            <Script word={w} />
            <code className="type-micro"> {w}</code>
          </li>
        ))}
      </ul>

      <h2 className="type-h2">Color roles</h2>
      <ul className="tokens-grid">
        {COLOR_ROLES.map((r) => (
          <Swatch key={r} name={r} varName={`--color-${r}`} />
        ))}
      </ul>
      {Object.entries(SCALES).map(([scale, steps]) => (
        <div key={scale}>
          <h3 className="type-h3">{scale}</h3>
          <ul className="tokens-grid">
            {steps.map((s) => (
              <Swatch key={s} name={`${scale}-${s}`} varName={`--color-${scale}-${s}`} />
            ))}
          </ul>
        </div>
      ))}
      <h3 className="type-h3">cloth</h3>
      <ul className="tokens-grid">
        {CLOTH.map((c) => (
          <Swatch key={c} name={c} varName={`--color-cloth-${c}`} />
        ))}
      </ul>
      <h3 className="type-h3">signal</h3>
      <ul className="tokens-grid">
        {SIGNAL.map((c) => (
          <Swatch key={c} name={c} varName={`--color-signal-${c}`} />
        ))}
      </ul>

      <h2 className="type-h2">Type</h2>
      <ul className="tokens-type">
        {TYPE.map((t) => (
          <li key={t}>
            <code className="type-micro">{t}</code>
            <p className={`type-${t}`}>{copy.boastLines[1]}</p>
          </li>
        ))}
      </ul>

      <h2 className="type-h2">Space</h2>
      <ul className="tokens-space">
        {SPACE.map((s) => (
          <li key={s}>
            <code className="type-micro">space-{s}</code>
            <span className="token-bar" style={{width: `var(--space-${s})`}} />
          </li>
        ))}
      </ul>
    </div>
  );
}
