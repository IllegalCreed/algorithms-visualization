import { test, expect } from '@playwright/test';

test('TC-E2E-LINK-01 链表知识页：正文+互动链表/点节点选中/选中后插入/头插/重置', async ({
  page,
}) => {
  await page.goto('/docs/link');

  // 正文标题（限定文章内 h1）+ 互动外框可见（两个 Playground：单链表 + 双向链表，取首个）
  await expect(page.locator('.article h1')).toContainText('链表');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动链表根（菜单也用 .btn，全部限定在 .link-viz 内）
  const viz = page.locator('.link-viz');
  const insert = viz.locator('.btn', { hasText: '插入' });
  const prepend = viz.locator('.btn', { hasText: '头插' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 3 节点 + head + null
  await expect(viz.locator('.node')).toHaveCount(3);
  await expect(viz.locator('.head')).toBeVisible();
  await expect(viz.locator('.nullbox')).toBeVisible();

  // 点第 2 个节点（index 1，值 2）选中
  await viz.locator('.node').nth(1).locator('.box').click();
  await expect(viz.locator('.node').nth(1)).toHaveClass(/is-sel/);

  // 在选中后插入 → 4 节点；新节点值 4 落在选中之后（index 2）
  await insert.click();
  await expect(viz.locator('.node')).toHaveCount(4);
  await expect(viz.locator('.node').nth(2).locator('.box')).toHaveText('4');
  await expect(viz.locator('.status')).toContainText('O(1)');

  // 头插 → 5 节点；新节点 5 落表头（index 0）
  await prepend.click();
  await expect(viz.locator('.node')).toHaveCount(5);
  await expect(viz.locator('.node').nth(0).locator('.box')).toHaveText('5');

  // 重置 → 回到初始 3 节点、无选中
  await reset.click();
  await expect(viz.locator('.node')).toHaveCount(3);
  await expect(viz.locator('.node').nth(0).locator('.box')).toHaveText('1');
  await expect(viz.locator('.node.is-sel')).toHaveCount(0);
});

test('TC-E2E-LINK-02 双向链表节：4 节点/反向遍历/点节点 O(1) 删除/重置', async ({ page }) => {
  await page.goto('/docs/link');

  // 限定双向链表互动根（与单链表 .link-viz 同页，作用域隔离）
  const viz = page.locator('.dlink-viz');
  const reverse = viz.locator('.btn', { hasText: '反向' });
  const remove = viz.locator('.btn', { hasText: '删除' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 4 节点（双向链）+ head + tail
  await expect(viz.locator('.dnode')).toHaveCount(4);
  await expect(viz.locator('.danchor.head')).toBeVisible();
  await expect(viz.locator('.danchor.tail')).toBeVisible();

  // 点首个节点选中 → O(1) 删除（节点自带 prev，无需找前驱）→ 3 节点、解说含 O(1)
  await viz.locator('.dnode').nth(0).locator('.box').click();
  await remove.click();
  await expect(viz.locator('.dnode')).toHaveCount(3);
  await expect(viz.locator('.status')).toContainText('O(1)');

  // 反向遍历（沿 prev 从 tail 往回）→ 解说含「反向」；走位期间工具栏锁住
  await reverse.click();
  await expect(viz.locator('.status')).toContainText('反向');

  // 重置（自动等反向遍历结束后按钮可点）→ 回到 4 节点
  await reset.click();
  await expect(viz.locator('.dnode')).toHaveCount(4);
});
