import { test, expect } from '@playwright/test';

test('TC-E2E-PERMUTE-01 全排列全模板：正文 + 多叉决策树/DFS 回溯/拖到末步 6 排列叶', async ({
  page,
}) => {
  await page.goto('/docs/permutations');

  // 全模板①：介绍正文 Article（h1 含「排列」）
  await expect(page.locator('.article h1')).toContainText('排列');

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

  // 拖到末步 → 6 个排列叶（.solution）+ 收尾字幕含「枚举」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.dtree-node.solution')).toHaveCount(6);
  await expect(page.locator('.caption')).toContainText('枚举');
});
