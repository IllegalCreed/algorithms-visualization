import { test, expect } from '@playwright/test';

test('TC-E2E-SKIP-01 跳表知识页：正文+互动跳表/楼梯查找命中/未命中/重置', async ({ page }) => {
  await page.goto('/docs/skip-list');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('跳表');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动跳表根（菜单也用 .btn，全部限定在 .skip-list-viz 内）
  const viz = page.locator('.skip-list-viz');
  const search = viz.locator('.btn', { hasText: '查找' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 网格单元格渲染（19 个：head 4 + 元素层高和 15）
  await expect(viz.locator('.skip-cell')).toHaveCount(19);

  // 查找 11 → 命中（楼梯走位结束后 status 含「找到了」）
  await viz.locator('.val-input').fill('11');
  await search.click();
  await expect(viz.locator('.status')).toContainText('找到了');

  // 查找 8 → 不存在（查找按钮 busy 时禁用，Playwright 自动等其恢复）
  await viz.locator('.val-input').fill('8');
  await search.click();
  await expect(viz.locator('.status')).toContainText('没找到');

  // 重置 → 解说复位
  await reset.click();
  await expect(viz.locator('.status')).toContainText('已重置');
});
