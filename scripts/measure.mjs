// Dev helper: node scripts/measure.mjs <url> <width> <height> "<css selector>" ...
import { chromium } from '@playwright/test';
const [url, w, h, ...sels] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
for (const sel of sels) {
  const boxes = await p.$$eval(sel, (els) => els.map((e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`; }));
  console.log(sel, '=>', boxes.join(' | '));
}
await b.close();
