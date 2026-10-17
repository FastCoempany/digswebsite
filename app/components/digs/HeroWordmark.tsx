import type {ReactNode} from 'react';
import {MediaSlot, type MediaImage} from '~/components/core/MediaSlot';
import {Button} from '~/components/core/Button';
import {Wordmark} from './marks/Wordmark';
import {Script} from './marks/Script';
import {Overline} from './Overline';
import './HeroWordmark.css';

export type HeroSlot = {code: string; ratio: string; image: MediaImage | null; srcSet?: string; alt?: string};

export type HeroWordmarkProps = {
  overline: string;
  sub: ReactNode;
  cta: {label: string; to: string};
  /** 9:16 slot (mobile) and 16:9 slot (desktop), shot code H-01. */
  mobile: HeroSlot;
  desktop: HeroSlot;
  className?: string;
};

/**
 * Home hero (02-puff-junction-attitude.md "giant wordmark hero", in DIGS terms): the wordmark edge
 * to edge, the "Actually Dope" scrawl across it at −9°, the model in front of the letters. The
 * surface is Digs Blue so the H-01 frame (cobalt seamless pulled to Digs Blue) sits flush; the
 * header above is transparent with an ice wordmark. On mobile the wordmark spans the top and the
 * photo sits beneath, overlapping by about a quarter.
 */
export function HeroWordmark({overline, sub, cta, mobile, desktop, className = ''}: HeroWordmarkProps) {
  return (
    <section className={`hero ${className}`} data-surface="brand" data-rail-tone="dark" aria-labelledby="hero-title">
      <div className="hero-photo hero-photo-mobile">
        <MediaSlot ratio={mobile.ratio} code={mobile.code} image={mobile.image} srcSet={mobile.srcSet} alt={mobile.alt} priority sizes="100vw" position="50% 20%" />
      </div>
      <div className="hero-photo hero-photo-desktop">
        <MediaSlot ratio={desktop.ratio} code={desktop.code} image={desktop.image} srcSet={desktop.srcSet} alt={desktop.alt} priority sizes="100vw" position="60% 50%" />
      </div>
      <div className="hero-mark" aria-hidden="true">
        <Wordmark color="ice" edgeToEdge decorative />
        <span className="hero-scrawl">
          <Script word="actually-dope-tilted" scale={1} label="" />
        </span>
      </div>
      <div className="hero-copy">
        <Overline tone="on-brand">{overline}</Overline>
        <h1 id="hero-title" className="hero-title">
          <span className="visually-hidden">digs. </span>
          <span className="hero-sub type-h2">{sub}</span>
        </h1>
        <Button to={cta.to} variant="on-dark" size="lg" className="hero-cta">
          {cta.label}
        </Button>
      </div>
    </section>
  );
}
