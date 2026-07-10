import { expect, test, type Page } from '@playwright/test';

interface CapturedEvent {
  name: string;
  data: Record<string, unknown>;
}

const TRACKER_URL = 'https://cloud.umami.is/script.js';
const MOCK_TRACKER = `
  window.__umamiEvents = [];
  window.umami = {
    track(first, second) {
      if (typeof first === 'function') {
        const data = first({
          hostname: window.location.hostname,
          language: navigator.language,
          referrer: document.referrer,
          screen: window.screen.width + 'x' + window.screen.height,
          title: document.title,
          url: window.location.pathname + window.location.search,
          website: '123e4567-e89b-12d3-a456-426614174000'
        });
        window.__umamiEvents.push({
          name: data.name || 'page_view',
          data: data.name ? data.data || {} : data
        });
        return;
      }
      window.__umamiEvents.push({ name: first, data: second || {} });
    }
  };
`;

async function installMockTracker(page: Page): Promise<void> {
  await page.route(TRACKER_URL, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: MOCK_TRACKER,
    }),
  );
}

async function capturedEvents(page: Page): Promise<CapturedEvent[]> {
  return page.evaluate(() => {
    const scope = window as typeof window & { __umamiEvents?: CapturedEvent[] };
    return scope.__umamiEvents ?? [];
  });
}

test.beforeEach(async ({ page }) => {
  await installMockTracker(page);
});

test('TC-E2E-ANL-125-01 UTM 深链与 SPA 导航发送去敏 page view', async ({ page }) => {
  await page.goto(
    '/docs/quick-sort?input=9,5,1&utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort#player',
  );
  await expect
    .poll(async () =>
      (await capturedEvents(page)).some(
        (event) =>
          event.name === 'page_view' && String(event.data.url).startsWith('/docs/quick-sort'),
      ),
    )
    .toBe(true);

  let pageViews = (await capturedEvents(page)).filter((event) => event.name === 'page_view');
  expect(pageViews).toHaveLength(1);
  expect(pageViews[0].data.url).toBe(
    '/docs/quick-sort?utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort',
  );
  expect(JSON.stringify(pageViews[0])).not.toContain('9,5,1');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://algo.illegalscreed.cn/docs/quick-sort/',
  );

  await page.getByRole('link', { name: 'Dijkstra 最短路', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/dijkstra$/);
  await expect
    .poll(
      async () => (await capturedEvents(page)).filter((event) => event.name === 'page_view').length,
    )
    .toBe(2);

  pageViews = (await capturedEvents(page)).filter((event) => event.name === 'page_view');
  expect(pageViews[1].data.url).toBe(
    '/docs/dijkstra?utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort',
  );
});

test('TC-E2E-ANL-125-02 核心交互只发送白名单属性', async ({ page }) => {
  await page.goto('/docs/quick-sort');
  await expect.poll(async () => (await capturedEvents(page)).length).toBeGreaterThanOrEqual(1);

  await page.locator('.play').click();
  await page.locator('.play').click();
  await page.locator('input.ib-text').fill('5, 3, 8, 1');
  await page.locator('button.ib-apply').click();

  await page.evaluate(() => {
    document.addEventListener(
      'click',
      (event) => {
        if ((event.target as Element | null)?.closest('a.icon-link')) event.preventDefault();
      },
      { capture: true, once: true },
    );
  });
  await page.getByTitle('分享到 X').click();

  await page.locator('.search-btn').click();
  await page.locator('.sp-input').fill('quick sort');
  await page.locator('.sp-item').filter({ hasText: '快速排序' }).first().click();

  await expect
    .poll(
      async () => (await capturedEvents(page)).filter((event) => event.name !== 'page_view').length,
    )
    .toBeGreaterThanOrEqual(4);
  const events = (await capturedEvents(page)).filter((event) => event.name !== 'page_view');
  expect(events.map((event) => event.name)).toEqual(
    expect.arrayContaining(['play', 'input_apply', 'share', 'search']),
  );

  const serialized = JSON.stringify(events);
  expect(serialized).not.toContain('5, 3, 8, 1');
  expect(serialized).not.toContain('quick sort');
  expect(events.find((event) => event.name === 'input_apply')?.data.item_count).toBe(4);
  expect(events.find((event) => event.name === 'share')?.data).toMatchObject({
    channel: 'x',
    path: '/docs/quick-sort',
  });
  expect(events.find((event) => event.name === 'search')?.data).toMatchObject({
    action: 'select',
    query_length: 10,
    selected_slug: 'quick-sort',
  });
});
