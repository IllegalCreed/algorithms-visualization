import { test, expect } from '@playwright/test';

test('冒泡排序动画最终升序', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/docs/bubble-sort');
  // 等待方块渲染
  await expect(page.locator('.block').first()).toBeVisible();
  // 轮询直到所有方块数值稳定为升序（10 元素冒泡约几十秒，超时 90s）
  await expect(async () => {
    const nums = await page.locator('.block span').allInnerTexts();
    const vals = nums.map(Number);
    const sorted = [...vals].sort((a, b) => a - b);
    expect(vals).toEqual(sorted);
  }).toPass({ timeout: 90_000 });
});
