import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function open(page: Page, width: number, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
}

async function axe(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  for (const v of bad) console.log(`[${label}] ${v.impact} ${v.id}: ${v.help} -> ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  expect(bad, `${label}: serious or critical axe violations`).toEqual([]);
}

test.describe('axe', () => {
  test('1440 on load, picker open', async ({ page }) => {
    await open(page, 1440);
    await axe(page, '1440 load');
    await page.locator('#message-box').focus();
    await page.keyboard.type('@');
    await expect(page.getByRole('listbox', { name: 'Mention a character' })).toBeVisible();
    await axe(page, '1440 picker');
  });

  test('1100 cast drawer', async ({ page }) => {
    await open(page, 1100);
    await page.getByRole('button', { name: 'Open cast: Nova and Iris' }).click();
    await expect(page.getByRole('dialog', { name: 'In this chat' })).toBeVisible();
    await axe(page, '1100 cast drawer');
  });

  test('390 on load, chats drawer, cast sheet', async ({ page }) => {
    await open(page, 390, 844);
    await axe(page, '390 load');
    await page.getByRole('button', { name: 'Open chats' }).click();
    await expect(page.getByRole('dialog', { name: 'Chats' })).toBeVisible();
    await axe(page, '390 chats drawer');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open cast: Nova and Iris' }).click();
    await expect(page.getByRole('dialog', { name: 'In this chat' })).toBeVisible();
    await axe(page, '390 cast sheet');
  });

  test('320 compact toolbar with the More menu open', async ({ page }) => {
    await open(page, 320, 800);
    const more = page.getByRole('button', { name: 'More actions' }).first();
    await more.scrollIntoViewIfNeeded();
    await more.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Edit prompt' })).toBeFocused();
    await axe(page, '320 menu');
    await page.keyboard.press('Escape');
    await expect(more).toBeFocused();
  });
});

test('keyboard demo path: trim, edit and apply, play, mention, mute', async ({ page }) => {
  test.setTimeout(60_000);
  await open(page, 1440);

  // The first Tab reaches the skip link.
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to message box' })).toBeFocused();

  // 1. Save the trim on Nova's hook.
  const hook = page.getByRole('group', { name: 'Audio: Late trains hook' });
  await hook.getByRole('slider', { name: 'Trim start' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(hook).toContainText('Start 0:03.5');
  await page.keyboard.press('ArrowRight');
  await hook.getByRole('button', { name: 'Save trim' }).focus();
  await page.keyboard.press('Enter');
  await expect(hook).toContainText('Trimmed to 0:04 to 0:18');
  await expect(hook).toContainText('0:14 · 92 BPM · lo-fi');
  await expect(page.getByRole('log').getByText('Tighter. The hook lands on the downbeat now.')).toBeVisible({ timeout: 5000 });

  // 2. Make changes to the cover, then apply.
  const cover = page.getByRole('group', { name: 'Image: Cover art, late trains' });
  await cover.getByRole('button', { name: 'Make changes' }).focus();
  await page.keyboard.press('Enter');
  const edit = page.getByRole('group', { name: /Edit: Cover art, late trains/ });
  await expect(edit).toContainText('Editing', { timeout: 5000 });
  await expect(edit).toContainText('Ready to review', { timeout: 8000 });
  await edit.getByRole('button', { name: 'Apply edits' }).focus();
  await page.keyboard.press('Enter');
  await expect(edit).toContainText('Applied');
  await expect(cover).toContainText('1:1 · v2');
  await expect(page.getByRole('log').getByText('Love the amber. I’ll nudge the pad warmer to match.')).toBeVisible({ timeout: 6000 });

  // 3. Play the teaser loop.
  const loop = page.getByRole('group', { name: 'Video: Teaser loop' });
  await loop.getByRole('button', { name: 'Play teaser loop' }).first().focus();
  await page.keyboard.press('Enter');
  await expect(loop.getByText('Late trains, city lights')).toBeVisible();
  await loop.getByRole('button', { name: 'Pause teaser loop' }).focus();
  await page.keyboard.press('Enter');

  // 4. Mention @Iris and send.
  await page.locator('#message-box').focus();
  await page.keyboard.type('@I');
  const picker = page.getByRole('listbox', { name: 'Mention a character' });
  await expect(picker.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page.locator('#message-box')).toHaveValue('@Iris ');
  await expect(page.getByRole('button', { name: 'Stop replying to Nova' })).toHaveCount(0);
  await page.keyboard.type('a darker cover please');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('log').getByText('Here’s another direction.')).toBeVisible({ timeout: 6000 });

  // 5. Mute Nova.
  await page.getByRole('button', { name: 'Mute Nova' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('log').getByText('Nova is muted and won\'t reply')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unmute Nova' })).toBeVisible();
  await expect(page.getByText('You, Nova and Iris · Nova muted')).toBeVisible();

  // Checklist ticks.
  await expect(page.getByRole('button', { name: /, done$/ })).toHaveCount(5);
});
