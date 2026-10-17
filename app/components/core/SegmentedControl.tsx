import {useId} from 'react';
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
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = options[(i + dir + options.length) % options.length];
    onChange?.(next.value);
    (e.currentTarget.parentElement?.children[(i + dir + options.length) % options.length] as HTMLElement)?.focus();
  };
  return (
    <div className={`segmented ${className}`} role="radiogroup" aria-labelledby={`${id}-l`}>
      <span id={`${id}-l`} className="visually-hidden">
        {label}
      </span>
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={selected} tabIndex={selected ? 0 : -1} className={`segment ${selected ? 'is-selected' : ''}`} onClick={() => onChange?.(o.value)} onKeyDown={(e) => onKey(e, i)}>
            {o.label}
            {typeof o.count === 'number' ? <span className="segment-count"> {o.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
