import { test, expect } from '@playwright/test';

test('TC-E2E-QUICK-01 快速排序播放器：默认暂停/区间栈轨/pivot品红/跳末升序全绿/重置', async ({
  page,
}) => {
  await page.goto('/docs/quick-sort');

  // 全模板：介绍正文 Article（h1 含「快速排序」）
  await expect(page.locator('.article h1')).toContainText('快速排序');

  // 快排原地：仅主轨 10 柱格（区间栈轨用水平区间条、非 .bar-cell）
  await expect(page.locator('.bar-cell')).toHaveCount(10);
  await expect(page.locator('.counter')).toContainText('1 / '); // 默认停第 0 步

  // 区间栈轨可见（继归并 AuxView 之后第二条可视化轨）
  await expect(page.locator('.stack-view')).toBeVisible();

  // 真机 Shiki 着色（单测里 useHighlighter 被 mock，这里补真机覆盖）
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  // 单步到 pivotSelect（第 2 步）：pivot 柱品红（快排核心视觉，真机验证）
  await page.locator('.ctl[title="下一步"]').click();
  await expect(page.locator('.counter')).toContainText('2 / ');
  await expect(page.locator('.bar.pivot')).toBeVisible();

  // 拖到末步 → 主轨数值升序、全部就位转绿
  const scrub = page.locator('.scrub');
  const max = await scrub.getAttribute('max');
  await scrub.evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, max!);
  const values = await page.locator('.bars-view .bar-cell .val').allInnerTexts();
  const nums = values.map((t) => parseInt(t, 10));
  expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  await expect(page.locator('.bars-view .bar.sorted')).toHaveCount(10); // 末步全绿

  // 重置回第 0 步
  await page.locator('.ctl[title="重置"]').click();
  await expect(page.locator('.counter')).toContainText('1 / ');
});
