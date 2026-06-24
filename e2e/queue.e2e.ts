import { test, expect } from '@playwright/test';

test('TC-E2E-QUEUE-01 队列知识页：正文+互动队列/enqueue入队/双指针/dequeue移队首/重置空态', async ({
  page,
}) => {
  await page.goto('/docs/queue');

  // 正文标题（限定文章内 h1）+ 互动外框可见
  await expect(page.locator('.article h1')).toContainText('队列');
  await expect(page.locator('.playground')).toBeVisible();

  // 互动队列根（菜单也用 .btn/.item，全部限定在 .queue-viz 内）
  const viz = page.locator('.queue-viz');
  const enq = viz.locator('.btn', { hasText: 'enqueue' });
  const deq = viz.locator('.btn', { hasText: 'dequeue' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始空态
  await expect(viz.locator('.empty-hint')).toBeVisible();
  await expect(viz.locator('.plate')).toHaveCount(0);

  // enqueue ×3 → 3 个元素
  await enq.click();
  await enq.click();
  await enq.click();
  await expect(viz.locator('.plate')).toHaveCount(3);

  // 队首 = 第一个 = 1（is-front），队尾 = 末个（is-rear）
  await expect(viz.locator('.qitem').first()).toHaveClass(/is-front/);
  await expect(viz.locator('.qitem.is-front .plate')).toHaveText('1');
  await expect(viz.locator('.qitem').last()).toHaveClass(/is-rear/);

  // dequeue → 移除队首 1（先等数量降到 2，避开离场动画的瞬时双 is-front），2 成新队首
  await deq.click();
  await expect(viz.locator('.plate')).toHaveCount(2);
  await expect(viz.locator('.qitem.is-front .plate')).toHaveText('2');
  await expect(viz.locator('.status')).toContainText('出队');

  // 重置 → 回到空态
  await reset.click();
  await expect(viz.locator('.plate')).toHaveCount(0);
  await expect(viz.locator('.empty-hint')).toBeVisible();
});
