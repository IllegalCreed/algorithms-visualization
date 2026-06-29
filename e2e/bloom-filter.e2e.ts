import { test, expect } from '@playwright/test';

test('TC-E2E-BLOOM-01 布隆过滤器知识页：正文+互动/加入/查询命中/误判/重置', async ({ page }) => {
  await page.goto('/docs/bloom-filter');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('布隆过滤器');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动布隆（菜单也用 .btn，全部限定在 .bloom-viz 内）
  const viz = page.locator('.bloom-viz');
  const add = viz.locator('.btn', { hasText: '加入' });
  const query = viz.locator('.btn', { hasText: '查询' });
  const reset = viz.locator('.btn', { hasText: '重置' });
  const input = viz.locator('.in-a');

  // 位数组渲染（16 格）
  await expect(viz.locator('.bit-cell')).toHaveCount(16);

  // 加入 3、7、11
  for (const x of ['3', '7', '11']) {
    await input.fill(x);
    await add.click();
  }
  await expect(viz.locator('.bit-cell.set')).toHaveCount(9);

  // 查询 7 → 命中（可能存在）
  await input.fill('7');
  await query.click();
  await expect(viz.locator('.status')).toContainText('可能存在');

  // 查询 2 → 误判（假阳性）
  await input.fill('2');
  await query.click();
  await expect(viz.locator('.status')).toContainText('误判');

  // 重置 → 解说复位、位清空
  await reset.click();
  await expect(viz.locator('.status')).toContainText('已重置');
  await expect(viz.locator('.bit-cell.set')).toHaveCount(0);
});
