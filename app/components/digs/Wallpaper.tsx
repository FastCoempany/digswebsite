import wordmarkUrl from '~/assets/marks/wordmark.svg';
import scrawlUrl from '~/assets/script/script-actually-dope-tilted.svg';
import type {CSSProperties} from 'react';
import './digs.css';

export type WallpaperProps = {
  variant?: 'stacked' | 'offset' | 'scrawl';
  /** 0–1; at most 0.06 behind content on ice (02-puff-junction-attitude.md). */
  opacity?: number;
  tone?: 'blue' | 'ice' | 'black';
  /** Tile width. */
  tile?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Wordmark or scrawl pattern background rebuilt from the SVGs as a repeating CSS mask
 * (the WebP patterns in brand/patterns are references only).
 */
export function Wallpaper({variant = 'stacked', opacity = 0.06, tone = 'blue', tile = '160px', className = '', style}: WallpaperProps) {
  const url = variant === 'scrawl' ? scrawlUrl : wordmarkUrl;
  return (
    <div
      className={`wallpaper wallpaper-${variant} wallpaper-${tone} ${className}`}
      style={{['--wallpaper-mask' as string]: `url(${url})`, ['--wallpaper-tile' as string]: tile, opacity, ...style}}
      aria-hidden="true"
      data-wallpaper=""
    />
  );
}
