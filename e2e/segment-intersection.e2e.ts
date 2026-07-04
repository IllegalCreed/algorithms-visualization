import { test, expect } from '@playwright/test';

test('TC-E2E-SI-01 线段相交全模板：三对判定 / 拖到末步 2 相交 1 不相交', async ({ page }) => {
  await page.goto('/docs/segment-intersection');

  // 全模板①：介绍正文 Article（h1 含「线段相交」）
  await expect(page.locator('.article h1')).toContainText('线段相交');

  // 全模板②③：点平面轨（12 点 6 边）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.hull-view')).toBeVisible();
  await expect(page.locator('.hull-point')).toHaveCount(12);
  await expect(page.locator('.hull-edge')).toHaveCount(6);
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

  // 拖到末步 → 4 条 seg-yes（2 对相交）+ 2 条 seg-no（1 对不相交）+ 字幕含 2
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.hull-edge.seg-yes')).toHaveCount(4);
  await expect(page.locator('.hull-edge.seg-no')).toHaveCount(2);
  await expect(page.locator('.caption')).toContainText('2');
});
