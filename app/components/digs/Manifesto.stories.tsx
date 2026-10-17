import type {Meta, StoryObj} from '@storybook/react-vite';
import {photoFor, srcSetFor} from '~/lib/mock';
import {copy} from '~/lib/copy';
import {lineWithScript} from './lineWithScript';
import {Manifesto} from './Manifesto';

/** BOAST manifestos 01–04 as numbered blocks. The manifesto comes before product (PJ attitude). */
const meta: Meta<typeof Manifesto> = {
  title: 'DIGS/Manifesto',
  component: Manifesto,
};
export default meta;

type Story = StoryObj<typeof Manifesto>;

const items = copy.home.manifestos;

/** Four 3:4 editorial slots: E-01…E-03 are approved, E-04 waits as a labelled placeholder. */
const EDITORIAL = ['E-01', 'E-02', 'E-03', 'E-04'];
const images = EDITORIAL.map((code) => {
  const image = photoFor(code, null, '4:5');
  return {code, ratio: '3:4', image, srcSet: srcSetFor(image?.url), alt: image?.altText ?? ''};
});

export const Stacked: Story = {
  name: 'Stacked (mobile default)',
  render: () => <Manifesto items={items} layout="stacked" />,
};
export const StackedWithHeading: Story = {
  name: 'Stacked · with the home heading',
  render: () => <Manifesto items={items} layout="stacked" heading={<h2 className="type-display-xl">{lineWithScript(copy.home.manifestoHead, copy.home.manifestoScript)}</h2>} />,
};
export const Grid: Story = {
  name: 'Grid (2×2 on desktop)',
  render: () => <Manifesto items={items} layout="grid" />,
};
export const Fullscreen: Story = {
  name: 'Fullscreen · E-01, E-02, E-03 approved, E-04 placeholder',
  render: () => <Manifesto items={items} layout="fullscreen" images={images} />,
};
