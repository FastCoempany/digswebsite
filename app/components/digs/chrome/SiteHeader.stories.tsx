import type {Meta, StoryObj} from '@storybook/react-vite';
import {OverlayProvider} from '~/components/core/OverlayProvider';
import {SiteHeader} from './SiteHeader';

/**
 * Mobile: menu · wordmark · Your Digs (n). Desktop: Shop · Manifesto · wordmark · Account ·
 * Your Digs (n). Transparent over the home hero (ice wordmark), solid everywhere else; the
 * transparent header turns solid after 24px of scroll (`scrolled` forces that look).
 */
const meta: Meta<typeof SiteHeader> = {
  title: 'DIGS/SiteHeader',
  component: SiteHeader,
  parameters: {padded: false},
  decorators: [
    (Story) => (
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SiteHeader>;

/** A Digs Blue block standing in for the home hero under the transparent (fixed) header. */
const brandBlock = <div data-surface="brand" style={{background: 'var(--color-surface-brand)', minHeight: '60vh'}} />;

export const SolidEmpty: Story = {name: 'Solid · cart 0', render: () => <SiteHeader cartCount={0} />};
export const SolidThree: Story = {name: 'Solid · cart 3', render: () => <SiteHeader cartCount={3} />};
export const SolidScrolled: Story = {name: 'Solid · scrolled', render: () => <SiteHeader cartCount={3} scrolled />};
export const Transparent: Story = {
  name: 'Transparent · over a brand block (home hero)',
  render: () => (
    <>
      <SiteHeader cartCount={0} transparent />
      {brandBlock}
    </>
  ),
};
export const TransparentScrolled: Story = {
  name: 'Transparent · scrolled (turns solid)',
  render: () => (
    <>
      <SiteHeader cartCount={3} transparent scrolled />
      {brandBlock}
    </>
  ),
};
