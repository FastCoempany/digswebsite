/**
 * View helpers: turn Storefront-shaped products into the brand-agnostic card/gallery data the core
 * components take. Labels come from content/copy/en.json.
 */
import type {Product, ProductStatus} from '~/lib/mock/types';
import {digs, srcSetFor} from '~/lib/mock';
import type {ProductCardData} from '~/components/core/ProductCard';
import type {BadgeStatus} from '~/components/core/Badge';
import {copy, fill} from '~/lib/copy';

export function badgeFor(status: ProductStatus, quantity?: number | null): {status: BadgeStatus; label: string} | null {
  switch (status) {
    case 'coming-soon':
      return {status: 'coming-soon', label: copy.product.comingSoon};
    case 'pre-order':
      return {status: 'pre-order', label: copy.product.preorderBadge};
    case 'sold-out':
      return {status: 'sold-out', label: copy.product.soldOut};
    case 'low-stock':
      // Only with a real count from the store; never an invented number.
      return typeof quantity === 'number' ? {status: 'low-stock', label: fill(copy.product.lowStock, {n: quantity})} : null;
    case 'new':
      return {status: 'new', label: copy.product.newBadge};
    default:
      return null;
  }
}

export function colorCountLabel(n: number): string | null {
  if (n <= 1) return null;
  return fill(copy.product.colorCount.other, {n});
}

export function cardData(p: Product, colorway?: string | null): ProductCardData {
  const colorways = digs.colorways(p);
  const cw = colorway ?? colorways[0]?.name ?? null;
  const gallery = digs.galleryFor(p, cw);
  const front = gallery.find((g) => g.kind === 'front') ?? null;
  const back = gallery.find((g) => g.kind === 'back') ?? null;
  const status = digs.status(p);
  const first = p.variants.nodes[0];
  return {
    handle: p.handle,
    title: p.title,
    href: `/products/${p.handle}`,
    image: {code: front?.code ?? `P-XX-01`, ratio: '4:5', image: front?.image ?? null, srcSet: srcSetFor(front?.image?.url), alt: front?.image?.altText ?? ''},
    secondImage: back ? {code: back.code, ratio: '4:5', image: back.image, srcSet: srcSetFor(back.image?.url), alt: back.image?.altText ?? ''} : null,
    colorCountLabel: colorCountLabel(colorways.length),
    swatches: colorways.map((c) => ({value: c.name, label: c.name, color: c.color, available: true})),
    price: first?.price ?? null,
    compareAtPrice: first?.compareAtPrice ?? null,
    badge: badgeFor(status),
    soldOut: status === 'sold-out',
    meta: cw && colorways.length ? cw : undefined,
    category: p.productType,
  };
}
