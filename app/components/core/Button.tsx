import {forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode} from 'react';
import {Link as RouterLink} from 'react-router';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'on-dark';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'pill' | 'block';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  /** Shows a spinner and sets aria-busy; the label stays for the accessible name. */
  loading?: boolean;
  fullWidth?: boolean;
  /** Renders a link styled as a button. */
  to?: string;
  external?: boolean;
  /** Optional caps tracking for short labels. */
  caps?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/**
 * Button: primary (brand fill), secondary (inverse fill), ghost (outline), on-dark (light fill).
 * 44px minimum target; label in the medium weight; states by CSS (hover, pressed, focus-visible,
 * disabled) and props (loading).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {variant = 'primary', size = 'md', shape = 'pill', loading = false, fullWidth = false, to, external, caps, className = '', children, disabled, type = 'button', onClick, ...rest},
  ref,
) {
  // While loading, clicks are swallowed instead of disabling the control, so focus never drops
  // mid-action and a pending submission cannot be repeated.
  const guarded = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  const guardedLink = (e: MouseEvent<HTMLAnchorElement>) => {
    if (loading || disabled) e.preventDefault();
  };
  const cls = ['btn', `btn-${variant}`, `btn-${size}`, `btn-${shape}`, fullWidth ? 'btn-full' : '', caps ? 'type-caps' : '', loading ? 'is-loading' : '', className].join(' ').trim();
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      {loading && <span className="btn-spinner" aria-hidden="true" />}
    </>
  );
  if (to) {
    if (external) {
      return (
        <a className={cls} href={to} target="_blank" rel="noreferrer" aria-busy={loading || undefined}>
          {inner}
        </a>
      );
    }
    return (
      <RouterLink className={cls} to={to} aria-busy={loading || undefined} aria-disabled={disabled || loading || undefined} onClick={guardedLink}>
        {inner}
      </RouterLink>
    );
  }
  return (
    <button ref={ref} type={type} className={cls} disabled={disabled} aria-busy={loading || undefined} aria-disabled={loading || undefined} onClick={guarded} {...rest}>
      {inner}
    </button>
  );
});
