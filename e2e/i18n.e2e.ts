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

test('TC-E2E-I18N-131-01 英文首页与算法深链具有完整正文和 SEO', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('Algorithm Visualizer | Interactive Algorithms, Step by Step');
  await expect(page.locator('a.item')).toHaveCount(94);
  expect(await alternateLinks(page)).toEqual([
    { hreflang: 'zh-CN', href: 'https://algo.illegalscreed.cn/' },
    { hreflang: 'en', href: 'https://algo.illegalscreed.cn/en/' },
    { hreflang: 'x-default', href: 'https://algo.illegalscreed.cn/' },
  ]);

  await page.goto('/en/docs/kmp');
  await expect(page.locator('article h1')).toHaveText('KMP String Matching');
  await expect(page.locator('#menu .item')).toHaveCount(94);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://algo.illegalscreed.cn/en/docs/kmp/',
  );
  expect(await page.locator('#app').innerText()).not.toMatch(HAN);
});

test('TC-E2E-I18N-131-02 工具页覆盖 92 学习页且新分类代表轨道可渲染', async ({ page }) => {
  await page.goto('/en/docs/complexity');
  await expect(page.locator('.complexity-table tbody tr')).toHaveCount(92);
  await page.locator('.complexity-search').fill('manacher');
  await expect(page.locator('.complexity-table tbody tr')).toHaveCount(1);

  await page.goto('/en/docs/paths');
  await expect(page.locator('.learning-path')).toHaveCount(8);
  await expect(page.locator('.learning-path li')).toHaveCount(92);

  const representatives = [
    ['/en/docs/edit-distance', 'Edit Distance', '.matrix-view'],
    ['/en/docs/maze', 'Maze Solving with DFS', '.maze-view'],
    ['/en/docs/manacher', "Manacher's Longest Palindromic Substring", '.mn-view'],
    ['/en/docs/sieve-of-eratosthenes', 'Sieve of Eratosthenes', '.sieve-view'],
    ['/en/docs/gcd', 'Euclidean Algorithm', '.gcd-view'],
    ['/en/docs/cocktail-sort', 'Cocktail Shaker Sort', '.bars-view'],
    ['/en/docs/floyd-warshall', 'Floyd-Warshall', '.matrix-view'],
    ['/en/docs/complete-knapsack', 'Unbounded Knapsack', '.matrix-view'],
    ['/en/docs/astar', 'A* Search', '.maze-view'],
    ['/en/docs/suffix-array', 'Suffix Array', '.suffix-array-view'],
    ['/en/docs/fft', 'Fast Fourier Transform', '.network-view'],
    ['/en/docs/segment-intersection', 'Line Segment Intersection', '.hull-view'],
    ['/en/docs/rotated-search', 'Search in a Rotated Sorted Array', '.bars-view'],
  ] as const;

  for (const [path, heading, track] of representatives) {
    await page.goto(path);
    await expect(page.locator('article h1')).toHaveText(heading);
    await expect(page.locator(track)).toBeVisible();
    expect(await page.locator('#app').innerText()).not.toMatch(HAN);
  }
});

test('TC-E2E-I18N-131-03 语言切换命中完整页面对并保留 input', async ({ page }) => {
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
  await expect(page).toHaveURL(/\/en\/docs\/array\?input=ignored$/);
  await expect(page.locator('article h1')).toHaveText('Array');
  await expect(page.locator('.array-viz')).toBeVisible();
  expect(await page.locator('#app').innerText()).not.toMatch(HAN);
});

test('TC-E2E-I18N-131-04 英文搜索直达并完成播放器输入和题卡交互', async ({ page }) => {
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

test('TC-E2E-I18N-131-05 900px 窄桌面无横向溢出或 Header 控件重叠', async ({ page }) => {
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

test('TC-E2E-I18N-131-06 英文数据结构页交互后仍无中文残留', async ({ page }) => {
  await page.goto('/en/docs/hash');
  await expect(page.locator('article h1')).toHaveText('Hash Table');
  const chaining = page.locator('.hash-viz');
  await chaining.locator('input').fill('22');
  await chaining.getByRole('button', { name: 'Insert', exact: true }).click();
  await expect(chaining.locator('.status')).toContainText('hash(22)');
  expect(await chaining.innerText()).not.toMatch(HAN);

  await page.goto('/en/docs/bloom-filter');
  await page.locator('.bloom-viz').getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.locator('.bloom-viz .status')).toContainText('Add 3');
  expect(await page.locator('#app').innerText()).not.toMatch(HAN);
});

test('TC-E2E-I18N-131-07 新增播放器字幕、变量与源码面板保持英文', async ({ page }) => {
  const paths = [
    '/en/docs/three-way-quick-sort',
    '/en/docs/two-sat',
    '/en/docs/digit-dp',
    '/en/docs/aho-corasick',
    '/en/docs/pollard-rho',
    '/en/docs/bentley-ottmann',
    '/en/docs/binary-answer',
  ];

  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator('.algo-player')).toBeVisible();
    await page.getByRole('button', { name: 'Next step' }).click();
    expect(await page.locator('.algo-player').innerText()).not.toMatch(HAN);
    await expect(page.locator('.code-panel')).toBeVisible();
  }
});
