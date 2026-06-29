import { test, expect } from '@playwright/test';

test('TC-E2E-LRU-01 LRU 缓存知识页：正文+互动缓存/get命中跳最前/put满淘汰/重置', async ({
  page,
}) => {
  await page.goto('/docs/lru');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('LRU');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动缓存根（菜单也用 .btn，全部限定在 .lru-viz 内）
  const viz = page.locator('.lru-viz');
  const get = viz.locator('.btn', { hasText: 'get' });
  const put = viz.locator('.btn', { hasText: 'put' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 3 缓存项（MRU→LRU = 3,2,1）
  await expect(viz.locator('.lru-cell')).toHaveCount(3);

  // get(1) 命中 → 1 跳到最前（首个 lru-key = 1）
  await viz.locator('.val-input').nth(0).fill('1');
  await get.click();
  await expect(viz.locator('.lru-key').first()).toHaveText('1');

  // put 到满再 put → 触发淘汰；put(4,40) 后 put(5,50)
  await viz.locator('.val-input').nth(0).fill('4');
  await viz.locator('.val-input').nth(1).fill('40');
  await put.click();
  await expect(viz.locator('.lru-cell')).toHaveCount(4);
  await viz.locator('.val-input').nth(0).fill('5');
  await viz.locator('.val-input').nth(1).fill('50');
  await put.click();
  await expect(viz.locator('.status')).toContainText('淘汰');
  await expect(viz.locator('.lru-cell')).toHaveCount(4);

  // 重置 → 回到 3 项
  await reset.click();
  await expect(viz.locator('.lru-cell')).toHaveCount(3);
});
