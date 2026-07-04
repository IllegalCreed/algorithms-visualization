import { test, expect } from '@playwright/test';

test('TC-E2E-BS-01 二分查找全模板：主柱轨 + 三箭头 / 拖到末步 O(log n)', async ({ page }) => {
  await page.goto('/docs/binary-search');

  // 全模板①：介绍正文 Article（h1 含「二分查找」）
  await expect(page.locator('.article h1')).toContainText('二分查找');

  // 全模板②③：主柱轨（本页有柱！）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.bars-view')).toBeVisible();
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 字幕含 O(log n)
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('O(log n)');
});
