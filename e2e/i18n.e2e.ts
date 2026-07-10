import { test, expect, type Page } from '@playwright/test';

const HAN = /[\u3400-\u9fff]/;

async function alternateLinks(page: Page) {
  return page.locator('link[rel="alternate"][hreflang]').evaluateAll((links) =>
    links.map((link) => ({
      hreflang: link.getAttribute('hreflang'),
      href: link.getAttribute('href'),
    })),
  );
}

test('TC-E2E-I18N-126-01 英文首页与算法深链具有完整正文和 SEO', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('Algorithm Visualizer | Interactive Algorithms, Step by Step');
  await expect(page.locator('a.item')).toHaveCount(9);
  expect(await alternateLinks(page)).toEqual([
    { hreflang: 'zh-CN', href: 'https://algo.illegalscreed.cn/' },
    { hreflang: 'en', href: 'https://algo.illegalscreed.cn/en/' },
    { hreflang: 'x-default', href: 'https://algo.illegalscreed.cn/' },
  ]);

  await page.goto('/en/docs/kmp');
  await expect(page.locator('article h1')).toHaveText('KMP String Matching');
  await expect(page.locator('#menu .item')).toHaveCount(9);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://algo.illegalscreed.cn/en/docs/kmp/',
  );
  expect(await page.locator('#app').innerText()).not.toMatch(HAN);
});

test('TC-E2E-I18N-126-02 语言切换命中页面对、保留 input，并为未翻译页回退 Home', async ({
  page,
}) => {
  await page.goto('/docs/quick-sort?input=8,3,6');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/docs\/quick-sort\?input=8(?:%2C|,)3(?:%2C|,)6$/);
  await expect(page.locator('.bars-view .bar')).toHaveCount(3);
  await expect(page.locator('article h1')).toHaveText('Quick Sort');

  await page.getByRole('link', { name: 'ZH', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/quick-sort\?input=8(?:%2C|,)3(?:%2C|,)6$/);
  await expect(page.locator('article h1')).toContainText('快速排序');

  await page.goto('/docs/array?input=ignored');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('#english-home h1')).toHaveText('Algorithm Visualizer');
});

test('TC-E2E-I18N-126-03 英文搜索直达并完成播放器输入和题卡交互', async ({ page }) => {
  await page.goto('/en/docs/kmp');
  await expect(page.locator('article h1')).toHaveText('KMP String Matching');
  await page.keyboard.press('Control+k');
  await expect(page.locator('.search-palette')).toBeVisible();
  await page.locator('.sp-input').fill('quick sort');
  await expect(page.locator('.sp-item').first()).toContainText('Quick Sort');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/en\/docs\/quick-sort$/);
  await expect(page.locator('.ib-label')).toHaveText('Input');
  await page.locator('.ib-text').fill('9, 5, 1');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.locator('.bars-view .bar')).toHaveCount(3);
  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.locator('.quiz-card')).toBeVisible();
  await page.locator('.qc-option').first().click();
  await expect(page.getByRole('button', { name: /Continue/ })).toBeVisible();
});

test('TC-E2E-I18N-126-04 900px 窄桌面无横向溢出或 Header 控件重叠', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/en/docs/quick-sort');
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('.language-switch')).toBeVisible();
  await expect(page.locator('.search-btn')).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  const overlaps = await page.locator('#header #main > *:not(.blank)').evaluateAll((elements) => {
    const boxes = elements
      .map((element) => element.getBoundingClientRect())
      .filter((box) => box.width > 0)
      .sort((left, right) => left.x - right.x);
    return boxes.slice(1).filter((box, index) => box.x < boxes[index].right - 1).length;
  });
  expect(overlaps).toBe(0);
});
