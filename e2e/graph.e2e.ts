import { test, expect } from '@playwright/test';

test('TC-E2E-GRAPH-01 图知识页：正文+互动图/BFS 队列遍历/重置', async ({ page }) => {
  await page.goto('/docs/graph');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('图');
  await expect(page.locator('.playground')).toBeVisible();

  // 互动图根（菜单也用 .btn，全部限定在 .graph-viz 内）
  const viz = page.locator('.graph-viz');
  const bfs = viz.locator('.btn', { hasText: 'BFS' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 6 顶点 + 7 边
  await expect(viz.locator('.vertex')).toHaveCount(6);
  await expect(viz.locator('.edge')).toHaveCount(7);

  // 点 BFS → 解说含「队列」+ 访问顺序 A B C D E F
  await bfs.click();
  await expect(viz.locator('.status')).toContainText('队列');
  await expect(viz.locator('.status')).toContainText('A B C D E F');

  // 重置（可中断动画）→ 解说回到起点提示
  await reset.click();
  await expect(viz.locator('.status')).toContainText('起点');
});
