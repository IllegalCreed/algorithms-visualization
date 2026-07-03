import { test, expect } from '@playwright/test';

test('TC-E2E-BM-01 Boyer-Moore 全模板：正文 + 对齐窗口带 / 拖到末步 命中高亮', async ({ page }) => {
  await page.goto('/docs/boyer-moore');

  // 全模板①：介绍正文 Article（h1 含「Boyer-Moore」）
  await expect(page.locator('.article h1')).toContainText('Boyer-Moore');

  // 全模板②③：字符串匹配轨（文本 9 格，无 π 行）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.kmp-view')).toBeVisible();
  await expect(page.locator('.kmp-text-cell')).toHaveCount(9);
  await expect(page.locator('.kmp-lps-cell')).toHaveCount(0); // Boyer-Moore 无 π 行
  await expect(page.locator('.counter')).toContainText('1 / ');

  // BM 特征：第 0 步已画出对齐窗口带（windowStart=0 → 3 格）
  await expect(page.locator('.kmp-window')).toHaveCount(3);

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

  // 拖到末步 → 命中区间高亮（.kmp-found ≥1）+ 收尾字幕含「命中」（下标 0、6）
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  expect(await page.locator('.kmp-found').count()).toBeGreaterThanOrEqual(1);
  await expect(page.locator('.caption')).toContainText('命中');
});
