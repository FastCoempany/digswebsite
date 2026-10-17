import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {test, PAGES, open} from './fixtures';

/**
 * Deliverable screenshots: docs/wireframes/{page}-{390|1440}.png (wire projects, @wireframes) and
 * docs/ui/{page}-{390|1440}.png (ui projects, @ui-shots). Full page, plus the chrome states.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const docs = path.join(here, '..', '..', 'docs');

test.describe('deliverable shots', () => {
  for (const p of PAGES) {
    test(`${p.name} @wireframes @ui-shots`, async ({page, mode, sizeName}) => {
      const dir = path.join(docs, mode === 'wire' ? 'wireframes' : 'ui');
      fs.mkdirSync(dir, {recursive: true});
      await open(page, p.path, mode);
      const width = sizeName === 'mobile' ? 390 : 1440;
      await page.screenshot({path: path.join(dir, `${p.name}-${width}.png`), fullPage: true, animations: 'disabled'});
    });
  }

  test('menu open @wireframes @ui-shots', async ({page, mode, sizeName}) => {
    const dir = path.join(docs, mode === 'wire' ? 'wireframes' : 'ui');
    await open(page, '/collections/all', mode);
    const width = sizeName === 'mobile' ? 390 : 1440;
    if (sizeName === 'mobile') await page.getByRole('button', {name: 'Menu', exact: true}).click();
    else {
      // Desktop: the menu button is mobile-only; open via the drawer id with the same state the button sets.
      await page.setViewportSize({width: 1023, height: 900});
      await page.getByRole('button', {name: 'Menu', exact: true}).click();
      await page.setViewportSize({width: 1440, height: 900});
    }
    await page.waitForTimeout(400);
    await page.screenshot({path: path.join(dir, `menu-${width}.png`), animations: 'disabled'});
  });

  test('cart drawer open @wireframes @ui-shots', async ({page, mode, sizeName}) => {
    const dir = path.join(docs, mode === 'wire' ? 'wireframes' : 'ui');
    await open(page, '/collections/all', mode);
    const width = sizeName === 'mobile' ? 390 : 1440;
    await page.getByRole('button', {name: /Your Digs/}).click();
    await page.waitForTimeout(400);
    await page.screenshot({path: path.join(dir, `cart-drawer-${width}.png`), animations: 'disabled'});
  });

  test('size guide modal @wireframes @ui-shots', async ({page, mode, sizeName}) => {
    const dir = path.join(docs, mode === 'wire' ? 'wireframes' : 'ui');
    await open(page, '/products/thermal-long-sleeve', mode);
    const width = sizeName === 'mobile' ? 390 : 1440;
    await page.locator('.sizes-aside').getByRole('button', {name: 'Size guide', exact: true}).click();
    await page.waitForTimeout(400);
    await page.screenshot({path: path.join(dir, `size-guide-modal-${width}.png`), animations: 'disabled'});
  });
});
