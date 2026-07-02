import { test, expect } from '@playwright/test';

// 缺陷回归（C-042 真机自检发现）：代码面板长行被 overflow:hidden 裁掉、无法横向滚动。
// 用窄视口强制溢出，断言 .code 是横向滚动容器且真的能滚。
test('TC-E2E-CODEPANEL-01 代码面板长行可横向滚动、不被截断', async ({ page }) => {
  await page.goto('/docs/dual-pivot-quick-sort'); // 双轴快排 TS 源码行长，作缺陷复现场景

  const code = page.locator('.code').first();
  await expect(code).toBeVisible();

  // ① .code 声明为横向滚动容器（修复前为 visible + 外层 hidden 裁切 → 红）
  const overflowX = await code.evaluate((el) => getComputedStyle(el).overflowX);
  expect(overflowX).toBe('auto');

  // 把面板压窄到 320px，确定性制造「内容比盒子宽」（考察行为与视口无关）
  await page
    .locator('.code-panel')
    .first()
    .evaluate((el) => {
      (el as HTMLElement).style.width = '320px';
    });

  // ② 长行没有被折行/吞掉：内容宽 > 可视宽
  const { scrollWidth, clientWidth } = await code.evaluate((el) => ({
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
  }));
  expect(scrollWidth).toBeGreaterThan(clientWidth);

  // ③ 真的能横向滚动（overflow:visible/hidden 的元素 scrollLeft 恒为 0 → 修复前红）
  const scrolled = await code.evaluate((el) => {
    el.scrollLeft = 60;
    return el.scrollLeft;
  });
  expect(scrolled).toBeGreaterThan(0);
});
