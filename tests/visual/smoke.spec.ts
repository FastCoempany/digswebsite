import {test, expect, open} from './fixtures';

/** Phase 0 done-criterion: one screenshot test at both sizes, both modes. */
test.describe('foundation', () => {
  test('token page renders the brand marks @smoke', async ({page, mode}) => {
    await open(page, '/dev/tokens', mode);
    await expect(page.getByRole('heading', {level: 1, name: 'Tokens'})).toBeVisible();
    await expect(page.getByRole('img', {name: 'digs', exact: true}).first()).toBeVisible();
    await expect(page.getByRole('img', {name: 'good'}).first()).toBeVisible();
    await expect(page.locator('.tokens-marks')).toHaveScreenshot('tokens-marks.png');
  });

  test('the private script font is never requested @smoke', async ({page, mode}) => {
    const fontRequests: string[] = [];
    page.on('request', (r) => {
      if (r.resourceType() === 'font' || /\.(otf|ttf|woff2?)(\?|$)/i.test(r.url())) fontRequests.push(r.url());
    });
    await open(page, '/dev/tokens', mode);
    expect(fontRequests.every((u) => /alexandria/i.test(u))).toBe(true);
    expect(fontRequests.some((u) => /falcon/i.test(u))).toBe(false);
  });
});
