import { test, expect } from '@playwright/test';

test('TC-E2E-INPUT-01 自定义输入全链路：快排改输入 → 柱数变化 + URL 分享', async ({ page }) => {
  await page.goto('/docs/quick-sort');

  // 默认 10 柱 + 输入条在位（第一批开放）
  await expect(page.locator('.input-bar')).toBeVisible();
  await expect(page.locator('.bars-view .bar')).toHaveCount(10);

  // 改输入应用 → 5 柱 + URL 带 ?input=
  await page.locator('input.ib-text').fill('9, 5, 27, 1, 14');
  await page.locator('button.ib-apply').click();
  await expect(page.locator('.bars-view .bar')).toHaveCount(5);
  await expect(page).toHaveURL(/input=9%2C5%2C27%2C1%2C14|input=9,5,27,1,14/);
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 非法输入 → 行内报错、柱数不变
  await page.locator('input.ib-text').fill('abc');
  await page.locator('button.ib-apply').click();
  await expect(page.locator('.ib-error')).toBeVisible();
  await expect(page.locator('.bars-view .bar')).toHaveCount(5);

  // 带 ?input= 直开 → 初始即自定义
  await page.goto('/docs/quick-sort?input=8,3,6');
  await expect(page.locator('.bars-view .bar')).toHaveCount(3);

  // 恢复默认 → 10 柱 + URL 清参
  await page.locator('button.ib-restore').click();
  await expect(page.locator('.bars-view .bar')).toHaveCount(10);
  await expect(page).not.toHaveURL(/input=/);

  // 固定剧本页无输入条（回归）
  await page.goto('/docs/lca');
  await expect(page.locator('.input-bar')).toHaveCount(0);
});
