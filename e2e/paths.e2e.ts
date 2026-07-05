import { test, expect } from '@playwright/test';

test('TC-E2E-PATHS-01 学习路径：四卡渲染 + 步骤直达', async ({ page }) => {
  await page.goto('/docs/paths');
  await expect(page.locator('.article h1')).toContainText('学习路径');
  await expect(page.locator('.lp-card')).toHaveCount(4);

  // 新手入门第 1 步 → 数组页
  await page.locator('.lp-card').first().locator('a').first().click();
  await expect(page).toHaveURL(/\/docs\/array/);
});
