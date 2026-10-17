import type {Meta, StoryObj} from '@storybook/react-vite';
import {SiteFooter} from './SiteFooter';

/** Four short link groups, the "Stay dope" sign-up, @dopeisgood, ©, then the edge-to-edge wordmark. */
const meta: Meta<typeof SiteFooter> = {
  title: 'DIGS/SiteFooter',
  component: SiteFooter,
  parameters: {padded: false},
};
export default meta;

type Story = StoryObj<typeof SiteFooter>;

export const Idle: Story = {name: 'Idle', render: () => <SiteFooter />};
export const NewsletterSuccess: Story = {name: 'Newsletter · success', render: () => <SiteFooter newsletterStatus="success" />};
export const NewsletterError: Story = {name: 'Newsletter · error', render: () => <SiteFooter newsletterStatus="error" />};
