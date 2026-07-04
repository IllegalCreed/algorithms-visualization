import { test, expect } from '@playwright/test';

test('TC-E2E-GCD-01 欧几里得全模板：正文 + 矩形铺砖 / 拖到末步 gcd=6', async ({ page }) => {
  await page.goto('/docs/gcd');

  // 全模板①：介绍正文 Article（h1 含「欧几里得」或「公约数」）
  await expect(page.locator('.article h1')).toContainText(/欧几里得|公约数/);

  // 全模板②③：铺砖轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.gcd-view')).toBeVisible();
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

  // 拖到末步 → 4 个正方形铺满 + 收尾字幕含 gcd 6
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.gcd-square')).toHaveCount(4);
  await expect(page.locator('.caption')).toContainText('6');
});
