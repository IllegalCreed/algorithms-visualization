import { test, expect } from '@playwright/test';

test('TC-E2E-TDMERGE-01 自顶向下归并全模板：正文 + 递归栈/temp 双辅助轨 + 拖到末步升序', async ({
  page,
}) => {
  await page.goto('/docs/top-down-merge-sort');

  // 全模板①：介绍正文 Article（h1 含「自顶向下归并」）
  await expect(page.locator('.article h1')).toContainText('自顶向下归并');

  // 全模板②③：可视化 + 代码播放器——主轨 8 柱 + aux 轨 8 槽 = 16 bar-cell + 默认停第 0 步
  await expect(page.locator('.bar-cell')).toHaveCount(16);
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 双辅助轨同屏：temp 轨 + 递归调用栈轨
  await expect(page.locator('.aux-view')).toBeVisible();
  await expect(page.locator('.stack-view')).toBeVisible();

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 主轨升序 [1,2,3,4,6,7,8,9]
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  const values = await page.locator('.bars-view .bar-cell .val').allInnerTexts();
  expect(values.map((t) => parseInt(t, 10))).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
});
