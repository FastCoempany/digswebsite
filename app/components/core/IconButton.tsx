import {forwardRef, type ButtonHTMLAttributes} from 'react';
import {Icon, type IconName} from './icons';
import './IconButton.css';

export type IconButtonProps = {
  icon: IconName;
  /** Required accessible name. */
  label: string;
  variant?: 'plain' | 'outline' | 'filled' | 'on-dark';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/** Square icon control with a 44px target and an accessible name. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {icon, label, variant = 'plain', size = 'md', loading, className = '', type = 'button', ...rest},
  ref,
) {
  return (
    <button ref={ref} type={type} className={`iconbtn iconbtn-${variant} iconbtn-${size} ${className}`} aria-label={label} title={label} aria-busy={loading || undefined} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 18 : size === 'lg' ? 28 : 22} />
    </button>
  );
});
