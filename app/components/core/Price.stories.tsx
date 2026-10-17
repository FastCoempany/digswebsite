import type {Meta, StoryObj} from '@storybook/react-vite';
import type {ReactNode} from 'react';
import {Price, type PriceProps} from './Price';
import {PRODUCTS} from '~/lib/mock';
import {copy} from '~/lib/copy';

/**
 * Price (05-components.md, Core): regular, sale (strike-through + sale color), TBA, from.
 * Every capsule price is `null` until the founder sets it (decision O1), so TBA is the only real
 * state today. The regular / sale / from stories use EXAMPLE AMOUNTS that belong to no product.
 */
// "From", "Sale price" and "Regular price" have no key in content/copy/en.json yet: story-only
// strings, flagged for the copy file. The TBA label is the real one.
const LABELS: PriceProps['labels'] = {tba: copy.product.priceTBA, from: 'From', sale: 'Sale price', regular: 'Regular price'};

/** Example amounts: not a product fact. */
const EXAMPLE = {amount: '120.00', currencyCode: 'USD'};
const EXAMPLE_SALE = {amount: '96.00', currencyCode: 'USD'};
const EXAMPLE_NOTE = 'Example amounts: no capsule piece has a price yet (decision O1).';

const realPrice = PRODUCTS[0].variants.nodes[0].price;

const meta = {
  title: 'Core/Price',
  component: Price,
  args: {price: realPrice, labels: LABELS},
} satisfies Meta<typeof Price>;
export default meta;
type Story = StoryObj<typeof meta>;

function Row({label, children}: {label: string; children: ReactNode}) {
  return (
    <div style={{display: 'grid', gap: 'var(--space-2)'}}>
      <p className="type-micro type-caps">{label}</p>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', alignItems: 'baseline'}}>{children}</div>
    </div>
  );
}

function Example({children}: {children: ReactNode}) {
  return (
    <div style={{display: 'grid', gap: 'var(--space-5)'}}>
      {children}
      <p className="type-small">{EXAMPLE_NOTE}</p>
    </div>
  );
}

export const TBA: Story = {
  name: 'TBA (price: null, the real state)',
  render: () => (
    <Row label={`${PRODUCTS[0].title} · price from content/products`}>
      <Price price={realPrice} labels={LABELS} />
    </Row>
  ),
};

export const Regular: Story = {
  name: 'Regular · example amounts',
  render: () => (
    <Example>
      <Row label="regular">
        <Price price={EXAMPLE} labels={LABELS} />
      </Row>
    </Example>
  ),
};

export const Sale: Story = {
  name: 'Sale · example amounts',
  render: () => (
    <Example>
      <Row label="sale: struck regular price, sale color on the amount">
        <Price price={EXAMPLE_SALE} compareAtPrice={EXAMPLE} labels={LABELS} />
      </Row>
    </Example>
  ),
};

export const From: Story = {
  name: 'From · example amounts',
  render: () => (
    <Example>
      <Row label="from (ranges on cards)">
        <Price price={EXAMPLE} from labels={LABELS} />
      </Row>
    </Example>
  ),
};

export const Sizes: Story = {
  name: 'Sizes · sm / md / lg',
  render: () => (
    <Example>
      <Row label="sm · md · lg · TBA">
        <Price price={realPrice} labels={LABELS} size="sm" />
        <Price price={realPrice} labels={LABELS} size="md" />
        <Price price={realPrice} labels={LABELS} size="lg" />
      </Row>
      <Row label="sm · md · lg · example amounts">
        <Price price={EXAMPLE} labels={LABELS} size="sm" />
        <Price price={EXAMPLE} labels={LABELS} size="md" />
        <Price price={EXAMPLE} labels={LABELS} size="lg" />
      </Row>
    </Example>
  ),
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Example>
      <Row label="TBA (real)">
        <Price price={realPrice} labels={LABELS} />
      </Row>
      <Row label="regular · example">
        <Price price={EXAMPLE} labels={LABELS} />
      </Row>
      <Row label="sale · example">
        <Price price={EXAMPLE_SALE} compareAtPrice={EXAMPLE} labels={LABELS} />
      </Row>
      <Row label="from · example">
        <Price price={EXAMPLE} from labels={LABELS} />
      </Row>
    </Example>
  ),
};
