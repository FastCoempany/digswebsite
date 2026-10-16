/** Collection and policy shapes. One collection (Capsule 01); policies are Shopify's once the store is linked. */
import type {Collection, ShopPolicy} from './types';
import {PRODUCTS} from './products';

export const CAPSULE: Collection = {
  id: 'gid://shopify/Collection/1',
  handle: 'all',
  title: 'The Capsule',
  description: '',
  products: {nodes: PRODUCTS},
};

export const POLICY_HANDLES = ['privacy-policy', 'terms-of-service', 'refund-policy', 'shipping-policy'] as const;
export type PolicyHandle = (typeof POLICY_HANDLES)[number];

export const POLICIES: ShopPolicy[] = POLICY_HANDLES.map((handle, i) => ({
  id: `gid://shopify/ShopPolicy/${i + 1}`,
  handle,
  title: handle
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' '),
  // Policy bodies are written in Shopify once the store exists; nothing is invented here.
  body: '',
  url: `/policies/${handle}`,
}));
