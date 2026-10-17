import {useId, useState} from 'react';
import type {Hotspot} from '~/lib/mock/types';
import {TrimToken} from './TrimToken';
import {Wallpaper} from './Wallpaper';
import './BuiltLikeThis.css';

export type FlatView = {url: string; viewBox: string};
export type Anchor = {view: 'front' | 'back'; x: number; y: number};

export type BuiltLikeThisProps = {
  /** Vector flats per view (from the tech-pack PDFs via tools/flats_svg.py). */
  flats: {front: FlatView | null; back: FlatView | null};
  hotspots: Hotspot[];
  /** Anchor per hotspot index; hotspots without one are listed but not pinned. */
  anchors: Array<Anchor | null>;
  /** collapsed: no callout highlighted · hotspot-active: one · all-open: every callout expanded (print). */
  state?: 'collapsed' | 'hotspot-active' | 'all-open';
  activeIndex?: number;
  labels: {hotspot: string; where: string; spec: string; front: string; back: string; allDetails: string};
  productName: string;
  /** Faint wordmark wallpaper behind the section (home teaser / PDP). */
  wallpaper?: boolean;
  /** Only show the hotspots listed (home teaser shows three). */
  limit?: number;
  className?: string;
};

/**
 * Tech-pack grammar as a design language: the garment flat with coded trim tokens pinned to it,
 * and callout cards with leader lines. The callouts are a real list (always in the DOM), so the
 * content reads without the pins; the pins and lines are the flourish.
 */
export function BuiltLikeThis({flats, hotspots, anchors, state = 'collapsed', activeIndex = 0, labels, productName, wallpaper = true, limit, className = ''}: BuiltLikeThisProps) {
  const id = useId();
  const [active, setActive] = useState<number | null>(state === 'hotspot-active' ? activeIndex : null);
  const items = typeof limit === 'number' ? hotspots.slice(0, limit) : hotspots;
  const views: Array<'front' | 'back'> = (['front', 'back'] as const).filter((v) => flats[v] && anchors.some((a, i) => a?.view === v && i < items.length));
  const allOpen = state === 'all-open';
  const toggle = (i: number) => setActive((cur) => (cur === i ? null : i));

  return (
    <div className={`blt ${allOpen ? 'is-all-open' : ''} ${className}`}>
      {wallpaper ? <Wallpaper variant="offset" opacity={0.035} tile="96px" className="blt-wallpaper" /> : null}
      <div className="blt-views">
        {views.map((view) => {
          const flat = flats[view]!;
          const [, , vw, vh] = flat.viewBox.split(' ').map(Number);
          return (
            <figure key={view} className={`blt-view blt-view-${view}`}>
              <div className="blt-flat-wrap" style={{aspectRatio: `${vw} / ${vh}`}}>
                <span className="blt-flat" style={{['--flat-mask' as string]: `url(${flat.url})`}} role="img" aria-label={`${productName}, ${view === 'front' ? labels.front : labels.back}`} />
                <svg className="blt-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  {items.map((h, i) => {
                    const a = anchors[i];
                    if (!a || a.view !== view) return null;
                    const on = allOpen || active === i;
                    const x2 = a.x < 50 ? 2 : 98;
                    return <line key={i} x1={a.x} y1={a.y} x2={x2} y2={a.y} className={`blt-line ${on ? 'is-on' : ''}`} vectorEffect="non-scaling-stroke" />;
                  })}
                </svg>
                {items.map((h, i) => {
                  const a = anchors[i];
                  if (!a || a.view !== view) return null;
                  const on = allOpen || active === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`blt-pin ${on ? 'is-on' : ''}`}
                      style={{left: `${a.x}%`, top: `${a.y}%`}}
                      aria-expanded={on}
                      aria-controls={`${id}-c${i}`}
                      aria-label={labels.hotspot.replace('{code}', h.code).replace('{label}', h.label)}
                      onClick={() => toggle(i)}
                    >
                      <TrimToken code={h.code} tone={on ? 'ink' : 'blue'} active={on} />
                    </button>
                  );
                })}
              </div>
              <figcaption className="blt-view-label type-micro type-caps">{view === 'front' ? labels.front : labels.back}</figcaption>
            </figure>
          );
        })}
      </div>
      <dl className="blt-callouts" aria-label={labels.allDetails}>
        {items.map((h, i) => {
          const on = allOpen || active === i;
          return (
            <div key={i} id={`${id}-c${i}`} className={`blt-callout ${on ? 'is-on' : ''}`}>
              <dt className="blt-callout-head">
                <TrimToken code={h.code} size="sm" tone="blue" />
                <span className="blt-callout-label type-caps">{h.label}</span>
              </dt>
              <dd className="blt-callout-body">
                <span className="blt-callout-spec">{h.spec}</span>
                <span className="blt-callout-where type-small">
                  <span className="blt-callout-k">{labels.where}</span> {h.where}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
