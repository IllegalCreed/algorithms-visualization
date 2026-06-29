import { test, expect } from '@playwright/test';

test('TC-E2E-BTREE-01 B+ 树知识页：正文+互动 B+ 树/查找下钻/范围叶链扫/重置', async ({ page }) => {
  await page.goto('/docs/b-tree');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('B 树');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动 B+ 树（菜单也用 .btn，全部限定在 .b-tree-viz 内）
  const viz = page.locator('.b-tree-viz');
  const search = viz.locator('.btn', { hasText: '查找' });
  const range = viz.locator('.btn', { hasText: '范围' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 节点渲染（4：root + 3 叶）
  await expect(viz.locator('.bt-node')).toHaveCount(4);

  // 查找 30 → 命中（下钻命中后 status 含「找到了」）
  await viz.locator('.in-a').fill('30');
  await search.click();
  await expect(viz.locator('.status')).toContainText('找到了');

  // 范围查 12..38 → 叶链横扫（status 含「扫到」）
  await viz.locator('.in-a').fill('12');
  await viz.locator('.in-b').fill('38');
  await range.click();
  await expect(viz.locator('.status')).toContainText('扫到');
  await expect(viz.locator('.bt-key.inrange')).toHaveCount(5);

  // 重置 → 解说复位、高亮清空
  await reset.click();
  await expect(viz.locator('.status')).toContainText('已重置');
  await expect(viz.locator('.bt-key.inrange')).toHaveCount(0);
});
