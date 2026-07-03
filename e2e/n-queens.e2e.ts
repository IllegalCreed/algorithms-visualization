import { test, expect } from '@playwright/test';

test('TC-E2E-QUEENS-01 N 皇后全模板：正文 + 棋盘 4×4/回溯求解/拖到末步 4 皇后', async ({
  page,
}) => {
  await page.goto('/docs/n-queens');

  // 全模板①：介绍正文 Article（h1 含「皇后」）
  await expect(page.locator('.article h1')).toContainText('皇后');

  // 全模板②③：棋盘轨 + 代码播放器——16 格 + 默认停第 0 步
  await expect(page.locator('.board-view')).toBeVisible();
  await expect(page.locator('.board-cell')).toHaveCount(16);
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

  // 拖到末步 → 4 个皇后（解）+ 收尾字幕含「解」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.board-queen')).toHaveCount(4);
  await expect(page.locator('.caption')).toContainText('解');
});
