import type {Meta, StoryObj} from '@storybook/react-vite';
import {Accordion, type AccordionItem} from './Accordion';
import {PRODUCTS, digs} from '~/lib/mock';
import {copy, text} from '~/lib/copy';

/**
 * Accordion (05-components.md, Core): collapsed, expanded, focus; one-open-at-a-time is optional
 * per use. Content is the Thermal Long Sleeve's tech-pack facts through the mock adapter.
 */
const thermal = PRODUCTS[0];
const [details, fit, care, shipping] = copy.product.accordions;

const ITEMS: AccordionItem[] = [
  {
    id: 'details',
    title: details,
    content: (
      <ul>
        {digs.details(thermal).map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    ),
  },
  {
    id: 'fit',
    title: fit,
    content: (
      <>
        <p>{digs.fit(thermal)}</p>
        <p>{copy.pages.sizeGuide.sampleNote}</p>
      </>
    ),
  },
  {
    id: 'care',
    title: care,
    content: (
      <ul>
        {digs.care(thermal).map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    ),
  },
  {id: 'shipping', title: shipping, content: <p>{text(copy.product.shippingReturnsBody)}</p>},
];

const meta = {
  title: 'Core/Accordion',
  component: Accordion,
  args: {items: ITEMS},
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Forced states (tokens only): the global :focus-visible ring and Accordion.css :hover color, on the first trigger. */
const FORCED = `
.story-focus .accordion-item:first-child .accordion-trigger { outline: var(--border-strong) solid var(--color-focus-ring); outline-offset: 2px; }
.story-hover .accordion-item:first-child .accordion-trigger { color: var(--color-text-link); }
`;

export const Collapsed: Story = {name: 'Collapsed', args: {items: ITEMS}};
export const Expanded: Story = {name: 'Expanded · Details open (PDP default)', args: {items: ITEMS, defaultOpen: ['details']}};
export const SingleOpen: Story = {name: 'Single · one open at a time', args: {items: ITEMS, single: true, defaultOpen: ['care']}};
export const AllOpen: Story = {name: 'All expanded', args: {items: ITEMS, defaultOpen: ITEMS.map((i) => i.id)}};

export const Focus: Story = {
  name: 'Focus (forced on the first trigger)',
  render: () => (
    <>
      <style>{FORCED}</style>
      <Accordion items={ITEMS} className="story-focus" />
    </>
  ),
};

export const Hover: Story = {
  name: 'Hover (forced on the first trigger)',
  render: () => (
    <>
      <style>{FORCED}</style>
      <Accordion items={ITEMS} className="story-hover" />
    </>
  ),
};
