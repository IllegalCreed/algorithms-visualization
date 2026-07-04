import { test, expect } from '@playwright/test';

test('TC-E2E-CP-01 最近点对全模板：分治 δ 带 / 拖到末步 1.118', async ({ page }) => {
  await page.goto('/docs/closest-pair');

  // 全模板①：介绍正文 Article（h1 含「最近点对」）
  await expect(page.locator('.article h1')).toContainText('最近点对');

  // 全模板②③：点平面轨（8 点）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.hull-view')).toBeVisible();
  await expect(page.locator('.hull-point')).toHaveCount(8);
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

  // 拖到末步 → 最近对绿线（存在性断言，避免零面积 bbox）+ 字幕含 1.118
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.hull-best')).toHaveCount(1);
  await expect(page.locator('.caption')).toContainText('1.118');
});
