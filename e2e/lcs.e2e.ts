import { test, expect } from '@playwright/test';

test('TC-E2E-LCS-01 LCS 全模板：正文 + DP 填表/回溯恢复解/拖到末步 路径绿 + ACD', async ({
  page,
}) => {
  await page.goto('/docs/lcs');

  // 全模板①：介绍正文 Article（h1 含「子序列」）
  await expect(page.locator('.article h1')).toContainText('子序列');

  // 全模板②③：矩阵轨 + 代码播放器——5×5 = 25 单元 + 默认停第 0 步
  await expect(page.locator('.matrix-view')).toBeVisible();
  await expect(page.locator('.matrix-cell')).toHaveCount(25);
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

  // 拖到末步 → 回溯路径绿环（.mx-path ≥3）+ 收尾字幕含 LCS「ACD」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  expect(await page.locator('.matrix-cell.mx-path').count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator('.caption')).toContainText('ACD');
});
