import { test, expect } from '@playwright/test';

test('TC-E2E-LIS-01 LIS 全模板：正文 + 一维 DP 两行表/拖到末步 LIS 高亮 + 1→3→4→5', async ({
  page,
}) => {
  await page.goto('/docs/lis');

  // 全模板①：介绍正文 Article（h1 含「递增子序列」）
  await expect(page.locator('.article h1')).toContainText('递增子序列');

  // 全模板②③：矩阵轨（2×6 = 12 单元）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.matrix-view')).toBeVisible();
  await expect(page.locator('.matrix-cell')).toHaveCount(12);
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

  // 拖到末步 → LIS 高亮（.mx-path ≥4）+ 收尾字幕含「1→3→4→5」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  expect(await page.locator('.matrix-cell.mx-path').count()).toBeGreaterThanOrEqual(4);
  await expect(page.locator('.caption')).toContainText('1→3→4→5');
});
