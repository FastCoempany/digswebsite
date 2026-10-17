import type {Meta, StoryObj} from '@storybook/react-vite';
import {digs, PRODUCTS} from '~/lib/mock';
import {StyleString} from './StyleString';

/** Tech-pack header grammar as a micro caps line: `STYLE CODE | NAME | SIZES`, from the product metafield. */
const meta: Meta<typeof StyleString> = {
  title: 'DIGS/StyleString',
  component: StyleString,
};
export default meta;

type Story = StoryObj<typeof StyleString>;

const one = (i: number) => <StyleString value={digs.styleString(PRODUCTS[i])} />;

export const Thermal: Story = {name: PRODUCTS[0].title, render: () => one(0)};
export const Pincord: Story = {name: PRODUCTS[1].title, render: () => one(1)};
export const Needlecord: Story = {name: PRODUCTS[2].title, render: () => one(2)};
export const Pant: Story = {name: PRODUCTS[3].title, render: () => one(3)};
export const AllFour: Story = {
  name: 'All four',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-3)'}}>
      {PRODUCTS.map((p) => (
        <StyleString key={p.handle} value={digs.styleString(p)} />
      ))}
    </div>
  ),
};
