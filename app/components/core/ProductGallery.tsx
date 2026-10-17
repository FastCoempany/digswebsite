import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import {MediaSlot, type MediaImage} from './MediaSlot';
import {IconButton} from './IconButton';
import {Modal} from './Modal';
import {Skeleton} from './Skeleton';
import './ProductGallery.css';

export type GalleryItem = {
  code: string;
  ratio: string;
  image: MediaImage | null;
  srcSet?: string;
  alt?: string;
};

export type ProductGalleryProps = {
  items: GalleryItem[];
  labels: {previous: string; next: string; counter: string; zoom: string; close: string; gallery: string};
  /** Vertical rail content on the left edge (mobile), e.g. "SWIPE". */
  rail?: ReactNode;
  /** Caption under the gallery (image disclosure). */
  caption?: string;
  loading?: boolean;
  /** Which item starts active (cross-fade on colorway switch). */
  activeIndex?: number;
  className?: string;
  /** Force zoomed state open (stories). */
  zoomed?: boolean;
};

/**
 * Mobile: scroll-snap carousel with a counter ("1 / 7"), buttons as well as swipe, arrow keys,
 * tap to zoom. Desktop: two-column grid. Single image: no controls.
 */
export function ProductGallery({items, labels, rail, caption, loading, activeIndex = 0, className = '', zoomed = false}: ProductGalleryProps) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(activeIndex);
  const [zoom, setZoom] = useState<number | null>(zoomed ? activeIndex : null);
  const total = items.length;

  useEffect(() => {
    setIndex(activeIndex);
    track.current?.scrollTo({left: 0, behavior: 'auto'});
  }, [activeIndex, items]);

  const scrollTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(total - 1, i));
    const child = el.children[next] as HTMLElement | undefined;
    child?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
    setIndex(next);
  }, [total]);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    setIndex(Math.round(el.scrollLeft / w));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') scrollTo(index + 1);
    if (e.key === 'ArrowLeft') scrollTo(index - 1);
  };

  if (loading) {
    return (
      <div className={`gallery is-loading ${className}`} aria-busy="true">
        <Skeleton variant="media" ratio="4 / 5" />
      </div>
    );
  }

  const counter = labels.counter.replace('{n}', String(index + 1)).replace('{total}', String(total));
  const single = total <= 1;

  return (
    <section className={`gallery ${single ? 'is-single' : ''} ${className}`} aria-label={labels.gallery} aria-roledescription="carousel">
      {rail ? <div className="gallery-rail" aria-hidden="true">{rail}</div> : null}
      <ul className="gallery-track" ref={track} onScroll={onScroll} onKeyDown={onKey} tabIndex={0} aria-live="polite">
        {items.map((item, i) => (
          <li key={`${item.code}-${i}`} className="gallery-item" aria-roledescription="slide" aria-label={labels.counter.replace('{n}', String(i + 1)).replace('{total}', String(total))}>
            <button type="button" className="gallery-zoom" onClick={() => setZoom(i)} aria-label={`${labels.zoom}: ${item.alt ?? item.code}`}>
              <MediaSlot ratio={item.ratio} code={item.code} image={item.image} srcSet={item.srcSet} alt={item.alt} sizes="(min-width: 1024px) 30vw, 100vw" priority={i === 0} />
            </button>
          </li>
        ))}
      </ul>
      {!single ? (
        <div className="gallery-controls">
          <IconButton icon="chevron-left" label={labels.previous} variant="outline" size="sm" onClick={() => scrollTo(index - 1)} disabled={index === 0} />
          <output className="gallery-counter type-micro" aria-live="polite">
            {counter}
          </output>
          <IconButton icon="chevron-right" label={labels.next} variant="outline" size="sm" onClick={() => scrollTo(index + 1)} disabled={index >= total - 1} />
        </div>
      ) : null}
      {caption ? <p className="gallery-caption">{caption}</p> : null}
      <Modal open={zoom !== null} onClose={() => setZoom(null)} title={labels.zoom} hideTitle closeLabel={labels.close} size="full">
        {zoom !== null && items[zoom] ? (
          <MediaSlot ratio={items[zoom].ratio} code={items[zoom].code} image={items[zoom].image} srcSet={items[zoom].srcSet} alt={items[zoom].alt} fit="contain" className="gallery-zoomed" sizes="100vw" />
        ) : null}
      </Modal>
    </section>
  );
}
