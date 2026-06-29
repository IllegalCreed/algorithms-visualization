import { test, expect } from '@playwright/test';

test('TC-E2E-SEG-01 线段树知识页：正文+互动线段树/区间和/单点更新/重置', async ({ page }) => {
  await page.goto('/docs/segment-tree');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('线段树');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动线段树（菜单也用 .btn，全部限定在 .seg-tree-viz 内）
  const viz = page.locator('.seg-tree-viz');
  const range = viz.locator('.btn', { hasText: '区间和' });
  const update = viz.locator('.btn', { hasText: '更新' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 二叉树节点渲染（15 个）
  await expect(viz.locator('.seg-node')).toHaveCount(15);

  // 区间和 [2,5] → status 含 17，取用 2 个整段点亮
  await viz.locator('.in-a').fill('2');
  await viz.locator('.in-b').fill('5');
  await range.click();
  await expect(viz.locator('.status')).toContainText('17');
  await expect(viz.locator('.seg-node.covered')).toHaveCount(2);

  // 单点更新 第2个→10 → status 含「更新」，路径点亮 4 个，根出现 46
  await viz.locator('.in-a').fill('2');
  await viz.locator('.in-b').fill('10');
  await update.click();
  await expect(viz.locator('.status')).toContainText('更新');
  await expect(viz.locator('.seg-node.onpath')).toHaveCount(4);

  // 重置 → 解说复位、高亮清空
  await reset.click();
  await expect(viz.locator('.status')).toContainText('已重置');
  await expect(viz.locator('.seg-node.covered')).toHaveCount(0);
});
