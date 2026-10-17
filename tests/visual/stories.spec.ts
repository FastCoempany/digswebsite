import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import {test, expect} from './fixtures';

/**
 * Story matrix: every Storybook story renders at the project's size (390 / 1440) in the project's
 * mode (ui / wire) and passes axe with no serious or critical violations (phases 2–3 done-criteria).
 * Runs against the static build on :6007 (see playwright.config.ts webServer).
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(here, '..', '..', 'storybook-static', 'index.json');
const STORYBOOK = process.env.STORYBOOK_URL || 'http://localhost:6007';

type Entry = {id: string; title: string; name: string; type: string};
const entries: Entry[] = fs.existsSync(indexPath) ? Object.values((JSON.parse(fs.readFileSync(indexPath, 'utf8')) as {entries: Record<string, Entry>}).entries).filter((e) => e.type === 'story') : [];

test.describe('stories @stories', () => {
  test.skip(entries.length === 0, 'storybook-static/index.json not found: run npm run storybook:build');
  for (const story of entries) {
    test(`${story.title} › ${story.name}`, async ({page, mode}) => {
      await page.goto(`${STORYBOOK}/iframe.html?id=${story.id}&viewMode=story&globals=mode:${mode}`, {waitUntil: 'networkidle'});
      await page.waitForSelector('#storybook-root > *', {timeout: 20_000});
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('html')).toHaveAttribute('data-mode', mode);
      await expect(page.locator('.sb-show-errordisplay, .sb-errordisplay')).toHaveCount(0);
      const results = await new AxeBuilder({page}).include('#storybook-root').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).disableRules(['region', 'page-has-heading-one', 'landmark-one-main']).analyze();
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(bad.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(' | ')})`)).toEqual([]);
    });
  }
});
