import { test, expect } from '@playwright/test';

test('TC-E2E-SDK-01 数独全模板：正文 + 4×4 盘 / 拖到末步整盘填满', async ({ page }) => {
  await page.goto('/docs/sudoku');

  // 全模板①：介绍正文 Article（h1 含「数独」）
  await expect(page.locator('.article h1')).toContainText('数独');

  // 全模板②③：数独轨（4×4=16 格）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.sudoku-view')).toBeVisible();
  await expect(page.locator('.sudoku-cell')).toHaveCount(16);
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 无柱数组 → 不渲染主柱轨
  await expect(page.locator('.bars-view')).toHaveCount(0);

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 整盘 16 格全有数字（无空格）+ 收尾字幕含「完成」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  const nonEmpty = await page
    .locator('.sudoku-cell')
    .evaluateAll((cells) => cells.filter((c) => (c.textContent ?? '').trim() !== '').length);
  expect(nonEmpty).toBe(16);
  await expect(page.locator('.caption')).toContainText('完成');
});
