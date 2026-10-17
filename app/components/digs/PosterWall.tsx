import type {ReactNode} from 'react';
import {MediaSlot, type MediaImage} from '~/components/core/MediaSlot';
import {Wordmark} from './marks/Wordmark';
import {Wallpaper} from './Wallpaper';
import './PosterWall.css';

export type PosterTile =
  | {kind: 'blue' | 'black' | 'ice'; line: ReactNode; wallpaper?: boolean}
  | {kind: 'wordmark'; tone: 'blue' | 'black' | 'ice'}
  | {kind: 'photo'; image: {code: string; ratio: string; image: MediaImage | null; srcSet?: string; alt?: string}};

/** Wheat-pasted posters, one idea and one color each. Horizontal scroll on mobile, grid on desktop. */
export function PosterWall({tiles, label, className = ''}: {tiles: PosterTile[]; label: string; className?: string}) {
  return (
    <ul className={`posters ${className}`} aria-label={label} tabIndex={0}>
      {tiles.map((t, i) => {
        if (t.kind === 'photo') {
          return (
            <li key={i} className="poster poster-photo">
              <MediaSlot ratio={t.image.ratio} code={t.image.code} image={t.image.image} srcSet={t.image.srcSet} alt={t.image.alt} sizes="(min-width: 1024px) 33vw, 70vw" />
            </li>
          );
        }
        if (t.kind === 'wordmark') {
          return (
            <li key={i} className={`poster poster-wordmark poster-${t.tone}`} data-surface={t.tone === 'ice' ? undefined : t.tone === 'blue' ? 'brand' : 'dark'}>
              <Wallpaper variant="stacked" tone={t.tone === 'blue' ? 'ice' : t.tone === 'ice' ? 'blue' : 'blue'} opacity={0.9} tile="50%" />
              <span className="visually-hidden">digs</span>
            </li>
          );
        }
        return (
          <li key={i} className={`poster poster-${t.kind}`} data-surface={t.kind === 'ice' ? undefined : t.kind === 'blue' ? 'brand' : 'dark'}>
            {t.wallpaper ? <Wallpaper variant="offset" tone={t.kind === 'blue' ? 'ice' : 'blue'} opacity={0.12} tile="35%" /> : null}
            <p className="poster-line type-h1">{t.line}</p>
            <span className="poster-mark">
              <Wordmark decorative height="20px" color={t.kind === 'ice' ? 'blue' : 'ice'} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
