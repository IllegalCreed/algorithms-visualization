import { test, expect } from '@playwright/test';

test('TC-E2E-FLOYD-01 Floyd 全模板：正文 + 矩阵轨 4×4/拖到末步全源最短距离矩阵', async ({
  page,
}) => {
  await page.goto('/docs/floyd-warshall');

  // 全模板①：介绍正文 Article（h1 含「Floyd」）
  await expect(page.locator('.article h1')).toContainText('Floyd');

  // 全模板②③：矩阵轨可视化 + 代码播放器——16 单元 + 默认停第 0 步
  await expect(page.locator('.matrix-view')).toBeVisible();
  await expect(page.locator('.matrix-cell')).toHaveCount(16);
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 图算法无柱数组 → 不渲染主柱轨
  await expect(page.locator('.bars-view')).toHaveCount(0);

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 全源最短距离矩阵定 + 收尾字幕
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('最短');
  // 末步矩阵无 ∞（全点对可达）
  await expect(page.locator('.matrix-cell', { hasText: '∞' })).toHaveCount(0);
});
