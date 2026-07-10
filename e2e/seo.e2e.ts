import { test, expect, type Page } from '@playwright/test';

async function jsonLdTypes(page: Page): Promise<string[]> {
  return page.locator('#seo-json-ld').evaluate((script) => {
    const value = JSON.parse(script.textContent ?? '{}') as {
      '@graph'?: Array<{ '@type'?: string }>;
    };
    return value['@graph']?.flatMap((node) => (node['@type'] ? [node['@type']] : [])) ?? [];
  });
}

test('TC-E2E-SEO-124-01 直接访问首页与深链时 head 和 JSON-LD 正确', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page).toHaveTitle('数据结构和算法可视化 | 92 个交互式学习条目');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://algo.illegalscreed.cn/',
  );
  expect(await jsonLdTypes(page)).toEqual(['WebSite', 'SoftwareApplication']);

  await page.goto('/docs/quick-sort');
  await expect(page).toHaveTitle('快速排序可视化 | 数据结构和算法可视化');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://algo.illegalscreed.cn/docs/quick-sort/',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index,follow,max-image-preview:large',
  );
  expect(await jsonLdTypes(page)).toEqual(['LearningResource', 'BreadcrumbList']);
});

test('TC-E2E-SEO-124-02 SPA 导航更新 head 且不产生重复标签', async ({ page }) => {
  await page.goto('/docs/quick-sort');
  await page.getByRole('link', { name: 'Dijkstra 最短路', exact: true }).click();

  await expect(page).toHaveURL(/\/docs\/dijkstra$/);
  await expect(page).toHaveTitle('Dijkstra 最短路可视化 | 数据结构和算法可视化');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://algo.illegalscreed.cn/docs/dijkstra/',
  );

  for (const selector of [
    'meta[name="description"]',
    'meta[name="robots"]',
    'meta[property="og:title"]',
    'meta[property="og:url"]',
    'meta[name="twitter:title"]',
    'link[rel="canonical"]',
    'script#seo-json-ld',
  ]) {
    await expect(page.locator(selector), selector).toHaveCount(1);
  }
});

test('TC-E2E-SEO-124-03 自定义输入 query 生效但不进入 canonical', async ({ page }) => {
  await page.goto('/docs/quick-sort?input=8,3,6');

  await expect(page.locator('.bars-view .bar')).toHaveCount(3);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://algo.illegalscreed.cn/docs/quick-sort/',
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://algo.illegalscreed.cn/docs/quick-sort/',
  );
});
