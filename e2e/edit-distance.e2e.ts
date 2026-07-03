import { test, expect } from '@playwright/test';

test('TC-E2E-EDIT-01 编辑距离全模板：正文 + DP 表 4×4/拖到末步右下角=2', async ({ page }) => {
  await page.goto('/docs/edit-distance');

  // 全模板①：介绍正文 Article（h1 含「编辑距离」）
  await expect(page.locator('.article h1')).toContainText('编辑距离');

  // 全模板②③：矩阵轨 DP 表 + 代码播放器——16 单元 + 默认停第 0 步
  await expect(page.locator('.matrix-view')).toBeVisible();
  await expect(page.locator('.matrix-cell')).toHaveCount(16);
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

  // 拖到末步 → 右下角 = 编辑距离 2 + 收尾字幕含「2」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('2');
  // 末步右下角单元（最后一个 .matrix-cell）= 2
  await expect(page.locator('.matrix-cell').last()).toHaveText('2');
});
