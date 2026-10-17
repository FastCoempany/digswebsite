import type {Meta, StoryObj} from '@storybook/react-vite';
import type {ReactNode} from 'react';
import {Field} from './Field';
import {copy} from '~/lib/copy';

/**
 * Field (05-components.md, Core): text / email input with label, hint, error and success.
 * States: default, focus, filled, error, success, disabled. Borders are ink-500 (3:1).
 * Focus is forced with the same token declarations Field.css applies on :focus-visible.
 */
const meta = {
  title: 'Core/Field',
  component: Field,
  args: {label: copy.a11y.email, type: 'email', placeholder: copy.a11y.emailPlaceholder, autoComplete: 'email', inputMode: 'email'},
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

const FORCED = `
.story-focus .field-input { outline: var(--border-strong) solid var(--color-focus-ring); outline-offset: 2px; border-color: var(--color-border-strong); }
[data-surface='dark'] .story-focus .field-input { outline-color: var(--color-focus-ring-on-dark); }
`;

function Frame({children}: {children: ReactNode}) {
  return <div style={{display: 'grid', gap: 'var(--space-6)', maxWidth: '26rem'}}>{children}</div>;
}

export const Default: Story = {
  name: 'Default · empty',
  render: (args) => (
    <Frame>
      <Field {...args} />
    </Frame>
  ),
};

export const Focus: Story = {
  name: 'Focus (forced)',
  render: (args) => (
    <Frame>
      <style>{FORCED}</style>
      <Field {...args} className="story-focus" />
    </Frame>
  ),
};

export const Filled: Story = {
  name: 'Filled',
  render: (args) => (
    <Frame>
      <Field {...args} defaultValue={copy.a11y.emailPlaceholder} placeholder={undefined} />
    </Frame>
  ),
};

export const ErrorState: Story = {
  name: 'Error · announced (role=alert, aria-invalid)',
  render: (args) => (
    <Frame>
      <Field {...args} defaultValue="you@example" placeholder={undefined} error={copy.home.newsletterError} />
    </Frame>
  ),
};

export const Success: Story = {
  name: 'Success · check icon and status line',
  render: (args) => (
    <Frame>
      <Field {...args} defaultValue={copy.a11y.emailPlaceholder} placeholder={undefined} success={copy.home.newsletterSuccess} />
    </Frame>
  ),
};

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => (
    <Frame>
      <Field {...args} disabled />
      <Field {...args} disabled defaultValue={copy.a11y.emailPlaceholder} placeholder={undefined} />
    </Frame>
  ),
};

export const HintAndRequired: Story = {
  name: 'Text input · hint, required marker',
  render: () => (
    <Frame>
      <Field label={copy.pages.contact.form.name} type="text" autoComplete="name" required requiredLabel={copy.a11y.required} hint={copy.pages.contact.form.note.text} />
    </Frame>
  ),
};

export const HiddenLabel: Story = {
  name: 'Hidden label (inline newsletter)',
  render: (args) => (
    <Frame>
      <Field {...args} hideLabel />
    </Frame>
  ),
};

export const OnDark: Story = {
  name: 'On black · default / error / success',
  parameters: {surface: 'dark'},
  render: (args) => (
    <Frame>
      <Field {...args} />
      <Field {...args} defaultValue="you@example" placeholder={undefined} error={copy.home.newsletterError} />
      <Field {...args} defaultValue={copy.a11y.emailPlaceholder} placeholder={undefined} success={copy.home.newsletterSuccess} />
    </Frame>
  ),
};

export const AllStates: Story = {
  name: 'All states',
  render: (args) => (
    <Frame>
      <style>{FORCED}</style>
      <Field {...args} />
      <Field {...args} className="story-focus" />
      <Field {...args} defaultValue={copy.a11y.emailPlaceholder} placeholder={undefined} />
      <Field {...args} defaultValue="you@example" placeholder={undefined} error={copy.home.newsletterError} />
      <Field {...args} defaultValue={copy.a11y.emailPlaceholder} placeholder={undefined} success={copy.home.newsletterSuccess} />
      <Field {...args} disabled />
    </Frame>
  ),
};
