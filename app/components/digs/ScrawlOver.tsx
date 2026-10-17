import type {ReactNode} from 'react';
import {Script} from './marks/Script';
import './digs.css';

export type ScrawlOverProps = {
  children: ReactNode;
  /** Script word drawn across the headline. */
  word?: string;
  /** 1–3 copies. */
  density?: 1 | 2 | 3;
  tone?: 'blue' | 'black';
  className?: string;
};

/** Marker handwriting laid across clean sans type (BOAST social posts). Decorative, aria-hidden. */
export function ScrawlOver({children, word = 'fashion', density = 1, tone = 'blue', className = ''}: ScrawlOverProps) {
  const n = Math.max(1, Math.min(3, density));
  return (
    <span className={`scrawlover scrawlover-${tone} ${className}`}>
      <span className="scrawlover-text">{children}</span>
      <span className="scrawlover-layer" aria-hidden="true" data-brand-graphic="">
        {Array.from({length: n}).map((_, i) => (
          <span key={i} className={`scrawlover-word scrawlover-word-${i + 1} scrawlover-of-${n}`}>
            <Script word={word} scale={1.6} label="" />
          </span>
        ))}
      </span>
    </span>
  );
}
