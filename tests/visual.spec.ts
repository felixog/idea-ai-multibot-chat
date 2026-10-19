import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { compare } from './compare';

const SCREENS: Array<{ name: string; width: number; query: string; height?: number }> = [
  { name: 'desktop-1440', width: 1440, query: '?capture=full' },
  { name: 'tablet-744', width: 744, query: '?capture=full&state=mentioning' },
  { name: 'mobile-390', width: 390, query: '?capture=full&state=mentioning' },
];

fs.mkdirSync('tests/output', { recursive: true });

for (const screen of SCREENS) {
  test(`${screen.name} matches Figma`, async ({ page }) => {
    const figma = `tests/figma/${screen.name}.png`;
    const { PNG } = await import('pngjs');
    const ref = PNG.sync.read(fs.readFileSync(figma));
    await page.setViewportSize({ width: screen.width, height: ref.height });
    await page.goto(`/${screen.query}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete));
    await page.waitForTimeout(300);
    const local = `tests/output/${screen.name}.png`;
    await page.screenshot({ path: local, fullPage: true, animations: 'disabled', caret: 'hide' });
    // Artwork is masked: Figma renders raster fills, the brief requires the SVG originals (docs/DECISIONS.md #34).
    // Also masked: the chats sidebar, redesigned after the Figma review (DECISIONS #47).
    const masks = await page.$$eval('[data-visual-mask], nav[aria-label="Chats"]', (els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
      }),
    );
    const r = compare(local, figma, `tests/output/${screen.name}-diff.png`, masks);
    console.log(`${screen.name}: ${(r.ratio * 100).toFixed(2)}% differ, worst 24px cell ${(r.worstCell * 100).toFixed(0)}% filled, height ${r.heights.local} vs ${r.heights.figma}`);
    expect.soft(Math.abs(r.heights.local - (screen.height ?? r.heights.figma)), 'page height within 8px').toBeLessThanOrEqual(8);
    expect(r.ratio, 'under 2% of pixels differ').toBeLessThan(0.02);
  });
}
