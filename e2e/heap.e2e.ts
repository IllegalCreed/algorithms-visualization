import { test, expect } from '@playwright/test';

test('TC-E2E-HEAPDS-01 堆知识页：正文+互动堆/数组+树双视图/输入插入上浮/重置', async ({ page }) => {
  await page.goto('/docs/heap');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('堆');
  await expect(page.locator('.playground')).toBeVisible();

  // 互动堆根（菜单也用 .btn，全部限定在 .heap-viz 内）
  const viz = page.locator('.heap-viz');
  const insert = viz.locator('.btn', { hasText: '插入' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 7 格数组 + 7 个树节点（同一个堆，双视图）
  await expect(viz.locator('.cell')).toHaveCount(7);
  await expect(viz.locator('.node')).toHaveCount(7);

  // 输入 95 插入 → 数组+树各 8，且出现值 95（上浮到位）
  await viz.locator('.val-input').fill('95');
  await insert.click();
  await expect(viz.locator('.cell')).toHaveCount(8);
  await expect(viz.locator('.node')).toHaveCount(8);
  await expect(viz.locator('.cell', { hasText: '95' })).toHaveCount(1);
  await expect(viz.locator('.status')).toContainText('上浮');

  // 重置（可中断动画）→ 回到 7 格
  await reset.click();
  await expect(viz.locator('.cell')).toHaveCount(7);
  await expect(viz.locator('.node')).toHaveCount(7);
});
