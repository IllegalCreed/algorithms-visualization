import { test, expect } from '@playwright/test';

test('TC-E2E-HG-01 匈牙利算法全模板：二分图轨 / 拖到末步匹配 3', async ({ page }) => {
  await page.goto('/docs/hungarian');

  // 全模板①：介绍正文 Article（h1 含「匈牙利」）
  await expect(page.locator('.article h1')).toContainText('匈牙利');

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

  // 拖到末步 → 字幕含最大匹配 3
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('3');
  await expect(page.locator('.caption')).toContainText('最大流');
});
