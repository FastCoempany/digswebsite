import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {QuantityStepper, type QuantityStepperProps} from './QuantityStepper';
import {copy} from '~/lib/copy';

/** QuantityStepper (05-components.md, Core): default, min, max, disabled, updating. */
const LABELS = {quantity: copy.a11y.quantity, increase: copy.a11y.increase, decrease: copy.a11y.decrease};

const meta = {
  title: 'Core/QuantityStepper',
  component: QuantityStepper,
  args: {value: 1, labels: LABELS},
} satisfies Meta<typeof QuantityStepper>;
export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({initial, ...props}: Omit<QuantityStepperProps, 'value' | 'onChange' | 'labels'> & {initial: number}) {
  const [value, setValue] = useState(initial);
  return <QuantityStepper {...props} value={value} onChange={setValue} labels={LABELS} />;
}

export const Default: Story = {name: 'Default · 2', render: () => <Controlled initial={2} />};
export const Min: Story = {name: 'Min · 1 (decrease disabled)', render: () => <Controlled initial={1} />};
export const Max: Story = {name: 'Max · 5 of 5 (increase disabled)', render: () => <Controlled initial={5} max={5} />};
export const Disabled: Story = {name: 'Disabled', render: () => <QuantityStepper value={2} disabled labels={LABELS} />};
export const Updating: Story = {name: 'Updating (aria-busy, dimmed)', render: () => <QuantityStepper value={2} updating labels={LABELS} />};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-4)', justifyItems: 'start'}}>
      <p className="type-micro type-caps">default · min · max · disabled · updating</p>
      <Controlled initial={2} />
      <Controlled initial={1} />
      <Controlled initial={5} max={5} />
      <QuantityStepper value={2} disabled labels={LABELS} />
      <QuantityStepper value={2} updating labels={LABELS} />
    </div>
  ),
};
