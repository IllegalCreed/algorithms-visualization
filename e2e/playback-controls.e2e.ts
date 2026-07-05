import { test, expect } from '@playwright/test';

test('TC-E2E-CTRL-01 播放控制增强：键盘三键 + 3× + 播完循环回卷', async ({ page }) => {
  await page.goto('/docs/heap-sort'); // 无 quiz 的页（quick-sort 已有题卡会拦键盘，见 C-112）
  await expect(page.locator('.counter')).toContainText('1 / ');

  // 键盘 → 两次、← 一次
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.counter')).toContainText('3 / ');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.counter')).toContainText('2 / ');

  // 空格播放 → 暂停图标；再空格暂停 → 播放三角
  await page.keyboard.press(' ');
  await expect(page.locator('.play svg rect').first()).toBeVisible();
  await page.keyboard.press(' ');
  await expect(page.locator('.play svg polygon').first()).toBeVisible();

  // 输入框聚焦时按 → 是移动光标，不走播放器
  await page.locator('input.ib-text').click();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.counter')).toContainText('2 / ');
  await page.locator('.caption').click(); // 移开焦点

  // 3× + 循环：拖到末步前一步，开循环播放 → 回卷（counter 变小）
  await page.locator('.speed').selectOption('3');
  await page.locator('.ctl-loop').click();
  await expect(page.locator('.ctl-loop')).toHaveClass(/ctl-active/);
  const max = await page.locator('.scrub').getAttribute('max');
  await page.locator('.scrub').evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, max!);
  const total = Number(max) + 1;
  await expect(page.locator('.counter')).toContainText(`${total} / ${total}`);
  await page.keyboard.press(' '); // 末步 + 循环开 → 从头播
  await expect(page.locator('.counter')).not.toContainText(`${total} / ${total}`, {
    timeout: 3000,
  });
});
