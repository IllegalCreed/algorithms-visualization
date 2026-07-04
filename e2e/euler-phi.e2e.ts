import { test, expect } from '@playwright/test';

test('TC-E2E-PHI-01 欧拉函数全模板：互质筛网格 / 拖到末步 φ(12)=4', async ({ page }) => {
  await page.goto('/docs/euler-phi');

  // 全模板①：介绍正文 Article（h1 含「欧拉函数」）
  await expect(page.locator('.article h1')).toContainText('欧拉函数');

  // 全模板②③：数字网格轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.sieve-view')).toBeVisible();
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

  // 拖到末步 → 字幕含 φ(12) = 4
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('φ(12) = 4');
});
