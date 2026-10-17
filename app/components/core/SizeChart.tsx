import {useState} from 'react';
import {SegmentedControl} from './SegmentedControl';
import './SizeChart.css';

export type SizeChartUnit = 'in' | 'cm';

export type SizeChartRowData = {
  pom: string;
  label: string;
  description?: string;
  laidFlat?: boolean;
  sizes: Record<string, {in: number; label: string; cm: number}>;
};

export type SizeChartProps = {
  title?: string;
  sizes: string[];
  rows: SizeChartRowData[];
  unit?: SizeChartUnit;
  onUnitChange?: (u: SizeChartUnit) => void;
  labels: {units: string; inches: string; centimetres: string; measurement: string; laidFlat: string; note?: string};
  /** Highlight a size column. */
  selectedSize?: string | null;
  note?: string | null;
  className?: string;
};

/** Graded spec table with an in/cm toggle. Half measures are shown laid flat and labelled so. */
export function SizeChart({title, sizes, rows, unit, onUnitChange, labels, selectedSize, note, className = ''}: SizeChartProps) {
  const [local, setLocal] = useState<SizeChartUnit>(unit ?? 'in');
  const u = unit ?? local;
  const setU = (v: string) => {
    setLocal(v as SizeChartUnit);
    onUnitChange?.(v as SizeChartUnit);
  };
  return (
    <div className={`sizechart ${className}`}>
      <div className="sizechart-head">
        {title ? <h3 className="sizechart-title">{title}</h3> : null}
        <SegmentedControl label={labels.units} value={u} onChange={setU} options={[{value: 'in', label: labels.inches}, {value: 'cm', label: labels.centimetres}]} />
      </div>
      <div className="sizechart-scroll" tabIndex={0} role="region" aria-label={title ?? labels.measurement}>
        <table className="sizechart-table">
          <thead>
            <tr>
              <th scope="col">{labels.measurement}</th>
              {sizes.map((s) => (
                <th key={s} scope="col" className={s === selectedSize ? 'is-selected' : ''}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pom}>
                <th scope="row">
                  <span className="sizechart-pom" aria-hidden="true">{r.pom}</span> {r.label}
                  {r.laidFlat && !/laid flat/i.test(r.label) ? <span className="sizechart-flat"> ({labels.laidFlat})</span> : null}
                </th>
                {sizes.map((s) => {
                  const v = r.sizes[s];
                  return (
                    <td key={s} className={s === selectedSize ? 'is-selected' : ''}>
                      {v ? (u === 'in' ? v.label : v.cm.toLocaleString('en-US', {maximumFractionDigits: 1})) : '–'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="sizechart-note">{note}</p> : null}
      {labels.note ? <p className="sizechart-note">{labels.note}</p> : null}
    </div>
  );
}
