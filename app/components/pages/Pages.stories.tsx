import type {Meta, StoryObj} from '@storybook/react-vite';
import {PRODUCTS, POLICIES, EMPTY_CART, hydrateCart} from '~/lib/mock';
import {cardData} from '~/lib/view';
import {PageLayout} from '~/components/digs/chrome/PageLayout';
import {HomePage} from './HomePage';
import {ShopPage} from './ShopPage';
import {ProductPage} from './ProductPage';
import {ManifestoPage} from './ManifestoPage';
import {CartPage} from './CartPage';
import {NotFound} from './NotFound';
import {TokensPage} from './TokensPage';
import {AccessibilityPage, AccountPage, ContactPage, FaqPage, PoliciesPage, PolicyPage, ShippingReturnsPage, SizeGuidePage} from './UtilityPages';

/**
 * Pages: every template in 04-ia-and-pages.md, composed from core + DIGS components with real
 * copy and mock data. Switch the Mode toolbar to "Wireframe" for the wire deliverable.
 */
const meta: Meta = {
  title: 'Pages',
  parameters: {layout: 'fullscreen', padded: false},
};
export default meta;

const CARDS = PRODUCTS.map((p) => cardData(p));
const thermal = PRODUCTS[0];
const others = CARDS.slice(1);
const othersThan = (i: number) => CARDS.filter((_, j) => j !== i);
const filledCart = hydrateCart({
  id: 'gid://shopify/Cart/story',
  lines: [
    {merchandiseId: PRODUCTS[0].variants.nodes[1].id, quantity: 1},
    {merchandiseId: PRODUCTS[3].variants.nodes[2].id, quantity: 2},
  ],
});

const frame = (children: React.ReactNode, extra: Partial<React.ComponentProps<typeof PageLayout>> = {}) => (
  <PageLayout cart={EMPTY_CART} cards={CARDS} taglineIndex={0} {...extra}>
    {children}
  </PageLayout>
);

