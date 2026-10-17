import type {Meta, StoryObj} from '@storybook/react-vite';
import type {Product} from '~/lib/mock/types';
import {digs, PRODUCTS} from '~/lib/mock';
import {copy} from '~/lib/copy';
import {anchorsFor, flatsFor} from './flats';
import {BuiltLikeThis, type BuiltLikeThisProps} from './BuiltLikeThis';

/**
 * Tech-pack grammar as a design language: the garment flat with coded trim tokens pinned to it,
 * callout cards with leader lines. Flats, hotspots and anchors all come from the tech packs
 * through the mock adapter; nothing is typed here.
 */
const meta: Meta<typeof BuiltLikeThis> = {
  title: 'DIGS/BuiltLikeThis',
  component: BuiltLikeThis,
};
export default meta;

type Story = StoryObj<typeof BuiltLikeThis>;

const labels = {
  hotspot: copy.a11y.hotspot,
  where: copy.product.builtWhere,
  spec: copy.product.builtSpec,
  front: copy.product.viewFront,
  back: copy.product.viewBack,
  allDetails: copy.product.builtAll,
};
const thermal = PRODUCTS[0];
const pant = PRODUCTS[3];
const firstCode = (p: Product) => digs.hotspots(p)[0]?.code ?? '';

function built(product: Product, extra: Partial<BuiltLikeThisProps> = {}) {
  const hotspots = digs.hotspots(product);
  return (
    // The wallpaper bleeds past the section by design; the page clips it, so the story does too.
    <div style={{position: 'relative', overflow: 'clip'}}>
      <BuiltLikeThis flats={flatsFor(product.handle)} hotspots={hotspots} anchors={anchorsFor(product.handle, hotspots.length)} productName={product.title} labels={labels} {...extra} />
    </div>
  );
}

export const ThermalCollapsed: Story = {name: `${thermal.title} · collapsed`, render: () => built(thermal)};
export const ThermalHotspotActive: Story = {name: `${thermal.title} · hotspot active (${firstCode(thermal)})`, render: () => built(thermal, {state: 'hotspot-active', activeIndex: 0})};
export const ThermalAllOpen: Story = {name: `${thermal.title} · all open (print)`, render: () => built(thermal, {state: 'all-open'})};
export const ThermalTeaser: Story = {name: `${thermal.title} · teaser, limit 3 (home)`, render: () => built(thermal, {limit: 3})};
export const PantCollapsed: Story = {name: `${pant.title} · collapsed`, render: () => built(pant)};
export const PantHotspotActive: Story = {name: `${pant.title} · hotspot active (${firstCode(pant)})`, render: () => built(pant, {state: 'hotspot-active', activeIndex: 0})};
export const PantAllOpen: Story = {name: `${pant.title} · all open (print)`, render: () => built(pant, {state: 'all-open'})};
