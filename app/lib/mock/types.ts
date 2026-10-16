/**
 * Storefront API shapes (the subset the site reads), mirrored so the mock adapter and the
 * live client return the same objects. Field names and nesting follow the Storefront API
 * (`product { handle title options variants { nodes { ... } } metafields(identifiers:) }`).
 * Only deviation: `price` is nullable here because prices are not set yet (decision O1).
 */
export type CurrencyCode = 'USD';

export type MoneyV2 = {amount: string; currencyCode: CurrencyCode};

export type Image = {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SelectedOption = {name: string; value: string};

export type ProductOptionValue = {
  name: string;
  /** Storefront `swatch { color }`: a CSS color (here the cloth token, never a literal). */
  swatch: {color: string | null; image: null} | null;
};

export type ProductOption = {id: string; name: string; optionValues: ProductOptionValue[]};

export type ProductVariant = {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: SelectedOption[];
  price: MoneyV2 | null;
  compareAtPrice: MoneyV2 | null;
  image: Image | null;
};

export type Metafield = {
  namespace: 'digs';
  key: string;
  type: 'single_line_text_field' | 'multi_line_text_field' | 'json' | 'date' | 'list.single_line_text_field';
  value: string;
};

export type ProductStatus = 'coming-soon' | 'pre-order' | 'available' | 'low-stock' | 'sold-out' | 'new';

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  options: ProductOption[];
  featuredImage: Image | null;
  images: {nodes: Image[]};
  variants: {nodes: ProductVariant[]};
  priceRange: {minVariantPrice: MoneyV2 | null; maxVariantPrice: MoneyV2 | null};
  metafields: Array<Metafield | null>;
  seo: {title: string | null; description: string | null};
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: {nodes: Product[]};
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: ProductVariant & {product: Pick<Product, 'id' | 'handle' | 'title' | 'vendor'>};
  cost: {totalAmount: MoneyV2 | null; amountPerQuantity: MoneyV2 | null};
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {nodes: CartLine[]};
  cost: {subtotalAmount: MoneyV2 | null; totalAmount: MoneyV2 | null};
  note: string | null;
};

export type ShopPolicy = {id: string; handle: string; title: string; body: string; url: string};

/** DIGS-specific, decoded from the `digs.*` metafields. */
export type Hotspot = {
  code: string;
  label: string;
  spec: string;
  where: string;
  view: 'front' | 'back' | 'detail' | 'inside';
};

export type GallerySlot = {
  /** Shot code from 07-photography.md, e.g. P-TLS-01 */
  code: string;
  ratio: '4:5' | '3:4' | '1:1' | '9:16' | '16:9';
  /** Which colorway the slot belongs to (null = shared) */
  colorway: string | null;
  /** The approved image for the slot, or null for a placeholder */
  image: Image | null;
  kind: 'front' | 'back' | 'side' | 'macro-fabric' | 'macro-logo' | 'flat' | 'editorial';
};

export type Colorway = {
  name: string;
  /** CSS color for the swatch: `var(--color-cloth-…)` */
  color: string;
  token: string;
  /** Screen reference hex, as printed in the tech pack (data, not a UI color). */
  reference: string;
  note: string | null;
};

export type SizeChartRow = {
  pom: string;
  label: string;
  /** Pack description, for the tooltip */
  description: string;
  laidFlat: boolean;
  sizes: Record<string, {in: number; label: string; cm: number}>;
};

export type SizeChart = {
  units: string;
  sampleSize: string;
  sizes: string[];
  rows: SizeChartRow[];
  note: string | null;
};
