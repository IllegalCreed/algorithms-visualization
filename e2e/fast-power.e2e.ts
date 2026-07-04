import { test, expect } from '@playwright/test';

test('TC-E2E-FP-01 快速幂全模板：正文 + 幂块行 / 拖到末步 3^13=1594323', async ({ page }) => {
  await page.goto('/docs/fast-power');

  // 全模板①：介绍正文 Article（h1 含「快速幂」）
  await expect(page.locator('.article h1')).toContainText('快速幂');

  // 全模板②③：幂块轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.power-view')).toBeVisible();
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

  // 拖到末步 → 4 个幂块 + 收尾字幕含 1594323
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.power-block')).toHaveCount(4);
  await expect(page.locator('.caption')).toContainText('1594323');
});
