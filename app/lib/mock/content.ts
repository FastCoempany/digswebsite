/**
 * The content files are the source of truth (CLAUDE.md). They are imported here, once, so
 * every product fact on screen traces back to content/products/*.json and the tech packs.
 */
import thermal from '../../../content/products/thermal-long-sleeve.json';
import pincord from '../../../content/products/pincord-button-down.json';
import needlecord from '../../../content/products/needlecord-shirt.json';
import pant from '../../../content/products/drawstring-pant.json';
import thermalSpec from '../../../content/products/specs/thermal-long-sleeve.json';
import pincordSpec from '../../../content/products/specs/pincord-button-down.json';
import needlecordSpec from '../../../content/products/specs/needlecord-shirt.json';
import pantSpec from '../../../content/products/specs/drawstring-pant.json';

export type ColorwaySource = {
  name: string;
  token: string;
  hex: string;
  thread?: string;
  logo?: string;
  buttons?: string;
  trims?: string;
};

export type HotspotSource = {code: string; label: string; spec: string; where: string; view: string};

export type ProductSource = {
  handle: string;
  styleCode: string;
  name: string;
  category: 'tops' | 'bottoms';
  productType: string;
  techPack: {file: string; revision: string; status: string; season: string; developer: string};
  price: number | null;
  availability: 'coming-soon' | 'pre-order' | 'available' | 'sold-out';
  sizes: string[];
  sampleSize: string;
  sizeNote?: string;
  colorways: ColorwaySource[];
  laterColorways?: {name: string; hex: string}[];
  fit: string;
  fabric: string[];
  finish: string;
  details: string[];
  builtLikeThis: HotspotSource[];
  care: string[];
  content: string;
  origin: {display: string; status: string};
  sizeChart: {specs: string; customerPOMs: Record<string, string>};
  openItems: string[];
  preorderShipDate?: string | null;
};

export type SpecRow = {
  pom: string;
  description: string;
  tolerance: {in: number; label: string} | null;
  sizes: Record<string, {in: number; label: string}>;
};

export type SpecSource = {handle: string; source: string; units: string; sample_size: string; rows: SpecRow[]};

/** Order on the site: tops first in capsule order, then the pant (06-products.md). */
export const PRODUCT_SOURCES: ProductSource[] = [
  thermal as ProductSource,
  pincord as ProductSource,
  needlecord as ProductSource,
  pant as ProductSource,
];

export const SPEC_SOURCES: Record<string, SpecSource> = {
  'thermal-long-sleeve': thermalSpec as SpecSource,
  'pincord-button-down': pincordSpec as SpecSource,
  'needlecord-shirt': needlecordSpec as SpecSource,
  'drawstring-pant': pantSpec as SpecSource,
};

/** Shot-code prefixes from 07-photography.md. */
export const SHOT_PREFIX: Record<string, string> = {
  'thermal-long-sleeve': 'TLS',
  'pincord-button-down': 'PBD',
  'needlecord-shirt': 'NCS',
  'drawstring-pant': 'DSP',
};

/** Style strings in tech-pack grammar (06-products.md: `AC-LST-001 | LONG SLEEVE TEE | S–XL`). */
export const STYLE_STRINGS: Record<string, string> = {
  'thermal-long-sleeve': 'AC-LST-001 | LONG SLEEVE TEE | S–XL',
  'pincord-button-down': 'AC-LSS-001 | LONG SLEEVE SHIRT | S–XL',
  'needlecord-shirt': 'AC-LSS-001 | LONG SLEEVE SHIRT | S–XL',
  'drawstring-pant': 'AC-PNT-001 | DRAWSTRING PANT | S–XL',
};
