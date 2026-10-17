import type {Meta, StoryObj} from '@storybook/react-vite';
import {Skeleton} from './Skeleton';
import {copy} from '~/lib/copy';

/** Skeleton (05-components.md, Core): text, media, card. Sunken blocks; no shimmer under reduced motion. */
const meta = {
  title: 'Core/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {name: 'Text · 3 lines', render: () => <Skeleton variant="text" />};

export const TextLines: Story = {
  name: 'Text · 1 / 2 / 5 lines',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-6)'}}>
      <Skeleton variant="text" lines={1} />
      <Skeleton variant="text" lines={2} />
      <Skeleton variant="text" lines={5} />
    </div>
  ),
};

export const Media: Story = {
  name: 'Media · 4:5, labelled "Loading"',
  render: () => (
    <div style={{maxWidth: '20rem'}}>
      <Skeleton variant="media" ratio="4 / 5" label={copy.a11y.loading} />
    </div>
  ),
};

export const MediaRatios: Story = {
  name: 'Media · 4:5 / 1:1 / 16:9 (decorative)',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'start'}}>
      <Skeleton variant="media" ratio="4 / 5" />
      <Skeleton variant="media" ratio="1 / 1" />
      <Skeleton variant="media" ratio="16 / 9" />
    </div>
  ),
};

export const Card: Story = {
  name: 'Card · media + two lines',
  render: () => (
    <div style={{maxWidth: '20rem'}}>
      <Skeleton variant="card" ratio="4 / 5" />
    </div>
  ),
};

export const CardGrid: Story = {
  name: 'Card · shop grid while loading',
  render: () => (
    <div aria-busy="true" style={{display: 'grid', gap: 'var(--space-6) var(--space-3)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'}}>
      {Array.from({length: 4}).map((_, i) => (
        <Skeleton key={i} variant="card" ratio="4 / 5" />
      ))}
    </div>
  ),
};
