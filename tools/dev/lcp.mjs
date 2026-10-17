import {spawn} from 'node:child_process';
import lighthouse from 'lighthouse';
const chrome = spawn('/opt/pw-browsers/chromium-1194/chrome-linux/chrome', ['--remote-debugging-port=9334', '--headless=new', '--no-sandbox', '--disable-gpu', '--user-data-dir=/tmp/lh-profile2'], {stdio: 'ignore'});
await new Promise((r) => setTimeout(r, 1500));
try {
  const url = process.argv[2] || 'http://localhost:3000/products/thermal-long-sleeve?mode=ui';
  const result = await lighthouse(url, {port: 9334, output: 'json', logLevel: 'error', onlyCategories: ['performance'], formFactor: 'mobile', screenEmulation: {mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false}, throttlingMethod: 'simulate'});
  const a = result.lhr.audits;
  console.log('LCP', a['largest-contentful-paint'].displayValue, 'FCP', a['first-contentful-paint'].displayValue, 'perf', result.lhr.categories.performance.score);
  const S = (v) => (JSON.stringify(v) ?? 'undefined').slice(0, 1400);
  for (const id of Object.keys(a).filter((k) => /lcp|largest|render-blocking|network-dependency|font-display/.test(k))) {
    console.log('---', id, a[id].score, a[id].displayValue ?? '', S(a[id].details));
  }
} finally {
  chrome.kill();
}
