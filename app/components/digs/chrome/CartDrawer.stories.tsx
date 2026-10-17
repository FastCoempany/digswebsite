import type {Meta, StoryObj} from '@storybook/react-vite';
import {OverlayProvider} from '~/components/core/OverlayProvider';
import {EMPTY_CART, PRODUCTS, hydrateCart} from '~/lib/mock';
import {CartDrawer} from './CartDrawer';

/** "Your Digs": right drawer on desktop, full screen on mobile. Empty state shows the capsule; prices read "Price TBA". */
const meta: Meta<typeof CartDrawer> = {
  title: 'DIGS/CartDrawer',
  component: CartDrawer,
  parameters: {padded: false},
  decorators: [
    (Story) => (
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CartDrawer>;

const noop = () => {};
const variant = PRODUCTS[0].variants.nodes[1];
const filled = hydrateCart({id: 'gid://shopify/Cart/story', lines: [{merchandiseId: variant.id, quantity: 1}]});

export const Empty: Story = {
  name: 'Open · empty (shows the capsule)',
  render: () => <CartDrawer cart={EMPTY_CART} products={PRODUCTS} open onClose={noop} />,
};
export const Filled: Story = {
  name: `Open · one line (${PRODUCTS[0].title}, ${variant.title})`,
  render: () => <CartDrawer cart={filled} products={PRODUCTS} open onClose={noop} />,
};
