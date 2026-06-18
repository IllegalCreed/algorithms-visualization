import { test, expect } from '@playwright/test';

test('首页加载并能进入 docs', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/算法可视化/);
  await page.getByText('开始学习').click();
  await expect(page).toHaveURL(/\/docs/);
});
