// Dev helper: screenshot a running page. Not part of the test suite.
// usage: node shot.mjs <url> <out.png> <width> [fullPage=1] [mode]
import {chromium} from '@playwright/test';
const [url, out, width = '1440', full = '1', mode = ''] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: Number(width), height: width === '390' ? 844 : 900}, reducedMotion: 'reduce'});
const u = new URL(url); if (mode) u.searchParams.set('mode', mode);
await page.goto(u.toString(), {waitUntil: 'networkidle'});
await page.evaluate(() => document.fonts.ready);
await page.screenshot({path: out, fullPage: full === '1'});
await browser.close();
console.log('wrote', out);
