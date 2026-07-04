import { test, expect } from '@playwright/test';

test('TC-E2E-LS-01 线性筛全模板：正文 + 数字网格 spf 角标 / 拖到末步 10 素数', async ({ page }) => {
  await page.goto('/docs/linear-sieve');

  // 全模板①：介绍正文 Article（h1 含「线性筛」）
  await expect(page.locator('.article h1')).toContainText('线性筛');

  // 全模板②③：筛轨（30 格）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.sieve-view')).toBeVisible();
  await expect(page.locator('.sieve-cell')).toHaveCount(30);
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

  // 拖到末步 → 10 个素数 + 合数带 spf 角标 + 收尾字幕含 10
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.sieve-prime')).toHaveCount(10);
  await expect(page.locator('.sieve-spf').first()).toBeVisible();
  await expect(page.locator('.caption')).toContainText('10');
});
