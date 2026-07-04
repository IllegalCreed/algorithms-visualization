import { test, expect } from '@playwright/test';

test('TC-E2E-AS-01 A* 寻路全模板：迷宫轨 f 值 / 拖到末步 10 vs 22', async ({ page }) => {
  await page.goto('/docs/astar');

  // 全模板①：介绍正文 Article（h1 含「A*」）
  await expect(page.locator('.article h1')).toContainText('A*');

  // 全模板②③：迷宫轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.maze-view')).toBeVisible();
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

  // 拖到末步 → 字幕含 10 与 22 对比
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('10');
  await expect(page.locator('.caption')).toContainText('22');
});
