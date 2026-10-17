import type {Meta, StoryObj} from '@storybook/react-vite';
import {copy} from '~/lib/copy';
import {StrikeRewrite} from './StrikeRewrite';

/** Strike a word with a marker stroke and rewrite it in script: ~~ordinary~~ *dope* (BOAST stories). */
const meta: Meta<typeof StrikeRewrite> = {
  title: 'DIGS/StrikeRewrite',
  component: StrikeRewrite,
};
export default meta;

type Story = StoryObj<typeof StrikeRewrite>;

/** The brief's own example (05-components.md); "dope" is a drawn script word. */
function rewrite(tone: 'blue' | 'black') {
  return (
    <p className="type-display">
      <StrikeRewrite struck="ordinary" word="dope" tone={tone} />
    </p>
  );
}

export const Blue: Story = {name: 'Blue · ordinary → dope', render: () => rewrite('blue')};
export const Black: Story = {name: 'Black · ordinary → dope', render: () => rewrite('black')};
export const OnDark: Story = {
  name: 'On black · blue stroke, script in ice',
  parameters: {surface: 'dark'},
  render: () => rewrite('blue'),
};
export const StruckOnly: Story = {
  name: 'Struck only · the "We are not" list (manifesto page)',
  render: () => (
    <ul className="type-h2" style={{display: 'grid', gap: 'var(--space-3)', margin: 0, padding: 0, listStyle: 'none'}}>
      {copy.manifestoPage.weAreNot.map((w) => (
        <li key={w}>
          <StrikeRewrite struck={w} word="" tone="blue" />
        </li>
      ))}
    </ul>
  ),
};
