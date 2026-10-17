import {useId} from 'react';
import './SizeSelector.css';

export type SizeOption = {value: string; available: boolean};

export type SizeSelectorProps = {
  label: string;
  sizes: SizeOption[];
  value: string | null;
  onChange?: (value: string) => void;
  /** Error message ("Select a size"); shown and announced when set. */
  error?: string | null;
  disabled?: boolean;
  /** Back-in-stock label for sold-out sizes ("Hold my size"). */
  holdLabel: string;
  onHold?: (size: string) => void;
  /** Suffix read to screen readers for sold-out sizes. */
  soldOutLabel: string;
  /** Right-aligned helper link (size guide). */
  aside?: React.ReactNode;
  className?: string;
};

/**
 * Size buttons with radio-group semantics. A sold-out size is struck through and offers
 * "Hold my size"; the error state reads "Select a size" via aria-describedby.
 */
export function SizeSelector({label, sizes, value, onChange, error, disabled, holdLabel, onHold, soldOutLabel, aside, className = ''}: SizeSelectorProps) {
  const id = useId();
  return (
    <fieldset className={`sizes ${error ? 'has-error' : ''} ${className}`} role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={error ? `${id}-error` : undefined} aria-invalid={error ? true : undefined} disabled={disabled}>
      <div className="sizes-head">
        <legend id={`${id}-label`} className="sizes-label">
          {label}
        </legend>
        {aside ? <span className="sizes-aside">{aside}</span> : null}
      </div>
      <div className="sizes-row">
        {sizes.map((s) => {
          const selected = s.value === value;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`size ${selected ? 'is-selected' : ''} ${!s.available ? 'is-soldout' : ''}`}
              disabled={disabled}
              onClick={() => onChange?.(s.value)}
            >
              <span className="size-value">{s.value}</span>
              {!s.available ? <span className="visually-hidden">, {soldOutLabel}</span> : null}
            </button>
          );
        })}
      </div>
      {value && !sizes.find((s) => s.value === value)?.available ? (
        <p className="sizes-hold">
          <button type="button" className="sizes-hold-btn" onClick={() => onHold?.(value)}>
            {holdLabel} ({value})
          </button>
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="sizes-error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
