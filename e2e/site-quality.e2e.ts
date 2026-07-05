import { test, expect } from '@playwright/test';

test('TC-E2E-QUALITY-01 站点质量：meta/main 地标/img alt/robots+sitemap+llms', async ({
  page,
  request,
}) => {
  await page.goto('/');
  // meta description
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /算法可视化|92 个算法/,
  );
  // main 地标
  await expect(page.locator('main')).toHaveCount(1);
  // 首页网格 img 全带非空 alt
  const missing = await page
    .locator('#main-content img, .category img, main img')
    .evaluateAll((imgs) => imgs.filter((i) => !(i as HTMLImageElement).alt).length);
  expect(missing).toBe(0);

  // 静态文件三件套
  for (const [path, head] of [
    ['/robots.txt', 'User-agent'],
    ['/sitemap.xml', '<?xml'],
    ['/llms.txt', '# 算法可视化'],
  ] as const) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect((await res.text()).startsWith(head), path).toBe(true);
  }

  // OG 分享卡（C-118）
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /og-cover\.png/,
  );
  const og = await request.get('/og-cover.png');
  expect(og.status()).toBe(200);
});
