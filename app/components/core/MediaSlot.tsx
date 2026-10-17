import {useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react';
import './MediaSlot.css';

export type MediaImage = {url: string; altText?: string | null; width?: number; height?: number};

export type MediaSlotProps = {
  /** Aspect ratio label as in the brief: "4:5", "3:4", "1:1", "9:16", "16:9". */
  ratio: string;
  /** Shot code from the photography brief, e.g. "P-TLS-01". Labels the slot in wire mode. */
  code: string;
  image?: MediaImage | null;
  alt?: string;
  /** `srcSet` for responsive images (built by the caller from the photo manifest). */
  srcSet?: string;
  sizes?: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
  fit?: 'cover' | 'contain';
  /** Focal point for cover crops, e.g. "50% 20%". */
  position?: string;
  /** Overlay content (stickers, captions). */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Forces the loading or error look (stories). */
  state?: 'loaded' | 'loading' | 'error';
};

function ratioValue(ratio: string) {
  const [w, h] = ratio.split(':').map(Number);
  return w && h ? `${w} / ${h}` : '1 / 1';
}

/**
 * Every image goes through MediaSlot with an explicit ratio so layout never jumps and wireframe
 * mode can label the slot (`data-media-slot="4:5 · P-TLS-01"`). With no image it renders the
 * placeholder: a quiet sunken block carrying the ratio and shot code.
 */
export function MediaSlot({ratio, code, image, alt, srcSet, sizes, priority, fit = 'cover', position, children, className = '', style, state}: MediaSlotProps) {
  // Images render visible from the server (no fade-in that depends on hydration); an image that
  // fails to load flips the slot to the labelled placeholder.
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(state ?? 'loaded');
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = imgRef.current;
    if (!img || state) return;
    if (img.complete && img.naturalWidth === 0) setStatus('error');
  }, [image?.url, state]);
  const effective = state ?? status;
  const label = `${ratio} · ${code}`;
  const empty = !image || effective === 'error';
  return (
    <figure
      className={`media-slot ${empty ? 'is-empty' : ''} is-${effective} media-fit-${fit} ${className}`}
      style={{aspectRatio: ratioValue(ratio), ...style}}
      data-media-slot={label}
      data-photo={image && !empty ? '' : undefined}
    >
      {image && effective !== 'error' ? (
        <img
          ref={imgRef}
          src={image.url}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt ?? image.altText ?? ''}
          width={image.width}
          height={image.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : undefined}
          style={position ? {objectPosition: position} : undefined}
          onError={() => setStatus('error')}
        />
      ) : (
        <span className="media-slot-placeholder" aria-hidden="true">
          <span className="media-slot-ratio">{ratio}</span>
          <span className="media-slot-code">{code}</span>
        </span>
      )}
      {children ? <figcaption className="media-slot-overlay">{children}</figcaption> : null}
    </figure>
  );
}
