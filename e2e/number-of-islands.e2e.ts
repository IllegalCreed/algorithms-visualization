import { test, expect } from '@playwright/test';

test('TC-E2E-ISL-01 岛屿数量全模板：正文 + 4×4 网格 / 拖到末步 6 绿陆地 + 3 个岛', async ({
  page,
}) => {
  await page.goto('/docs/number-of-islands');

  // 全模板①：介绍正文 Article（h1 含「岛屿」）
  await expect(page.locator('.article h1')).toContainText('岛屿');

  // 全模板②③：网格轨 4×4 + 代码播放器——16 格 + 默认停第 0 步
  await expect(page.locator('.maze-view')).toBeVisible();
  await expect(page.locator('.maze-cell')).toHaveCount(16);
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

  // 拖到末步 → 全部陆地标绿（6 格 .mz-solution）+ 收尾字幕含「3」个岛屿
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.mz-solution')).toHaveCount(6);
  await expect(page.locator('.caption')).toContainText('3');
});
