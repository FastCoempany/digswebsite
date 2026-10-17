import wordmarkUrl from '~/assets/marks/wordmark.svg';
import './marks.css';

export type MarkColor = 'blue' | 'black' | 'ice' | 'current';

export type WordmarkProps = {
  /** Color from the BOAST triad; `current` inherits the text color. */
  color?: MarkColor;
  /** CSS height (ignored when edgeToEdge). Default 28px, the header size (04-ia-and-pages.md). */
  height?: string;
  /** Fills the container width: the hero and the foot of every page (BOAST "do"). */
  edgeToEdge?: boolean;
  /** Decorative copies (wallpaper, hero backdrop) hide from assistive tech. */
  decorative?: boolean;
  className?: string;
  /** Accessible name. The wordmark is always lowercase `digs`. */
  label?: string;
};

/**
 * The `digs` wordmark from brand/logos/wordmark (via tools/brand_svg.py), drawn as a CSS mask over
 * currentColor: one cached SVG for every instance on the page instead of inline path data.
 */
export function Wordmark({color = 'current', height = '28px', edgeToEdge = false, decorative = false, className = '', label = 'digs'}: WordmarkProps) {
  return (
    <span
      className={`mark mark-mask mark-wordmark mark-${color} ${edgeToEdge ? 'mark-edge' : ''} ${className}`}
      style={{...(edgeToEdge ? {} : {height}), ['--mark-mask' as string]: `url(${wordmarkUrl})`}}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      data-brand-graphic={decorative ? '' : undefined}
    />
  );
}
