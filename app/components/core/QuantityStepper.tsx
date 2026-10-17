import {useEffect, useState} from 'react';
import {Icon} from './icons';
import './QuantityStepper.css';

export type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange?: (next: number) => void;
  disabled?: boolean;
  updating?: boolean;
  /** Another control owns the pending request: this one ignores input without looking busy or losing focus. */
  locked?: boolean;
  labels: {quantity: string; increase: string; decrease: string};
  /** Progressive enhancement: the buttons become submit buttons (name="quantity") of this form id. */
  formId?: string;
  className?: string;
};

/** Minus / value / plus. Buttons disable at the bounds; `updating` sets aria-busy and dims. */
export function QuantityStepper({value, min = 1, max = 99, onChange, disabled, updating, locked = false, labels, formId, className = ''}: QuantityStepperProps) {
  // Bounds use aria-disabled so a button that has focus never disables under the user.
  const dec = value <= min || disabled || updating || locked;
  const inc = value >= max || disabled || updating || locked;
  // In form mode a blocked click cancels the submission; otherwise the change handler runs.
  const press = (blocked: boolean, next: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (blocked) {
      e.preventDefault();
      return;
    }
    if (!formId) onChange?.(next);
  };
  const submitAttrs = (next: number) => (formId ? {type: 'submit' as const, form: formId, name: 'quantity', value: String(next)} : {type: 'button' as const});
  // Without JavaScript a submit button at the bound would still post (quantity 0 removes the line),
  // so the server HTML disables it natively; after hydration the click guard takes over.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const nativeDec = disabled || (Boolean(formId) && !hydrated && value <= min);
  const nativeInc = disabled || (Boolean(formId) && !hydrated && value >= max);
  return (
    <div className={`qty ${updating ? 'is-updating' : ''} ${className}`} role="group" aria-label={labels.quantity} aria-busy={updating || undefined}>
      <button {...submitAttrs(value - 1)} className="qty-btn" aria-label={labels.decrease} aria-disabled={dec || undefined} disabled={nativeDec} onClick={press(dec, value - 1)}>
        <Icon name="minus" size={16} />
      </button>
      <output className="qty-value" aria-live="polite">
        {value}
      </output>
      <button {...submitAttrs(value + 1)} className="qty-btn" aria-label={labels.increase} aria-disabled={inc || undefined} disabled={nativeInc} onClick={press(inc, value + 1)}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
