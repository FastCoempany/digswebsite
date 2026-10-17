import AxeBuilder from '@axe-core/playwright';
import {test, expect, PAGES, open} from './fixtures';

/** Phase 6: axe on every page, both sizes, both modes: zero serious or critical issues. */
test.describe('accessibility @a11y', () => {
  for (const p of PAGES) {
    test(`${p.name} has no serious or critical axe violations`, async ({page, mode}) => {
      await open(page, p.path, mode);
      const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(bad.map((v) => `${v.id} [${v.impact}]: ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    });
  }

  test('menu, cart drawer and size guide modal are axe-clean when open', async ({page, mode, sizeName}) => {
    await open(page, '/products/thermal-long-sleeve', mode);
    await page.getByRole('button', {name: /Your Digs/}).click();
    await expect(page.locator('#site-cart')).toBeVisible();
    let r = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-cart')).toBeHidden();
    await page.getByRole('button', {name: 'Size guide', exact: true}).first().click();
    await expect(page.getByRole('dialog', {name: 'Size guide'})).toBeVisible();
    r = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([]);
    await page.keyboard.press('Escape');
    if (sizeName === 'mobile') {
      await page.getByRole('button', {name: 'Menu', exact: true}).click();
      await expect(page.locator('#site-menu')).toBeVisible();
      r = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([]);
    }
  });
});
