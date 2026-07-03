import { test, expect } from '@playwright/test';

test('TC-E2E-PRIM-01 Prim 全模板：正文 + 图轨 6 点 9 边/从 A 生长/拖到末步 MST 5 绿边总权 18', async ({
  page,
}) => {
  await page.goto('/docs/prim');

  // 全模板①：介绍正文 Article（h1 含「Prim」）
  await expect(page.locator('.article h1')).toContainText('Prim');

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

  // 拖到末步 → MST 5 条绿边 + 6 点全并入树 + 收尾字幕含「18」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.graph-edge.mst')).toHaveCount(5);
  await expect(page.locator('.graph-node.done')).toHaveCount(6);
  await expect(page.locator('.caption')).toContainText('18');
});
