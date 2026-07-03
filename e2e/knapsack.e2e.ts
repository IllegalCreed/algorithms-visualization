import { test, expect } from '@playwright/test';

test('TC-E2E-KNAP-01 0-1 背包全模板：正文 + DP 表 5×6/拖到末步右下角=7', async ({ page }) => {
  await page.goto('/docs/knapsack');

  // 全模板①：介绍正文 Article（h1 含「背包」）
  await expect(page.locator('.article h1')).toContainText('背包');

  // 全模板②③：矩阵轨 DP 表 + 代码播放器——30 单元 + 默认停第 0 步
  await expect(page.locator('.matrix-view')).toBeVisible();
  await expect(page.locator('.matrix-cell')).toHaveCount(30);
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

  // 拖到末步 → 右下角 = 最优值 7 + 收尾字幕含「7」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('7');
  await expect(page.locator('.matrix-cell').last()).toHaveText('7');
});
