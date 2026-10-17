import type {Meta, StoryObj} from '@storybook/react-vite';
import type {ReactNode} from 'react';
import {IconButton, type IconButtonProps} from './IconButton';
import type {IconName} from './icons';
import {copy} from '~/lib/copy';

/**
 * IconButton (05-components.md, Core): menu, close, plus/minus, chevrons (plus arrow, check,
 * zoom from icons.tsx). Same states as Button; every instance needs an accessible name.
 */
const meta = {
  title: 'Core/IconButton',
  component: IconButton,
  args: {icon: 'menu', label: copy.a11y.openMenu},
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

type Variant = NonNullable<IconButtonProps['variant']>;
type Size = NonNullable<IconButtonProps['size']>;

const ICONS: {icon: IconName; label: string}[] = [
  {icon: 'menu', label: copy.a11y.openMenu},
  {icon: 'close', label: copy.a11y.close},
  {icon: 'plus', label: copy.a11y.increase},
  {icon: 'minus', label: copy.a11y.decrease},
  {icon: 'chevron-left', label: copy.a11y.previousImage},
  {icon: 'chevron-right', label: copy.a11y.nextImage},
  {icon: 'chevron-down', label: copy.shop.seeAll},
  {icon: 'arrow-right', label: copy.cta.enterShop},
  {icon: 'check', label: copy.a11y.selected},
  {icon: 'zoom', label: copy.a11y.zoomImage},
];
const VARIANTS: Variant[] = ['plain', 'outline', 'filled', 'on-dark'];
const SIZES: Size[] = ['sm', 'md', 'lg'];

/** Forced states (tokens only): mirrors IconButton.css :hover / :active and the global :focus-visible ring. */
const FORCED = `
.iconbtn.story-hover { background: var(--color-surface-sunken); }
.iconbtn-filled.story-hover { background: var(--color-action-secondary-hover); }
.iconbtn-on-dark.story-hover { background: color-mix(in oklab, var(--color-text-on-inverse) 16%, transparent); }
.iconbtn.story-pressed { background: var(--color-border-hairline); }
.iconbtn.story-focus { outline: var(--border-strong) solid var(--color-focus-ring); outline-offset: 2px; }
.iconbtn-on-dark.story-focus, [data-surface='dark'] .iconbtn.story-focus { outline-color: var(--color-focus-ring-on-dark); }
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

function OnSurface({variant, children}: {variant: Variant; children: ReactNode}) {
  if (variant !== 'on-dark') return <>{children}</>;
  return (
    <span data-surface="dark" style={{display: 'inline-flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--color-surface-inverse)', color: 'var(--color-text-on-inverse)'}}>
      {children}
    </span>
  );
}

function VariantRow({forced, label, ...props}: {forced?: string; label?: string; disabled?: boolean; loading?: boolean}) {
  return (
    <Stack>
      {forced ? <style>{FORCED}</style> : null}
      {VARIANTS.map((variant) => (
        <Row key={variant} label={`${variant}${label ? ` · ${label}` : ''}`}>
          <OnSurface variant={variant}>
            {ICONS.slice(0, 6).map((i) => (
              <IconButton key={i.icon} icon={i.icon} label={i.label} variant={variant} className={forced} {...props} />
            ))}
          </OnSurface>
        </Row>
      ))}
    </Stack>
  );
}

export const AllIcons: Story = {
  name: 'All icons (plain · md)',
  render: () => (
    <Row label="menu · close · plus · minus · chevron-left · chevron-right · chevron-down · arrow-right · check · zoom">
      {ICONS.map((i) => (
        <IconButton key={i.icon} icon={i.icon} label={i.label} />
      ))}
    </Row>
  ),
};

export const Variants: Story = {
  name: 'Variants · plain / outline / filled / on-dark',
  render: () => (
    <Stack>
      {VARIANTS.map((variant) => (
        <Row key={variant} label={variant}>
          <OnSurface variant={variant}>
            {ICONS.map((i) => (
              <IconButton key={i.icon} icon={i.icon} label={i.label} variant={variant} />
            ))}
          </OnSurface>
        </Row>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  name: 'Sizes · sm / md / lg (44px minimum target)',
  render: () => (
    <Stack>
      {SIZES.map((size) => (
        <Row key={size} label={size}>
          {VARIANTS.slice(0, 3).map((variant) => (
            <IconButton key={variant} icon="menu" label={copy.a11y.openMenu} variant={variant} size={size} />
          ))}
        </Row>
      ))}
    </Stack>
  ),
};

export const OnDark: Story = {
  name: 'On-dark · on the inverse surface',
  parameters: {surface: 'dark'},
  render: () => (
    <Row label="on-dark">
      {ICONS.map((i) => (
        <IconButton key={i.icon} icon={i.icon} label={i.label} variant="on-dark" />
      ))}
    </Row>
  ),
};

export const Default: Story = {name: 'State · default', render: () => <VariantRow />};
export const Hover: Story = {name: 'State · hover (forced)', render: () => <VariantRow forced="story-hover" label="hover, forced" />};
export const Pressed: Story = {name: 'State · pressed (forced)', render: () => <VariantRow forced="story-pressed" label="pressed, forced" />};
export const FocusVisible: Story = {name: 'State · focus-visible (forced)', render: () => <VariantRow forced="story-focus" label="focus-visible, forced" />};
export const Disabled: Story = {name: 'State · disabled', render: () => <VariantRow disabled label="disabled" />};
export const Loading: Story = {name: 'State · loading (aria-busy)', render: () => <VariantRow loading label="loading, aria-busy" />};

export const StatesMatrix: Story = {
  name: 'All states × variants',
  render: () => (
    <Stack>
      <style>{FORCED}</style>
      {VARIANTS.map((variant) => (
        <Row key={variant} label={`${variant} · default / hover / pressed / focus-visible / disabled / loading`}>
          <OnSurface variant={variant}>
            <IconButton icon="close" label={copy.a11y.close} variant={variant} />
            <IconButton icon="close" label={copy.a11y.close} variant={variant} className="story-hover" />
            <IconButton icon="close" label={copy.a11y.close} variant={variant} className="story-pressed" />
            <IconButton icon="close" label={copy.a11y.close} variant={variant} className="story-focus" />
            <IconButton icon="close" label={copy.a11y.close} variant={variant} disabled />
            <IconButton icon="close" label={copy.a11y.close} variant={variant} loading />
          </OnSurface>
        </Row>
      ))}
    </Stack>
  ),
};
