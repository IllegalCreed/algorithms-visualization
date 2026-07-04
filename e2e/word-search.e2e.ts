import { test, expect } from '@playwright/test';

test('TC-E2E-WS-01 单词搜索全模板：正文 + 3×4 字母网格 / 拖到末步 ADEE 路径绿', async ({
  page,
}) => {
  await page.goto('/docs/word-search');

  // 全模板①：介绍正文 Article（h1 含「单词搜索」）
  await expect(page.locator('.article h1')).toContainText('单词搜索');

  // 全模板②③：字母网格轨（3×4=12 格、12 字母）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.maze-view')).toBeVisible();
  await expect(page.locator('.maze-cell')).toHaveCount(12);
  await expect(page.locator('.mz-letter')).toHaveCount(12);
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

  // 拖到末步 → 命中路径 ADEE（4 格 .mz-solution 绿）+ 收尾字幕含「ADEE」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.mz-solution')).toHaveCount(4);
  await expect(page.locator('.caption')).toContainText('ADEE');
});
