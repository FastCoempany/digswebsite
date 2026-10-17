import {useId} from 'react';
import {Button} from './Button';
import {Price, type Money} from './Price';
import './CartSummary.css';

export type CartSummaryProps = {
  subtotal: Money;
  labels: {subtotal: string; taxNote: string; checkout: string; priceTBA: string; checkoutNote?: string; freeShipping?: string};
  /** Free-shipping progress; stays hidden until terms exist (null). */
  freeShipping?: {threshold: number; current: number; currencyCode: string} | null;
  onCheckout?: () => void;
  checkoutHref?: string;
  checkoutDisabled?: boolean;
  className?: string;
};

/** Subtotal, tax note, checkout. Checkout hands off to Shopify later; nothing is wired now. */
export function CartSummary({subtotal, labels, freeShipping, onCheckout, checkoutHref, checkoutDisabled, className = ''}: CartSummaryProps) {
  const noteId = useId();
  const pct = freeShipping ? Math.min(100, Math.round((freeShipping.current / freeShipping.threshold) * 100)) : 0;
  return (
    <div className={`cartsum ${className}`}>
      {freeShipping ? (
        <div className="cartsum-ship">
          <p className="type-small">{labels.freeShipping}</p>
          <div className="cartsum-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={labels.freeShipping}>
            <span style={{width: `${pct}%`}} />
          </div>
        </div>
      ) : null}
      <dl className="cartsum-row">
        <dt>{labels.subtotal}</dt>
        <dd>
          <Price price={subtotal} labels={{tba: labels.priceTBA}} />
        </dd>
      </dl>
      <p className="cartsum-note">{labels.taxNote}</p>
      <Button variant="primary" size="lg" fullWidth to={checkoutHref} onClick={onCheckout} disabled={checkoutDisabled} aria-describedby={labels.checkoutNote ? noteId : undefined}>
        {labels.checkout}
      </Button>
      {labels.checkoutNote ? (
        <p id={noteId} className="cartsum-note">
          {labels.checkoutNote}
        </p>
      ) : null}
    </div>
  );
}
