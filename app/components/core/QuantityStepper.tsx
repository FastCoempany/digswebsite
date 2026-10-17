import {Icon} from './icons';
import './QuantityStepper.css';

export type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange?: (next: number) => void;
  disabled?: boolean;
  updating?: boolean;
  labels: {quantity: string; increase: string; decrease: string};
  className?: string;
};

/** Minus / value / plus. Buttons disable at the bounds; `updating` sets aria-busy and dims. */
export function QuantityStepper({value, min = 1, max = 99, onChange, disabled, updating, labels, className = ''}: QuantityStepperProps) {
  // Bounds use aria-disabled so a button that has focus never disables under the user.
  const dec = value <= min || disabled || updating;
  const inc = value >= max || disabled || updating;
  return (
    <div className={`qty ${updating ? 'is-updating' : ''} ${className}`} role="group" aria-label={labels.quantity} aria-busy={updating || undefined}>
      <button type="button" className="qty-btn" aria-label={labels.decrease} aria-disabled={dec || undefined} disabled={disabled} onClick={() => !dec && onChange?.(value - 1)}>
        <Icon name="minus" size={16} />
      </button>
      <output className="qty-value" aria-live="polite">
        {value}
      </output>
      <button type="button" className="qty-btn" aria-label={labels.increase} aria-disabled={inc || undefined} disabled={disabled} onClick={() => !inc && onChange?.(value + 1)}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
