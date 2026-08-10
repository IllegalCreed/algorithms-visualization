import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem('illegalcreed.analytics-consent.v1', 'denied');
  });
});

async function expectNoPageOverflow(page: import('@playwright/test').Page): Promise<void> {
  const geometry = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(geometry.document).toBeLessThanOrEqual(geometry.viewport);
  expect(geometry.body).toBeLessThanOrEqual(geometry.viewport);
}

test('TC-RESPONSIVE-140-01 中文与英文首页在手机宽度无横向溢出且导航可触控', async ({ page }) => {
  for (const path of ['/', '/en']) {
    await page.goto(path);
    await expectNoPageOverflow(page);
    await expect(page.locator('#header')).toHaveCSS('height', '64px');
    await expect(page.locator('#mobile-menu-trigger')).toBeVisible();

    const triggerSize = await page.locator('#mobile-menu-trigger').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    expect(triggerSize.width).toBeGreaterThanOrEqual(40);
    expect(triggerSize.height).toBeGreaterThanOrEqual(40);

    await page.locator('#mobile-menu-trigger').click();
    await expect(page.locator('#mobile-nav-sheet')).toBeVisible();
    for (const locator of [
      page.locator('#mobile-nav-sheet .locale-option').first(),
      page.locator('#mobile-nav-sheet .mobile-external-links .icon-link').first(),
    ]) {
      const size = await locator.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
      expect(size.width).toBeGreaterThanOrEqual(44);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
    await page.locator('.search-btn').evaluate((element) => (element as HTMLElement).focus());
    await expect
      .poll(() =>
        page
          .locator('#mobile-nav-sheet')
          .evaluate((sheet) => sheet.contains(document.activeElement)),
      )
      .toBe(true);
    await page.getByRole('button', { name: /关闭菜单|Close menu/ }).click();
    await expect(page.locator('#mobile-nav-sheet')).toHaveCount(0);
  }
});

test('TC-RESPONSIVE-140-02 文档侧栏在手机变为抽屉，文章和播放器使用完整可用宽度', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/docs/binary-answer');
    await expectNoPageOverflow(page);
    await expect(page.locator('#header')).toHaveCSS('height', '64px');
    await expect(page.locator('#left')).toBeHidden();

    const geometry = await page.locator('#right').evaluate((element) => {
      const right = element.getBoundingClientRect();
      const article = element.querySelector('.article')?.getBoundingClientRect();
      const player = element.querySelector('.algo-player')?.getBoundingClientRect();
      return {
        rightWidth: right.width,
        rightTop: right.top,
        articleWidth: article?.width ?? 0,
        playerWidth: player?.width ?? 0,
      };
    });
    expect(geometry.rightWidth).toBeGreaterThanOrEqual(viewport.width - 1);
    expect(geometry.rightTop).toBeCloseTo(64, 0);
    expect(geometry.articleWidth).toBeGreaterThan(viewport.width - 40);
    expect(geometry.playerWidth).toBeGreaterThan(viewport.width - 50);

    await page.locator('#mobile-menu-trigger').click();
    await expect(page.locator('#docs-menu-drawer')).toBeVisible();
    await page.locator('.search-btn').evaluate((element) => (element as HTMLElement).focus());
    await expect
      .poll(() =>
        page
          .locator('#docs-menu-drawer')
          .evaluate((drawer) => drawer.contains(document.activeElement)),
      )
      .toBe(true);
    await expect(
      page.locator('#docs-menu-drawer').getByRole('link', { name: '链表' }),
    ).toBeVisible();
    await expect(page.locator('#docs-menu-drawer .mobile-language-switch')).toBeVisible();
    await expect(page.locator('#docs-menu-drawer .mobile-external-links a')).toHaveCount(4);
    await page.getByRole('button', { name: '关闭文章目录' }).click();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/binary-answer');
  await page.locator('#mobile-menu-trigger').click();
  await expect(page.locator('#docs-menu-drawer')).toBeVisible();
  await page.setViewportSize({ width: 1000, height: 700 });
  await expect(page.locator('#docs-menu-drawer')).toHaveCount(0);
  await expect(page.locator('#mobile-menu-trigger')).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');

  // Fixed-width structure tracks must start at the readable edge and scroll
  // inside their own wrapper instead of being symmetrically clipped.
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/docs/array');
  const structureTrack = page.locator('.array-viz .lane-wrap');
  const trackGeometry = await structureTrack.evaluate((element) => {
    const wrapper = element.getBoundingClientRect();
    const firstCell = element.querySelector('.cell')?.getBoundingClientRect();
    return {
      wrapperLeft: wrapper.left,
      wrapperRight: wrapper.right,
      firstCellLeft: firstCell?.left ?? -1,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    };
  });
  expect(trackGeometry.wrapperLeft).toBeGreaterThanOrEqual(0);
  expect(trackGeometry.wrapperRight).toBeLessThanOrEqual(320);
  expect(trackGeometry.firstCellLeft).toBeGreaterThanOrEqual(trackGeometry.wrapperLeft);
  expect(trackGeometry.scrollWidth).toBeGreaterThan(trackGeometry.clientWidth);
  await structureTrack.evaluate((element) => element.scrollTo({ left: element.scrollWidth }));
  await expect
    .poll(() => structureTrack.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
  await expectNoPageOverflow(page);

  for (const path of [
    '/docs/link',
    '/docs/queue',
    '/docs/tree',
    '/docs/heap',
    '/docs/hash',
    '/docs/graph',
    '/docs/trie',
    '/docs/union-find',
    '/docs/lru',
    '/docs/skip-list',
    '/docs/segment-tree',
    '/docs/b-tree',
  ]) {
    await page.goto(path);
    const wrappers = page.locator('.lane-wrap');
    await expect(wrappers.first()).toBeAttached();
    const geometries = await wrappers.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        };
      }),
    );
    expect(geometries.length).toBeGreaterThan(0);
    expect(geometries.every(({ left, right }) => left >= 0 && right <= 320)).toBe(true);
    expect(geometries.some(({ clientWidth, scrollWidth }) => scrollWidth > clientWidth)).toBe(true);
    const maxScrolls = await wrappers.evaluateAll((elements) =>
      elements
        .filter((element) => element.scrollWidth > element.clientWidth)
        .map((element) => {
          element.scrollLeft = element.scrollWidth;
          return element.scrollLeft;
        }),
    );
    expect(maxScrolls.every((scrollLeft) => scrollLeft > 0)).toBe(true);
    await expectNoPageOverflow(page);
  }
});

