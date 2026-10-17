import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {SwatchGroup, type SwatchGroupProps, type SwatchOption} from './SwatchGroup';
import {PRODUCTS, digs, type Product} from '~/lib/mock';
import {copy} from '~/lib/copy';

/**
 * SwatchGroup (05-components.md, Core): sm (cards) and md (PDP). States: default, selected
 * (2px ink ring with gap), unavailable (diagonal strike), focus. Every swatch carries the
 * ink-300 keyline. Colors are the cloth tokens from content/products via the mock adapter.
 */
const thermal = PRODUCTS[0];
const toOptions = (p: Product): SwatchOption[] => digs.colorways(p).map((c) => ({value: c.name, label: c.name, color: c.color, available: true}));
/** The thermal's two colorways (Off White, Sand Blue). */
const THERMAL = toOptions(thermal);
/** All five capsule colorways in one row, for density only (no product has five). */
const CAPSULE = PRODUCTS.flatMap(toOptions);
const WITH_UNAVAILABLE: SwatchOption[] = THERMAL.map((o, i) => (i === 1 ? {...o, available: false} : o));

const meta = {
  title: 'Core/SwatchGroup',
  component: SwatchGroup,
  args: {label: copy.a11y.colorway, options: THERMAL, value: null},
} satisfies Meta<typeof SwatchGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Forced focus (tokens only): mirrors SwatchGroup.css .swatch:focus-visible on the first swatch. */
const FORCED = `
.story-focus .swatch:first-child { outline: var(--border-strong) solid var(--color-focus-ring); outline-offset: 3px; }
`;

function Controlled({initial = null, ...props}: Omit<SwatchGroupProps, 'value' | 'onChange'> & {initial?: string | null}) {
  const [value, setValue] = useState<string | null>(initial);
  return <SwatchGroup {...props} value={value} onChange={setValue} />;
}

export const Md: Story = {
  name: 'md (PDP) · name shown',
  render: () => <Controlled label={copy.a11y.colorway} options={THERMAL} initial={THERMAL[0].value} size="md" showName unavailableLabel={copy.a11y.unavailable} />,
};

export const Sm: Story = {
  name: 'sm (cards) · interactive',
  render: () => <Controlled label={copy.a11y.colorway} options={THERMAL} initial={THERMAL[0].value} size="sm" unavailableLabel={copy.a11y.unavailable} />,
};

export const Selected: Story = {
  name: 'Selected · 2px ring with gap',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-6)'}}>
      <SwatchGroup label={copy.a11y.colorway} options={THERMAL} value={THERMAL[1].value} size="md" showName />
      <SwatchGroup label={copy.a11y.colorway} options={THERMAL} value={THERMAL[1].value} size="sm" />
    </div>
  ),
};

export const Unavailable: Story = {
  name: 'Unavailable · diagonal strike',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-6)'}}>
      <Controlled label={copy.a11y.colorway} options={WITH_UNAVAILABLE} initial={THERMAL[0].value} size="md" showName unavailableLabel={copy.a11y.unavailable} />
      <Controlled label={copy.a11y.colorway} options={WITH_UNAVAILABLE} initial={THERMAL[0].value} size="sm" unavailableLabel={copy.a11y.unavailable} />
    </div>
  ),
};

export const Focus: Story = {
  name: 'Focus (forced on the first swatch)',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-6)'}}>
      <style>{FORCED}</style>
      <SwatchGroup label={copy.a11y.colorway} options={THERMAL} value={THERMAL[0].value} size="md" showName className="story-focus" />
      <SwatchGroup label={copy.a11y.colorway} options={THERMAL} value={THERMAL[0].value} size="sm" className="story-focus" />
    </div>
  ),
};

export const ReadOnly: Story = {
  name: 'Read-only (cards: shown, not interactive; tooltip names)',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-6)'}}>
      <SwatchGroup label={copy.a11y.colorway} options={THERMAL} value={null} size="sm" readOnly />
      <SwatchGroup label={copy.a11y.colorway} options={WITH_UNAVAILABLE} value={null} size="sm" readOnly />
      <SwatchGroup label={copy.a11y.colorway} options={CAPSULE} value={null} size="sm" readOnly />
    </div>
  ),
};

export const AllCapsuleColorways: Story = {
  name: 'All five capsule colorways (density check)',
  render: () => <Controlled label={copy.a11y.colorway} options={CAPSULE} initial={CAPSULE[0].value} size="md" showName unavailableLabel={copy.a11y.unavailable} />,
};
