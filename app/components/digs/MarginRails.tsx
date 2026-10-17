import {useEffect, useRef} from 'react';
import './digs.css';

export type MarginRailsProps = {
  left: string;
  right: string;
  /** Force a tone (stories). Otherwise sections with data-rail-tone="dark" flip the rails to ice. */
  tone?: 'light' | 'dark';
  /** Changes when the page content changes (the route key): the dark sections are queried again. */
  refreshKey?: string;
};

/**
 * Rotated caps micro text on both edges, fixed, 1024px and up. Decorative: the lines repeat
 * copy that lives elsewhere, so the rails are aria-hidden.
 */
export function MarginRails({left, right, tone, refreshKey}: MarginRailsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tone) return;
    const el = ref.current;
    if (!el) return;
    // The rails outlive client-side navigations, so the dark sections are read per route, after
    // the new page has rendered, and the tone is recomputed on scroll and resize.
    let darks: HTMLElement[] = [];
    const collect = () => {
      darks = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-tone="dark"]'));
    };
    const update = () => {
      const mid = window.innerHeight / 2;
      const over = darks.some((d) => {
        const r = d.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      el.dataset.tone = over ? 'dark' : 'light';
    };
    collect();
    update();
    const raf = requestAnimationFrame(() => {
      collect();
      update();
    });
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [tone, refreshKey]);
  return (
    <div ref={ref} className="rails" data-tone={tone ?? 'light'} aria-hidden="true">
      <span className="rail rail-left type-micro type-caps">{left}</span>
      <span className="rail rail-right type-micro type-caps">{right}</span>
    </div>
  );
}
