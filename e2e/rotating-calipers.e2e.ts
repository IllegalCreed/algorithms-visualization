import { test, expect } from '@playwright/test';

test('TC-E2E-RC-01 旋转卡壳全模板：凸包 + 卡壳 / 拖到末步 直径 6', async ({ page }) => {
  await page.goto('/docs/rotating-calipers');

  // 全模板①：介绍正文 Article（h1 含「旋转卡壳」）
  await expect(page.locator('.article h1')).toContainText('旋转卡壳');

  // 全模板②③：点平面轨（7 点 + 凸包多边形常显）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.hull-view')).toBeVisible();
  await expect(page.locator('.hull-point')).toHaveCount(7);
  await expect(page.locator('.hull-polygon')).toBeVisible();
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

  // 拖到末步 → 最远点对绿线（水平线零高度 bbox，用存在性断言）+ 收尾字幕含直径 6
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.hull-best')).toHaveCount(1);
  await expect(page.locator('.caption')).toContainText('6');
});
