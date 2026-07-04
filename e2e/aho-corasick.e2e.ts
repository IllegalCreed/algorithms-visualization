import { test, expect } from '@playwright/test';

test('TC-E2E-AC-01 AC 自动机全模板：正文 + Trie 图 / 拖到末步 命中汇总', async ({ page }) => {
  await page.goto('/docs/aho-corasick');

  // 全模板①：介绍正文 Article（h1 含「AC」或「Aho」）
  await expect(page.locator('.article h1')).toContainText(/AC|Aho/);

  // 全模板②③：图轨 + 代码播放器 + 默认停第 0 步
  await expect(page.locator('.graph-view')).toBeVisible();
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

  // 拖到末步 → 8 个状态节点全部显示 + 收尾字幕含命中（hers）
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.graph-node')).toHaveCount(8);
  await expect(page.locator('.caption')).toContainText('hers');
});
