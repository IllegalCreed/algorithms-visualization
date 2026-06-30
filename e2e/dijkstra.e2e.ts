import { test, expect } from '@playwright/test';

test('TC-E2E-DIJKSTRA-01 Dijkstra 最短路页：正文+互动带权图/单步松弛走到底/重置', async ({
  page,
}) => {
  await page.goto('/docs/dijkstra');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('Dijkstra');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动带权图（菜单也用 .btn，全部限定在 .dijkstra-viz 内）
  const viz = page.locator('.dijkstra-viz');
  const next = viz.locator('.btn', { hasText: '下一步' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 6 个顶点渲染
  await expect(viz.locator('.dvert')).toHaveCount(6);

  // 连点下一步 6 次走到底
  for (let i = 0; i < 6; i++) await next.click();
  await expect(viz.locator('.dvert.settled')).toHaveCount(6);
  await expect(viz.locator('.status')).toContainText('最短');
  await expect(viz.locator('.status')).toContainText('9');

  // 重置 → 确定点清空
  await reset.click();
  await expect(viz.locator('.dvert.settled')).toHaveCount(0);
});
