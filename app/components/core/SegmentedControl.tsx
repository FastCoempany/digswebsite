import {useId} from 'react';
import {rovingRadio} from './useRovingRadio';
import './SegmentedControl.css';

export type SegmentOption = {value: string; label: string; count?: number};

export type SegmentedControlProps = {
  label: string;
  options: SegmentOption[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

/** A pill bar of radio buttons (the shop filter: All · Tops · Bottoms). Arrow keys move the selection. */
export function SegmentedControl({label, options, value, onChange, className = ''}: SegmentedControlProps) {
  const id = useId();
  const selectedIndex = options.findIndex((o) => o.value === value);
  return (
    <div className={`segmented ${className}`} role="radiogroup" aria-labelledby={`${id}-l`}>
      <span id={`${id}-l`} className="visually-hidden">
        {label}
      </span>
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={selected} className={`segment ${selected ? 'is-selected' : ''}`} onClick={() => onChange?.(o.value)} {...rovingRadio(i, options.length, selectedIndex, (n) => onChange?.(options[n].value))}>
            {o.label}
            {typeof o.count === 'number' ? <span className="segment-count"> {o.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
