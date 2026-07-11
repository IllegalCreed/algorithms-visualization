import { test, expect } from '@playwright/test';

test('docs 菜单点击切换路由', async ({ page }) => {
  await page.goto('/docs/bubble-sort');
  await page.locator('#menu').getByText('冒泡排序').click();
  await expect(page).toHaveURL(/bubble-sort/);
});

test('TC-E2E-MENU-TOOLS-132-01 中文菜单可进入复杂度速查', async ({ page }) => {
  await page.goto('/docs/bubble-sort');
  const menu = page.locator('#menu');

  await expect(menu.getByText('学习工具', { exact: true })).toBeVisible();
  await menu.getByText('算法复杂度速查', { exact: true }).click();

  await expect(page).toHaveURL(/\/docs\/complexity\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: '复杂度速查表' })).toBeVisible();
});
