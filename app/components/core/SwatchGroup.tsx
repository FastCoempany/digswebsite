import {useId} from 'react';
import {rovingRadio} from './useRovingRadio';
import './SwatchGroup.css';

export type SwatchOption = {
  value: string;
  label: string;
  /** Any CSS color, e.g. `var(--color-cloth-pincord-mustard)`. */
  color: string;
  available?: boolean;
};

export type SwatchGroupProps = {
  /** Visible group label ("Colorway"). */
  label: string;
  options: SwatchOption[];
  value: string | null;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  /** Show the selected option's name next to the label (PDP). Cards use tooltips. */
  showName?: boolean;
  /** Label suffix for unavailable swatches, read by screen readers. */
  unavailableLabel?: string;
  /** Cards: swatches are not interactive, just shown. */
  readOnly?: boolean;
  className?: string;
};

/**
 * Colorway swatches. Every swatch has a keyline so light cloth reads on ice; the selected state
 * is a 2px ring with a 2px gap; unavailable swatches carry a diagonal strike.
 */
export function SwatchGroup({label, options, value, onChange, size = 'md', showName, unavailableLabel = '', readOnly, className = ''}: SwatchGroupProps) {
  const id = useId();
  const current = options.find((o) => o.value === value);
  if (readOnly) {
    return (
      <ul className={`swatches swatches-${size} swatches-readonly ${className}`} aria-label={label}>
        {options.map((o) => (
          <li key={o.value} className={`swatch ${o.available === false ? 'is-unavailable' : ''}`} style={{['--swatch-color' as string]: o.color}} data-swatch="" title={o.label}>
            <span className="visually-hidden">{o.label}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <fieldset className={`swatches swatches-${size} ${className}`} role="radiogroup" aria-labelledby={`${id}-label`}>
      <legend id={`${id}-label`} className="swatches-legend">
        <span className="swatches-label">{label}</span>
        {showName && current ? <span className="swatches-name">{current.label}</span> : null}
      </legend>
      <div className="swatches-row">
        {options.map((o, i) => {
          const selected = o.value === value;
          const unavailable = o.available === false;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`swatch ${selected ? 'is-selected' : ''} ${unavailable ? 'is-unavailable' : ''}`}
              style={{['--swatch-color' as string]: o.color}}
              data-swatch=""
              title={o.label}
              onClick={() => onChange?.(o.value)}
              {...rovingRadio(i, options.length, options.findIndex((x) => x.value === value), (n) => onChange?.(options[n].value))}
            >
              <span className="visually-hidden">
                {o.label}
                {unavailable && unavailableLabel ? `, ${unavailableLabel}` : ''}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
