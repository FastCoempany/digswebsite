import type {ReactNode} from 'react';
import {MediaSlot, type MediaImage} from '~/components/core/MediaSlot';
import './Manifesto.css';

export type ManifestoItem = {n: string; title: string; body: string};

export type ManifestoProps = {
  items: ManifestoItem[];
  /** stacked (mobile default), grid (2×2 on desktop), fullscreen (manifesto page, one per screen with a photo). */
  layout?: 'stacked' | 'grid' | 'fullscreen';
  images?: Array<{code: string; ratio: string; image: MediaImage | null; srcSet?: string; alt?: string} | null>;
  heading?: ReactNode;
  className?: string;
};

/** BOAST manifestos 01–04 as numbered blocks. The manifesto comes before product (PJ attitude). */
export function Manifesto({items, layout = 'grid', images, heading, className = ''}: ManifestoProps) {
  return (
    <div className={`manifesto manifesto-${layout} ${className}`}>
      {heading}
      <ol className="manifesto-list">
        {items.map((m, i) => (
          <li key={m.n} className="manifesto-item">
            {layout === 'fullscreen' && images?.[i] ? (
              <div className="manifesto-photo">
                <MediaSlot ratio={images[i]!.ratio} code={images[i]!.code} image={images[i]!.image} srcSet={images[i]!.srcSet} alt={images[i]!.alt} sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
            ) : null}
            <div className="manifesto-text">
              <span className="manifesto-n type-micro type-caps" aria-hidden="true">
                {m.n}
              </span>
              <h3 className="manifesto-title type-h2">
                <span className="visually-hidden">{m.n}. </span>
                {m.title}
              </h3>
              <p className="manifesto-body">{m.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
