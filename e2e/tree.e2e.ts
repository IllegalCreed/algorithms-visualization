import { test, expect } from '@playwright/test';

test('TC-E2E-TREE-01 树知识页：正文+互动 BST/输入插入走位/中序=升序/重置', async ({ page }) => {
  await page.goto('/docs/tree');

  // 正文标题（限定文章内 h1）+ 互动外框可见（树页现有两个 Playground，取首个）
  await expect(page.locator('.article h1')).toContainText('树');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动 BST 根（菜单也用 .btn，全部限定在 .tree-viz 内）
  const viz = page.locator('.tree-viz');
  const insert = viz.locator('.btn', { hasText: '插入' });
  const inorder = viz.locator('.btn', { hasText: '中序遍历' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始平衡树 7 节点
  await expect(viz.locator('.node')).toHaveCount(7);

  // 输入 35 插入 → 8 节点，且出现值 35 的节点（走位落到正确空位）
  await viz.locator('.val-input').fill('35');
  await insert.click();
  await expect(viz.locator('.node')).toHaveCount(8);
  await expect(viz.locator('.node', { hasText: '35' })).toHaveCount(1);
  await expect(viz.locator('.status')).toContainText('O(log n)');

  // 中序遍历 → 解说升序序列（插入 35 后，35 排到 30 与 40 之间，仍升序）
  await inorder.click();
  await expect(viz.locator('.status')).toContainText('20 30 35 40 50 60 70 80');

  // 重置 → 回到 7 节点
  await reset.click();
  await expect(viz.locator('.node')).toHaveCount(7);
});

test('TC-E2E-TREE-02 树知识页·平衡节：退化↔平衡对照 + 查找走位', async ({ page }) => {
  await page.goto('/docs/tree');

  // 平衡互动件（与 BST 互动件同页，限定 .bal-viz 作用域）
  const bal = page.locator('.bal-viz');
  const toBalanced = bal.locator('.btn', { hasText: '平衡' });
  const find = bal.locator('.btn', { hasText: '查找' });

  // 初始退化：7 节点 + 读数含「7 层」
  await expect(bal.locator('.node')).toHaveCount(7);
  await expect(bal.locator('.readout')).toContainText('7 层');

  // 切平衡 → 读数变「3 层」
  await toBalanced.click();
  await expect(bal.locator('.readout')).toContainText('3 层');

  // 查找 7（平衡）→ 解说含「3 步」
  await find.click();
  await expect(bal.locator('.status')).toContainText('3 步');
});
