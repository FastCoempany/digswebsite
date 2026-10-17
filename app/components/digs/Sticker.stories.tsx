import type {Meta, StoryObj} from '@storybook/react-vite';
import {digs, PRODUCTS} from '~/lib/mock';
import {Sticker, type StickerProps} from './Sticker';

/**
 * Angled stamps that break the grid: the DD brandmark, the "Actually Dope" scrawl, the d!gs dot
 * badge and a tech-pack trim token. Decorative (aria-hidden), rotation clamped to −12…+12°.
 */
const meta: Meta<typeof Sticker> = {
  title: 'DIGS/Sticker',
  component: Sticker,
};
export default meta;

type Story = StoryObj<typeof Sticker>;

const SIZES = ['sm', 'md', 'lg'] as const;
const TONES = ['blue', 'black', 'ice'] as const;
/** Trim codes come from the tech packs through the mock adapter, never typed here. */
const TRIM_CODES = Array.from(new Set(PRODUCTS.flatMap((p) => digs.hotspots(p).map((h) => h.code))));

/** One row per tone, sm → lg across. The ice tone sits on Digs Blue, where it belongs. */
function Matrix({kind, code}: {kind: StickerProps['kind']; code?: string}) {
  return (
    <div style={{display: 'grid', gap: 'var(--space-4)'}}>
      {TONES.map((tone) => (
        <div
          key={tone}
          data-surface={tone === 'ice' ? 'brand' : undefined}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--space-7)',
            padding: 'var(--space-6)',
            background: tone === 'ice' ? 'var(--color-surface-brand)' : 'var(--color-surface-raised)',
          }}
        >
          {SIZES.map((size) => (
            <Sticker key={size} kind={kind} size={size} tone={tone} code={code} />
          ))}
        </div>
      ))}
    </div>
  );
}

const row = {display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-8)', padding: 'var(--space-6)'} as const;

export const DD: Story = {name: 'DD · sizes × tones', render: () => <Matrix kind="dd" />};
export const ActuallyDope: Story = {name: 'Actually Dope · sizes × tones', render: () => <Matrix kind="actually-dope" />};
export const Dot: Story = {name: 'd!gs dot · sizes × tones', render: () => <Matrix kind="dot" />};
export const Trim: Story = {name: 'Trim L3 · sizes × tones', render: () => <Matrix kind="trim" code="L3" />};
export const TrimCodes: Story = {
  name: 'Trim · every code in the tech packs',
  render: () => (
    <div style={row}>
      {TRIM_CODES.map((code, i) => (
        <Sticker key={code} kind="trim" code={code} rotate={((i % 5) - 2) * 6} />
      ))}
    </div>
  ),
};
export const Rotation: Story = {
  name: 'Rotation · −12°, 0°, +12°',
  render: () => (
    <div style={row}>
      {[-12, 0, 12].map((deg) => (
        <Sticker key={deg} kind="dd" size="lg" rotate={deg} />
      ))}
      {[-12, 0, 12].map((deg) => (
        <Sticker key={deg} kind="actually-dope" size="lg" rotate={deg} />
      ))}
    </div>
  ),
};
export const DropOn: Story = {
  name: 'Drop-on entrance (300ms; none under reduced motion)',
  render: () => (
    <div style={row}>
      <Sticker kind="dd" size="lg" dropOn />
      <Sticker kind="actually-dope" size="lg" rotate={6} dropOn />
      <Sticker kind="dot" size="lg" rotate={-4} dropOn />
      <Sticker kind="trim" code="L3" size="lg" rotate={10} dropOn />
    </div>
  ),
};
