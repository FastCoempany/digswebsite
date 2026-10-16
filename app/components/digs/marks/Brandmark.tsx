import brandmarkUrl from '~/assets/marks/brandmark.svg';
import type {MarkColor} from './Wordmark';
import './marks.css';

export type BrandmarkProps = {
  color?: MarkColor;
  /** CSS size (height; the mark is nearly square). */
  size?: string;
  decorative?: boolean;
  className?: string;
  label?: string;
};

/**
 * The DD brandmark (BOAST p11–13). Drawn as a CSS mask over currentColor so the 40 KB path
 * stays a cached static asset instead of inline markup.
 */
export function Brandmark({
  color = 'current',
  size = '40px',
  decorative = false,
  className = '',
  label = 'digs',
}: BrandmarkProps) {
  return (
    <span
      className={`mark mark-mask mark-brandmark mark-${color} ${className}`}
      style={{height: size, ['--mark-mask' as string]: `url(${brandmarkUrl})`}}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      data-brand-graphic={decorative ? '' : undefined}
    />
  );
}
