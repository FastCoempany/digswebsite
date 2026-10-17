import type {Meta, StoryObj} from '@storybook/react-vite';
import {copy} from '~/lib/copy';
import {TaglineBand} from './TaglineBand';

/** Black band with one approved BOAST line (payoff word in script) and one CTA; closes every page before the footer. */
const meta: Meta<typeof TaglineBand> = {
  title: 'DIGS/TaglineBand',
  component: TaglineBand,
  parameters: {padded: false},
};
export default meta;

type Story = StoryObj<typeof TaglineBand>;

const cta = {label: copy.cta.enterShop, to: '/collections/all'};
const band = (index: number) => <TaglineBand lines={copy.taglineBand} index={index} cta={cta} />;

export const Line0: Story = {name: `Line 0 · ${copy.taglineBand[0]}`, render: () => band(0)};
export const Line1: Story = {name: `Line 1 · ${copy.taglineBand[1]}`, render: () => band(1)};
export const Line2: Story = {name: `Line 2 · ${copy.taglineBand[2]}`, render: () => band(2)};
export const Line3: Story = {name: `Line 3 · ${copy.taglineBand[3]}`, render: () => band(3)};
export const Line4: Story = {name: `Line 4 · ${copy.taglineBand[4]}`, render: () => band(4)};
