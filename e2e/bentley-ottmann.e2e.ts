import { test, expect } from '@playwright/test';

test('TC-E2E-BO-01 扫描线求交全模板：点平面轨 / 拖到末步 3 个交点', async ({ page }) => {
  await page.goto('/docs/bentley-ottmann');

  // 全模板①：介绍正文 Article（h1 含「扫描线」）
  await expect(page.locator('.article h1')).toContainText('扫描线');

  // 全模板②③：点平面轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.hull-view')).toBeVisible();
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

  // 拖到末步 → 字幕报 3 个交点；交点红标 3 个
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('3 个交点');
  await expect(page.locator('.hull-mark')).toHaveCount(3);
});
