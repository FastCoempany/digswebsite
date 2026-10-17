import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {SegmentedControl, type SegmentOption} from './SegmentedControl';
import {PRODUCTS} from '~/lib/mock';
import {copy} from '~/lib/copy';

/** SegmentedControl (05-components.md, Core): the shop filter. States: default, selected, focus. */
const [all, tops, bottoms] = copy.shop.filters;
const OPTIONS: SegmentOption[] = [
  {value: 'all', label: all, count: PRODUCTS.length},
  {value: 'tops', label: tops, count: PRODUCTS.filter((p) => p.productType === 'Tops').length},
  {value: 'bottoms', label: bottoms, count: PRODUCTS.filter((p) => p.productType === 'Bottoms').length},
];
const PLAIN: SegmentOption[] = OPTIONS.map(({value, label}) => ({value, label}));
const UNITS: SegmentOption[] = [
  {value: 'in', label: copy.a11y.inches},
  {value: 'cm', label: copy.a11y.centimetres},
];

const meta = {
  title: 'Core/SegmentedControl',
  component: SegmentedControl,
  args: {label: copy.a11y.mainNav, options: OPTIONS, value: 'all'},
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Forced focus (tokens only): mirrors SegmentedControl.css .segment:focus-visible on the selected segment. */
const FORCED = `
.story-focus .segment.is-selected { outline: var(--border-strong) solid var(--color-focus-ring); outline-offset: 1px; }
`;

function Controlled({initial, options, label}: {initial: string; options: SegmentOption[]; label: string}) {
  const [value, setValue] = useState(initial);
  return <SegmentedControl label={label} options={options} value={value} onChange={setValue} />;
}

export const Default: Story = {
  name: 'Default · All selected, with counts',
  render: () => <Controlled label={copy.a11y.mainNav} options={OPTIONS} initial="all" />,
};

export const Selected: Story = {
  name: 'Selected · Tops',
  render: () => <Controlled label={copy.a11y.mainNav} options={OPTIONS} initial="tops" />,
};

export const Focus: Story = {
  name: 'Focus (forced on the selected segment)',
  render: () => (
    <>
      <style>{FORCED}</style>
      <SegmentedControl label={copy.a11y.mainNav} options={OPTIONS} value="all" className="story-focus" />
    </>
  ),
};

export const WithoutCounts: Story = {
  name: 'Without counts',
  render: () => <Controlled label={copy.a11y.mainNav} options={PLAIN} initial="all" />,
};

export const Units: Story = {
  name: 'Units · in / cm (size chart toggle)',
  render: () => <Controlled label={copy.a11y.unitToggle} options={UNITS} initial="in" />,
};
