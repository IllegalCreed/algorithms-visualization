import { test, expect } from '@playwright/test';

test('TC-E2E-DIJKSTRA-01 Dijkstra 全模板：正文 + 图轨 6 点 9 边/拖到末步整棵最短路树', async ({
  page,
}) => {
  await page.goto('/docs/dijkstra');

  // 全模板①：介绍正文 Article（h1 含「Dijkstra」）
  await expect(page.locator('.article h1')).toContainText('Dijkstra');

  // 全模板②③：图轨可视化 + 代码播放器——6 节点 9 边 + 默认停第 0 步
  await expect(page.locator('.graph-view')).toBeVisible();
  await expect(page.locator('.graph-node')).toHaveCount(6);
  await expect(page.locator('.graph-edge')).toHaveCount(9);
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

  // 拖到末步 → 6 点全确定（绿）+ 最短路树 5 条绿边 + 收尾字幕含「最短」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.graph-node.done')).toHaveCount(6);
  await expect(page.locator('.graph-edge.tree')).toHaveCount(5);
  await expect(page.locator('.caption')).toContainText('最短');
});
