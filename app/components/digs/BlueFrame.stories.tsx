import type {Meta, StoryObj} from '@storybook/react-vite';
import {photoFor, srcSetFor} from '~/lib/mock';
import {copy} from '~/lib/copy';
import {lineWithScript} from './lineWithScript';
import {BlueFrame, type BlueFrameProps} from './BlueFrame';

/**
 * BOAST billboard: a photograph inside a solid Digs Blue frame, headline top-left (payoff word in
 * script), wordmark bottom-left, stacked footer bottom-right.
 */
const meta: Meta<typeof BlueFrame> = {
  title: 'DIGS/BlueFrame',
  component: BlueFrame,
  parameters: {padded: false},
};
export default meta;

type Story = StoryObj<typeof BlueFrame>;

const CODE = 'E-02';
const headline = lineWithScript(copy.home.blueFrameHead, copy.home.blueFrameScript, 1);
const footer = [copy.brand.instagram, copy.brand.domain, copy.brand.labelLine];

function slot(ratio: '4:5' | '16:9', approved: boolean): BlueFrameProps['image'] {
  const image = approved ? photoFor(CODE, null, '4:5') : null;
  return {code: CODE, ratio, image, srcSet: srcSetFor(image?.url), alt: image?.altText ?? ''};
}

export const PortraitPhoto: Story = {
  name: 'Portrait · E-02 photo',
  render: () => <BlueFrame image={slot('4:5', true)} headline={headline} footer={footer} orientation="portrait" />,
};
export const PortraitPlaceholder: Story = {
  name: 'Portrait · placeholder (4:5 · E-02)',
  render: () => <BlueFrame image={slot('4:5', false)} headline={headline} footer={footer} orientation="portrait" />,
};
export const LandscapePhoto: Story = {
  name: 'Landscape · E-02 photo (16:9 crop)',
  render: () => <BlueFrame image={slot('16:9', true)} headline={headline} footer={footer} orientation="landscape" />,
};
export const LandscapePlaceholder: Story = {
  name: 'Landscape · placeholder (16:9 · E-02)',
  render: () => <BlueFrame image={slot('16:9', false)} headline={headline} footer={footer} orientation="landscape" />,
};
export const Adaptive: Story = {
  name: 'Adaptive · portrait on mobile, 16:9 crop from 1024px (home)',
  render: () => <BlueFrame image={slot('4:5', true)} headline={headline} footer={footer} orientation="portrait" className="blueframe-adaptive" />,
};
