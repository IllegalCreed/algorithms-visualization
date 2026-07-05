import { test, expect } from '@playwright/test';

test('TC-E2E-QUIZ-01 测验模式：二分页自动播被题卡拦 → 答对续播 → 末步成绩', async ({ page }) => {
  await page.goto('/docs/binary-search');

  // 播放 → 到首个探针步被题卡拦停
  await page.locator('.play').click();
  await expect(page.locator('.quiz-card')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.qc-question')).toContainText('候选区间');
  // 拦停确认：暂停图标消失（回到播放三角）
  await expect(page.locator('.play svg polygon').first()).toBeVisible();

  // 答对 → ✓ 态 + 继续播放按钮
  await page.locator('.qc-option').first().click();
  await expect(page.locator('.qc-option.qc-correct')).toBeVisible();
  await page.locator('.qc-resume').click();

  // 续播确认：暂停图标出现
  await expect(page.locator('.play svg rect').first()).toBeVisible();
  await page.locator('.play').click(); // 暂停，准备拖动

  // 拖到末步 → 成绩行
  const max = await page.locator('.scrub').getAttribute('max');
  await page.locator('.scrub').evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, max!);
  await expect(page.locator('.quiz-score')).toContainText('1 / 2');

  // 固定剧本页无题卡（回归）
  await page.goto('/docs/lca');
  await expect(page.locator('.quiz-card')).toHaveCount(0);
});
