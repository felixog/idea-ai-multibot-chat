// Dev helper: node scripts/shot.mjs <url> <width> <out.png> [selector] [--height=900] [--viewport]
import { chromium } from '@playwright/test';

const [url, width, out, selector] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const heightArg = process.argv.find((a) => a.startsWith('--height='));
const viewportOnly = process.argv.includes('--viewport');
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: Number(width), height: heightArg ? Number(heightArg.split('=')[1]) : 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState('networkidle');
await page.waitForTimeout(300);
if (selector) await page.locator(selector).first().screenshot({ path: out });
else await page.screenshot({ path: out, fullPage: !viewportOnly });
if (errors.length) console.log('console:', errors.join('\n'));
await browser.close();
