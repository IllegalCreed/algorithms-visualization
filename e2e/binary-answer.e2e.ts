import { test, expect } from '@playwright/test';

test('TC-E2E-BA-01 二分答案全模板：答案空间柱轨 / 拖到末步收官语义', async ({ page }) => {
  await page.goto('/docs/binary-answer');

  // 全模板①：介绍正文 Article（h1 含「二分答案」）
  await expect(page.locator('.article h1')).toContainText('二分答案');

  // 全模板②③：主柱轨（柱子=候选答案）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.bars-view')).toBeVisible();
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 字幕含答案空间
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('答案空间');
});
