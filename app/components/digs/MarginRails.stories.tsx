import type {ReactNode} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {copy} from '~/lib/copy';
import {MarginRails} from './MarginRails';

/**
 * Rotated caps micro text fixed to both edges of the viewport. Desktop only: the rails are
 * display:none under 1024px by design, so the 390 viewport shows an empty surface. Decorative
 * (aria-hidden); the lines repeat copy that lives elsewhere on the page.
 */
const meta: Meta<typeof MarginRails> = {
  title: 'DIGS/MarginRails',
  component: MarginRails,
  parameters: {padded: false},
};
export default meta;

type Story = StoryObj<typeof MarginRails>;

const Tall = ({children, surface}: {children: ReactNode; surface?: 'dark'}) => (
  <div data-surface={surface} data-rail-tone={surface} style={{minHeight: '100vh', background: surface === 'dark' ? 'var(--color-surface-inverse)' : undefined}}>
    {children}
  </div>
);

export const OnLight: Story = {
  name: 'On light · desktop only (hidden under 1024px by design)',
  render: () => (
    <Tall>
      <MarginRails left={copy.rails.left} right={copy.rails.right} tone="light" />
    </Tall>
  ),
};
export const OnDark: Story = {
  name: 'On dark · desktop only (hidden under 1024px by design)',
  parameters: {surface: 'dark'},
  render: () => (
    <Tall>
      <MarginRails left={copy.rails.left} right={copy.rails.right} tone="dark" />
    </Tall>
  ),
};
export const AutoTone: Story = {
  name: 'Auto tone · flips over data-rail-tone="dark" sections on scroll (desktop only)',
  render: () => (
    <>
      <MarginRails left={copy.rails.left} right={copy.rails.right} />
      <Tall>{null}</Tall>
      <Tall surface="dark">{null}</Tall>
      <Tall>{null}</Tall>
    </>
  ),
};
