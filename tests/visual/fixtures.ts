import {test as base, expect, type Page} from '@playwright/test';
import type {TestOptions} from './playwright.config';

export const PAGES: Array<{name: string; path: string}> = [
  {name: 'home', path: '/'},
  {name: 'shop', path: '/collections/all'},
  {name: 'product-thermal-long-sleeve', path: '/products/thermal-long-sleeve'},
  {name: 'product-pincord-button-down', path: '/products/pincord-button-down'},
  {name: 'product-needlecord-shirt', path: '/products/needlecord-shirt'},
  {name: 'product-drawstring-pant', path: '/products/drawstring-pant'},
  {name: 'manifesto', path: '/pages/manifesto'},
  {name: 'size-guide', path: '/pages/size-guide'},
  {name: 'shipping-returns', path: '/pages/shipping-returns'},
  {name: 'faq', path: '/pages/faq'},
  {name: 'contact', path: '/pages/contact'},
  {name: 'accessibility', path: '/pages/accessibility'},
  {name: 'policies', path: '/policies'},
  {name: 'policy-privacy', path: '/policies/privacy-policy'},
  {name: 'account', path: '/account'},
  {name: 'cart', path: '/cart'},
  {name: '404', path: '/this-page-does-not-exist'},
];

export const test = base.extend<TestOptions>({
  mode: ['ui', {option: true}],
  sizeName: ['mobile', {option: true}],
});

export {expect};

/** Open a page in the project's mode and wait for fonts and images. */
export async function open(page: Page, path: string, mode: TestOptions['mode']) {
  const url = new URL(path, 'http://x');
  url.searchParams.set('mode', mode);
  await page.goto(url.pathname + url.search, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('html')).toHaveAttribute('data-mode', mode);
  // Fixed chrome that depends on scroll position would smear across a full-page capture.
  await page.addStyleTag({content: '.pdp-sticky, .toasts { display: none !important; }'});
  await settle(page);
}

export async function settle(page: Page) {
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    // Walk the page so lazy images and reveal-on-scroll fire, then wait (bounded) for images.
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += Math.max(400, window.innerHeight * 0.8)) {
      window.scrollTo({top: y, behavior: 'instant'});
      await sleep(40);
    }
    window.scrollTo({top: h, behavior: 'instant'});
    await sleep(80);
    const pending = Array.from(document.images).filter((i) => !i.complete);
    await Promise.race([
      Promise.all(pending.map((i) => new Promise((r) => { i.addEventListener('load', r, {once: true}); i.addEventListener('error', r, {once: true}); }))),
      sleep(4000),
    ]);
    window.scrollTo({top: 0, behavior: 'instant'});
    await sleep(250);
  });
}
