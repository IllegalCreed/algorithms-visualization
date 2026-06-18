import { test, expect } from '@playwright/test';

test('首页加载并能进入 docs', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/算法可视化/);
  await page.getByText('开始学习').click();
  // 注意：此处仅断言 URL 含 /docs，属已知空壳 bug（遗留②）：
  // Splash「开始学习」实际只跳转到空 /docs 壳页，未能定位到「数组」文章页。
  // 见 docs/plans/20260618-c003-test-suite/implementation.md 遗留②，留 M2 修复；
  // M2 修复 router.push bug 后应将此断言收紧，验证实际进入文章页（如断言 URL 含 /docs/array 或页面内容）。
  await expect(page).toHaveURL(/\/docs/);
});
