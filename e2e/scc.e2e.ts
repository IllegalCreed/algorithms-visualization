import { test, expect } from '@playwright/test';

test('TC-E2E-SCC-01 强连通分量全模板：正文 + 有向图 6 点 / 拖到末步 3 个 SCC 着色', async ({
  page,
}) => {
  await page.goto('/docs/scc');

  // 全模板①：介绍正文 Article（h1 含「强连通」）
  await expect(page.locator('.article h1')).toContainText('强连通');

  // 全模板②③：图轨（6 节点）+ 代码播放器 + 默认停第 0 步
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

  // 拖到末步 → 共 3 个 SCC（caption 含「3」）+ 栈空（0 .on-stack）
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('3');
  await expect(page.locator('.on-stack')).toHaveCount(0);
});
