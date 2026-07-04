import { test, expect } from '@playwright/test';

test('TC-E2E-2SAT-01 2-SAT 全模板：正文 + 蕴含图 / 拖到末步 可满足解', async ({ page }) => {
  await page.goto('/docs/two-sat');

  // 全模板①：介绍正文 Article（h1 含「2-SAT」）
  await expect(page.locator('.article h1')).toContainText('2-SAT');

  // 全模板②③：图轨（6 文字节点）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.graph-view')).toBeVisible();
  await expect(page.locator('.graph-node')).toHaveCount(6);
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

  // 拖到末步 → 8 条蕴含边全部出现 + 收尾字幕含「可满足」
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.graph-edge')).toHaveCount(8);
  await expect(page.locator('.caption')).toContainText('可满足');
});
