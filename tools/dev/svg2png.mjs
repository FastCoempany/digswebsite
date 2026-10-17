// Dev helper: rasterize an SVG file with the repo's Playwright chromium (used by tools/flats_svg.py
// --sheet and for eyeballing generated assets). Not part of the test suite.
// usage: node tools/dev/svg2png.mjs <in.svg> <out.png> [width=800] [color=black] [background=white]
import {readFileSync} from 'node:fs';
import {chromium} from '@playwright/test';
const [input, out, width = '800', color = 'black', background = 'white'] = process.argv.slice(2);
if (!input || !out) {
  console.error('usage: node tools/dev/svg2png.mjs <in.svg> <out.png> [width] [color] [background]');
  process.exit(2);
}
const svg = readFileSync(input, 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: Number(width) + 40, height: 1200}, deviceScaleFactor: 1});
await page.setContent(
  `<!doctype html><html><body style="margin:0;padding:20px;background:${background};color:${color}">` +
    `<div id="wrap" style="width:${Number(width)}px;display:inline-block">${svg}</div></body></html>`,
);
await page.evaluate(() => {
  const s = document.querySelector('#wrap svg');
  s.style.width = '100%';
  s.style.height = 'auto';
  s.style.display = 'block';
});
await page.locator('#wrap').screenshot({path: out});
await browser.close();
console.log('wrote', out);
