import { test, expect } from '@playwright/test';

test('TC-E2E-COMBSUM-01 组合总和全模板：正文 + 决策树剪枝/拖到末步 剪枝支+解叶', async ({
  page,
}) => {
  await page.goto('/docs/combination-sum');

  // 全模板①：介绍正文 Article（h1 含「组合」）
  await expect(page.locator('.article h1')).toContainText('组合');

  // 全模板②③：决策树轨 + 代码播放器——≥6 节点 + 默认停第 0 步
  await expect(page.locator('.dtree-view')).toBeVisible();
  expect(await page.locator('.dtree-node').count()).toBeGreaterThanOrEqual(6);
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 无柱数组 → 不渲染主柱轨
  await expect(page.locator('.bars-view')).toHaveCount(0);

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 剪枝支（.pruned）+ 2 个解叶（.solution）+ 收尾字幕含「组合」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  expect(await page.locator('.dtree-node.pruned').count()).toBeGreaterThanOrEqual(1);
  await expect(page.locator('.dtree-node.solution')).toHaveCount(2);
  await expect(page.locator('.caption')).toContainText('组合');
});
