import type {Meta, StoryObj} from '@storybook/react-vite';
import {Wallpaper, type WallpaperProps} from './Wallpaper';

/**
 * Wordmark or scrawl pattern rebuilt from the SVGs as a repeating CSS mask. Behind content on ice
 * it stays at 6% or less (02-puff-junction-attitude.md); at 100% it is a poster fill.
 */
const meta: Meta<typeof Wallpaper> = {
  title: 'DIGS/Wallpaper',
  component: Wallpaper,
};
export default meta;

type Story = StoryObj<typeof Wallpaper>;

const TONES = ['blue', 'black', 'ice'] as const;

/** Each tone in a positioned, fixed-height box on the surface it is meant for: blue and black on ice, ice on Digs Blue. */
function Boxes({variant, opacity}: {variant: WallpaperProps['variant']; opacity: number}) {
  return (
    <div style={{display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))'}}>
      {TONES.map((tone) => (
        <div
          key={tone}
          data-surface={tone === 'ice' ? 'brand' : undefined}
          style={{
            position: 'relative',
            height: '20rem',
            overflow: 'hidden',
            background: tone === 'ice' ? 'var(--color-surface-brand)' : 'var(--color-surface-page)',
            border: 'var(--border-hairline) solid var(--color-border-hairline)',
          }}
        >
          <Wallpaper variant={variant} tone={tone} opacity={opacity} />
        </div>
      ))}
    </div>
  );
}

export const StackedFaint: Story = {name: 'Stacked · 6% (the ceiling behind content) · blue, black, ice', render: () => <Boxes variant="stacked" opacity={0.06} />};
export const StackedFull: Story = {name: 'Stacked · 100% · blue, black, ice', render: () => <Boxes variant="stacked" opacity={1} />};
export const OffsetFaint: Story = {name: 'Offset · 6% · blue, black, ice', render: () => <Boxes variant="offset" opacity={0.06} />};
export const OffsetFull: Story = {name: 'Offset · 100% · blue, black, ice', render: () => <Boxes variant="offset" opacity={1} />};
export const ScrawlFaint: Story = {name: 'Scrawl · 6% · blue, black, ice', render: () => <Boxes variant="scrawl" opacity={0.06} />};
export const ScrawlFull: Story = {name: 'Scrawl · 100% · blue, black, ice', render: () => <Boxes variant="scrawl" opacity={1} />};
