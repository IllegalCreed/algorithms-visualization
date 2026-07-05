import { test, expect } from '@playwright/test';

test('TC-E2E-EU-01 欧拉路径全模板：消边图轨 / 拖到末步 O(E)', async ({ page }) => {
  await page.goto('/docs/euler-path');

  // 全模板①：介绍正文 Article（h1 含「欧拉」）
  await expect(page.locator('.article h1')).toContainText('欧拉');

  // 全模板②③：图轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.graph-view')).toBeVisible();
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

  // 拖到末步 → 字幕含 O(E)
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('O(E)');
});
