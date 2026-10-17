import {test, expect, PAGES, open} from './fixtures';

/** Visual baselines (phase 6): every page, full page, both sizes, both modes. */
test.describe('visual baselines @visual', () => {
  for (const p of PAGES) {
    test(`${p.name}`, async ({page, mode}) => {
      await open(page, p.path, mode);
      await expect(page).toHaveScreenshot(`${p.name}.png`, {fullPage: true, animations: 'disabled', mask: [page.locator('.pdp-sticky')]});
    });
  }
});
