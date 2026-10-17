import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {ToastRegion} from './Toast';
import {OverlayProvider, useOverlay, type ToastItem} from './OverlayProvider';
import {Button} from './Button';
import {copy} from '~/lib/copy';

/**
 * Toast (05-components.md, Core): added-to-cart and generic, enter and exit. Polite live region;
 * 300ms slide, instant under reduced motion. The region is fixed to the bottom of the viewport.
 */
const meta = {
  title: 'Core/Toast',
  component: ToastRegion,
  args: {toasts: [], onDismiss: () => undefined, dismissLabel: copy.a11y.dismiss},
} satisfies Meta<typeof ToastRegion>;
export default meta;
type Story = StoryObj<typeof meta>;

const ADDED: ToastItem = {id: 1, message: copy.product.added, kind: 'added-to-cart'};
const GENERIC: ToastItem = {id: 2, message: copy.product.holdConfirm, kind: 'generic'};
const LISTED: ToastItem = {id: 3, message: copy.product.listConfirm, kind: 'generic'};

function Region({items, exiting}: {items: ToastItem[]; exiting?: boolean}) {
  const [toasts, setToasts] = useState(items);
  return (
    <>
      <p className="type-small">Toasts sit at the bottom of the viewport.</p>
      <ToastRegion toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} dismissLabel={copy.a11y.dismiss} exiting={exiting} />
    </>
  );
}

export const AddedToCartEnter: Story = {name: 'Added to cart · enter', render: () => <Region items={[ADDED]} />};
export const GenericEnter: Story = {name: 'Generic · enter', render: () => <Region items={[GENERIC]} />};
export const AddedToCartExit: Story = {name: 'Added to cart · exit (forced)', render: () => <Region items={[ADDED]} exiting />};
export const GenericExit: Story = {name: 'Generic · exit (forced)', render: () => <Region items={[GENERIC]} exiting />};
export const Stack: Story = {name: 'Stacked · three in the queue', render: () => <Region items={[ADDED, GENERIC, LISTED]} />};

function Triggers() {
  const {toast, toasts, dismissToast} = useOverlay();
  return (
    <div style={{display: 'grid', gap: 'var(--space-4)', justifyItems: 'start'}}>
      <p className="type-small">Each toast dismisses itself after 4 seconds.</p>
      <Button onClick={() => toast(copy.product.added, 'added-to-cart')}>{copy.cta.addToCart}</Button>
      <Button variant="ghost" onClick={() => toast(copy.product.holdConfirm)}>
        {copy.cta.backInStock}
      </Button>
      <ToastRegion toasts={toasts} onDismiss={dismissToast} dismissLabel={copy.a11y.dismiss} />
    </div>
  );
}

export const Interactive: Story = {
  name: 'Interactive · through OverlayProvider',
  render: () => (
    <OverlayProvider>
      <Triggers />
    </OverlayProvider>
  ),
};
