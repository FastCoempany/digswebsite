import type {Meta, StoryObj} from '@storybook/react-vite';
import {ProductGallery, type GalleryItem} from './ProductGallery';
import {PRODUCTS, digs, srcSetFor} from '~/lib/mock';
import {copy} from '~/lib/copy';

/**
 * ProductGallery (05-components.md, Core): mobile scroll-snap carousel with a counter ("1 / 7"),
 * desktop two-column grid. States: default, zoomed, loading, single image. Slots are the
 * Thermal Long Sleeve's gallery (P-TLS-01…07) through the mock adapter; only 01 and 02 have
 * approved photos, the rest render as labelled placeholders.
 */
const meta = {
  title: 'Core/ProductGallery',
  component: ProductGallery,
} satisfies Meta<typeof ProductGallery>;
export default meta;
type Story = StoryObj<typeof meta>;

const thermal = PRODUCTS[0];

function itemsFor(colorway: string): GalleryItem[] {
  return digs.galleryFor(thermal, colorway).map((g) => ({
    code: g.code,
    ratio: g.ratio,
    image: g.image,
    srcSet: srcSetFor(g.image?.url),
    alt: g.image?.altText ?? `${thermal.title}${g.colorway ? `, ${g.colorway}` : ''}`,
  }));
}

const OFF_WHITE = itemsFor('Off White');
const SAND_BLUE = itemsFor('Sand Blue');

const LABELS = {previous: copy.a11y.previousImage, next: copy.a11y.nextImage, counter: copy.a11y.imageCounter, zoom: copy.a11y.zoomImage, close: copy.a11y.close, gallery: thermal.title};

const RAIL = <span className="type-micro type-caps" style={{display: 'inline-block', writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: 'var(--space-3) var(--space-2)'}}>{copy.rails.gallery}</span>;

export const Default: Story = {
  name: 'Default · 7 slots, Off White',
  args: {items: OFF_WHITE, labels: LABELS, rail: RAIL, caption: copy.product.imageDisclosure},
};

export const SandBlue: Story = {
  name: 'Default · 7 slots, Sand Blue',
  args: {items: SAND_BLUE, labels: LABELS, rail: RAIL, caption: copy.product.imageDisclosure},
};

export const Zoomed: Story = {
  name: 'Zoomed · full-screen modal on the first slot',
  args: {items: OFF_WHITE, labels: LABELS, rail: RAIL, caption: copy.product.imageDisclosure, zoomed: true},
};

export const ZoomedPlaceholder: Story = {
  name: 'Zoomed · on a placeholder slot',
  args: {items: OFF_WHITE, labels: LABELS, activeIndex: 2, zoomed: true},
};

export const Loading: Story = {
  name: 'Loading',
  args: {items: OFF_WHITE, labels: LABELS, loading: true},
};

export const SingleImage: Story = {
  name: 'Single image · no controls, no counter',
  args: {items: OFF_WHITE.slice(0, 1), labels: LABELS, caption: copy.product.imageDisclosure},
};

export const StartOnThird: Story = {
  name: 'Active index · starts on slot 3',
  args: {items: OFF_WHITE, labels: LABELS, rail: RAIL, activeIndex: 2},
};
