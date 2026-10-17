import type {Cart} from '~/lib/mock/types';
import {digs, productByHandle, srcSetFor} from '~/lib/mock';
import type {CartLineData} from '~/components/core/CartLine';

/** Storefront-shaped cart lines → the data the core CartLine renders (shared by the drawer, the cart page and the stories). */
export function cartLineData(cart: Cart): CartLineData[] {
  return cart.lines.nodes.map((l) => {
    const colorway = l.merchandise.selectedOptions.find((o) => o.name === 'Color')?.value ?? null;
    const size = l.merchandise.selectedOptions.find((o) => o.name === 'Size')?.value ?? null;
    const img = l.merchandise.image;
    const product = productByHandle(l.merchandise.product.handle);
    const front = product ? digs.galleryFor(product, colorway).find((g) => g.kind === 'front') : null;
    return {
      id: l.id,
      title: l.merchandise.product.title,
      href: `/products/${l.merchandise.product.handle}${colorway ? `?color=${encodeURIComponent(colorway)}` : ''}`,
      colorway,
      size,
      quantity: l.quantity,
      price: l.merchandise.price,
      lineTotal: l.cost.totalAmount,
      image: {code: front?.code ?? 'P-XX-01', ratio: '4:5', image: img, srcSet: srcSetFor(img?.url), alt: img?.altText ?? ''},
    };
  });
}