test('TC-RESPONSIVE-140-03 手机播放器按阅读顺序单列，控制器和语言按钮满足触控尺寸', async ({
  page,
}) => {
  await page.goto('/docs/binary-answer');

  const stage = page.locator('.player-stage');
  await expect(stage).toBeVisible();
  const layout = await stage.evaluate((element) => {
    const visual = element.querySelector('.visual-pane')!.getBoundingClientRect();
    const explanation = element.querySelector('.explanation-pane')!.getBoundingClientRect();
    const inspector = element.querySelector('.inspector-pane')!.getBoundingClientRect();
    return {
      columns: getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length,
      visualBottom: visual.bottom,
      explanationTop: explanation.top,
      explanationBottom: explanation.bottom,
      inspectorTop: inspector.top,
    };
  });
  expect(layout.columns).toBe(1);
  expect(layout.explanationTop).toBeGreaterThanOrEqual(layout.visualBottom);
  expect(layout.inspectorTop).toBeGreaterThanOrEqual(layout.explanationBottom);

  for (const locator of [
    page.locator('.transport .ctl').first(),
    page.locator('.code-panel .tab').first(),
  ]) {
    const size = await locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  }

  await expect(page.locator('.inspector-tabs')).toBeVisible();
  await expect(page.locator('.var-pane')).toBeHidden();
  await page.locator('.inspector-tab').nth(1).click();
  await expect(page.locator('.code-pane')).toBeHidden();
  await expect(page.locator('.var-pane')).toBeVisible();

  // Advancing to a later highlighted line must scroll only the code pane. A
  // page-level scrollIntoView would hide the article heading on a phone.
  const pageScrollBefore = await page.evaluate(() => window.scrollY);
  const next = page.locator('.transport button[aria-label="下一步"]');
  for (let i = 0; i < 6; i += 1) {
    await next.evaluate((element) => (element as HTMLElement).click());
    await page.waitForTimeout(40);
  }
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScrollBefore);
  await expect(page.locator('.counter')).toContainText('/ 7');
  await expectNoPageOverflow(page);

  // The mobile segmented tabs disappear when crossing to desktop. Both
  // inspector regions must remain visible and focus cannot be discarded.
  await page.locator('.inspector-tab').nth(1).focus();
  await page.setViewportSize({ width: 1000, height: 700 });
  await expect(page.locator('.inspector-tabs')).toHaveCount(0);
  await expect(page.locator('.code-pane')).toBeVisible();
  await expect(page.locator('.var-pane')).toBeVisible();
  await expect(page.locator('.code-pane')).toHaveAttribute('role', 'region');
  await expect(page.locator('.var-pane')).toHaveAttribute('role', 'region');
  await expect.poll(() => page.evaluate(() => document.activeElement !== document.body)).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.inspector-tabs')).toHaveCount(1);
  await expect(page.locator('.inspector-tab').nth(1)).toBeFocused();
  await expect(page.locator('.var-pane')).toHaveAttribute('role', 'tabpanel');
  await expect(page.locator('.var-pane')).toBeVisible();
  await expect(page.locator('.code-pane')).toBeHidden();
});

test('TC-RESPONSIVE-140-04 文档路由切换复位内容滚动位置', async ({ page }) => {
  await page.goto('/docs/binary-answer');
  await expect(page.locator('.article h1')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 800));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await page.locator('#mobile-menu-trigger').click();
  await page.locator('#docs-menu-drawer').getByRole('link', { name: '链表' }).click();
  await expect(page).toHaveURL(/\/docs\/link$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('.article h1')).toBeFocused();
});

test('TC-RESPONSIVE-140-06 手机目录与搜索互斥且关闭后释放页面滚动', async ({ page }) => {
  await page.goto('/docs/binary-answer');
  await page.locator('#mobile-menu-trigger').click();
  await expect(page.locator('#docs-menu-drawer')).toBeVisible();

  await page.keyboard.press('Control+K');
  await expect(page.locator('#docs-menu-drawer')).toHaveCount(0);
  await expect(page.locator('.search-palette')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(1);

  await page.getByRole('button', { name: '关闭搜索' }).click();
  await expect(page.locator('.search-palette')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');

  await page.goto('/');
  await expect(page.locator('#start-btn')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await page.keyboard.press('Control+k');
  await expect(page.locator('.sp-input')).toBeVisible();
  await page.locator('.sp-input').fill('二分答案');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/binary-answer$/);
  await expect(page.locator('.article h1')).toBeFocused();

  // Selecting the page already being viewed is a same-route navigation: the
  // search dialog closes and focus should land on the article heading rather
  // than on document.body.
  await page.goto('/docs/binary-answer');
  await expect(page.locator('.article h1')).toBeVisible();
  await page.keyboard.press('Control+k');
  await expect(page.locator('.sp-input')).toBeVisible();
  await page.locator('.sp-input').fill('二分答案');
  await page.locator('.sp-item').first().click();
  await expect(page.locator('.article h1')).toBeFocused();
});
