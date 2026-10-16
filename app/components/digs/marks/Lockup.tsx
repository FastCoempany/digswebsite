import inlineWordmark from '~/assets/marks/lockup-inline-wordmark.svg';
import inlineScrawl from '~/assets/marks/lockup-inline-scrawl.svg';
import stackedWordmark from '~/assets/marks/lockup-stacked-wordmark.svg';
import stackedScrawl from '~/assets/marks/lockup-stacked-scrawl.svg';
import {LOCKUP_VIEWBOX} from './paths.generated';
import './marks.css';

export type LockupSurface = 'light' | 'blue' | 'dark';

export type LockupProps = {
  layout?: 'inline' | 'stacked';
  /** The surface the lockup sits on; picks the BOAST color pair (01-brand-system.md §2). */
  surface?: LockupSurface;
  /** CSS width. */
  width?: string;
  decorative?: boolean;
  className?: string;
  label?: string;
};

/**
 * Wordmark + "Actually Dope" scrawl, BOAST's primary lockup (p8–10). Two mask layers with the
 * same viewBox so the scrawl crosses the wordmark exactly where the file puts it.
 *
 * Pairs: ice/white → black wordmark, blue scrawl · Digs Blue → inline: ice wordmark, black scrawl;
 * stacked: black wordmark, ice scrawl · black → ice wordmark, blue scrawl.
 */
export function Lockup({
  layout = 'inline',
  surface = 'light',
  width = '240px',
  decorative = false,
  className = '',
  label = 'digs. Actually Dope',
}: LockupProps) {
  const vb = LOCKUP_VIEWBOX[layout].split(' ').map(Number);
  const ratio = `${vb[2]} / ${vb[3]}`;
  const wm = layout === 'inline' ? inlineWordmark : stackedWordmark;
  const sc = layout === 'inline' ? inlineScrawl : stackedScrawl;
  return (
    <span
      className={`lockup lockup-${layout} lockup-on-${surface} ${className}`}
      style={{width, aspectRatio: ratio}}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      data-brand-graphic=""
    >
      <span className="lockup-layer lockup-wordmark" style={{['--mark-mask' as string]: `url(${wm})`}} />
      <span className="lockup-layer lockup-scrawl" style={{['--mark-mask' as string]: `url(${sc})`}} />
    </span>
  );
}
