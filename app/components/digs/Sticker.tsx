import type {CSSProperties} from 'react';
import {Brandmark} from './marks/Brandmark';
import {Script} from './marks/Script';
import {Wordmark} from './marks/Wordmark';
import {TrimToken} from './TrimToken';
import './digs.css';

export type StickerProps = {
  kind: 'dd' | 'actually-dope' | 'dot' | 'trim';
  /** Degrees, −12 to +12. */
  rotate?: number;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'blue' | 'black' | 'ice';
  /** Trim code for the `trim` kind. */
  code?: string;
  /** Drop-on entrance (scale + rotate over 300ms; none under reduced motion). */
  dropOn?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Angled stamps that break the grid: the DD, the "Actually Dope" scrawl, the d!gs dot badge, a trim token. Decorative. */
export function Sticker({kind, rotate = -8, size = 'md', tone = 'blue', code = 'L3', dropOn, className = '', style}: StickerProps) {
  const rot = Math.max(-12, Math.min(12, rotate));
  return (
    <span className={`sticker sticker-${kind} sticker-${size} sticker-${tone} ${dropOn ? 'sticker-drop' : ''} ${className}`} style={{['--sticker-rotate' as string]: `${rot}deg`, ...style}} aria-hidden="true" data-sticker="">
      {kind === 'dd' ? <Brandmark decorative size="100%" /> : null}
      {kind === 'actually-dope' ? <Script word="actually-dope-tilted" scale={1} label="" /> : null}
      {kind === 'dot' ? (
        <span className="sticker-dot-badge">
          <Wordmark decorative height="42%" />
        </span>
      ) : null}
      {kind === 'trim' ? <TrimToken code={code} size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} tone={tone === 'ice' ? 'ice' : tone === 'black' ? 'ink' : 'blue'} /> : null}
    </span>
  );
}
