import { test, expect } from '@playwright/test';

test('TC-E2E-MAZE-01 迷宫寻路全模板：正文 + 网格 DFS 回溯/拖到末步 解路径绿', async ({ page }) => {
  await page.goto('/docs/maze');

  // 全模板①：介绍正文 Article（h1 含「迷宫」）
  await expect(page.locator('.article h1')).toContainText('迷宫');

  // 全模板②③：迷宫轨 + 代码播放器——25 格 + 默认停第 0 步
  await expect(page.locator('.maze-view')).toBeVisible();
  await expect(page.locator('.maze-cell')).toHaveCount(25);
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

  // 拖到末步 → 解路径整条变绿（.mz-solution ≥2）+ 收尾字幕含「路径」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  expect(await page.locator('.mz-solution').count()).toBeGreaterThanOrEqual(2);
  await expect(page.locator('.caption')).toContainText('路径');
});
