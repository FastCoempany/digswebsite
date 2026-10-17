import type {Meta, StoryObj} from '@storybook/react-vite';
import type {ReactNode} from 'react';
import {Link} from './Link';
import {copy} from '~/lib/copy';

/**
 * Link (05-components.md, Core): inline (underlined), nav, footer. States: default, hover,
 * visited (inline only), focus. Hover / visited / focus are forced with a class carrying the
 * same token declarations as Link.css (:visited cannot be set from a story).
 */
const meta = {
  title: 'Core/Link',
  component: Link,
  args: {to: '/collections/all', children: copy.shop.seeAll},
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

const FORCED = `
.lnk-inline.story-hover { text-decoration-thickness: 2px; }
.lnk-inline.story-visited { color: var(--color-action-primary-pressed); }
.lnk-nav.story-hover { text-decoration: underline; text-decoration-thickness: 2px; }
.lnk-footer.story-hover { color: var(--color-text-primary); text-decoration: underline; }
[data-surface='dark'] .lnk-footer.story-hover { color: var(--color-text-on-inverse); }
.lnk.story-focus { outline: var(--border-strong) solid var(--color-focus-ring); outline-offset: 2px; }
[data-surface='dark'] .lnk.story-focus { outline-color: var(--color-focus-ring-on-dark); }
`;

const FOOTER_LINKS: Record<string, string> = {
  'The Capsule': '/collections/all',
  'Size guide': '/pages/size-guide',
  'Shipping & returns': '/pages/shipping-returns',
  FAQ: '/pages/faq',
  Contact: '/pages/contact',
  Manifesto: '/pages/manifesto',
  Instagram: copy.brand.instagramUrl,
  Privacy: '/policies/privacy-policy',
  Terms: '/policies/terms-of-service',
  Accessibility: '/pages/accessibility',
};

const [before, after] = copy.pages.contact.instagramLine.split('{handle}');

function Row({label, children}: {label: string; children: ReactNode}) {
  return (
    <div style={{display: 'grid', gap: 'var(--space-2)'}}>
      <p className="type-micro type-caps">{label}</p>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', alignItems: 'center'}}>{children}</div>
    </div>
  );
}

function Stack({children}: {children: ReactNode}) {
  return <div style={{display: 'grid', gap: 'var(--space-6)'}}>{children}</div>;
}

export const Inline: Story = {
  name: 'Inline · in running text',
  render: () => (
    <Stack>
      <p className="type-body">
        {copy.shop.emptyFilter} <Link to="/collections/all">{copy.shop.seeAll}</Link>
      </p>
      <p className="type-body">
        {before}
        <Link to={copy.brand.instagramUrl} external>
          {copy.brand.instagram}
        </Link>
        {after}
      </p>
    </Stack>
  ),
};

export const InlineStates: Story = {
  name: 'Inline · default / hover / visited / focus (forced)',
  render: () => (
    <Stack>
      <style>{FORCED}</style>
      <Row label="default">
        <Link to="/pages/size-guide">{copy.cta.sizeGuide}</Link>
      </Row>
      <Row label="hover · forced">
        <Link to="/pages/size-guide" className="story-hover">
          {copy.cta.sizeGuide}
        </Link>
      </Row>
      <Row label="visited · forced (the real :visited color is the pressed brand tone)">
        <Link to="/pages/size-guide" className="story-visited">
          {copy.cta.sizeGuide}
        </Link>
      </Row>
      <Row label="focus-visible · forced">
        <Link to="/pages/size-guide" className="story-focus">
          {copy.cta.sizeGuide}
        </Link>
      </Row>
    </Stack>
  ),
};

export const Nav: Story = {
  name: 'Nav · with the current route (aria-current)',
  parameters: {route: '/collections/all'},
  render: () => (
    <Row label="Shop is the current route">
      <Link to="/collections/all" variant="nav" nav>
        {copy.nav.shop}
      </Link>
      <Link to="/pages/manifesto" variant="nav" nav>
        {copy.nav.manifesto}
      </Link>
      <Link to="/account" variant="nav" nav>
        {copy.nav.account}
      </Link>
    </Row>
  ),
};

export const NavStates: Story = {
  name: 'Nav · default / hover / focus (forced) / current',
  parameters: {route: '/pages/manifesto'},
  render: () => (
    <Stack>
      <style>{FORCED}</style>
      <Row label="default">
        <Link to="/collections/all" variant="nav">
          {copy.nav.shop}
        </Link>
      </Row>
      <Row label="hover · forced">
        <Link to="/collections/all" variant="nav" className="story-hover">
          {copy.nav.shop}
        </Link>
      </Row>
      <Row label="focus-visible · forced">
        <Link to="/collections/all" variant="nav" className="story-focus">
          {copy.nav.shop}
        </Link>
      </Row>
      <Row label="current route">
        <Link to="/pages/manifesto" variant="nav" nav>
          {copy.nav.manifesto}
        </Link>
      </Row>
    </Stack>
  ),
};

export const Footer: Story = {
  name: 'Footer · the four groups',
  render: () => (
    <nav aria-label={copy.a11y.footerNav} style={{display: 'grid', gap: 'var(--space-5)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'}}>
      {Object.entries(copy.footer.groups).map(([group, items]) => (
        <div key={group}>
          <p className="type-micro type-caps" style={{marginBottom: 'var(--space-2)'}}>
            {group}
          </p>
          <ul style={{display: 'grid'}}>
            {items.map((label) => (
              <li key={label}>
                <Link to={FOOTER_LINKS[label] ?? '/'} variant="footer" external={label === 'Instagram'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  ),
};

export const FooterOnDark: Story = {
  name: 'Footer · on black',
  parameters: {surface: 'dark'},
  render: () => (
    <Row label="footer links on the inverse surface">
      {copy.footer.groups.Help.map((label) => (
        <Link key={label} to={FOOTER_LINKS[label] ?? '/'} variant="footer">
          {label}
        </Link>
      ))}
    </Row>
  ),
};

export const FooterStates: Story = {
  name: 'Footer · default / hover / focus (forced)',
  render: () => (
    <Stack>
      <style>{FORCED}</style>
      <Row label="default">
        <Link to="/pages/faq" variant="footer">
          {copy.pages.faq.head}
        </Link>
      </Row>
      <Row label="hover · forced">
        <Link to="/pages/faq" variant="footer" className="story-hover">
          {copy.pages.faq.head}
        </Link>
      </Row>
      <Row label="focus-visible · forced">
        <Link to="/pages/faq" variant="footer" className="story-focus">
          {copy.pages.faq.head}
        </Link>
      </Row>
    </Stack>
  ),
};

export const External: Story = {
  name: 'External · opens in a new tab',
  render: () => (
    <Row label="external (target _blank, rel noreferrer)">
      <Link to={copy.brand.instagramUrl} external>
        {copy.brand.instagram}
      </Link>
      <Link to={copy.brand.instagramUrl} external variant="nav">
        {copy.nav.instagram}
      </Link>
      <Link to={copy.brand.instagramUrl} external variant="footer">
        {copy.nav.instagram}
      </Link>
    </Row>
  ),
};
