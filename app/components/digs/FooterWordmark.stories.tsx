import type {Meta, StoryObj} from '@storybook/react-vite';
import {FooterWordmark} from './FooterWordmark';

/** The edge-to-edge wordmark that closes every page (BOAST "do"): blue on ice, or ice on black. */
const meta: Meta<typeof FooterWordmark> = {
  title: 'DIGS/FooterWordmark',
  component: FooterWordmark,
  parameters: {padded: false},
};
export default meta;

type Story = StoryObj<typeof FooterWordmark>;

export const Light: Story = {name: 'Light · blue on ice', render: () => <FooterWordmark tone="light" />};
export const Dark: Story = {name: 'Dark · ice on black', parameters: {surface: 'dark'}, render: () => <FooterWordmark tone="dark" />};
