/**
 * Builds Storefront-API-shaped products from content/products/*.json. One Shopify product per
 * style with options Color and Size (06-products.md): 4 products, 20 variants.
 */
import type {
  Colorway,
  GallerySlot,
  Hotspot,
  Image,
  Metafield,
  Product,
  ProductStatus,
  ProductVariant,
  SizeChart,
  SizeChartRow,
} from './types';
import {
  PRODUCT_SOURCES,
  SHOT_PREFIX,
  SPEC_SOURCES,
  STYLE_STRINGS,
  type ProductSource,
  type SpecRow,
} from './content';
import {photoFor} from './photos';

const VENDOR = 'digs';
const SEASON_TAG = 'capsule-01';

const GALLERY_KINDS: GallerySlot['kind'][] = [
  'front',
  'back',
  'side',
  'macro-fabric',
  'macro-logo',
  'flat',
  'editorial',
];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function skuColor(name: string) {
  return name.toUpperCase().replace(/[^A-Z0-9]+/g, '');
}

function mf(key: string, value: unknown, type: Metafield['type'] = 'single_line_text_field'): Metafield {
  return {
    namespace: 'digs',
    key,
    type,
    value: typeof value === 'string' ? value : JSON.stringify(value),
  };
}

function toCm(inches: number) {
  return Math.round(inches * 2.54 * 2) / 2;
}

function buildSizeChart(src: ProductSource): SizeChart {
  const spec = SPEC_SOURCES[src.handle];
  const rows: SizeChartRow[] = [];
  for (const [pom, label] of Object.entries(src.sizeChart.customerPOMs)) {
    const row: SpecRow | undefined = spec.rows.find((r) => r.pom === pom);
    if (!row) continue;
    const sizes: SizeChartRow['sizes'] = {};
    for (const size of src.sizes) {
      const v = row.sizes[size];
      if (v) sizes[size] = {in: v.in, label: v.label, cm: toCm(v.in)};
    }
    rows.push({
      pom,
      label,
      description: row.description,
      laidFlat: /^1\/2\b/.test(row.description) || /laid flat/i.test(label),
      sizes,
    });
  }
  return {
    units: spec.units,
    sampleSize: spec.sample_size,
    sizes: src.sizes,
    rows,
    note: src.sizeNote ?? null,
  };
}

function buildColorways(src: ProductSource): Colorway[] {
  return src.colorways.map((c) => ({
    name: c.name,
    token: c.token,
    color: `var(${c.token})`,
    reference: c.hex,
    note: [c.thread, c.logo, c.buttons, c.trims].filter(Boolean).join(' · ') || null,
  }));
}

function buildGallery(src: ProductSource): GallerySlot[] {
  const prefix = SHOT_PREFIX[src.handle];
  const slots: GallerySlot[] = [];
  for (const colorway of src.colorways) {
    GALLERY_KINDS.forEach((kind, i) => {
      const code = `P-${prefix}-${String(i + 1).padStart(2, '0')}`;
      const shared = kind === 'editorial';
      slots.push({
        code,
        ratio: '4:5',
        colorway: shared ? null : colorway.name,
        image: photoFor(code, shared ? null : colorway.name),
        kind,
      });
    });
  }
  // Editorial slots are shared across colorways: keep one.
  const seen = new Set<string>();
  return slots.filter((s) => {
    const k = `${s.code}:${s.colorway ?? ''}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function statusOf(src: ProductSource): ProductStatus {
  return src.availability;
}

function buildVariants(src: ProductSource, gallery: GallerySlot[], index: number): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let n = 0;
  for (const colorway of src.colorways) {
    const front = gallery.find((g) => g.colorway === colorway.name && g.kind === 'front')?.image ?? null;
    for (const size of src.sizes) {
      n += 1;
      variants.push({
        id: `gid://shopify/ProductVariant/${(index + 1) * 100 + n}`,
        title: `${colorway.name} / ${size}`,
        // Shirt SKUs wait for new style numbers (decision O2): the shared code is used until then.
        sku: `${src.styleCode.split(' ')[0]}-${skuColor(colorway.name)}-${size}`,
        availableForSale: src.availability === 'available' || src.availability === 'pre-order',
        quantityAvailable: null,
        selectedOptions: [
          {name: 'Color', value: colorway.name},
          {name: 'Size', value: size},
        ],
        // Decision O1: prices are null until the founder sets them; the UI shows "Price TBA".
        price: src.price == null ? null : {amount: src.price.toFixed(2), currencyCode: 'USD'},
        compareAtPrice: null,
        image: front,
      });
    }
  }
  return variants;
}

