import type {Meta, StoryObj} from '@storybook/react-vite';
import type {ReactNode} from 'react';
import {Link as RouterLink} from 'react-router';
import {Header} from './Header';
import {IconButton} from './IconButton';
import {Link as UiLink} from './Link';
import {Drawer} from './Drawer';
import {copy} from '~/lib/copy';

/**
 * Header (05-components.md, Core): transparent (home hero) and solid; scrolled and menu-open.
 * The shell is brand-agnostic; the slots here are filled the way the DIGS chrome fills them,
 * with a neutral mark standing in for the wordmark (nothing under core/ imports the DIGS layer).
 * Mobile: menu · brand · cart. Desktop: Shop Manifesto · brand · Account, Your Digs.
 */
const STORY_CSS = `
.hdr-brand { display: inline-flex; align-items: center; height: 2.75rem; padding-inline: var(--space-2); color: var(--color-text-link); }
.hdr-transparent:not(.is-scrolled) .hdr-brand,
.hdr-transparent:not(.is-scrolled) .lnk-nav,
.hdr-transparent:not(.is-scrolled) .iconbtn { color: var(--color-text-on-brand); }
.hdr-transparent:not(.is-scrolled) :focus-visible { outline-color: var(--color-focus-ring-on-dark); }
.hdr-cart { padding-inline: var(--space-2); }
.hdr-cart-short { display: none; }
@media (max-width: 359px) { .hdr-cart-long { display: none; } .hdr-cart-short { display: inline; } }
.story-brand { font-weight: 700; font-size: 1.375rem; letter-spacing: -0.03em; line-height: 1; }
`;
const brand = <span className="story-brand">brand</span>;
const meta = {
  title: 'Core/Header',
  component: Header,
  parameters: {padded: false},
  decorators: [
    (StoryFn) => (
      <>
        <style>{STORY_CSS}</style>
        <StoryFn />
      </>
    ),
  ],
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

function slots({menuOpen = false, cartCount = 0, menuId}: {menuOpen?: boolean; cartCount?: number; menuId?: string} = {}) {
  return {
    leadingMobile: <IconButton icon="menu" label={copy.a11y.openMenu} aria-expanded={menuOpen} aria-controls={menuId} aria-haspopup="dialog" className="hdr-btn" />,
    leading: (
      <>
        <UiLink to="/collections/all" variant="nav" nav>
          {copy.nav.shop}
        </UiLink>
        <UiLink to="/pages/manifesto" variant="nav" nav>
          {copy.nav.manifesto}
        </UiLink>
      </>
    ),
    center: (
      <RouterLink to="/" className="hdr-brand">
        {brand}
      </RouterLink>
    ),
    trailing: (
      <>
        <span className="hdr-desktop-only">
          <UiLink to="/account" variant="nav">
            {copy.nav.account}
          </UiLink>
        </span>
        <button type="button" className="hdr-cart lnk lnk-nav" aria-haspopup="dialog">
          <span className="hdr-cart-long">
            {copy.cta.cart} ({cartCount})
          </span>
          <span className="hdr-cart-short" aria-hidden="true">
            {copy.cta.cartShort} ({cartCount})
          </span>
        </button>
      </>
    ),
  };
}

/** A brand-surface block standing in for the home hero; `transform` keeps the fixed transparent header inside it. */
function Hero({children}: {children: ReactNode}) {
  return (
    <div data-surface="brand" style={{position: 'relative', transform: 'translateZ(0)', minHeight: '28rem', background: 'var(--color-surface-brand)', color: 'var(--color-text-on-brand)'}}>
      {children}
      <div style={{position: 'absolute', left: 'var(--space-5)', right: 'var(--space-5)', bottom: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)'}}>
        <p className="type-micro type-caps">{copy.home.heroOverline}</p>
        <p className="type-h2">{copy.home.heroSub}</p>
      </div>
    </div>
  );
}

function PageBody() {
  return (
    <div style={{padding: 'var(--space-6) var(--space-5)', display: 'grid', gap: 'var(--space-4)'}}>
      <p className="type-micro type-caps">{copy.shop.overline}</p>
      <p className="type-h1">{copy.shop.head}</p>
      <p className="type-body">{copy.boastLines[1]}</p>
    </div>
  );
}

export const Solid: Story = {
  name: 'Solid · Shop is the current route',
  parameters: {route: '/collections/all'},
  render: () => (
    <>
      <Header variant="solid" {...slots()} />
      <PageBody />
    </>
  ),
};

export const SolidWithCart: Story = {
  name: 'Solid · 3 in the cart',
  parameters: {route: '/pages/manifesto'},
  render: () => (
    <>
      <Header variant="solid" {...slots({cartCount: 3})} />
      <PageBody />
    </>
  ),
};

export const Transparent: Story = {
  name: 'Transparent · over the home hero (ice on blue)',
  parameters: {route: '/'},
  render: () => (
    <Hero>
      <Header variant="transparent" scrolled={false} {...slots()} />
    </Hero>
  ),
};

export const Scrolled: Story = {
  name: 'Scrolled · transparent turned solid after 24px',
  parameters: {route: '/'},
  render: () => (
    <Hero>
      <Header variant="transparent" scrolled {...slots()} />
    </Hero>
  ),
};

export const MenuOpen: Story = {
  name: 'Menu open · full drawer over the header',
  parameters: {route: '/'},
  render: () => (
    <>
      <Header variant="solid" menuOpen {...slots({menuOpen: true, menuId: 'story-menu'})} />
      <PageBody />
      <Drawer open onClose={() => undefined} side="full" tone="page" id="story-menu" title={<span className="type-h3">{brand}</span>} label={copy.a11y.menu} closeLabel={copy.a11y.closeMenu}>
        <nav aria-label={copy.a11y.mainNav} style={{padding: 'var(--space-5) var(--layout-margin)'}}>
          <ul style={{display: 'grid', gap: 'var(--space-2)'}}>
            <li>
              <UiLink to="/collections/all" variant="nav" className="type-h1">
                {copy.nav.shop}
              </UiLink>
            </li>
            <li>
              <UiLink to="/pages/manifesto" variant="nav" className="type-h1">
                {copy.nav.manifesto}
              </UiLink>
            </li>
            <li>
              <UiLink to="/cart" variant="nav" className="type-h1">
                {copy.nav.cart}
              </UiLink>
            </li>
            <li>
              <UiLink to={copy.brand.instagramUrl} variant="nav" external className="type-h1">
                {copy.nav.instagram}
              </UiLink>
            </li>
          </ul>
        </nav>
      </Drawer>
    </>
  ),
};

export const Minimal: Story = {
  name: 'Minimal · brand slot only',
  render: () => (
    <>
      <Header variant="solid" center={slots().center} />
      <PageBody />
    </>
  ),
};
