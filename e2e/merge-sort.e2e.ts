import { test, expect } from '@playwright/test';

test('TC-E2E-MERGE-01 归并排序播放器：默认暂停/合并聚焦+temp填充/跳末升序/重置', async ({
  page,
}) => {
  await page.goto('/docs/merge-sort');

  // 主轨 10 + 辅助轨 10 = 20 个柱格（双轨可视化）
  await expect(page.locator('.bar-cell')).toHaveCount(20);
  await expect(page.locator('.counter')).toContainText('1 / '); // 默认停第 0 步

  // 真机 Shiki 着色（单测里 useHighlighter 被 mock，这里补真机覆盖）
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  // 单步到 mergeStart：当前合并段聚焦、段外 dimmed；temp 有空槽虚框
  await page.locator('.ctl[title="下一步"]').click();
  await expect(page.locator('.counter')).toContainText('2 / ');
  await expect(page.locator('.bar.dimmed').first()).toBeVisible();
  await expect(page.locator('.aux-view .bar.empty').first()).toBeVisible();

  // 继续单步：compare → take，辅助轨出现已填 sorted 槽
  await page.locator('.ctl[title="下一步"]').click(); // compare
  await page.locator('.ctl[title="下一步"]').click(); // takeLeft/takeRight
  await expect(page.locator('.aux-view .bar.sorted').first()).toBeVisible();

  // 拖到末步 → 主轨数值升序
  const scrub = page.locator('.scrub');
  const max = await scrub.getAttribute('max');
  await scrub.evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, max!);
  const values = await page.locator('.bars-view .bar-cell .val').allInnerTexts();
  const nums = values.map((t) => parseInt(t, 10));
  expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // 重置回第 0 步
  await page.locator('.ctl[title="重置"]').click();
  await expect(page.locator('.counter')).toContainText('1 / ');
});
