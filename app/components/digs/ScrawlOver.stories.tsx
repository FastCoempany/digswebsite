import type {Meta, StoryObj} from '@storybook/react-vite';
import {copy} from '~/lib/copy';
import {ScrawlOver} from './ScrawlOver';

/**
 * Marker scrawl ("fashion", the default word) driven across a clean Alexandria headline, as on
 * the BOAST social posts. The scrawl layer is decorative and aria-hidden; the headline stays text.
 */
const meta: Meta<typeof ScrawlOver> = {
  title: 'DIGS/ScrawlOver',
  component: ScrawlOver,
};
export default meta;

type Story = StoryObj<typeof ScrawlOver>;

/** BOAST lines, verbatim from content/copy/en.json → boastLines. */
const LINE_BLUE = copy.boastLines[9];
const LINE_BLACK = copy.boastLines[7];

function headline(line: string, tone: 'blue' | 'black', density: 1 | 2 | 3) {
  return (
    <p className="type-display" style={{maxWidth: '12ch'}}>
      <ScrawlOver tone={tone} density={density}>
        {line}
      </ScrawlOver>
    </p>
  );
}

export const BlueDensity1: Story = {name: 'Blue · density 1', render: () => headline(LINE_BLUE, 'blue', 1)};
export const BlueDensity2: Story = {name: 'Blue · density 2', render: () => headline(LINE_BLUE, 'blue', 2)};
export const BlueDensity3: Story = {name: 'Blue · density 3', render: () => headline(LINE_BLUE, 'blue', 3)};
export const BlackDensity1: Story = {name: 'Black · density 1', render: () => headline(LINE_BLACK, 'black', 1)};
export const BlackDensity2: Story = {name: 'Black · density 2', render: () => headline(LINE_BLACK, 'black', 2)};
export const BlackDensity3: Story = {name: 'Black · density 3', render: () => headline(LINE_BLACK, 'black', 3)};
