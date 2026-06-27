import { test, expect } from '@playwright/test';

test('TC-E2E-UF-01 并查集知识页：正文+互动并查集/合并/连通判定/重置', async ({ page }) => {
  await page.goto('/docs/union-find');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('并查集');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动并查集根（菜单也用 .btn，全部限定在 .union-find-viz 内）
  const viz = page.locator('.union-find-viz');
  const merge = viz.locator('.btn', { hasText: '合并' });
  const conn = viz.locator('.btn', { hasText: '连通' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 固定 8 节点、初始 8 组
  await expect(viz.locator('.ufnode')).toHaveCount(8);
  await expect(viz.locator('.readout')).toContainText('8');

  // 合并 0 和 1 → 组数变 7，多一条父指针箭头
  await viz.locator('.val-input').nth(0).fill('0');
  await viz.locator('.val-input').nth(1).fill('1');
  await merge.click();
  await expect(viz.locator('.readout')).toContainText('7');
  await expect(viz.locator('.uf-edge')).toHaveCount(1);

  // 连通? 0 和 1 → 同根、连通
  await conn.click();
  await expect(viz.locator('.status')).toContainText('同根');

  // 重置 → 回到 8 组、无箭头
  await reset.click();
  await expect(viz.locator('.readout')).toContainText('8');
  await expect(viz.locator('.uf-edge')).toHaveCount(0);
});
