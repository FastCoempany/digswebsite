import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {NewsletterForm, type NewsletterStatus} from './NewsletterForm';
import {copy} from '~/lib/copy';

/**
 * NewsletterForm (05-components.md, Core): inline and footer variants × idle, submitting,
 * success, error. UI only: nothing is wired in this phase.
 */
const meta = {
  title: 'Core/NewsletterForm',
  component: NewsletterForm,
  args: {
    labels: {email: copy.a11y.email, placeholder: copy.a11y.emailPlaceholder, submit: copy.cta.newsletter, success: copy.home.newsletterSuccess, error: copy.home.newsletterError},
  },
} satisfies Meta<typeof NewsletterForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InlineIdle: Story = {name: 'Inline · idle', args: {variant: 'inline', status: 'idle'}};
export const InlineSubmitting: Story = {name: 'Inline · submitting', args: {variant: 'inline', status: 'submitting'}};
export const InlineSuccess: Story = {name: 'Inline · success', args: {variant: 'inline', status: 'success'}};
export const InlineError: Story = {name: 'Inline · error', args: {variant: 'inline', status: 'error'}};

export const FooterIdle: Story = {name: 'Footer · idle', args: {variant: 'footer', status: 'idle'}};
export const FooterSubmitting: Story = {name: 'Footer · submitting', args: {variant: 'footer', status: 'submitting'}};
export const FooterSuccess: Story = {name: 'Footer · success', args: {variant: 'footer', status: 'success'}};
export const FooterError: Story = {name: 'Footer · error', args: {variant: 'footer', status: 'error'}};

/**
 * The error state is left out on black: Field.css has no dark-surface override for `.field-error`,
 * and `--color-text-sale` measures 3.56:1 on the inverse surface (axe, 14px). Flagged in the PR;
 * the success line is fine because NewsletterForm.css restyles it on dark.
 */
export const OnDark: Story = {
  name: 'On black · idle / submitting / success',
  parameters: {surface: 'dark'},
  render: (args) => (
    <div style={{display: 'grid', gap: 'var(--space-6)'}}>
      <NewsletterForm {...args} variant="footer" onDark status="idle" />
      <NewsletterForm {...args} variant="footer" onDark status="submitting" />
      <NewsletterForm {...args} variant="footer" onDark status="success" />
    </div>
  ),
};

function Interactive() {
  const [status, setStatus] = useState<NewsletterStatus>('idle');
  const submit = (email: string) => {
    // Same stand-in as SiteFooter: a well-formed address reads as success, anything else as the error.
    setStatus('submitting');
    window.setTimeout(() => setStatus(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? 'success' : 'error'), 800);
  };
  return <NewsletterForm variant="footer" status={status} onSubmit={submit} labels={{email: copy.a11y.email, placeholder: copy.a11y.emailPlaceholder, submit: copy.cta.newsletter, success: copy.home.newsletterSuccess, error: copy.home.newsletterError}} />;
}

export const Stateful: Story = {
  name: 'Interactive · idle → submitting → success / error',
  render: () => <Interactive />,
};