export const Home: StoryObj = {render: () => frame(<HomePage cards={CARDS} thermal={thermal} />, {transparentHeader: true}), parameters: {route: '/'}};
export const HomeMenuOpen: StoryObj = {name: 'Home · menu open', render: () => frame(<HomePage cards={CARDS} thermal={thermal} />, {transparentHeader: true, initialOpen: 'menu'}), parameters: {route: '/'}};
export const HomeCartEmpty: StoryObj = {name: 'Home · cart drawer, empty', render: () => frame(<HomePage cards={CARDS} thermal={thermal} />, {transparentHeader: true, initialOpen: 'cart'}), parameters: {route: '/'}};
export const HomeCartFilled: StoryObj = {name: 'Home · cart drawer, filled', render: () => frame(<HomePage cards={CARDS} thermal={thermal} />, {transparentHeader: true, initialOpen: 'cart', cart: filledCart}), parameters: {route: '/'}};
export const Shop: StoryObj = {render: () => frame(<ShopPage cards={CARDS} />), parameters: {route: '/collections/all'}};
export const ShopTops: StoryObj = {name: 'Shop · Tops filter', render: () => frame(<ShopPage cards={CARDS} filter="tops" />), parameters: {route: '/collections/all'}};
export const ShopLoading: StoryObj = {name: 'Shop · loading skeleton', render: () => frame(<ShopPage cards={CARDS} loading />), parameters: {route: '/collections/all'}};
export const ShopEmptyFilter: StoryObj = {name: 'Shop · empty filter result', render: () => frame(<ShopPage cards={CARDS.filter((c) => c.category === 'Tops')} filter="bottoms" />), parameters: {route: '/collections/all'}};
export const ShopAllSoldOut: StoryObj = {name: 'Shop · all sold out', render: () => frame(<ShopPage cards={CARDS} allSoldOut />), parameters: {route: '/collections/all'}};
export const ProductThermal: StoryObj = {name: 'Product · Thermal Long Sleeve', render: () => frame(<ProductPage product={thermal} others={others} />), parameters: {route: '/products/thermal-long-sleeve'}};
export const ProductThermalSandBlue: StoryObj = {name: 'Product · Thermal, Sand Blue', render: () => frame(<ProductPage product={thermal} others={others} color="Sand Blue" />), parameters: {route: '/products/thermal-long-sleeve?color=Sand%20Blue'}};
export const ProductPincord: StoryObj = {name: 'Product · Pincord Button-Down', render: () => frame(<ProductPage product={PRODUCTS[1]} others={othersThan(1)} />), parameters: {route: '/products/pincord-button-down'}};
export const ProductNeedlecord: StoryObj = {name: 'Product · Needlecord Shirt', render: () => frame(<ProductPage product={PRODUCTS[2]} others={othersThan(2)} />), parameters: {route: '/products/needlecord-shirt'}};
export const ProductPant: StoryObj = {name: 'Product · Drawstring Pant', render: () => frame(<ProductPage product={PRODUCTS[3]} others={othersThan(3)} />), parameters: {route: '/products/drawstring-pant'}};
export const ProductSizeNotSelected: StoryObj = {name: 'Product · size not selected (error)', render: () => frame(<ProductPage product={thermal} others={others} forceStatus="available" forceError />), parameters: {route: '/products/thermal-long-sleeve'}};
export const ProductAvailable: StoryObj = {name: 'Product · available, size M', render: () => frame(<ProductPage product={thermal} others={others} forceStatus="available" forceSize="M" />), parameters: {route: '/products/thermal-long-sleeve'}};
export const ProductAdding: StoryObj = {name: 'Product · adding', render: () => frame(<ProductPage product={thermal} others={others} forceStatus="available" forceSize="M" forceAdding />), parameters: {route: '/products/thermal-long-sleeve'}};
export const ProductPreorder: StoryObj = {name: 'Product · pre-order', render: () => frame(<ProductPage product={thermal} others={others} forceStatus="pre-order" />), parameters: {route: '/products/thermal-long-sleeve'}};
export const ProductSoldOut: StoryObj = {name: 'Product · sold out (Hold my size)', render: () => frame(<ProductPage product={thermal} others={others} forceStatus="sold-out" forceSize="M" />), parameters: {route: '/products/thermal-long-sleeve'}};
export const ProductSizeGuide: StoryObj = {name: 'Product · size guide modal', render: () => frame(<ProductPage product={thermal} others={others} sizeGuideOpen />), parameters: {route: '/products/thermal-long-sleeve'}};
export const Manifesto: StoryObj = {render: () => frame(<ManifestoPage />), parameters: {route: '/pages/manifesto'}};
export const SizeGuide: StoryObj = {name: 'Size guide', render: () => frame(<SizeGuidePage products={PRODUCTS} />), parameters: {route: '/pages/size-guide'}};
export const ShippingReturns: StoryObj = {name: 'Shipping & returns', render: () => frame(<ShippingReturnsPage />), parameters: {route: '/pages/shipping-returns'}};
export const Faq: StoryObj = {name: 'FAQ', render: () => frame(<FaqPage />), parameters: {route: '/pages/faq'}};
export const Contact: StoryObj = {render: () => frame(<ContactPage />), parameters: {route: '/pages/contact'}};
export const Accessibility: StoryObj = {render: () => frame(<AccessibilityPage />), parameters: {route: '/pages/accessibility'}};
export const Policies: StoryObj = {render: () => frame(<PoliciesPage policies={POLICIES} />), parameters: {route: '/policies'}};
export const Policy: StoryObj = {name: 'Policy · privacy', render: () => frame(<PolicyPage policy={POLICIES[0]} />), parameters: {route: '/policies/privacy-policy'}};
export const Account: StoryObj = {render: () => frame(<AccountPage />), parameters: {route: '/account'}};
export const CartEmpty: StoryObj = {name: 'Cart page · empty', render: () => frame(<CartPage cart={EMPTY_CART} cards={CARDS} />), parameters: {route: '/cart'}};
export const CartFilled: StoryObj = {name: 'Cart page · filled', render: () => frame(<CartPage cart={filledCart} cards={CARDS} />, {cart: filledCart}), parameters: {route: '/cart'}};
export const NotFoundPage: StoryObj = {name: '404', render: () => frame(<NotFound cards={CARDS} />), parameters: {route: '/nope'}};
export const Tokens: StoryObj = {name: 'Dev · tokens', render: () => frame(<TokensPage />), parameters: {route: '/dev/tokens'}};
