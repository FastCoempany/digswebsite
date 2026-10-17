import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import type {ReactNode} from 'react';
import {CartLine, type CartLineData} from './CartLine';
import {PRODUCTS, hydrateCart} from '~/lib/mock';
import {cartLineData} from '~/components/digs/chrome/CartDrawer';
import {copy, text} from '~/lib/copy';

/**
 * CartLine (05-components.md, Core): default, updating, removing, error. Lines come from a
 * Storefront-shaped cart (`hydrateCart`) mapped by the same helper the cart drawer uses, so
 * titles, colorways, sizes and the (null → "Price TBA") totals are real.
 */
const cart = hydrateCart({
  id: 'gid://shopify/Cart/story',
  lines: [
    {merchandiseId: PRODUCTS[0].variants.nodes[1].id, quantity: 1}, // Thermal Long Sleeve · Off White / M
    {merchandiseId: PRODUCTS[3].variants.nodes[2].id, quantity: 2}, // Drawstring Pant · Salmon / L
  ],
});
const [thermalLine, pantLine] = cartLineData(cart);

const LABELS = {remove: copy.cart.remove, quantity: copy.a11y.quantity, increase: copy.a11y.increase, decrease: copy.a11y.decrease, priceTBA: copy.product.priceTBA, colorway: copy.a11y.colorway, size: copy.a11y.size};

const meta = {
  title: 'Core/CartLine',
  component: CartLine,
  args: {line: thermalLine, labels: LABELS},
} satisfies Meta<typeof CartLine>;
export default meta;
type Story = StoryObj<typeof meta>;

/** CartLine renders an <li>, so every story wraps it in a list. */
function Lines({children}: {children: ReactNode}) {
  return (
    <ul aria-label={copy.cart.head} style={{listStyle: 'none', margin: 0, padding: 0, maxWidth: '32rem'}}>
      {children}
    </ul>
  );
}

export const Default: Story = {
  name: 'Default',
  render: () => (
    <Lines>
      <CartLine line={thermalLine} labels={LABELS} />
    </Lines>
  ),
};

export const Updating: Story = {
  name: 'Updating · quantity change in flight',
  render: () => (
    <Lines>
      <CartLine line={thermalLine} labels={LABELS} state="updating" />
    </Lines>
  ),
};

export const Removing: Story = {
  name: 'Removing · line fading out',
  render: () => (
    <Lines>
      <CartLine line={thermalLine} labels={LABELS} state="removing" />
    </Lines>
  ),
};

export const ErrorState: Story = {
  name: 'Error · "That didn\'t update. Try again."',
  render: () => (
    <Lines>
      <CartLine line={thermalLine} labels={LABELS} state="error" error={text(copy.cart.lineError)} />
    </Lines>
  ),
};

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <Lines>
      <CartLine line={thermalLine} labels={LABELS} />
      <CartLine line={pantLine} labels={LABELS} state="updating" />
      <CartLine line={thermalLine} labels={LABELS} state="removing" />
      <CartLine line={pantLine} labels={LABELS} state="error" error={text(copy.cart.lineError)} />
    </Lines>
  ),
};

function Interactive() {
  const [lines, setLines] = useState<CartLineData[]>([thermalLine, pantLine]);
  const [busy, setBusy] = useState<{id: string; state: 'updating' | 'removing'} | null>(null);
  const settle = (fn: () => void) => window.setTimeout(() => {
    fn();
    setBusy(null);
  }, 700);
  return (
    <Lines>
      {lines.map((l) => (
        <CartLine
          key={l.id}
          line={l}
          labels={LABELS}
          state={busy?.id === l.id ? busy.state : 'default'}
          onQuantity={(id, quantity) => {
            setBusy({id, state: 'updating'});
            settle(() => setLines((cur) => cur.map((x) => (x.id === id ? {...x, quantity} : x))));
          }}
          onRemove={(id) => {
            setBusy({id, state: 'removing'});
            settle(() => setLines((cur) => cur.filter((x) => x.id !== id)));
          }}
        />
      ))}
    </Lines>
  );
}

export const Stateful: Story = {
  name: 'Interactive · two lines, stepper and remove',
  render: () => <Interactive />,
};
