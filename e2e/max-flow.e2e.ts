import { test, expect } from '@playwright/test';

test('TC-E2E-MF-01 最大流全模板：正文 + 网络图 / 拖到末步 最大流 6', async ({ page }) => {
  await page.goto('/docs/max-flow');

  // 全模板①：介绍正文 Article（h1 含「最大流」）
  await expect(page.locator('.article h1')).toContainText('最大流');

  // 全模板②③：图轨（4 节点）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.graph-view')).toBeVisible();
  await expect(page.locator('.graph-node')).toHaveCount(4);
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

  // 拖到末步 → 收尾字幕含最大流 6
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('6');
});
