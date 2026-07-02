import { test, expect } from '@playwright/test';

test('TC-E2E-SHELL-01 希尔排序播放器：默认暂停/单步聚焦分组/跳末升序/重置', async ({ page }) => {
  await page.goto('/docs/shell-sort');

  // 全模板：介绍正文 Article（h1 含「希尔排序」）
  await expect(page.locator('.article h1')).toContainText('希尔排序');

  const bars = page.locator('.bar-cell');
  await expect(bars).toHaveCount(10);
  await expect(page.locator('.counter')).toContainText('1 / '); // 默认停第 0 步

  // 真机 Shiki 着色（单测里 useHighlighter 被 mock，这里补真机覆盖）
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  // 单步到 groupStart（第 1 步）：当前组聚焦、其余柱 dimmed 淡出（希尔核心视觉，真机验证）
  await page.locator('.ctl[title="下一步"]').click();
  await expect(page.locator('.counter')).toContainText('2 / ');
  await expect(page.locator('.bar.dimmed').first()).toBeVisible();

  // 拖到末步 → 数值升序
  const scrub = page.locator('.scrub');
  const max = await scrub.getAttribute('max');
  await scrub.evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, max!);
  const values = await page.locator('.bar-cell .val').allInnerTexts();
  const nums = values.map((t) => parseInt(t, 10));
  expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // 重置回第 0 步
  await page.locator('.ctl[title="重置"]').click();
  await expect(page.locator('.counter')).toContainText('1 / ');
});
