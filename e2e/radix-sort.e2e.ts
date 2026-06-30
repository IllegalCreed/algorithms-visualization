import { test, expect } from '@playwright/test';

test('TC-E2E-RADIX-01 基数排序播放器：主轨 8 柱/桶轨 10 桶/拖到末步升序', async ({ page }) => {
  await page.goto('/docs/radix-sort');

  // 主轨 8 柱（基数排序用桶轨 .count-bucket）+ 默认停第 0 步
  await expect(page.locator('.bar-cell')).toHaveCount(8);
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 计数桶轨可见 + 10 个桶（数字 0–9）
  await expect(page.locator('.count-view')).toBeVisible();
  await expect(page.locator('.count-bucket')).toHaveCount(10);

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 主轨升序 [7,9,18,25,31,42,56,63]
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  const values = await page.locator('.bars-view .bar-cell .val').allInnerTexts();
  expect(values.map((t) => parseInt(t, 10))).toEqual([7, 9, 18, 25, 31, 42, 56, 63]);
});
