import { test, expect } from '@playwright/test';

test('首页加载并能进入 docs', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/算法可视化/);
  await page.getByText('开始学习').click();
  // 「开始学习」跳转到「数组」文章页（C-20260618-005 修复了原 params:{page} 无效路由 bug）
  await expect(page).toHaveURL(/\/docs\/array/);
});
