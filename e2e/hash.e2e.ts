import { test, expect } from '@playwright/test';

test('TC-E2E-HASH-01 哈希表知识页：正文+互动哈希/散列直达/冲突追加/重置', async ({ page }) => {
  await page.goto('/docs/hash');

  // 正文标题（限定文章内 h1）+ 互动外框可见（两个 Playground：拉链 + 开放寻址，取首个）
  await expect(page.locator('.article h1')).toContainText('哈希表');
  await expect(page.locator('.playground').first()).toBeVisible();

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

test('TC-E2E-HASH-02 开放寻址节：扁平表 7 格/线性探测插入/未命中/重置', async ({ page }) => {
  await page.goto('/docs/hash');

  // 限定开放寻址互动根（与拉链 .hash-viz 同页，作用域隔离）
  const viz = page.locator('.probe-viz');
  const insert = viz.locator('.btn', { hasText: '插入' });
  const find = viz.locator('.btn', { hasText: '查找' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 7 格扁平表、4 格已填（[_,15,8,23,4,_,_]）
  await expect(viz.locator('.cell')).toHaveCount(7);
  await expect(viz.locator('.cell.filled')).toHaveCount(4);
  await expect(viz.locator('.readout')).toContainText('4/7');

  // 插入 9 → 9%7=2 被占，线性探测往后落 5 号；解说含「探测」、填到 5 格
  await viz.locator('.val-input').fill('9');
  await insert.click();
  await expect(viz.locator('.status')).toContainText('探测');
  await expect(viz.locator('.cell.filled')).toHaveCount(5);

  // 查找 99 → 探到空位、不在表中
  await viz.locator('.val-input').fill('99');
  await find.click();
  await expect(viz.locator('.status')).toContainText('不在表中');

  // 重置 → 回到 4 格
  await reset.click();
  await expect(viz.locator('.cell.filled')).toHaveCount(4);
});
