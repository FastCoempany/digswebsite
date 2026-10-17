import type {Meta, StoryObj} from '@storybook/react-vite';
import {Badge, type BadgeStatus} from './Badge';
import {MediaSlot} from './MediaSlot';
import {badgeFor} from '~/lib/view';
import {copy} from '~/lib/copy';

/**
 * Badge (05-components.md, Core): new, coming-soon, pre-order, low-stock, sold-out. Text plus
 * color, never color alone; signal colors only for low-stock and sold-out. Labels come from
 * content/copy/en.json through `badgeFor` (view.ts).
 */
const meta = {
  title: 'Core/Badge',
  component: Badge,
  args: {status: 'coming-soon', children: copy.product.comingSoon},
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

const STATUSES: BadgeStatus[] = ['new', 'coming-soon', 'pre-order', 'low-stock', 'sold-out'];
const labelFor = (status: BadgeStatus) => badgeFor(status)?.label ?? status;

export const AllStatuses: Story = {
  name: 'All five statuses',
  render: () => (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center'}}>
      {STATUSES.map((status) => (
        <Badge key={status} status={status}>
          {labelFor(status)}
        </Badge>
      ))}
    </div>
  ),
};

export const New: Story = {name: 'new', render: () => <Badge status="new">{labelFor('new')}</Badge>};
export const ComingSoon: Story = {name: 'coming-soon', render: () => <Badge status="coming-soon">{labelFor('coming-soon')}</Badge>};
export const PreOrder: Story = {name: 'pre-order', render: () => <Badge status="pre-order">{labelFor('pre-order')}</Badge>};
export const LowStock: Story = {name: 'low-stock (signal color)', render: () => <Badge status="low-stock">{labelFor('low-stock')}</Badge>};
export const SoldOut: Story = {name: 'sold-out (signal color, struck)', render: () => <Badge status="sold-out">{labelFor('sold-out')}</Badge>};

export const OnMedia: Story = {
  name: 'On a media slot (card position)',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))'}}>
      {STATUSES.map((status) => (
        <div key={status} style={{position: 'relative'}}>
          <MediaSlot ratio="4:5" code="P-TLS-03" image={null} />
          <span style={{position: 'absolute', left: 'var(--space-3)', top: 'var(--space-3)'}}>
            <Badge status={status}>{labelFor(status)}</Badge>
          </span>
        </div>
      ))}
    </div>
  ),
};
