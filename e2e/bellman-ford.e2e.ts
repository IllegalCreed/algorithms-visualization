import { test, expect } from '@playwright/test';

test('TC-E2E-BELLMAN-01 Bellman-Ford 全模板：正文 + 图轨 5 点 7 边（含负权）/拖到末步最短路树 4 绿边', async ({
  page,
}) => {
  await page.goto('/docs/bellman-ford');

  // 全模板①：介绍正文 Article（h1 含「Bellman」）
  await expect(page.locator('.article h1')).toContainText('Bellman');

  // 全模板②③：图轨可视化 + 代码播放器——5 节点 7 边 + 默认停第 0 步
  await expect(page.locator('.graph-view')).toBeVisible();
  await expect(page.locator('.graph-node')).toHaveCount(5);
  await expect(page.locator('.graph-edge')).toHaveCount(7);
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

  // 拖到末步 → 最短路树 4 条绿边 + 5 点全确定 + 收尾字幕含 dist
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.graph-edge.tree')).toHaveCount(4);
  await expect(page.locator('.graph-node.done')).toHaveCount(5);
  await expect(page.locator('.caption')).toContainText('最短路');
});
