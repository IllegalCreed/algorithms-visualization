import { test, expect } from '@playwright/test';

test('TC-E2E-COCKTAIL-01 鸡尾酒排序全模板：正文 + 主轨 8 柱/拖到末步升序', async ({ page }) => {
  await page.goto('/docs/cocktail-sort');

  // 全模板①：介绍正文 Article（h1 含「鸡尾酒排序」）
  await expect(page.locator('.article h1')).toContainText('鸡尾酒排序');

  // 全模板②③：可视化 + 代码播放器——纯 BarsView 主轨 8 柱 + 默认停第 0 步
  await expect(page.locator('.bar-cell')).toHaveCount(8);
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 主轨升序 [1,2,3,4,5,6,7,8]
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  const values = await page.locator('.bars-view .bar-cell .val').allInnerTexts();
  expect(values.map((t) => parseInt(t, 10))).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});
