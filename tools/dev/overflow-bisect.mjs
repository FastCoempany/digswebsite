// Which top-level block causes horizontal overflow? Hides each candidate in turn and re-measures document.scrollWidth.
// usage: node tools/dev/overflow-bisect.mjs <url> <width> [selector of candidates]
import {chromium} from '@playwright/test';
const [, , url = 'http://localhost:3000/pages/manifesto?mode=ui', width = '390', sel = 'body > *, .page-main > *, .page-main > * > *, section > *'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: Number(width), height: 844}, deviceScaleFactor: 1, reducedMotion: 'reduce'});
await page.goto(url, {waitUntil: 'networkidle'});
const res = await page.evaluate((sel) => {
  const base = document.documentElement.scrollWidth;
  const out = [];
  for (const el of document.querySelectorAll(sel)) {
    const prev = el.style.display;
    el.style.display = 'none';
    const w = document.documentElement.scrollWidth;
    el.style.display = prev;
    if (w < base) out.push({tag: el.tagName.toLowerCase(), cls: el.getAttribute('class') || '', id: el.id, widthWhenHidden: w});
  }
  // pseudo-elements with content on the culprits' subtree
  return {base, culprits: out.slice(0, 30)};
}, sel);
console.log(JSON.stringify(res, null, 1));
await browser.close();
