import { test, expect } from '@playwright/test';

test('TC-E2E-HEAP-01 堆排序播放器：默认暂停/二叉树轨/heapNode深紫/跳末升序全绿/重置', async ({
  page,
}) => {
  await page.goto('/docs/heap-sort');

  // 主轨 10 柱（二叉树轨用 .tree-node，非 .bar-cell）
  await expect(page.locator('.bar-cell')).toHaveCount(10);
  await expect(page.locator('.counter')).toContainText('1 / '); // 默认停第 0 步

  // 二叉树轨可见（首个非线性结构轨）+ 10 个节点
  await expect(page.locator('.tree-view')).toBeVisible();
  await expect(page.locator('.tree-node')).toHaveCount(10);

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  // 第 0 步 heapify：当前 siftDown 节点 heapNode 深紫（堆排序核心视觉，真机验证）
  await expect(page.locator('.bar.heapNode').first()).toBeVisible();
  await expect(page.locator('.tree-node.heapNode').first()).toBeVisible();

  // 拖到末步 → 主轨升序、全部就位转绿
  const scrub = page.locator('.scrub');
  const max = await scrub.getAttribute('max');
  await scrub.evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, max!);
  const values = await page.locator('.bars-view .bar-cell .val').allInnerTexts();
  expect(values.map((t) => parseInt(t, 10))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  await expect(page.locator('.bars-view .bar.sorted')).toHaveCount(10); // 末步全绿

  // 重置回第 0 步
  await page.locator('.ctl[title="重置"]').click();
  await expect(page.locator('.counter')).toContainText('1 / ');
});
