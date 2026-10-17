import type {ReactNode} from 'react';
import {Link} from 'react-router';
import {MediaSlot, type MediaImage} from './MediaSlot';
import {Price, type Money} from './Price';
import {QuantityStepper} from './QuantityStepper';
import './CartLine.css';

export type CartLineData = {
  id: string;
  title: string;
  href: string;
  colorway: string | null;
  size: string | null;
  quantity: number;
  price: Money;
  lineTotal: Money;
  image: {code: string; ratio: string; image: MediaImage | null; srcSet?: string; alt?: string};
};

export type CartLineProps = {
  line: CartLineData;
  state?: 'default' | 'updating' | 'removing' | 'error';
  error?: ReactNode | null;
  onQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  labels: {remove: string; quantity: string; increase: string; decrease: string; priceTBA: string; colorway: string; size: string};
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** Another line's mutation is pending: this line's controls ignore input until it settles. */
  locked?: boolean;
  className?: string;
};

/** One cart row: media, title, colorway / size, qty stepper, remove, line total. */
export function CartLine({line, state = 'default', error, onQuantity, onRemove, labels, headingLevel: H = 'h3', locked = false, className = ''}: CartLineProps) {
  const busy = state === 'updating' || state === 'removing';
  return (
    <li className={`cartline is-${state} ${className}`} aria-busy={busy || undefined}>
      <Link to={line.href} className="cartline-media" tabIndex={-1} aria-hidden="true">
        <MediaSlot ratio={line.image.ratio} code={line.image.code} image={line.image.image} srcSet={line.image.srcSet} alt="" sizes="96px" />
      </Link>
      <div className="cartline-body">
        <H className="cartline-title">
          <Link to={line.href}>{line.title}</Link>
        </H>
        <p className="cartline-meta">
          {line.colorway ? <span>{line.colorway}</span> : null}
          {line.colorway && line.size ? <span aria-hidden="true"> · </span> : null}
          {line.size ? (
            <span>
              <span className="visually-hidden">{labels.size} </span>
              {line.size}
            </span>
          ) : null}
        </p>
        <div className="cartline-controls">
          <QuantityStepper value={line.quantity} onChange={(q) => onQuantity?.(line.id, q)} updating={state === 'updating'} locked={locked} disabled={state === 'removing'} labels={{quantity: labels.quantity, increase: labels.increase, decrease: labels.decrease}} />
          <button type="button" className="cartline-remove" onClick={() => !busy && !locked && onRemove?.(line.id)} aria-disabled={busy || locked || undefined}>
            {labels.remove}
            <span className="visually-hidden">: {line.title}</span>
          </button>
        </div>
        {error ? (
          <p className="cartline-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <Price price={line.lineTotal} labels={{tba: labels.priceTBA}} className="cartline-total" />
    </li>
  );
}
