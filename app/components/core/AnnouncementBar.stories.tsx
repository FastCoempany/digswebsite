import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {AnnouncementBar} from './AnnouncementBar';
import {Button} from './Button';
import {copy, text} from '~/lib/copy';

/** AnnouncementBar (05-components.md, Core): one line on the brand surface. States: default, dismissed. */
const meta = {
  title: 'Core/AnnouncementBar',
  component: AnnouncementBar,
  parameters: {padded: false},
  args: {dismissLabel: copy.a11y.dismiss, children: text(copy.announcement)},
} satisfies Meta<typeof AnnouncementBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {name: 'Default'};

export const Dismissed: Story = {
  name: 'Dismissed (renders nothing)',
  render: (args) => (
    <>
      <AnnouncementBar {...args} dismissed />
      <p className="type-small" style={{padding: 'var(--space-5)'}}>
        Dismissed: the bar renders nothing and does not stack with another bar.
      </p>
    </>
  ),
};

export const NotDismissible: Story = {
  name: 'Not dismissible',
  args: {dismissible: false},
};

function Interactive() {
  const [dismissed, setDismissed] = useState(false);
  return (
    <>
      <AnnouncementBar dismissLabel={copy.a11y.dismiss} dismissed={dismissed} onDismiss={() => setDismissed(true)}>
        {text(copy.announcement)}
      </AnnouncementBar>
      {dismissed ? (
        <div style={{padding: 'var(--space-5)'}}>
          <Button variant="ghost" size="sm" onClick={() => setDismissed(false)}>
            {copy.errors.tryAgain}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export const Stateful: Story = {
  name: 'Interactive · dismiss, then bring it back',
  render: () => <Interactive />,
};
