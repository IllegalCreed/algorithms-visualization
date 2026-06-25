import { test, expect } from '@playwright/test';

test('TC-E2E-HASH-01 哈希表知识页：正文+互动哈希/散列直达/冲突追加/重置', async ({ page }) => {
  await page.goto('/docs/hash');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('哈希表');
  await expect(page.locator('.playground')).toBeVisible();

  // 互动哈希根（菜单也用 .btn，全部限定在 .hash-viz 内）
  const viz = page.locator('.hash-viz');
  const insert = viz.locator('.btn', { hasText: '插入' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 7 桶 + 4 项（桶1 有冲突链 15、8）
  await expect(viz.locator('.bucket')).toHaveCount(7);
  await expect(viz.locator('.entry')).toHaveCount(4);

  // 输入 11 插入 → 11%7=4，4 号桶冲突追加到 2 项且含 11；解说含算式
  await viz.locator('.val-input').fill('11');
  await insert.click();
  await expect(viz.locator('.bucket').nth(4).locator('.entry')).toHaveCount(2);
  await expect(viz.locator('.bucket').nth(4).locator('.entry', { hasText: '11' })).toHaveCount(1);
  await expect(viz.locator('.entry')).toHaveCount(5);
  await expect(viz.locator('.status')).toContainText('% 7');

  // 重置（可中断动画）→ 回到 4 项
  await reset.click();
  await expect(viz.locator('.entry')).toHaveCount(4);
});
