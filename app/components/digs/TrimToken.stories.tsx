import type {Meta, StoryObj} from '@storybook/react-vite';
import {digs, PRODUCTS} from '~/lib/mock';
import {TrimToken, type TrimTokenProps} from './TrimToken';

/** Small coded circle, the tech packs' trim grammar (L1, L3, RIB, YOKE…). Presentational. */
const meta: Meta<typeof TrimToken> = {
  title: 'DIGS/TrimToken',
  component: TrimToken,
};
export default meta;

type Story = StoryObj<typeof TrimToken>;

const SIZES = ['sm', 'md', 'lg'] as const;
/** The thermal's hotspot codes, straight from its tech pack via the mock adapter. */
const CODES = digs.hotspots(PRODUCTS[0]).map((h) => h.code);

/** One row per size, every code across. */
function Rows({tone, active}: {tone: TrimTokenProps['tone']; active?: boolean}) {
  return (
    <div style={{display: 'grid', gap: 'var(--space-4)'}}>
      {SIZES.map((size) => (
        <div key={size} style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)'}}>
          {CODES.map((code) => (
            <TrimToken key={code} code={code} size={size} tone={tone} active={active} />
          ))}
        </div>
      ))}
    </div>
  );
}

export const Ink: Story = {name: 'Ink · sm, md, lg', render: () => <Rows tone="ink" />};
export const InkActive: Story = {name: 'Ink · active', render: () => <Rows tone="ink" active />};
export const Blue: Story = {name: 'Blue · sm, md, lg', render: () => <Rows tone="blue" />};
export const BlueActive: Story = {name: 'Blue · active', render: () => <Rows tone="blue" active />};
export const IceOnBlack: Story = {name: 'Ice on black · sm, md, lg', parameters: {surface: 'dark'}, render: () => <Rows tone="ice" />};
export const IceOnBlackActive: Story = {name: 'Ice on black · active', parameters: {surface: 'dark'}, render: () => <Rows tone="ice" active />};
export const IceOnBlue: Story = {name: 'Ice on blue · sm, md, lg', parameters: {surface: 'brand'}, render: () => <Rows tone="ice" />};
