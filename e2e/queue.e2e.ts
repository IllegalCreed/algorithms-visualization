import { test, expect } from '@playwright/test';

test('TC-E2E-QUEUE-01 队列知识页：正文+互动队列/enqueue入队/双指针/dequeue移队首/重置空态', async ({
  page,
}) => {
  await page.goto('/docs/queue');

  // 正文标题（限定文章内 h1）+ 互动外框可见（两个 Playground：FIFO 队列 + 双端队列，取首个）
  await expect(page.locator('.article h1')).toContainText('队列');
  await expect(page.locator('.playground').first()).toBeVisible();

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

test('TC-E2E-QUEUE-02 双端队列节：3 元素/头部入/尾部出/重置（两端都能进出）', async ({ page }) => {
  await page.goto('/docs/queue');

  // 限定双端队列互动根（与 FIFO .queue-viz 同页，作用域隔离）
  const viz = page.locator('.deque-viz');
  const pushFront = viz.locator('.btn', { hasText: '头部入' });
  const popBack = viz.locator('.btn', { hasText: '尾部出' });
  const reset = viz.locator('.btn', { hasText: '重置' });

  // 初始 3 元素（[1,2,3]）+ 头/尾标记（限定到可见的那个：首元素的头标记、末元素的尾标记）
  await expect(viz.locator('.dqitem')).toHaveCount(3);
  await expect(viz.locator('.dqitem.is-front .dm-front')).toBeVisible();
  await expect(viz.locator('.dqitem.is-back .dm-back')).toBeVisible();

  // 头部入 → 4 元素，新元素落队头（首位 = 4）
  await pushFront.click();
  await expect(viz.locator('.dqitem')).toHaveCount(4);
  await expect(viz.locator('.dqitem').first().locator('.plate')).toHaveText('4');
  await expect(viz.locator('.status')).toContainText('头');

  // 尾部出 → 回 3 元素，从队尾移除
  await popBack.click();
  await expect(viz.locator('.dqitem')).toHaveCount(3);
  await expect(viz.locator('.status')).toContainText('尾');

  // 重置 → 回到 3 元素
  await reset.click();
  await expect(viz.locator('.dqitem')).toHaveCount(3);
});
