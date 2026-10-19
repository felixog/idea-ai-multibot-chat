import { test, expect } from '@playwright/test';

let consoleProblems: string[] = [];

test.beforeEach(async ({ page }) => {
  consoleProblems = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') consoleProblems.push(`${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleProblems.push(`pageerror: ${e.message}`));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
});

test.afterEach(() => {
  expect(consoleProblems, 'no console errors or warnings').toEqual([]);
});

test('video trim, undo and redo', async ({ page }) => {
  const loop = page.getByRole('group', { name: 'Video: Teaser loop' });
  await loop.getByRole('button', { name: 'Trim' }).click();
  await expect(loop).toContainText('4.6s selected');
  await loop.getByRole('button', { name: 'Save trim' }).click();
  await expect(loop).toContainText('0:05 · 16:9');
  await expect(loop).toContainText('Trimmed to 4.6s');
  await loop.getByRole('button', { name: 'Undo: Trimmed to 4.6s' }).click();
  await expect(loop).toContainText('0:06 · 16:9');
  await loop.getByRole('button', { name: 'Redo: Trimmed to 4.6s' }).click();
  await expect(loop).toContainText('0:05 · 16:9');
  await expect(page.getByRole('complementary', { name: 'Cast' })).toContainText('Iris · Video · 0:05');
});

