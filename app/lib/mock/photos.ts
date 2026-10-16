/**
 * Approved photography, by shot code (07-photography.md). Built from assets/photography/MANIFEST.csv
 * by `python3 tools/photo_sync.py`, which also writes the optimized copies under public/photography/.
 * Until photos are approved for a slot, the slot renders as a labelled MediaSlot placeholder.
 */
import manifest from './photos.generated.json';
import type {Image} from './types';

export type PhotoEntry = {
  code: string;
  file: string;
  colorway: string | null;
  width: number;
  height: number;
  alt: string;
  /** Available widths of the optimized copies, e.g. [480, 960] */
  widths: number[];
};

const entries = manifest as PhotoEntry[];

function key(code: string, colorway?: string | null) {
  return colorway ? `${code}:${colorway.toLowerCase()}` : code;
}

const byKey = new Map<string, PhotoEntry>();
for (const e of entries) byKey.set(key(e.code, e.colorway), e);

/** The approved image for a shot code (and colorway, for product sets), or null. */
export function photoFor(code: string, colorway?: string | null): Image | null {
  const e = byKey.get(key(code, colorway)) ?? (colorway ? byKey.get(key(code)) : undefined);
  if (!e) return null;
  return {
    id: `gid://shopify/MediaImage/${e.file}`,
    url: `/photography/${e.file}`,
    altText: e.alt,
    width: e.width,
    height: e.height,
  };
}

export function photoWidths(url: string): number[] {
  const file = url.replace('/photography/', '');
  return entries.find((e) => e.file === file)?.widths ?? [];
}

export const PHOTO_COUNT = entries.length;
