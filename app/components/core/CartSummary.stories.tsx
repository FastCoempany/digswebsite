import type {Meta, StoryObj} from '@storybook/react-vite';
import {CartSummary} from './CartSummary';
import {EMPTY_CART} from '~/lib/mock';
import {copy, text} from '~/lib/copy';

/**
 * CartSummary (05-components.md, Core): default, and the free-shipping progress slot (hidden
 * until shipping terms exist). Checkout hands off to Shopify later; nothing is wired, so the
 * button stays disabled with the checkout note underneath.
 */
const meta = {
  title: 'Core/CartSummary',
  component: CartSummary,
  args: {
    labels: {subtotal: copy.cart.subtotal, taxNote: copy.cart.taxNote, checkout: copy.cta.checkout, priceTBA: copy.product.priceTBA, checkoutNote: text(copy.cart.checkoutNote)},
    subtotal: null,
    freeShipping: null,
    checkoutDisabled: true,
  },
} satisfies Meta<typeof CartSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default · subtotal TBA, checkout disabled with note',
  render: (args) => (
    <div style={{maxWidth: '26rem'}}>
      <CartSummary {...args} />
    </div>
  ),
};

export const FreeShippingProgress: Story = {
  name: 'Free-shipping progress · UI slot (example threshold)',
  render: (args) => (
    <div style={{display: 'grid', gap: 'var(--space-5)', maxWidth: '26rem'}}>
      <CartSummary
        {...args}
        // The threshold and the line are a UI slot only: shipping terms are the founder's call
        // (03-represent-mechanics.md) and the label has no key in content/copy/en.json yet.
        labels={{...args.labels, freeShipping: 'Free shipping progress (UI slot: example threshold)'}}
        freeShipping={{threshold: 150, current: 90, currencyCode: 'USD'}}
      />
      <p className="type-small">Example threshold, no real terms. The bar stays hidden (`freeShipping={'{null}'}`) until they exist.</p>
    </div>
  ),
};

export const EmptyCartSubtotal: Story = {
  name: 'Zero subtotal (empty cart shape)',
  render: (args) => (
    <div style={{maxWidth: '26rem'}}>
      <CartSummary {...args} subtotal={EMPTY_CART.cost.subtotalAmount} />
    </div>
  ),
};

export const CheckoutEnabled: Story = {
  name: 'Checkout enabled (later phase)',
  render: (args) => (
    <div style={{maxWidth: '26rem'}}>
      <CartSummary {...args} labels={{subtotal: copy.cart.subtotal, taxNote: copy.cart.taxNote, checkout: copy.cta.checkout, priceTBA: copy.product.priceTBA}} checkoutDisabled={false} checkoutHref="/cart" />
    </div>
  ),
};
