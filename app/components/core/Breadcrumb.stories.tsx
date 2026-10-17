import type {Meta, StoryObj} from '@storybook/react-vite';
import {Breadcrumb} from './Breadcrumb';
import {PRODUCTS} from '~/lib/mock';
import {copy} from '~/lib/copy';

/** Breadcrumb (05-components.md, Core): `Shop / Thermal Long Sleeve`; the last item is the current page. */
const meta = {
  title: 'Core/Breadcrumb',
  component: Breadcrumb,
  args: {label: copy.a11y.breadcrumb, items: [{label: copy.nav.shop, to: '/collections/all'}, {label: PRODUCTS[0].title}]},
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {name: 'Shop / product (PDP)'};

export const ThreeLevels: Story = {
  name: 'Home / Shop / product',
  args: {items: [{label: copy.a11y.home, to: '/'}, {label: copy.nav.shop, to: '/collections/all'}, {label: PRODUCTS[3].title}]},
};

export const Single: Story = {
  name: 'Single item (current page only)',
  args: {items: [{label: copy.pages.sizeGuide.head}]},
};

export const LongTitles: Story = {
  name: 'Wraps at 390',
  args: {items: [{label: copy.a11y.home, to: '/'}, {label: copy.nav.shop, to: '/collections/all'}, {label: copy.pages.shippingReturns.head, to: '/pages/shipping-returns'}, {label: PRODUCTS[1].title}]},
};
