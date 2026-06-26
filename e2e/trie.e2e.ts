import { test, expect } from '@playwright/test';

test('TC-E2E-TRIE-01 字典树知识页：正文+互动字典树/查找三结局/前缀自动补全/重置', async ({
  page,
}) => {
  await page.goto('/docs/trie');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('字典树');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动字典树根（菜单也用 .btn，全部限定在 .trie-viz 内）
  const viz = page.locator('.trie-viz');
  const search = viz.locator('.btn', { hasText: '查找' });
  const prefix = viz.locator('.btn', { hasText: '前缀' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 固定字典树 11 节点 + 10 边
  await expect(viz.locator('.tnode')).toHaveCount(11);
  await expect(viz.locator('.edge')).toHaveCount(10);

  // 查找 card → 是一个词（解说含「词」）
  await viz.locator('.val-input').fill('card');
  await search.click();
  await expect(viz.locator('.status')).toContainText('词');

  // 前缀 ca → 自动补全列出 car/card/cat（解说含 car）；走位结束后按钮恢复
  await viz.locator('.val-input').fill('ca');
  await prefix.click();
  await expect(viz.locator('.status')).toContainText('car');

  // 重置 → 解说复位
  await reset.click();
  await expect(viz.locator('.status')).toContainText('已重置');
});
