import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {SizeSelector, type SizeOption, type SizeSelectorProps} from './SizeSelector';
import {PRODUCTS, digs} from '~/lib/mock';
import {copy} from '~/lib/copy';

/**
 * SizeSelector (05-components.md, Core): radio-group buttons. States: available, selected,
 * sold-out (strike-through + "Hold my size"), disabled, error ("Select a size").
 * Sizes come from the product (S–XL, content/products).
 */
const thermal = PRODUCTS[0];
const SIZES: SizeOption[] = digs.sizes(thermal).map((value) => ({value, available: true}));
/** M and XL sold out: a UI state, not a stock fact. */
const SOLD: SizeOption[] = digs.sizes(thermal).map((value) => ({value, available: value !== 'M' && value !== 'XL'}));

const BASE = {
  label: copy.a11y.size,
  holdLabel: copy.cta.backInStock,
  soldOutLabel: copy.product.soldOut,
  aside: <button type="button">{copy.cta.sizeGuide}</button>,
};

const meta = {
  title: 'Core/SizeSelector',
  component: SizeSelector,
  args: {...BASE, sizes: SIZES, value: null},
} satisfies Meta<typeof SizeSelector>;
export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({initial = null, ...props}: Omit<SizeSelectorProps, 'value' | 'onChange'> & {initial?: string | null}) {
  const [value, setValue] = useState<string | null>(initial);
  const [error, setError] = useState<string | null>(props.error ?? null);
  return (
    <SizeSelector
      {...props}
      value={value}
      error={error}
      onChange={(v) => {
        setValue(v);
        setError(null);
      }}
    />
  );
}

export const Available: Story = {
  name: 'Available · nothing selected',
  render: () => <Controlled {...BASE} sizes={SIZES} />,
};

export const Selected: Story = {
  name: 'Selected · M',
  render: () => <Controlled {...BASE} sizes={SIZES} initial="M" />,
};

export const SoldOut: Story = {
  name: 'Sold out · M selected → "Hold my size"',
  render: () => <Controlled {...BASE} sizes={SOLD} initial="M" />,
};

export const SoldOutUnselected: Story = {
  name: 'Sold out · struck sizes, nothing selected',
  render: () => <Controlled {...BASE} sizes={SOLD} />,
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => <SizeSelector {...BASE} sizes={SIZES} value={null} disabled />,
};

export const ErrorState: Story = {
  name: 'Error · "Select a size"',
  render: () => <Controlled {...BASE} sizes={SIZES} error={copy.cta.selectSize} />,
};

export const WithoutAside: Story = {
  name: 'Without the size-guide aside',
  render: () => <Controlled label={copy.a11y.size} holdLabel={copy.cta.backInStock} soldOutLabel={copy.product.soldOut} sizes={SIZES} initial="L" />,
};
