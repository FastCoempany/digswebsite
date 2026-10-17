import type {ReactNode} from 'react';
import {Link} from 'react-router';
import {MediaSlot, type MediaImage} from './MediaSlot';
import {Price, type Money} from './Price';
import {Badge, type BadgeStatus} from './Badge';
import {SwatchGroup, type SwatchOption} from './SwatchGroup';
import {Skeleton} from './Skeleton';
import './ProductCard.css';

export type ProductCardData = {
  handle: string;
  title: string;
  href: string;
  /** Primary media slot. */
  image: {code: string; ratio: string; image: MediaImage | null; srcSet?: string; alt?: string};
  /** Hover / second image (desktop). */
  secondImage?: {code: string; ratio: string; image: MediaImage | null; srcSet?: string; alt?: string} | null;
  colorCountLabel?: string | null;
  swatches?: SwatchOption[];
  price: Money;
  compareAtPrice?: Money;
  badge?: {status: BadgeStatus; label: string} | null;
  soldOut?: boolean;
  /** Short line for the mini variant (colorway, size). */
  meta?: string;
};

export type ProductCardProps = {
  product?: ProductCardData;
  variant?: 'grid' | 'mini';
  loading?: boolean;
  priority?: boolean;
  labels: {priceTBA: string; swatches: string};
  /** Overlay content on the image (stickers). */
  overlay?: ReactNode;
  sizes?: string;
  className?: string;
};

/**
 * Product tile: image (4:5), name, colorway count, swatches, price or TBA, status badge.
 * Desktop hover swaps to the second image. Sold-out tiles dim their media.
 */
export function ProductCard({product, variant = 'grid', loading, priority, labels, overlay, sizes, className = ''}: ProductCardProps) {
  if (loading || !product) {
    return (
      <div className={`pcard pcard-${variant} is-loading ${className}`} aria-busy="true">
        <Skeleton variant="card" ratio="4 / 5" />
      </div>
    );
  }
  const {image, secondImage} = product;
  const defaultSizes = variant === 'mini' ? '96px' : '(min-width: 1024px) 25vw, 50vw';
  return (
    <article className={`pcard pcard-${variant} ${product.soldOut ? 'is-soldout' : ''} ${className}`}>
      <Link to={product.href} className="pcard-media" aria-label={product.title} tabIndex={-1} aria-hidden="true">
        <MediaSlot ratio={image.ratio} code={image.code} image={image.image} srcSet={image.srcSet} sizes={sizes ?? defaultSizes} alt="" priority={priority} className="pcard-img pcard-img-1">
          {overlay}
        </MediaSlot>
        {variant === 'grid' && secondImage ? (
          <MediaSlot ratio={secondImage.ratio} code={secondImage.code} image={secondImage.image} srcSet={secondImage.srcSet} sizes={sizes ?? defaultSizes} alt="" className="pcard-img pcard-img-2" />
        ) : null}
        {product.badge ? (
          <Badge status={product.badge.status} className="pcard-badge">
            {product.badge.label}
          </Badge>
        ) : null}
      </Link>
      <div className="pcard-body">
        <h3 className="pcard-title">
          <Link to={product.href} className="pcard-link">
            {product.title}
          </Link>
        </h3>
        {variant === 'mini' && product.meta ? <p className="pcard-meta">{product.meta}</p> : null}
        {variant === 'grid' ? (
          <div className="pcard-row">
            {product.colorCountLabel ? <span className="pcard-meta">{product.colorCountLabel}</span> : null}
            {product.swatches?.length ? <SwatchGroup label={labels.swatches} options={product.swatches} value={null} size="sm" readOnly /> : null}
          </div>
        ) : null}
        <Price price={product.price} compareAtPrice={product.compareAtPrice} labels={{tba: labels.priceTBA}} size="sm" className="pcard-price" />
      </div>
    </article>
  );
}
