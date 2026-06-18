import { test, expect } from '@playwright/test';

test('docs 菜单点击切换路由', async ({ page }) => {
  await page.goto('/docs/bubble-sort');
  await page.locator('#menu').getByText('冒泡排序').click();
  await expect(page).toHaveURL(/bubble-sort/);
});
