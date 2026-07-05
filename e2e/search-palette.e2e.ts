import { test, expect } from '@playwright/test';

test('TC-E2E-SEARCH-01 全站搜索：Ctrl+K 呼出 → 键入 → Enter 直达', async ({ page }) => {
  await page.goto('/docs/lca');
  await expect(page.locator('.article h1')).toContainText('LCA'); // 页面就绪再按键

  // Ctrl+K 呼出（Playwright 用 Control 修饰）
  await page.keyboard.press('Control+k');
  await expect(page.locator('.search-palette')).toBeVisible();

  // 键入过滤 + Enter 跳转
  await page.locator('.sp-input').fill('快速排序');
  await expect(page.locator('.sp-item').first()).toContainText('快速排序');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/quick-sort/);
  await expect(page.locator('.search-palette')).toHaveCount(0);

  // Header 按钮呼出 + Esc 关闭
  await page.locator('.search-btn').click();
  await expect(page.locator('.search-palette')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.search-palette')).toHaveCount(0);
});
