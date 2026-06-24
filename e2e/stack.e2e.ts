import { test, expect } from '@playwright/test';

test('TC-E2E-STACK-01 栈知识页：正文+互动栈/push压入/栈顶跟随/pop弹出/重置空态', async ({
  page,
}) => {
  await page.goto('/docs/stack');

  // 正文标题（限定文章内 h1，避开头部站点标题）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('栈');
  await expect(page.locator('.playground')).toBeVisible();

  // 互动栈根（菜单也用 .btn/.item，全部限定在 .stack-viz 内）
  const viz = page.locator('.stack-viz');
  const push = viz.locator('.btn', { hasText: 'push' });
  const pop = viz.locator('.btn', { hasText: 'pop' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始空态：栈为空 + 无盘子
  await expect(viz.locator('.empty-hint')).toBeVisible();
  await expect(viz.locator('.plate')).toHaveCount(0);

  // push ×3 → 3 个盘子
  await push.click();
  await push.click();
  await push.click();
  await expect(viz.locator('.plate')).toHaveCount(3);

  // 栈顶 = 最后压入的 3：is-top 落在最顶元素，「← 栈顶」指针在该行
  await expect(viz.locator('.item').last()).toHaveClass(/is-top/);
  await expect(viz.locator('.item.is-top .plate')).toHaveText('3');
  await expect(viz.locator('.item.is-top .arrow')).toHaveCount(1);

  // pop → 2 个盘子、解说含「弹出」
  await pop.click();
  await expect(viz.locator('.plate')).toHaveCount(2);
  await expect(viz.locator('.status')).toContainText('弹出');

  // 重置 → 回到空态
  await reset.click();
  await expect(viz.locator('.plate')).toHaveCount(0);
  await expect(viz.locator('.empty-hint')).toBeVisible();
});
