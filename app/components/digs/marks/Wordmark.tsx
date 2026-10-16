import {WORDMARK} from './paths.generated';
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

/** The `digs` wordmark, inline SVG from brand/logos/wordmark (via tools/brand_svg.py). */
export function Wordmark({
  color = 'current',
  height = '28px',
  edgeToEdge = false,
  decorative = false,
  className = '',
  label = 'digs',
}: WordmarkProps) {
  return (
    <svg
      viewBox={WORDMARK.viewBox}
      className={`mark mark-wordmark mark-${color} ${edgeToEdge ? 'mark-edge' : ''} ${className}`}
      style={edgeToEdge ? undefined : {height}}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      focusable="false"
      data-brand-graphic={decorative ? '' : undefined}
    >
      {WORDMARK.paths.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
