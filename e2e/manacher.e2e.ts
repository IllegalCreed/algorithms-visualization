import { test, expect } from '@playwright/test';

test('TC-E2E-MAN-01 Manacher 全模板：正文 + 转换串/半径两行 / 拖到末步 最长回文 bab', async ({
  page,
}) => {
  await page.goto('/docs/manacher');

  // 全模板①：介绍正文 Article（h1 含「Manacher」）
  await expect(page.locator('.article h1')).toContainText('Manacher');

  // 全模板②③：回文轨（转换串 11 格）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.mn-view')).toBeVisible();
  await expect(page.locator('.mn-s-cell')).toHaveCount(11);
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

  // 拖到末步 → 最长回文 "bab" 在转换串上 #b#a#b#（7 格 .mn-best）+ 收尾字幕含「bab」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.mn-best')).toHaveCount(7);
  await expect(page.locator('.caption')).toContainText('bab');
});
