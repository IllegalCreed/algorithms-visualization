import { test, expect } from '@playwright/test';

test('TC-E2E-CH-01 凸包全模板：正文 + 点平面 / 拖到末步 凸包多边形', async ({ page }) => {
  await page.goto('/docs/convex-hull');

  // 全模板①：介绍正文 Article（h1 含「凸包」）
  await expect(page.locator('.article h1')).toContainText('凸包');

  // 全模板②③：点平面轨（7 点）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.hull-view')).toBeVisible();
  await expect(page.locator('.hull-point')).toHaveCount(7);
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

  // 拖到末步 → 凸包多边形出现 + 收尾字幕含 6
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.hull-polygon')).toBeVisible();
  await expect(page.locator('.caption')).toContainText('6');
});
