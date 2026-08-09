import { test, expect } from '@playwright/test';

test('TC-E2E-BA-01 二分答案全模板：答案空间柱轨 / 拖到末步收官语义', async ({ page }) => {
  await page.goto('/docs/binary-answer');

  // 全模板①：介绍正文 Article（h1 含「二分答案」）
  await expect(page.locator('.article h1')).toContainText('二分答案');

  // 全模板②③：主柱轨（柱子=候选答案）+ 代码播放器 + 默认停第 0 步
  await expect(page.locator('.bars-view')).toBeVisible();
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 真机 Shiki 着色
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  const scrub = page.locator('.scrub');
  const setScrub = (v: string) =>
    scrub.evaluate((el: HTMLInputElement, val: string) => {
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, v);

  // 拖到末步 → 字幕含答案空间
  const max = await scrub.getAttribute('max');
  await setScrub(max!);
  await expect(page.locator('.caption')).toContainText('答案空间');
});

test('TC-PLAYER-GRID-139-03 二分答案桌面柱轨不侵入代码面板', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/docs/binary-answer');

  const bars = page.locator('.bars-view .bars');
  const visual = page.locator('.visual-pane');
  const code = page.locator('.code-panel');
  const explanation = page.locator('.explanation-pane');
  const vars = page.locator('.var-panel');

  await expect(page.locator('.bars-view .bar-cell')).toHaveCount(11);
  const [barsBox, visualBox, codeBox] = await Promise.all([
    bars.boundingBox(),
    visual.boundingBox(),
    code.boundingBox(),
  ]);
  expect(barsBox).not.toBeNull();
  expect(visualBox).not.toBeNull();
  expect(codeBox).not.toBeNull();

  expect(barsBox!.x + barsBox!.width).toBeLessThanOrEqual(codeBox!.x);
  expect(visualBox!.x).toBeLessThan(codeBox!.x);
  expect(Math.abs(visualBox!.y - codeBox!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(visualBox!.height - codeBox!.height)).toBeLessThanOrEqual(1);

  await expect(explanation).toBeVisible();
  const [explanationBox, varsBox] = await Promise.all([
    explanation.boundingBox(),
    vars.boundingBox(),
  ]);
  expect(explanationBox).not.toBeNull();
  expect(varsBox).not.toBeNull();
  expect(explanationBox!.x).toBeLessThan(varsBox!.x);
  expect(Math.abs(explanationBox!.y - varsBox!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(explanationBox!.height - varsBox!.height)).toBeLessThanOrEqual(1);
});

test('TC-PLAYER-GRID-139-04 四面板窄屏按阅读顺序单列且不横溢', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/docs/binary-answer');

  const selectors = ['.visual-pane', '.explanation-pane', '.code-panel', '.var-panel'];
  const boxes = [];
  for (const selector of selectors) {
    const target = page.locator(selector);
    await expect(target).toBeVisible();
    boxes.push(await target.boundingBox());
  }

  expect(boxes.every(Boolean)).toBe(true);
  expect(boxes[0]!.y).toBeLessThan(boxes[1]!.y);
  expect(boxes[1]!.y).toBeLessThan(boxes[2]!.y);
  expect(boxes[2]!.y).toBeLessThan(boxes[3]!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(900);
});
