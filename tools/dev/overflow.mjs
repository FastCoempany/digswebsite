// Lists elements that extend beyond a fixed-width layout viewport (no mobile emulation, so the page cannot zoom out).
// usage: node tools/dev/overflow.mjs <url> <width>
import {chromium} from '@playwright/test';
const [, , url = 'http://localhost:3000/pages/manifesto?mode=ui', width = '390'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: Number(width), height: 844}, deviceScaleFactor: 1, reducedMotion: 'reduce'});
await page.goto(url, {waitUntil: 'networkidle'});
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo({top: y, behavior: 'instant'}); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
const out = await page.evaluate((w) => {
  const doc = {scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth, innerWidth: window.innerWidth};
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > w + 1 || r.left < -1 || r.width > w + 1) {
      const cs = getComputedStyle(el);
      bad.push({tag: el.tagName.toLowerCase(), cls: (el.className && el.className.baseVal === undefined ? el.className : el.getAttribute('class')) || '', left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), pos: cs.position, transform: cs.transform !== 'none' ? cs.transform.slice(0, 40) : '', overflowParent: (el.parentElement && getComputedStyle(el.parentElement).overflowX) || ''});
    }
  }
  bad.sort((a, b) => b.right - a.right);
  return {doc, bad: bad.slice(0, 25), count: bad.length};
}, Number(width));
console.log(JSON.stringify(out, null, 1));
await browser.close();
