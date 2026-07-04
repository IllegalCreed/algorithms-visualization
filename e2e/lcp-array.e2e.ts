import { test, expect } from '@playwright/test';

test('TC-E2E-LCP-01 LCP 数组全模板：正文 + 后缀表 LCP 列 / 拖到末步 最长重复 3', async ({
  page,
}) => {
  await page.goto('/docs/lcp-array');

  // 全模板①：介绍正文 Article（h1 含「LCP」）
  await expect(page.locator('.article h1')).toContainText('LCP');

  // 全模板②③：后缀轨（6 行）+ LCP 列 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.suffix-array-view')).toBeVisible();
  await expect(page.locator('.sa-row')).toHaveCount(6);
  await expect(page.locator('.sa-lcp').first()).toBeVisible();
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

  // 拖到末步 → 收尾字幕含「3」（最长重复子串长）
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('3');
});
