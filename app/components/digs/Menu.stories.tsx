import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button} from '~/components/core/Button';
import {copy} from '~/lib/copy';
import {Menu, type MenuItem} from './Menu';

/**
 * Full-screen menu: stacked full-width blocks, each a single huge Alexandria word, blue on ice.
 * The hovered or focused block flips to ice on blue with a scrawl underline (`activeIndex` forces
 * that look for a screenshot). Focus is trapped in the dialog; Esc closes.
 */
const meta: Meta<typeof Menu> = {
  title: 'DIGS/Menu',
  component: Menu,
  parameters: {padded: false},
};
export default meta;

type Story = StoryObj<typeof Menu>;

const ITEMS: MenuItem[] = [
  {label: copy.nav.shop, to: '/collections/all'},
  {label: copy.nav.manifesto, to: '/pages/manifesto'},
  {label: copy.nav.cart, to: '/cart', count: 2},
  {label: copy.nav.instagram, to: copy.brand.instagramUrl, external: true},
];
const LABELS = {close: copy.a11y.closeMenu, menu: copy.a11y.menu};

/** Stateful wrapper: a trigger with the menu's accessible name, so close and reopen work in every story. */
function MenuDemo({initialOpen = false, activeIndex}: {initialOpen?: boolean; activeIndex?: number}) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div style={{padding: 'var(--space-5)'}}>
      <Button variant="secondary" aria-haspopup="dialog" aria-controls="site-menu" aria-expanded={open} onClick={() => setOpen(true)}>
        {copy.a11y.openMenu}
      </Button>
      <Menu open={open} onClose={() => setOpen(false)} items={ITEMS} smallPrint={copy.menu.smallPrint} labels={LABELS} activeIndex={activeIndex} />
    </div>
  );
}

export const Open: Story = {name: 'Open', render: () => <MenuDemo initialOpen />};
export const ActiveShop: Story = {name: `Open · ${ITEMS[0].label} hover/focus flip`, render: () => <MenuDemo initialOpen activeIndex={0} />};
export const ActiveManifesto: Story = {name: `Open · ${ITEMS[1].label} hover/focus flip`, render: () => <MenuDemo initialOpen activeIndex={1} />};
export const ActiveCart: Story = {name: `Open · ${ITEMS[2].label} (2) hover/focus flip`, render: () => <MenuDemo initialOpen activeIndex={2} />};
export const ActiveInstagram: Story = {name: `Open · ${ITEMS[3].label} hover/focus flip`, render: () => <MenuDemo initialOpen activeIndex={3} />};
export const Closed: Story = {name: 'Closed · trigger button', render: () => <MenuDemo />};
