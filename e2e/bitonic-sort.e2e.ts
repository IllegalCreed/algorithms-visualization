import { test, expect } from '@playwright/test';

test('TC-E2E-BN-01 双调排序全模板：比较器网络 / 拖到末步 有序', async ({ page }) => {
  await page.goto('/docs/bitonic-sort');

  // 全模板①：介绍正文 Article（h1 含「双调」）
  await expect(page.locator('.article h1')).toContainText('双调');

  // 全模板②③：网络轨（8 wire 24 比较器）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.network-view')).toBeVisible();
  await expect(page.locator('.net-wire')).toHaveCount(8);
  await expect(page.locator('.net-comp')).toHaveCount(24);
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

  // 拖到末步 → wire 值升序 1..8 + 字幕含 6（拍）
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  const vals = await page.locator('.net-val').allTextContents();
  expect(vals.map(Number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  await expect(page.locator('.caption')).toContainText('6');
});
