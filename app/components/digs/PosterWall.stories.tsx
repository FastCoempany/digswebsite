import type {Meta, StoryObj} from '@storybook/react-vite';
import {photoFor, srcSetFor} from '~/lib/mock';
import {copy} from '~/lib/copy';
import {lineWithScript} from './lineWithScript';
import {PosterWall, type PosterTile} from './PosterWall';

/** Wheat-pasted posters, one idea and one color each. Horizontal scroller on mobile, 3-up grid from 1024px. */
const meta: Meta<typeof PosterWall> = {
  title: 'DIGS/PosterWall',
  component: PosterWall,
  parameters: {padded: false},
};
export default meta;

type Story = StoryObj<typeof PosterWall>;

/** BOAST lines, verbatim from content/copy/en.json → boastLines. */
const L = copy.boastLines;

function photo(code: string): PosterTile {
  const image = photoFor(code, null, '4:5');
  return {kind: 'photo', image: {code, ratio: '4:5', image, srcSet: srcSetFor(image?.url), alt: image?.altText ?? ''}};
}

const wall = (tiles: PosterTile[]) => (
  <div style={{paddingBlock: 'var(--space-6)'}}>
    <PosterWall tiles={tiles} label={copy.home.posterLabel} />
  </div>
);

/** The home set (HomePage.tsx): blue, photo, black with wallpaper, ice, wordmark, black. */
const MIXED: PosterTile[] = [
  {kind: 'blue', line: lineWithScript(L[10], 'actually-dope-cap', 1)},
  photo('E-03'),
  {kind: 'black', line: L[0], wallpaper: true},
  {kind: 'ice', line: lineWithScript(L[14])},
  {kind: 'wordmark', tone: 'blue'},
  {kind: 'black', line: L[16]},
];

export const Mixed: Story = {name: 'Mixed · blue, photo, black, ice, wordmark (home set)', render: () => wall(MIXED)};
export const BlueTiles: Story = {
  name: 'Blue tiles',
  render: () =>
    wall([
      {kind: 'blue', line: lineWithScript(L[10], 'actually-dope-cap', 1)},
      {kind: 'blue', line: L[2], wallpaper: true},
      {kind: 'blue', line: lineWithScript(L[8])},
    ]),
};
export const BlackTiles: Story = {
  name: 'Black tiles',
  render: () =>
    wall([
      {kind: 'black', line: L[0], wallpaper: true},
      {kind: 'black', line: lineWithScript(L[20])},
      {kind: 'black', line: L[16]},
    ]),
};
export const IceTiles: Story = {
  name: 'Ice tiles',
  render: () =>
    wall([
      {kind: 'ice', line: lineWithScript(L[14])},
      {kind: 'ice', line: L[3], wallpaper: true},
      {kind: 'ice', line: lineWithScript(L[18])},
    ]),
};
export const WordmarkTiles: Story = {
  name: 'Wordmark tiles · blue, black, ice',
  render: () =>
    wall([
      {kind: 'wordmark', tone: 'blue'},
      {kind: 'wordmark', tone: 'black'},
      {kind: 'wordmark', tone: 'ice'},
    ]),
};
export const PhotoTiles: Story = {
  name: 'Photo tiles · E-01, E-02, E-03 approved, E-04 placeholder',
  render: () => wall([photo('E-01'), photo('E-02'), photo('E-03'), photo('E-04')]),
};
