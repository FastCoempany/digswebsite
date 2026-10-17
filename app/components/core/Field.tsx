import {forwardRef, useId, type InputHTMLAttributes} from 'react';
import {Icon} from './icons';
import './Field.css';

export type FieldProps = {
  label: string;
  /** Visually hidden label (inline newsletter forms). */
  hideLabel?: boolean;
  hint?: string;
  error?: string | null;
  success?: string | null;
  requiredLabel?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/** Text / email input with label, hint, error and success states. Borders meet 3:1 on ice and white. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field({label, hideLabel, hint, error, success, requiredLabel, id, className = '', type = 'text', required, ...rest}, ref) {
  const auto = useId();
  const fid = id ?? auto;
  const describedBy = [hint ? `${fid}-hint` : null, error ? `${fid}-err` : null, success ? `${fid}-ok` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${error ? 'has-error' : ''} ${success ? 'has-success' : ''} ${className}`}>
      <label htmlFor={fid} className={`field-label ${hideLabel ? 'visually-hidden' : ''}`}>
        {label}
        {required && requiredLabel ? <span className="field-required"> ({requiredLabel})</span> : null}
      </label>
      <div className="field-control">
        <input ref={ref} id={fid} type={type} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className="field-input" {...rest} />
        {success ? <Icon name="check" size={18} className="field-icon" /> : null}
      </div>
      {hint ? (
        <p id={`${fid}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${fid}-err`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p id={`${fid}-ok`} className="field-success" role="status">
          {success}
        </p>
      ) : null}
    </div>
  );
});
