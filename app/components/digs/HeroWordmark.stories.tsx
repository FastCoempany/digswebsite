import type {Meta, StoryObj} from '@storybook/react-vite';
import {photoFor, srcSetFor} from '~/lib/mock';
import {copy} from '~/lib/copy';
import {HeroWordmark, type HeroSlot} from './HeroWordmark';

/**
 * Home hero: the wordmark edge to edge, the "Actually Dope" scrawl across it, the model in front
 * of the letters. Mobile stacks the 9:16 frame under the wordmark; desktop collides the 16:9 frame
 * with it. Shot code H-01 either way.
 */
const meta: Meta<typeof HeroWordmark> = {
  title: 'DIGS/HeroWordmark',
  component: HeroWordmark,
  parameters: {padded: false, route: '/'},
};
export default meta;

type Story = StoryObj<typeof HeroWordmark>;

const CODE = 'H-01';

function slot(ratio: '9:16' | '16:9', approved: boolean): HeroSlot {
  const image = approved ? photoFor(CODE, null, ratio) : null;
  return {code: CODE, ratio, image, srcSet: srcSetFor(image?.url), alt: image?.altText ?? ''};
}

const base = {
  overline: copy.home.heroOverline,
  sub: copy.home.heroSub,
  cta: {label: copy.cta.enterShop, to: '/collections/all'},
};

export const Placeholders: Story = {
  name: 'Placeholder slots · H-01 9:16 (mobile) and 16:9 (desktop)',
  render: () => <HeroWordmark {...base} mobile={slot('9:16', false)} desktop={slot('16:9', false)} />,
};
export const ApprovedPhotos: Story = {
  name: 'Approved photos · H-01 9:16 and 16:9',
  render: () => <HeroWordmark {...base} mobile={slot('9:16', true)} desktop={slot('16:9', true)} />,
};
