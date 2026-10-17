/**
 * Vector flats from the tech packs (tools/flats_svg.py → app/assets/flats/). Hotspot anchors are
 * percentages of each flat's box, keyed by product handle and hotspot index.
 */
import index from '~/assets/flats/index.json';
import anchors from '~/assets/flats/anchors.json';
import type {Anchor, FlatView} from './BuiltLikeThis';

const urls = import.meta.glob('../../assets/flats/*.svg', {eager: true, query: '?url', import: 'default'}) as Record<string, string>;

type FlatIndex = Record<string, {front?: {file: string; viewBox: string}; back?: {file: string; viewBox: string}}>;
type AnchorIndex = Record<string, Record<string, {view: 'front' | 'back'; x: number; y: number}>>;

const FLATS = index as FlatIndex;
const ANCHORS = anchors as AnchorIndex;

function view(handle: string, which: 'front' | 'back'): FlatView | null {
  const entry = FLATS[handle]?.[which];
  if (!entry) return null;
  const url = urls[`../../assets/flats/${entry.file}`];
  return url ? {url, viewBox: entry.viewBox} : null;
}

export function flatsFor(handle: string): {front: FlatView | null; back: FlatView | null} {
  return {front: view(handle, 'front'), back: view(handle, 'back')};
}

export function anchorsFor(handle: string, count: number): Array<Anchor | null> {
  const a = ANCHORS[handle] ?? {};
  return Array.from({length: count}, (_, i) => {
    const v = a[String(i)];
    return v ? {view: v.view, x: v.x, y: v.y} : null;
  });
}

export const FLAT_HANDLES = Object.keys(FLATS);
