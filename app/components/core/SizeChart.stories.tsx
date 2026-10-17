import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {SizeChart, type SizeChartUnit} from './SizeChart';
import {PRODUCTS, digs} from '~/lib/mock';
import {copy} from '~/lib/copy';

/**
 * SizeChart (05-components.md, Core): tops and bottoms, in / cm. Data is the graded spec from
 * content/products/specs/*.json filtered to the customer POMs (through the mock adapter);
 * nothing is typed in here.
 */
const thermal = PRODUCTS[0];
const pant = PRODUCTS[3];

function must<T>(chart: T | null, handle: string): T {
  if (!chart) throw new Error(`size chart metafield missing from the mock product ${handle}`);
  return chart;
}
const tops = must(digs.sizeChart(thermal), thermal.handle);
const bottoms = must(digs.sizeChart(pant), pant.handle);

const LABELS = {units: copy.a11y.unitToggle, inches: copy.a11y.inches, centimetres: copy.a11y.centimetres, measurement: copy.product.measurementsHeadNoSize, laidFlat: copy.a11y.laidFlat, note: copy.product.sizeNoteLaidFlat};

const meta = {
  title: 'Core/SizeChart',
  component: SizeChart,
  args: {sizes: tops.sizes, rows: tops.rows, labels: LABELS},
} satisfies Meta<typeof SizeChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TopsInches: Story = {
  name: 'Tops · Thermal Long Sleeve · in',
  args: {title: thermal.title, sizes: tops.sizes, rows: tops.rows, unit: 'in', note: tops.note, labels: LABELS},
};

export const TopsCentimetres: Story = {
  name: 'Tops · Thermal Long Sleeve · cm',
  args: {title: thermal.title, sizes: tops.sizes, rows: tops.rows, unit: 'cm', note: tops.note, labels: LABELS},
};

export const BottomsInches: Story = {
  name: 'Bottoms · Drawstring Pant · in',
  args: {title: pant.title, sizes: bottoms.sizes, rows: bottoms.rows, unit: 'in', note: bottoms.note, labels: LABELS},
};

export const BottomsCentimetres: Story = {
  name: 'Bottoms · Drawstring Pant · cm',
  args: {title: pant.title, sizes: bottoms.sizes, rows: bottoms.rows, unit: 'cm', note: bottoms.note, labels: LABELS},
};

export const SelectedSize: Story = {
  name: 'Selected size column · M',
  args: {title: thermal.title, sizes: tops.sizes, rows: tops.rows, unit: 'in', selectedSize: 'M', note: tops.note, labels: LABELS},
};

function Controlled() {
  const [unit, setUnit] = useState<SizeChartUnit>('in');
  return (
    <div style={{display: 'grid', gap: 'var(--space-8)'}}>
      <SizeChart title={thermal.title} sizes={tops.sizes} rows={tops.rows} unit={unit} onUnitChange={setUnit} note={tops.note} labels={LABELS} />
      <SizeChart title={pant.title} sizes={bottoms.sizes} rows={bottoms.rows} unit={unit} onUnitChange={setUnit} note={bottoms.note} labels={LABELS} />
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive · one unit toggle for both tables',
  render: () => <Controlled />,
};

export const Untitled: Story = {
  name: 'Without a title (inside the size-guide modal)',
  args: {sizes: tops.sizes, rows: tops.rows, labels: LABELS},
};