function buildProduct(src: ProductSource, index: number): Product {
  const colorways = buildColorways(src);
  const gallery = buildGallery(src);
  const variants = buildVariants(src, gallery, index);
  const images: Image[] = gallery.map((g) => g.image).filter((i): i is Image => Boolean(i));
  const hotspots: Hotspot[] = src.builtLikeThis.map((h) => ({...h, view: h.view as Hotspot['view']}));
  const status = statusOf(src);
  const price = src.price == null ? null : {amount: src.price.toFixed(2), currencyCode: 'USD' as const};

  return {
    id: `gid://shopify/Product/${index + 1}`,
    handle: src.handle,
    title: src.name,
    vendor: VENDOR,
    productType: src.category === 'tops' ? 'Tops' : 'Bottoms',
    tags: [SEASON_TAG, src.category, status],
    description: src.fit,
    descriptionHtml: `<p>${src.fit}</p>`,
    availableForSale: variants.some((v) => v.availableForSale),
    options: [
      {
        id: `gid://shopify/ProductOption/${index + 1}01`,
        name: 'Color',
        optionValues: colorways.map((c) => ({name: c.name, swatch: {color: c.color, image: null}})),
      },
      {
        id: `gid://shopify/ProductOption/${index + 1}02`,
        name: 'Size',
        optionValues: src.sizes.map((s) => ({name: s, swatch: null})),
      },
    ],
    featuredImage: images[0] ?? null,
    images: {nodes: images},
    variants: {nodes: variants},
    priceRange: {minVariantPrice: price, maxVariantPrice: price},
    metafields: [
      mf('style_code', src.styleCode),
      mf('style_string', STYLE_STRINGS[src.handle]),
      mf('status', status),
      mf('fit', src.fit),
      mf('fabric', src.fabric, 'list.single_line_text_field'),
      mf('finish', src.finish),
      mf('details', src.details, 'list.single_line_text_field'),
      mf('care', src.care, 'list.single_line_text_field'),
      mf('content', src.content),
      mf('origin', src.origin.display),
      mf('built_like_this', hotspots, 'json'),
      mf('size_chart', buildSizeChart(src), 'json'),
      mf('colorways', colorways, 'json'),
      mf('gallery', gallery, 'json'),
      mf('tech_pack', src.techPack, 'json'),
      src.preorderShipDate ? mf('preorder_ship_date', src.preorderShipDate, 'date') : null,
      src.laterColorways?.length
        ? mf('later_colorways', src.laterColorways.map((c) => c.name), 'list.single_line_text_field')
        : null,
    ],
    seo: {title: `${src.name} | digs`, description: src.fit},
  };
}

export const PRODUCTS: Product[] = PRODUCT_SOURCES.map(buildProduct);

export function productByHandle(handle: string): Product | null {
  return PRODUCTS.find((p) => p.handle === handle) ?? null;
}

/* ---------- Metafield decoders (the UI never parses JSON itself) ---------- */

export function metafield(product: Product, key: string): string | null {
  return product.metafields.find((m) => m && m.key === key)?.value ?? null;
}

function metafieldJson<T>(product: Product, key: string, fallback: T): T {
  const v = metafield(product, key);
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function metafieldList(product: Product, key: string): string[] {
  return metafieldJson<string[]>(product, key, []);
}

export const digs = {
  styleString: (p: Product) => metafield(p, 'style_string') ?? '',
  styleCode: (p: Product) => metafield(p, 'style_code') ?? '',
  status: (p: Product) => (metafield(p, 'status') ?? 'coming-soon') as ProductStatus,
  fit: (p: Product) => metafield(p, 'fit') ?? '',
  finish: (p: Product) => metafield(p, 'finish') ?? '',
  content: (p: Product) => metafield(p, 'content') ?? '',
  origin: (p: Product) => metafield(p, 'origin') ?? '',
  fabric: (p: Product) => metafieldList(p, 'fabric'),
  details: (p: Product) => metafieldList(p, 'details'),
  care: (p: Product) => metafieldList(p, 'care'),
  laterColorways: (p: Product) => metafieldList(p, 'later_colorways'),
  hotspots: (p: Product) => metafieldJson<Hotspot[]>(p, 'built_like_this', []),
  sizeChart: (p: Product) => metafieldJson<SizeChart | null>(p, 'size_chart', null),
  colorways: (p: Product) => metafieldJson<Colorway[]>(p, 'colorways', []),
  gallery: (p: Product) => metafieldJson<GallerySlot[]>(p, 'gallery', []),
  preorderShipDate: (p: Product) => metafield(p, 'preorder_ship_date'),
  /** Gallery for a colorway: its own slots plus the shared editorial slot. */
  galleryFor: (p: Product, colorway: string | null) =>
    metafieldJson<GallerySlot[]>(p, 'gallery', []).filter(
      (g) => g.colorway === null || !colorway || g.colorway === colorway,
    ),
  /** Variant for a Color + Size pair. */
  variantFor: (p: Product, color: string | null, size: string | null) =>
    p.variants.nodes.find(
      (v) =>
        (!color || v.selectedOptions.some((o) => o.name === 'Color' && o.value === color)) &&
        (!size || v.selectedOptions.some((o) => o.name === 'Size' && o.value === size)),
    ) ?? null,
  colorCount: (p: Product) => p.options.find((o) => o.name === 'Color')?.optionValues.length ?? 0,
  sizes: (p: Product) => p.options.find((o) => o.name === 'Size')?.optionValues.map((v) => v.name) ?? [],
  cardImage: (p: Product, which: 'front' | 'back') =>
    metafieldJson<GallerySlot[]>(p, 'gallery', []).find((g) => g.kind === which) ?? null,
  slugColor: slug,
};
