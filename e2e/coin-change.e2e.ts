import { test, expect } from '@playwright/test';

test('TC-E2E-CC-01 硬币找零方案数全模板：正文 + DP 表 4×6 / 拖到末步右下角=4', async ({ page }) => {
  await page.goto('/docs/coin-change');

  // 全模板①：介绍正文 Article（h1 含「硬币」）
  await expect(page.locator('.article h1')).toContainText('硬币');

  // 全模板②③：矩阵轨 DP 表 + 代码播放器——24 单元 + 默认停第 0 步
  await expect(page.locator('.matrix-view')).toBeVisible();
  await expect(page.locator('.matrix-cell')).toHaveCount(24);
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

  // 拖到末步 → 右下角 = 方案数 4 + 收尾字幕含「4」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('4');
  await expect(page.locator('.matrix-cell').last()).toHaveText('4');
});
