import { test, expect } from '@playwright/test';

test('TC-E2E-CPLX-01 复杂度速查：分组表 / 标签过滤 / 行链直达', async ({ page }) => {
  await page.goto('/docs/complexity');
  await expect(page.locator('.article h1')).toContainText('复杂度速查');
  await expect(page.locator('.cx-group')).toHaveCount(9);
  await expect(page.locator('.cx-count')).toContainText('92');

  // 标签过滤
  await page.locator('.cx-tag', { hasText: '查找' }).click();
  await expect(page.locator('.cx-group')).toHaveCount(1);
  await expect(page.locator('.cx-count')).toContainText('5');

  // 行链直达
  await page.locator('.cx-table a', { hasText: '二分查找' }).click();
  await expect(page).toHaveURL(/\/docs\/binary-search/);
  await expect(page.locator('.article h1')).toContainText('二分');
});
