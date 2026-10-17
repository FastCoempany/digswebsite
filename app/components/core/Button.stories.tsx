import type {Meta, StoryObj} from '@storybook/react-vite';
import type {ReactNode} from 'react';
import {Button, type ButtonShape, type ButtonSize, type ButtonVariant} from './Button';
import {copy} from '~/lib/copy';

/**
 * Button (05-components.md, Core): primary (blue) · secondary (black) · ghost (ink outline) ·
 * on-dark (ice), sizes sm/md/lg, pill or block. States: default, hover, pressed, focus-visible,
 * disabled, loading. Hover / pressed / focus are forced with the same token declarations
 * Button.css applies on :hover / :active / :focus-visible (see FORCED below).
 */
const meta = {
  title: 'Core/Button',
  component: Button,
  args: {children: copy.cta.addToCart},
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'on-dark'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];
const SHAPES: ButtonShape[] = ['pill', 'block'];

/** Forced states for review (tokens only): mirrors Button.css :hover / :active / :focus-visible. */
const FORCED = `
.btn.story-hover { background: var(--btn-bg-hover); }
.btn.story-pressed { background: var(--btn-bg-pressed); transform: translateY(1px); }
.btn.story-focus { outline: var(--border-strong) solid var(--color-focus-ring); outline-offset: 2px; }
.btn-on-dark.story-focus, [data-surface='dark'] .btn.story-focus { outline-color: var(--color-focus-ring-on-dark); }
`;

function Row({label, children}: {label: string; children: ReactNode}) {
  return (
    <div style={{display: 'grid', gap: 'var(--space-2)'}}>
      <p className="type-micro type-caps">{label}</p>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center'}}>{children}</div>
    </div>
  );
}

function Stack({children}: {children: ReactNode}) {
  return <div style={{display: 'grid', gap: 'var(--space-6)'}}>{children}</div>;
}

/** The on-dark variant only reads on the inverse surface, so mixed rows wrap it in one. */
function OnSurface({variant, children}: {variant: ButtonVariant; children: ReactNode}) {
  if (variant !== 'on-dark') return <>{children}</>;
  return (
    <span data-surface="dark" style={{display: 'inline-flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--color-surface-inverse)', color: 'var(--color-text-on-inverse)'}}>
      {children}
    </span>
  );
}

/** One row per variant, all four at md · pill, with an optional forced-state class. */
function VariantRow({forced, label, ...props}: {forced?: string; label?: string; disabled?: boolean; loading?: boolean}) {
  return (
    <Stack>
      {forced ? <style>{FORCED}</style> : null}
      {VARIANTS.map((variant) => (
        <Row key={variant} label={`${variant}${label ? ` · ${label}` : ''}`}>
          <OnSurface variant={variant}>
            {SIZES.map((size) => (
              <Button key={size} variant={variant} size={size} className={forced} {...props}>
                {copy.cta.addToCart}
              </Button>
            ))}
            <Button variant={variant} shape="block" className={forced} {...props}>
              {copy.cta.backInStock}
            </Button>
          </OnSurface>
        </Row>
      ))}
    </Stack>
  );
}

function VariantMatrix({variant}: {variant: ButtonVariant}) {
  return (
    <Stack>
      {SHAPES.map((shape) => (
        <Row key={shape} label={`${variant} · ${shape} · sm / md / lg`}>
          {SIZES.map((size) => (
            <Button key={size} variant={variant} size={size} shape={shape}>
              {copy.cta.addToCart}
            </Button>
          ))}
        </Row>
      ))}
    </Stack>
  );
}

export const Matrix: Story = {
  name: 'All variants × sizes × shapes',
  render: () => (
    <Stack>
      {VARIANTS.map((variant) => (
        <OnSurface key={variant} variant={variant}>
          <VariantMatrix variant={variant} />
        </OnSurface>
      ))}
    </Stack>
  ),
};

export const Primary: Story = {name: 'Primary · sizes × shapes', render: () => <VariantMatrix variant="primary" />};
export const Secondary: Story = {name: 'Secondary · sizes × shapes', render: () => <VariantMatrix variant="secondary" />};
export const Ghost: Story = {name: 'Ghost · sizes × shapes', render: () => <VariantMatrix variant="ghost" />};
export const OnDark: Story = {name: 'On-dark · sizes × shapes', parameters: {surface: 'dark'}, render: () => <VariantMatrix variant="on-dark" />};

export const Default: Story = {name: 'State · default', render: () => <VariantRow />};
export const Hover: Story = {name: 'State · hover (forced)', render: () => <VariantRow forced="story-hover" label="hover, forced" />};
export const Pressed: Story = {name: 'State · pressed (forced)', render: () => <VariantRow forced="story-pressed" label="pressed, forced" />};
export const FocusVisible: Story = {name: 'State · focus-visible (forced)', render: () => <VariantRow forced="story-focus" label="focus-visible, forced" />};
export const Disabled: Story = {name: 'State · disabled', render: () => <VariantRow disabled label="disabled" />};
export const Loading: Story = {name: 'State · loading', render: () => <VariantRow loading label="loading (aria-busy, label kept)" />};

export const StatesMatrix: Story = {
  name: 'All states × variants',
  render: () => (
    <Stack>
      <style>{FORCED}</style>
      {VARIANTS.map((variant) => (
        <Row key={variant} label={`${variant} · default / hover / pressed / focus-visible / disabled / loading`}>
          <OnSurface variant={variant}>
            <Button variant={variant}>{copy.cta.addToCart}</Button>
            <Button variant={variant} className="story-hover">
              {copy.cta.addToCart}
            </Button>
            <Button variant={variant} className="story-pressed">
              {copy.cta.addToCart}
            </Button>
            <Button variant={variant} className="story-focus">
              {copy.cta.addToCart}
            </Button>
            <Button variant={variant} disabled>
              {copy.cta.addToCart}
            </Button>
            <Button variant={variant} loading>
              {copy.cta.addToCart}
            </Button>
          </OnSurface>
        </Row>
      ))}
    </Stack>
  ),
};

export const FullWidth: Story = {
  name: 'Full width · block (PDP buy button)',
  render: () => (
    <Stack>
      <Button variant="primary" size="lg" shape="block" fullWidth>
        {copy.cta.addToCart}
      </Button>
      <Button variant="secondary" size="lg" shape="block" fullWidth>
        {copy.cta.backInStock}
      </Button>
      <Button variant="ghost" size="lg" shape="block" fullWidth>
        {copy.cta.comingSoon}
      </Button>
    </Stack>
  ),
};

export const Caps: Story = {
  name: 'Caps tracking (short labels)',
  render: () => (
    <Row label="caps">
      <Button caps>{copy.cta.enterShop}</Button>
      <Button caps variant="secondary">
        {copy.cta.newsletter}
      </Button>
      <Button caps variant="ghost">
        {copy.cta.checkout}
      </Button>
    </Row>
  ),
};

export const AsLink: Story = {
  name: 'As a link (to) · internal and external',
  render: () => (
    <Row label="router link · external link">
      <Button to="/collections/all">{copy.cta.enterShop}</Button>
      <Button to="/pages/manifesto" variant="ghost">
        {copy.cta.readManifesto}
      </Button>
      <Button to={copy.brand.instagramUrl} external variant="secondary">
        {copy.nav.instagram}
      </Button>
    </Row>
  ),
};
