/**
 * Cart-shaped mock (Storefront `cart { id checkoutUrl totalQuantity lines { nodes } cost }`),
 * persisted in the session cookie. Nothing is wired to Shopify checkout in this phase.
 */
import type {Cart, CartLine, MoneyV2} from './types';
import {PRODUCTS} from './products';

export type StoredLine = {merchandiseId: string; quantity: number};
export type StoredCart = {id: string; lines: StoredLine[]};

export const EMPTY_CART: Cart = {
  id: 'gid://shopify/Cart/mock',
  checkoutUrl: '/cart',
  totalQuantity: 0,
  lines: {nodes: []},
  cost: {subtotalAmount: {amount: '0.00', currencyCode: 'USD'}, totalAmount: {amount: '0.00', currencyCode: 'USD'}},
  note: null,
};

function money(amount: number): MoneyV2 {
  return {amount: amount.toFixed(2), currencyCode: 'USD'};
}

function findVariant(merchandiseId: string) {
  for (const product of PRODUCTS) {
    const v = product.variants.nodes.find((x) => x.id === merchandiseId);
    if (v) return {product, variant: v};
  }
  return null;
}

export function hydrateCart(stored: StoredCart | null | undefined): Cart {
  if (!stored || stored.lines.length === 0) return EMPTY_CART;
  const nodes: CartLine[] = [];
  let subtotal = 0;
  let priced = true;
  for (const line of stored.lines) {
    const hit = findVariant(line.merchandiseId);
    if (!hit) continue;
    const {product, variant} = hit;
    const unit = variant.price ? Number(variant.price.amount) : null;
    if (unit == null) priced = false;
    else subtotal += unit * line.quantity;
    nodes.push({
      id: `gid://shopify/CartLine/${variant.id.split('/').pop()}`,
      quantity: line.quantity,
      merchandise: {
        ...variant,
        product: {id: product.id, handle: product.handle, title: product.title, vendor: product.vendor},
      },
      cost: {
        totalAmount: unit == null ? null : money(unit * line.quantity),
        amountPerQuantity: variant.price,
      },
    });
  }
  return {
    ...EMPTY_CART,
    id: stored.id,
    totalQuantity: nodes.reduce((n, l) => n + l.quantity, 0),
    lines: {nodes},
    cost: priced
      ? {subtotalAmount: money(subtotal), totalAmount: money(subtotal)}
      : {subtotalAmount: null, totalAmount: null},
  };
}

export type CartAction =
  | {action: 'LinesAdd'; lines: StoredLine[]}
  | {action: 'LinesUpdate'; lines: {id: string; quantity: number}[]}
  | {action: 'LinesRemove'; lineIds: string[]};

export function applyCartAction(stored: StoredCart | null | undefined, input: CartAction): StoredCart {
  const cart: StoredCart = stored ? {id: stored.id, lines: [...stored.lines]} : {id: 'gid://shopify/Cart/mock-1', lines: []};
  const lineIdFor = (merchandiseId: string) => `gid://shopify/CartLine/${merchandiseId.split('/').pop()}`;
  switch (input.action) {
    case 'LinesAdd':
      for (const add of input.lines) {
        if (!findVariant(add.merchandiseId)) continue;
        const existing = cart.lines.find((l) => l.merchandiseId === add.merchandiseId);
        if (existing) existing.quantity += add.quantity;
        else cart.lines.push({merchandiseId: add.merchandiseId, quantity: Math.max(1, add.quantity)});
      }
      break;
    case 'LinesUpdate':
      for (const upd of input.lines) {
        const existing = cart.lines.find((l) => lineIdFor(l.merchandiseId) === upd.id);
        if (existing) existing.quantity = Math.max(0, upd.quantity);
      }
      cart.lines = cart.lines.filter((l) => l.quantity > 0);
      break;
    case 'LinesRemove':
      cart.lines = cart.lines.filter((l) => !input.lineIds.includes(lineIdFor(l.merchandiseId)));
      break;
  }
  return cart;
}
