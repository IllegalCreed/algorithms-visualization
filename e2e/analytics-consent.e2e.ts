import { expect, test } from '@playwright/test';

test('TC-E2E-ANL-135-01 开发态同意 UI 不产生 Google 请求且不阻塞导航', async ({ page }) => {
  const googleRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('googletagmanager.com/gtag/js')) {
      googleRequests.push(request.url());
    }
  });

  await page.goto('/');
  await expect(page.getByTestId('analytics-consent-panel')).toBeVisible();
  await page.getByRole('button', { name: '拒绝' }).click();
  await page.getByRole('link', { name: '开始学习' }).click();

  await expect(page).toHaveURL(/\/docs/);
  expect(googleRequests).toEqual([]);
});
