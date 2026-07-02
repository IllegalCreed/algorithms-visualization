import { test, expect } from '@playwright/test';

test('TC-E2E-COUNT-01 计数排序播放器：默认暂停/计数桶轨/计数填桶/空桶/跳末升序全绿/重置', async ({
  page,
}) => {
  await page.goto('/docs/counting-sort');

  // 全模板：介绍正文 Article（h1 含「计数排序」）
  await expect(page.locator('.article h1')).toContainText('计数排序');

  // 主轨 10 柱（计数桶轨用 .count-cell，非 .bar-cell）+ 默认停第 0 步
  await expect(page.locator('.bar-cell')).toHaveCount(10);
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 计数桶轨可见（第四条轨、首条按「值」索引）+ 6 个桶
  await expect(page.locator('.count-view')).toBeVisible();
  await expect(page.locator('.count-bucket')).toHaveCount(6);

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  // 第 0 步 count：读 a[0]=3 → 桶「3」高亮 +1（计数核心视觉，真机验证）
  await expect(page.locator('.count-bucket.active')).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到计数完成（index 9）：桶 = [3,1,2,2,0,2]，值 5 为空桶（0 格、计数 0）
  await setScrub('9');
  await expect(page.locator('.count-bucket').nth(0).locator('.count-num')).toHaveText('3');
  await expect(page.locator('.count-bucket').nth(0).locator('.count-cell')).toHaveCount(3);
  await expect(page.locator('.count-bucket').nth(4).locator('.count-num')).toHaveText('0');
  await expect(page.locator('.count-bucket').nth(4).locator('.count-cell')).toHaveCount(0);

  // 拖到末步 → 主轨升序、全部就位转绿
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  const values = await page.locator('.bars-view .bar-cell .val').allInnerTexts();
  expect(values.map((t) => parseInt(t, 10))).toEqual([1, 1, 1, 2, 3, 3, 4, 4, 6, 6]);
  await expect(page.locator('.bars-view .bar.sorted')).toHaveCount(10); // 末步全绿

  // 重置回第 0 步
  await page.locator('.ctl[title="重置"]').click();
  await expect(page.locator('.counter')).toContainText('1 / ');
});
