import type {Meta, StoryObj} from '@storybook/react-vite';
import {EmptyState} from './EmptyState';
import {Button} from './Button';
import {Link} from './Link';
import {Script} from '~/components/digs/marks';
import {copy, text} from '~/lib/copy';

/**
 * EmptyState (05-components.md, Core): cart, filter, 404, with a slot for a script word. The
 * brand layer passes the word (stories may import `Script`; core components may not).
 */
const meta = {
  title: 'Core/EmptyState',
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

const scriptArt = (word: string) => (
  <span className="type-display">
    <Script word={word} />
  </span>
);

export const Cart: Story = {
  name: 'Cart · "Your Digs are empty."',
  args: {
    variant: 'cart',
    heading: copy.cart.empty,
    body: text(copy.cart.emptyBody),
    art: scriptArt(copy.cart.emptyScript),
    action: <Button to="/collections/all">{copy.cta.enterShop}</Button>,
  },
};

export const Filter: Story = {
  name: 'Filter · "Nothing here yet."',
  args: {
    variant: 'filter',
    heading: copy.shop.emptyFilter,
    action: (
      <Link to="/collections/all" variant="inline">
        {copy.shop.seeAll}
      </Link>
    ),
  },
};

export const FilterAllSoldOut: Story = {
  name: 'Filter · everything spoken for',
  args: {
    variant: 'filter',
    heading: copy.shop.emptyFilter,
    body: text(copy.shop.emptyAll),
    action: <Button variant="ghost">{copy.cta.backInStock}</Button>,
  },
};

export const NotFound: Story = {
  name: '404 · "This page doesn\'t exist."',
  args: {
    variant: '404',
    heading: copy.notFound.head,
    body: copy.notFound.sub,
    art: scriptArt('dope'),
    action: (
      <Button to="/collections/all" size="lg">
        {copy.notFound.cta}
      </Button>
    ),
  },
};

export const NotFoundNoArt: Story = {
  name: '404 · without the script word',
  args: {
    variant: '404',
    heading: copy.notFound.head,
    body: copy.notFound.sub,
    action: (
      <Button to="/collections/all" size="lg">
        {copy.notFound.cta}
      </Button>
    ),
  },
};
