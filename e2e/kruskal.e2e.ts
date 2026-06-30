import { test, expect } from '@playwright/test';

test('TC-E2E-KRUSKAL-01 Kruskal 最小生成树页：正文+互动/单步判环走到底/重置', async ({ page }) => {
  await page.goto('/docs/kruskal');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('Kruskal');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动 MST（菜单也用 .btn，全部限定在 .kruskal-viz 内）
  const viz = page.locator('.kruskal-viz');
  const next = viz.locator('.btn', { hasText: '下一步' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 6 个顶点 + 9 条边渲染
  await expect(viz.locator('.kvert')).toHaveCount(6);
  await expect(viz.locator('.kedge')).toHaveCount(9);

  // 连点下一步 9 次走到底 → MST 5 条、总权 18
  for (let i = 0; i < 9; i++) await next.click();
  await expect(viz.locator('.kedge.mst')).toHaveCount(5);
  await expect(viz.locator('.status')).toContainText('18');

  // 重置 → MST 清空
  await reset.click();
  await expect(viz.locator('.kedge.mst')).toHaveCount(0);
});
