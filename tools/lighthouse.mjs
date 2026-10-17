// Lighthouse mobile performance on Home, Shop and PDP against the preview build (phase 6).
// usage: node tools/lighthouse.mjs [baseUrl]   → prints scores, writes docs/qa/lighthouse-*.json
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import lighthouse from 'lighthouse';

const base = process.argv[2] || 'http://localhost:3000';
const pages = [
  ['home', '/'],
  ['shop', '/collections/all'],
  ['pdp', '/products/thermal-long-sleeve'],
];
const chromePath = process.env.CHROMIUM_PATH || findChromium();
const port = 9333;
const chrome = spawn(chromePath, [`--remote-debugging-port=${port}`, '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--user-data-dir=/tmp/lh-profile'], {stdio: 'ignore'});
await new Promise((r) => setTimeout(r, 1500));
fs.mkdirSync('docs/qa', {recursive: true});
const rows = [];
try {
  for (const [name, p] of pages) {
    const result = await lighthouse(base + p + '?mode=ui', {port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], formFactor: 'mobile', screenEmulation: {mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false}, throttlingMethod: 'simulate'});
    const c = result.lhr.categories;
    const audits = result.lhr.audits;
    const row = {page: name, url: p, performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100), bestPractices: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100), lcp: audits['largest-contentful-paint'].displayValue, cls: audits['cumulative-layout-shift'].displayValue, tbt: audits['total-blocking-time'].displayValue, fcp: audits['first-contentful-paint'].displayValue};
    rows.push(row);
    fs.writeFileSync(path.join('docs/qa', `lighthouse-${name}.json`), JSON.stringify({fetchTime: result.lhr.fetchTime, ...row, opportunities: Object.values(audits).filter((a) => a.details?.type === 'opportunity' && a.score !== null && a.score < 0.9).map((a) => ({id: a.id, title: a.title, savings: a.displayValue}))}, null, 1));
    console.log(JSON.stringify(row));
  }
} finally {
  chrome.kill();
}
fs.writeFileSync('docs/qa/lighthouse.md', ['# Lighthouse (mobile, simulated throttling)', '', `Run against \`npm run preview\` on ${new Date().toISOString().slice(0, 10)} with \`node tools/lighthouse.mjs\`.`, '', '| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |', '|---|---|---|---|---|---|---|---|', ...rows.map((r) => `| ${r.page} \`${r.url}\` | **${r.performance}** | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} |`), ''].join('\n'));
const fail = rows.filter((r) => r.performance < 90);
if (fail.length) {
  console.error('performance below 90:', fail.map((r) => `${r.page}=${r.performance}`).join(', '));
  process.exit(1);
}

function findChromium() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(process.env.HOME || '', '.cache', 'ms-playwright');
  const dirs = fs.existsSync(root) ? fs.readdirSync(root).filter((d) => d.startsWith('chromium-') && !d.includes('headless')) : [];
  for (const d of dirs) {
    for (const cand of ['chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
      const p = path.join(root, d, cand);
      if (fs.existsSync(p)) return p;
    }
  }
  throw new Error('No Chromium found; set CHROMIUM_PATH');
}
