import { test, expect } from '@playwright/test';

test('TC-E2E-FFT-01 FFT 全模板：蝶形网络 / 拖到末步 O(n log n)', async ({ page }) => {
  await page.goto('/docs/fft');

  // 全模板①：介绍正文 Article（h1 含「FFT」）
  await expect(page.locator('.article h1')).toContainText('FFT');

  // 全模板②③：网络轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.network-view')).toBeVisible();
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

  // 拖到末步 → 字幕含 O(n log n)
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('O(n log n)');
});
