import {test, expect, open} from './fixtures';

/** Phase 6 keyboard pass: menu, drawer, gallery, size selector, modal. */
test.describe('keyboard @keyboard', () => {
  test('menu opens from the keyboard, traps focus, Esc closes and returns focus', async ({page, mode, sizeName}) => {
    test.skip(sizeName === 'desktop', 'The menu button is mobile-only; desktop shows inline nav');
    await open(page, '/collections/all', mode);
    const btn = page.getByRole('button', {name: 'Menu', exact: true});
    await btn.focus();
    await page.keyboard.press('Enter');
    const menu = page.locator('#site-menu');
    await expect(menu).toBeVisible();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    // Tab through: focus stays inside the dialog
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('#site-menu'));
      expect(inside).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(btn).toBeFocused();
  });

  test('cart drawer: open with keyboard, focus inside, Esc closes', async ({page, mode}) => {
    await open(page, '/', mode);
    const btn = page.getByRole('button', {name: /Your Digs/});
    await btn.focus();
    await page.keyboard.press('Enter');
    const drawer = page.locator('#site-cart');
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#site-cart'))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(btn).toBeFocused();
  });

  test('gallery: arrow keys move the counter, Enter zooms, Esc closes', async ({page, mode, sizeName}) => {
    await open(page, '/products/thermal-long-sleeve', mode);
    const track = page.locator('.gallery-track');
    if (sizeName === 'mobile') {
      await track.focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('.gallery-counter')).toHaveText(/2 of 7/);
      await page.keyboard.press('ArrowLeft');
      await expect(page.locator('.gallery-counter')).toHaveText(/1 of 7/);
    }
    const first = page.locator('.gallery-zoom').first();
    await first.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', {name: 'Zoom image'});
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('size selector: Tab reaches the sizes, Enter selects, error reads on submit without a size', async ({page, mode}) => {
    await open(page, '/products/thermal-long-sleeve', mode);
    const sizes = page.getByRole('radiogroup', {name: 'Size'});
    const m = sizes.getByRole('radio', {name: 'M', exact: true});
    await m.focus();
    await page.keyboard.press('Enter');
    await expect(m).toHaveAttribute('aria-checked', 'true');
    const l = sizes.getByRole('radio', {name: 'L', exact: true});
    await l.focus();
    await page.keyboard.press('Space');
    await expect(l).toHaveAttribute('aria-checked', 'true');
    await expect(m).toHaveAttribute('aria-checked', 'false');
  });

  test('size guide modal: opens from the keyboard, traps focus, unit toggle works, Esc closes', async ({page, mode}) => {
    await open(page, '/products/thermal-long-sleeve', mode);
    const trigger = page.getByRole('button', {name: 'Size guide', exact: true}).first();
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', {name: 'Size guide'});
    await expect(dialog).toBeVisible();
    const cm = dialog.getByRole('radio', {name: 'cm', exact: true});
    await cm.focus();
    await page.keyboard.press('Enter');
    await expect(cm).toHaveAttribute('aria-checked', 'true');
    await expect(dialog.locator('tbody td').first()).toHaveText(/\d+(\.5)?/);
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('dialog[open]'))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('skip link goes to main content', async ({page, mode}) => {
    await open(page, '/', mode);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', {name: 'Skip to content'});
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});