test('edit prompt on the loop: EditCard ready, before/after, apply, undo apply', async ({ page }) => {
  test.setTimeout(30_000);
  const loop = page.getByRole('group', { name: 'Video: Teaser loop' });
  await loop.getByRole('button', { name: 'Edit prompt' }).click();
  await expect(loop.getByText('Six second loop of the window lights, rain streaks, seamless, 16:9')).toBeVisible();
  await expect(loop.getByRole('button', { name: 'Make changes' })).toBeDisabled();
  await loop.getByLabel('Describe the change').fill('Warmer grade, tighter loop');
  await loop.getByLabel('Describe the change').press('Control+Enter');
  await expect(page.getByRole('log').getByText('Grading it to the cover and tightening the loop.')).toBeVisible({ timeout: 5000 });
  const edit = page.getByRole('group', { name: /Edit: Teaser loop/ });
  await expect(edit).toContainText('Ready to review', { timeout: 6000 });
  await expect(edit).toContainText('Teaser loop · v2');
  await edit.getByRole('radio', { name: 'Before' }).click();
  await expect(edit.getByRole('radio', { name: 'Before' })).toHaveAttribute('aria-checked', 'true');
  await edit.getByRole('button', { name: 'Apply edits' }).click();
  await expect(loop).toContainText('0:05 · 16:9 · v2');
  await edit.getByRole('button', { name: 'Undo apply' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Back to v1' })).toBeVisible();
  await expect(loop).toContainText('0:06 · 16:9');
});

test('regenerate, toasts and last-chip protection', async ({ page }) => {
  const hook = page.getByRole('group', { name: 'Audio: Late trains hook' });
  await hook.getByRole('button', { name: 'Cancel' }).click();
  await hook.getByRole('button', { name: 'Regenerate' }).click();
  await expect(hook).toContainText('Nova is making your hook');
  await expect(page.getByRole('status').filter({ hasText: 'Nova made a new version' })).toBeVisible({ timeout: 5000 });
  await expect(hook).toContainText('v2');
  await hook.getByRole('button', { name: 'Download' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Audio files aren’t part of this prototype' })).toBeVisible();

  await page.getByRole('button', { name: 'Stop replying to Nova' }).click();
  await page.getByRole('button', { name: 'Stop replying to Iris' }).click();
  await expect(page.getByRole('button', { name: 'Stop replying to Iris' })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Pick at least one character to reply' })).toBeVisible();
});

test('typing indicator, plain reply, muted characters never reply', async ({ page }) => {
  await page.getByRole('button', { name: 'Mute Iris' }).click();
  const box = page.locator('#message-box');
  await box.fill('Sounds good');
  await box.press('Enter');
  await expect(page.getByRole('log').getByRole('article', { name: 'Nova is typing' })).toBeVisible();
  await expect(page.getByRole('log').getByText('On it. I’ll keep it at 92 BPM so it sits under the loop.')).toBeVisible({ timeout: 4000 });
  await page.waitForTimeout(2500);
  await expect(page.getByRole('log').getByRole('article', { name: /^Iris/ })).toHaveCount(2); // only the seed messages
});

test('made in this chat jumps and highlights; reset restores the seed', async ({ page }) => {
  const hook = page.getByRole('group', { name: 'Audio: Late trains hook' });
  await hook.getByRole('button', { name: 'Save trim' }).click();
  await page.getByRole('complementary', { name: 'Cast' }).getByRole('button', { name: /Late trains hook/ }).click();
  await expect(hook).toBeInViewport();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(hook).toContainText('14s selected');
  await expect(page.getByRole('log').getByRole('article')).toHaveCount(6);
});

test('phone preview renders the mobile shell in a 390 frame', async ({ page }) => {
  await page.getByRole('radio', { name: 'Phone 390' }).click();
  const frame = page.getByRole('region', { name: 'Phone preview, 390 by 844' });
  await expect(frame).toBeVisible();
  const box = await frame.boundingBox();
  expect(Math.round(box!.width)).toBe(390);
  await frame.getByRole('button', { name: 'Open chats' }).click();
  await expect(frame.getByRole('dialog', { name: 'Chats' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Back to full view' }).click();
  await expect(page.getByRole('complementary', { name: 'Cast' })).toBeVisible();
});

test('reduced motion removes loops and transforms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const loop = page.getByRole('group', { name: 'Video: Teaser loop' });
  await loop.getByRole('button', { name: 'Play teaser loop' }).first().click();
  const poster = loop.locator('[data-visual-mask] > span').first();
  expect(await poster.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await page.locator('#message-box').fill('Sounds good');
  await page.locator('#message-box').press('Enter');
  const dot = page.getByRole('article', { name: /is typing/ }).locator('span[aria-hidden] > span').first();
  expect(await dot.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
});

test('a muted character still delivers changes asked of their own media', async ({ page }) => {
  test.setTimeout(30_000);
  await page.getByRole('button', { name: 'Mute Iris' }).click();
  const cover = page.getByRole('group', { name: 'Image: Cover art, late trains' });
  await cover.getByRole('button', { name: 'Make changes' }).click();
  await expect(page.getByRole('button', { name: /then apply them\s*, started/ })).toBeVisible();
  const edit = page.getByRole('group', { name: /Edit: Cover art, late trains/ });
  await expect(edit).toContainText('Ready to review', { timeout: 9000 });
  await edit.getByRole('button', { name: 'Apply edits' }).click();
  await expect(page.getByRole('button', { name: /then apply them\s*, done/ })).toBeVisible();
});

test('sidebars collapse to rails, by button and by shortcut, keeping focus', async ({ page }) => {
  const hideChats = page.getByRole('button', { name: 'Hide chats' });
  await expect(hideChats).toHaveAttribute('aria-expanded', 'true');
  await hideChats.click();
  const showChats = page.getByRole('button', { name: 'Show chats' });
  await expect(showChats).toBeFocused();
  await expect(showChats).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Sunday market vlog' })).toHaveCount(0);
  await expect.poll(async () => Math.round((await page.getByRole('navigation', { name: 'Chats' }).boundingBox())!.width)).toBe(64);

  await page.keyboard.press('Control+.');
  await expect(page.getByRole('button', { name: 'Show cast' })).toBeVisible();
  await page.getByRole('button', { name: 'Iris, Visual director' }).click();
  await expect(page.getByRole('button', { name: 'Mute Iris' })).toBeFocused();

  await page.keyboard.press('Control+b');
  await expect(page.getByRole('button', { name: 'Hide chats' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Hide chats' })).toBeVisible();
});

test('1100: the cast is a rail that opens the drawer', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.getByRole('button', { name: 'Made in this chat, 3 items' }).click();
  const drawer = page.getByRole('dialog', { name: 'In this chat' });
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
});

test('three chats: switch, apply the album edit, background reply marks unread', async ({ page }) => {
  test.setTimeout(30_000);
  const album = page.getByRole('button', { name: /^Album cover ideas/ });
  await expect(album).toContainText('new reply');
  await album.click();
  await expect(page.locator('main h1')).toHaveText('Album cover ideas');
  await expect(album).not.toContainText('new reply');
  const edit = page.getByRole('group', { name: /Edit: EP cover, night radio/ });
  await edit.getByRole('button', { name: 'Apply edits' }).click();
  await expect(page.getByRole('group', { name: 'Image: EP cover, night radio' }).locator('img')).toHaveAttribute('src', '/assets/night-radio-grain.svg');

  await page.locator('#message-box').fill('@Iris love it');
  await page.locator('#message-box').press('Enter');
  await expect(page.getByRole('log').getByText('Today')).toBeVisible();
  await page.getByRole('button', { name: /^Sunday market vlog/ }).click();
  await expect(page.locator('main h1')).toHaveText('Sunday market vlog');
  await expect(page.getByRole('complementary', { name: 'Cast' })).toContainText('4 items');
  await expect(album).toContainText('new reply', { timeout: 5000 });
  await album.click();
  await expect(page.getByRole('log').getByText(/title sit at the top|amber dial|window lit/)).toBeVisible();
});
