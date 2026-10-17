import type {Meta, StoryObj} from '@storybook/react-vite';
import {copy} from '~/lib/copy';
import {Overline} from './Overline';

/** Micro caps label above a section ("CAPSULE 01"), with the d!gs dot as its bullet. */
const meta: Meta<typeof Overline> = {
  title: 'DIGS/Overline',
  component: Overline,
};
export default meta;

type Story = StoryObj<typeof Overline>;

export const Default: Story = {render: () => <Overline>{copy.brand.season}</Overline>};
export const OnDark: Story = {
  name: 'On dark',
  parameters: {surface: 'dark'},
  render: () => <Overline tone="on-dark">{copy.brand.season}</Overline>,
};
export const OnBrand: Story = {
  name: 'On brand',
  parameters: {surface: 'brand'},
  render: () => <Overline tone="on-brand">{copy.brand.season}</Overline>,
};
export const AboveHead: Story = {
  name: 'In context · above a section head',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-2)'}}>
      <Overline>{copy.shop.overline}</Overline>
      <h2 className="type-display">{copy.shop.head}</h2>
    </div>
  ),
};
