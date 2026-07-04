import { test, expect } from '@playwright/test';

test('TC-E2E-MR-01 米勒-拉宾全模板：平方链表 / 拖到末步概率语义', async ({ page }) => {
  await page.goto('/docs/miller-rabin');

  // 全模板①：介绍正文 Article（h1 含「米勒-拉宾」）
  await expect(page.locator('.article h1')).toContainText('米勒-拉宾');

  // 全模板②③：矩阵轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.matrix-view')).toBeVisible();
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 无柱数组 → 不渲染主柱轨
  await expect(page.locator('.bars-view')).toHaveCount(0);

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 字幕含概率界 1/4
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('1/4');
});
