import { test, expect } from '@playwright/test';

test('TC-E2E-SA-01 后缀数组全模板：正文 + 后缀表 / 拖到末步 sa 定型', async ({ page }) => {
  await page.goto('/docs/suffix-array');

  // 全模板①：介绍正文 Article（h1 含「后缀数组」）
  await expect(page.locator('.article h1')).toContainText('后缀数组');

  // 全模板②③：后缀轨（6 后缀行）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.suffix-array-view')).toBeVisible();
  await expect(page.locator('.sa-row')).toHaveCount(6);
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

  // 拖到末步 → 首行后缀以 a 开头（字典序最小）+ 收尾字幕含 sa
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.sa-row').first().locator('.sa-suffix')).toHaveText(/^a/);
  await expect(page.locator('.caption')).toContainText('sa');
});
