import type {ReactNode} from 'react';
import {MediaSlot, type MediaImage} from '~/components/core/MediaSlot';
import {Wordmark} from './marks/Wordmark';
import './BlueFrame.css';

export type BlueFrameProps = {
  image: {code: string; ratio: string; image: MediaImage | null; srcSet?: string; alt?: string};
  headline: ReactNode;
  /** Stacked footer lines, bottom right: @dopeisgood / dopeisgood.com / Designed in USA */
  footer: string[];
  orientation?: 'portrait' | 'landscape';
  headingLevel?: 'h2' | 'h3' | 'p';
  className?: string;
};

/** BOAST billboard: a photograph inside a solid Digs Blue frame, headline top-left, wordmark bottom-left, stacked footer right. */
export function BlueFrame({image, headline, footer, orientation = 'portrait', headingLevel: H = 'h2', className = ''}: BlueFrameProps) {
  return (
    <figure className={`blueframe blueframe-${orientation} ${className}`} data-surface="brand" data-rail-tone="dark">
      <div className="blueframe-well">
        <MediaSlot ratio={image.ratio} code={image.code} image={image.image} srcSet={image.srcSet} alt={image.alt} sizes="(min-width: 1024px) 60vw, 100vw" className="blueframe-media" />
        <figcaption className="blueframe-layer">
          <H className="blueframe-head type-display">{headline}</H>
          <span className="blueframe-mark">
            <Wordmark color="ice" height="clamp(28px, 6vw, 64px)" decorative />
          </span>
          <span className="blueframe-foot type-small">
            {footer.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
