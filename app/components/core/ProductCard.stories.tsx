import type {Meta, StoryObj} from '@storybook/react-vite';
import type {ReactNode} from 'react';
import {ProductCard, type ProductCardData} from './ProductCard';
import {PRODUCTS} from '~/lib/mock';
import {cardData} from '~/lib/view';
import {copy} from '~/lib/copy';

/**
 * ProductCard (05-components.md, Core): grid and mini. States: default, hover (second image),
 * loading skeleton, sold out. Media slot 4:5. Data is the capsule through `cardData` (view.ts).
 */
const meta = {
  title: 'Core/ProductCard',
  component: ProductCard,
  args: {labels: {priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway}},
} satisfies Meta<typeof ProductCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const LABELS = {priceTBA: copy.product.priceTBA, swatches: copy.a11y.colorway};
const thermal: ProductCardData = cardData(PRODUCTS[0]);
const thermalSandBlue: ProductCardData = cardData(PRODUCTS[0], 'Sand Blue');
/** Sold out is a UI state here, not a stock fact (ShopPage does the same for its all-sold-out story). */
const soldOut: ProductCardData = {...thermal, soldOut: true, badge: {status: 'sold-out', label: copy.product.soldOut}};
/** Before a slot's photo is approved the card shows the labelled placeholder. */
const noPhoto: ProductCardData = {...thermal, image: {...thermal.image, image: null, srcSet: undefined}, secondImage: null};

/** Forced hover (tokens only): ProductCard.css shows the second image on :hover / :focus-within at ≥768px with a pointer. */
const FORCED = `
.story-hover .pcard-img-2:not(.is-empty) { opacity: 1; }
`;

const GRID = `
.story-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-6) var(--space-3); list-style: none; margin: 0; padding: 0; }
@media (min-width: 1024px) { .story-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
`;

function Tile({children}: {children: ReactNode}) {
  return <div style={{maxWidth: '20rem'}}>{children}</div>;
}

export const Grid: Story = {
  name: 'Grid · default (coming-soon badge, two colorways, Price TBA)',
  render: () => (
    <Tile>
      <ProductCard product={thermal} labels={LABELS} priority />
    </Tile>
  ),
};

export const GridCapsule: Story = {
  name: 'Grid · the capsule (2 up at 390, 4 up at 1440)',
  render: () => (
    <>
      <style>{GRID}</style>
      <ul className="story-grid" aria-label={copy.home.capsuleHead}>
        {PRODUCTS.map((p, i) => (
          <li key={p.handle}>
            <ProductCard product={cardData(p)} labels={LABELS} priority={i < 2} />
          </li>
        ))}
      </ul>
    </>
  ),
};

export const GridHover: Story = {
  name: 'Grid · hover (forced: second image shown)',
  render: () => (
    <Tile>
      <style>{FORCED}</style>
      <ProductCard product={thermal} labels={LABELS} className="story-hover" priority />
    </Tile>
  ),
};

export const Loading: Story = {
  name: 'Loading skeleton',
  render: () => (
    <Tile>
      <ProductCard loading labels={LABELS} />
    </Tile>
  ),
};

export const SoldOut: Story = {
  name: 'Sold out · dimmed media, struck badge',
  render: () => (
    <Tile>
      <ProductCard product={soldOut} labels={LABELS} priority />
    </Tile>
  ),
};

export const Placeholder: Story = {
  name: 'Grid · before photos are approved',
  render: () => (
    <Tile>
      <ProductCard product={noPhoto} labels={LABELS} />
    </Tile>
  ),
};

export const Mini: Story = {
  name: 'Mini · cart and cross-sell',
  render: () => (
    <div style={{maxWidth: '26rem'}}>
      <ProductCard product={thermalSandBlue} variant="mini" labels={LABELS} />
    </div>
  ),
};

export const MiniList: Story = {
  name: 'Mini · the capsule in the empty cart',
  render: () => (
    <ul aria-label={copy.home.capsuleHead} style={{display: 'grid', gap: 'var(--space-4)', maxWidth: '26rem', listStyle: 'none', margin: 0, padding: 0}}>
      {PRODUCTS.map((p) => (
        <li key={p.handle}>
          <ProductCard product={cardData(p)} variant="mini" labels={LABELS} />
        </li>
      ))}
    </ul>
  ),
};

export const MiniLoading: Story = {
  name: 'Mini · loading skeleton',
  render: () => (
    <div style={{maxWidth: '26rem'}}>
      <ProductCard loading variant="mini" labels={LABELS} />
    </div>
  ),
};
