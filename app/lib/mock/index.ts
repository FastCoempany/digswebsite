/**
 * The DIGS data adapter. Every loader reads through this object; swapping it for the live
 * Storefront API later means re-implementing these functions with `storefront.query`
 * (09-build-plan.md: "a one-file change"). Nothing here touches the network.
 */
import type {HydrogenSession} from '@shopify/hydrogen';
import type {Cart, Collection, Product, ShopPolicy} from './types';
import {PRODUCTS, productByHandle} from './products';
import {CAPSULE, POLICIES} from './shop';
import {applyCartAction, hydrateCart, type CartAction, type StoredCart} from './cart';

const CART_KEY = 'digsCart';

export type DigsAdapter = {
  products(): Promise<Product[]>;
  product(handle: string): Promise<Product | null>;
  collection(handle: string): Promise<Collection | null>;
  policies(): Promise<ShopPolicy[]>;
  policy(handle: string): Promise<ShopPolicy | null>;
  cart: {
    get(): Promise<Cart>;
    apply(input: CartAction): Promise<Cart>;
  };
};

export function createDigsAdapter(session: HydrogenSession): DigsAdapter {
  const readCart = () => (session.get(CART_KEY) as StoredCart | undefined) ?? null;
  return {
    products: async () => PRODUCTS,
    product: async (handle) => productByHandle(handle),
    collection: async (handle) => (handle === 'all' || handle === 'capsule-01' ? CAPSULE : null),
    policies: async () => POLICIES,
    policy: async (handle) => POLICIES.find((p) => p.handle === handle) ?? null,
    cart: {
      get: async () => hydrateCart(readCart()),
      apply: async (input) => {
        const next = applyCartAction(readCart(), input);
        session.set(CART_KEY, next);
        return hydrateCart(next);
      },
    },
  };
}

export * from './types';
export {PRODUCTS, productByHandle, digs, metafield, metafieldList} from './products';
export {CAPSULE, POLICIES, POLICY_HANDLES} from './shop';
export {EMPTY_CART, hydrateCart} from './cart';
export {photoFor, photoWidths, srcSetFor, PHOTO_COUNT} from './photos';
