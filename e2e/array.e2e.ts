import { test, expect } from '@playwright/test';

test('TC-E2E-ARRAY-01 数组知识页：正文+互动数组/点选下标/插入右移/尾部追加/重置', async ({
  page,
}) => {
  await page.goto('/docs/array');

  // 正文标题（限定文章内 h1）+ 互动外框可见（两个 Playground：静态数组 + 动态扩容，取首个）
  await expect(page.locator('.article h1')).toContainText('数组');
  await expect(page.locator('.playground').first()).toBeVisible();

  // 互动数组根（菜单也用 .btn，全部限定在 .array-viz 内）
  const viz = page.locator('.array-viz');
  const insert = viz.locator('.btn', { hasText: '插入' });
  const append = viz.locator('.btn', { hasText: '追加' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始预填 4 格 [1,2,3,4]、下标 0..3
  await expect(viz.locator('.cell')).toHaveCount(4);
  await expect(viz.locator('.slot')).toHaveCount(4);
  await expect(viz.locator('.empty-hint')).toHaveCount(0);

  // 点下标 2 选中（深绿 + ↑：以 is-selected 类为证）
  await viz.locator('.cell').nth(2).click();
  await expect(viz.locator('.cell').nth(2)).toHaveClass(/is-selected/);
  await expect(viz.locator('.slot').nth(2)).toHaveClass(/is-selected/);

  // 在下标 2 插入 → 5 格；下标 2 起右移腾位，新值 5 落 a[2]、原 a[2]=3 移到 a[3]（下标≠值）
  await insert.click();
  await expect(viz.locator('.cell')).toHaveCount(5);
  await expect(viz.locator('.cell').nth(2)).toHaveText('5');
  await expect(viz.locator('.cell').nth(3)).toHaveText('3');
  await expect(viz.locator('.status')).toContainText('右移');

  // 尾部追加 → 6 格，末位 = 6（无需搬移）
  await append.click();
  await expect(viz.locator('.cell')).toHaveCount(6);
  await expect(viz.locator('.cell').last()).toHaveText('6');
  await expect(viz.locator('.status')).toContainText('O(1)');

  // 重置 → 回到初始 4 格 [1,2,3,4]、无选中
  await reset.click();
  await expect(viz.locator('.cell')).toHaveCount(4);
  await expect(viz.locator('.cell').first()).toHaveText('1');
  await expect(viz.locator('.cell').last()).toHaveText('4');
  await expect(viz.locator('.cell.is-selected')).toHaveCount(0);
});

test('TC-E2E-ARRAY-02 动态扩容节：容量满了翻倍扩容 + 均摊 O(1)', async ({ page }) => {
  await page.goto('/docs/array');

  // 限定动态扩容互动根（与静态 .array-viz 同页，作用域隔离）
  const viz = page.locator('.array-grow-viz');
  const append = viz.locator('.btn', { hasText: '追加' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 4 格（容量 4）、3 格已用（长度 3）
  await expect(viz.locator('.gcell')).toHaveCount(4);
  await expect(viz.locator('.gcell.filled')).toHaveCount(3);

  // 追加一次：填满（4 已用），容量仍 4、解说 O(1)
  await append.click();
  await expect(viz.locator('.gcell.filled')).toHaveCount(4);
  await expect(viz.locator('.gcell')).toHaveCount(4);
  await expect(viz.locator('.status')).toContainText('O(1)');

  // 再追加一次：装满触发扩容 → 容量翻倍到 8（8 格），解说含「扩容」
  await append.click();
  await expect(viz.locator('.gcell')).toHaveCount(8);
  await expect(viz.locator('.status')).toContainText('扩容');

  // 重置 → 回到 4 格、3 已用
  await reset.click();
  await expect(viz.locator('.gcell')).toHaveCount(4);
  await expect(viz.locator('.gcell.filled')).toHaveCount(3);
});
