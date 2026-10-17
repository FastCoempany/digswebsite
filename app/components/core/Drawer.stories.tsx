import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {Drawer, type DrawerProps} from './Drawer';
import {Button} from './Button';
import {CartLine} from './CartLine';
import {CartSummary} from './CartSummary';
import {EmptyState} from './EmptyState';
import {Link} from './Link';
import {PRODUCTS, hydrateCart} from '~/lib/mock';
import {cartLineData} from '~/components/digs/chrome/CartDrawer';
import {Script, Wordmark} from '~/components/digs/marks';
import {copy, text} from '~/lib/copy';

/**
 * Drawer (05-components.md, Core): right (420px panel on desktop, full screen on mobile) and
 * full (full screen everywhere, the menu). States: open, closing. Native <dialog>, 300ms slide.
 */
const cart = hydrateCart({
  id: 'gid://shopify/Cart/story',
  lines: [
    {merchandiseId: PRODUCTS[0].variants.nodes[1].id, quantity: 1},
    {merchandiseId: PRODUCTS[3].variants.nodes[2].id, quantity: 2},
  ],
});
const LINES = cartLineData(cart);
const LINE_LABELS = {remove: copy.cart.remove, quantity: copy.a11y.quantity, increase: copy.a11y.increase, decrease: copy.a11y.decrease, priceTBA: copy.product.priceTBA, colorway: copy.a11y.colorway, size: copy.a11y.size};
const SUMMARY_LABELS = {subtotal: copy.cart.subtotal, taxNote: copy.cart.taxNote, checkout: copy.cta.checkout, priceTBA: copy.product.priceTBA, checkoutNote: text(copy.cart.checkoutNote)};

const meta = {
  title: 'Core/Drawer',
  component: Drawer,
  // Every story renders through the Stateful wrapper below; these satisfy the required props.
  args: {open: true, onClose: () => undefined, title: copy.cart.head, label: copy.cart.head, closeLabel: copy.a11y.closeCart, children: null},
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Forced mid-transition look for the closing state (tokens only): the panel transform and backdrop opacity Drawer.css animates, held halfway. */
const FORCED = `
.drawer-right.is-open.story-closing .drawer-panel { transform: translateX(50%); }
.drawer-full.is-open.story-closing .drawer-panel { transform: translateY(-50%); }
.drawer.is-open.story-closing::backdrop { opacity: 0.5; }
`;

function Stateful({initial, trigger, ...props}: Omit<DrawerProps, 'open' | 'onClose'> & {initial: boolean; trigger: string}) {
  const [open, setOpen] = useState(initial);
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        {trigger}
      </Button>
      <Drawer {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const cartTitle = (
  <span className="type-h3">
    {copy.cart.head} ({cart.totalQuantity})
  </span>
);

const cartLines = (
  <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
    {LINES.map((l) => (
      <CartLine key={l.id} line={l} labels={LINE_LABELS} />
    ))}
  </ul>
);

const MENU_ITEMS = [
  {label: copy.nav.shop, to: '/collections/all'},
  {label: copy.nav.manifesto, to: '/pages/manifesto'},
  {label: copy.nav.cart, to: '/cart'},
  {label: copy.nav.instagram, to: copy.brand.instagramUrl, external: true},
];

const menuBody = (
  <nav aria-label={copy.a11y.mainNav} style={{padding: 'var(--space-5) var(--layout-margin)'}}>
    <ul style={{display: 'grid', gap: 'var(--space-2)'}}>
      {MENU_ITEMS.map((item) => (
        <li key={item.label}>
          <Link to={item.to} variant="nav" external={item.external} className="type-h1">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
    <ul style={{display: 'flex', gap: 'var(--space-5)', marginTop: 'var(--space-8)'}}>
      {copy.menu.smallPrint.map((item) => (
        <li key={item.to}>
          <Link to={item.to} variant="footer">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export const RightOpen: Story = {
  name: 'Right · open (cart, two lines)',
  render: () => (
    <Stateful initial trigger={`${copy.cta.cart} (${cart.totalQuantity})`} side="right" title={cartTitle} label={copy.cart.head} closeLabel={copy.a11y.closeCart} footer={<CartSummary subtotal={cart.cost.subtotalAmount} labels={SUMMARY_LABELS} freeShipping={null} checkoutDisabled />}>
      {cartLines}
    </Stateful>
  ),
};

export const RightEmpty: Story = {
  name: 'Right · open, empty cart',
  render: () => (
    <Stateful initial trigger={`${copy.cta.cart} (0)`} side="right" title={<span className="type-h3">{copy.cart.head}</span>} label={copy.cart.head} closeLabel={copy.a11y.closeCart}>
      <EmptyState
        variant="cart"
        heading={copy.cart.empty}
        body={text(copy.cart.emptyBody)}
        art={
          <span className="type-display">
            <Script word={copy.cart.emptyScript} />
          </span>
        }
        action={<Button to="/collections/all">{copy.cta.enterShop}</Button>}
      />
    </Stateful>
  ),
};

export const FullOpen: Story = {
  name: 'Full · open (menu, page tone)',
  render: () => (
    <Stateful initial trigger={copy.a11y.openMenu} side="full" tone="page" title={<Wordmark color="blue" height="28px" />} label={copy.a11y.menu} closeLabel={copy.a11y.closeMenu}>
      {menuBody}
    </Stateful>
  ),
};

export const Trigger: Story = {
  name: 'Closed · opens from a trigger',
  render: () => (
    <Stateful initial={false} trigger={`${copy.cta.cart} (${cart.totalQuantity})`} side="right" title={cartTitle} label={copy.cart.head} closeLabel={copy.a11y.closeCart} footer={<CartSummary subtotal={cart.cost.subtotalAmount} labels={SUMMARY_LABELS} freeShipping={null} checkoutDisabled />}>
      {cartLines}
    </Stateful>
  ),
};

export const RightClosing: Story = {
  name: 'Right · closing (forced mid-transition)',
  render: () => (
    <>
      <style>{FORCED}</style>
      <Stateful initial trigger={`${copy.cta.cart} (${cart.totalQuantity})`} side="right" title={cartTitle} label={copy.cart.head} closeLabel={copy.a11y.closeCart} className="story-closing">
        {cartLines}
      </Stateful>
    </>
  ),
};

export const FullClosing: Story = {
  name: 'Full · closing (forced mid-transition)',
  render: () => (
    <>
      <style>{FORCED}</style>
      <Stateful initial trigger={copy.a11y.openMenu} side="full" tone="page" title={<Wordmark color="blue" height="28px" />} label={copy.a11y.menu} closeLabel={copy.a11y.closeMenu} className="story-closing">
        {menuBody}
      </Stateful>
    </>
  ),
};
