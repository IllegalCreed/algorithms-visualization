import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { preview } from 'vite';

const SITE_ORIGIN = 'https://algo.illegalscreed.cn';
const DIST_DIR = resolve(process.cwd(), 'dist');
const PAGE_TIMEOUT_MS = 45_000;

function readArgument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function routeWithBase(path, base) {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');
  return path === '/' ? `${prefix}/` : `${prefix}${path}`;
}

function pathWithoutBase(pathname, base) {
  if (base === '/') return pathname;
  const prefix = base.replace(/\/$/, '');
  assert.ok(pathname.startsWith(prefix), `发现的 URL 未使用构建 base: ${pathname}`);
  return pathname.slice(prefix.length) || '/';
}

function outputPathFor(path) {
  return path === '/' ? 'index.html' : `${path.replace(/^\//, '')}/index.html`;
}

function canonicalFor(path) {
  const canonicalPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  return new URL(canonicalPath, `${SITE_ORIGIN}/`).toString();
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function escapeMarkdown(value) {
  return value.replaceAll('[', '\\[').replaceAll(']', '\\]').replace(/\s+/g, ' ').trim();
}

function buildSitemap(pages) {
  const urls = pages.map((page) => `  <url><loc>${escapeXml(page.canonical)}</loc></url>`);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

function buildLlms(pages) {
  const chineseCoreNames = new Set(['home', 'complexity', 'paths']);
  const lineFor = (page) =>
    `- [${escapeMarkdown(page.heading)}](${page.canonical}): ${escapeMarkdown(page.description)}`;
  const chinesePages = pages.filter((page) => page.locale === 'zh-CN');
  const englishPages = pages.filter((page) => page.locale === 'en');

  return [
    '# 数据结构和算法可视化 / Algorithm Visualizer',
    '',
    '> 面向中文学习者的交互式算法与数据结构学习站，包含 92 个可视化条目、四语言代码、可改输入、测验、复杂度速查与学习路径。',
    '',
    '> The English pilot contains ten translated entry points with the same interactive visual engines and synchronized code.',
    '',
    '本文件是面向机器读者的辅助导航，不代表搜索收录、排名或 AI 引用保证。',
    '',
    '## 中文核心入口',
    '',
    ...chinesePages.filter((page) => chineseCoreNames.has(page.name)).map(lineFor),
    '',
    '## 中文数据结构与算法页面',
    '',
    ...chinesePages.filter((page) => !chineseCoreNames.has(page.name)).map(lineFor),
    '',
    '## English Pilot',
    '',
    ...englishPages.map(lineFor),
    '',
  ].join('\n');
}

function previewOrigin(server) {
  const address = server.httpServer.address();
  assert.ok(address && typeof address !== 'string', '无法读取 Vite preview 端口');
  return `http://127.0.0.1:${address.port}`;
}

async function waitForPageReady(page, task) {
  await page.waitForFunction(
    (name) => document.documentElement.dataset.seoReady === name,
    task.name,
  );
  if (task.name === 'home' || task.name === 'en-home') {
    await page.locator('h1').first().waitFor({ state: 'visible' });
  } else {
    const article = page.locator('article').first();
    await article.waitFor({ state: 'visible' });
    await article.locator('h1').first().waitFor({ state: 'visible' });
    await page.waitForFunction(
      () => (document.querySelector('article')?.textContent?.trim().length ?? 0) >= 200,
    );
  }
  await page.waitForFunction(() => {
    const canonical = document.head.querySelector('link[rel="canonical"]');
    const description = document.head.querySelector('meta[name="description"]');
    const jsonLd = document.head.querySelector('#seo-json-ld');
    return Boolean(canonical && description && jsonLd?.textContent);
  });
}

async function normalizeStaticRouteLinks(page, base) {
  await page.evaluate((routeBase) => {
    const basePrefix = routeBase === '/' ? '' : routeBase.replace(/\/$/, '');

    for (const anchor of document.querySelectorAll('a[href]')) {
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) continue;

      const routePath = basePrefix ? url.pathname.slice(basePrefix.length) : url.pathname;
      const isStaticRoute =
        routePath === '/en' ||
        /^\/docs\/[^/]+$/.test(routePath) ||
        /^\/en\/docs\/[^/]+$/.test(routePath);
      if (!isStaticRoute) continue;

      url.pathname = `${url.pathname}/`;
      anchor.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    }
  }, base);
}

async function readRenderedMetadata(page) {
  return page.evaluate(() => ({
    name: document.documentElement.dataset.seoReady ?? '',
    locale: document.documentElement.lang,
    title: document.title,
    description:
      document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    canonical: document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
    robots: document.head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
    alternates: [...document.head.querySelectorAll('link[rel="alternate"][hreflang]')].map(
      (link) => ({
        hreflang: link.getAttribute('hreflang') ?? '',
        href: link.getAttribute('href') ?? '',
      }),
    ),
  }));
}

async function renderTask(context, origin, base, mode, task) {
  const page = await context.newPage();
  const errors = [];
  page.setDefaultTimeout(PAGE_TIMEOUT_MS);
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    errors.push(`requestfailed: ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`response: ${response.status()} ${response.url()}`);
  });

  try {
    const response = await page.goto(new URL(routeWithBase(task.path, base), origin).toString(), {
      waitUntil: 'networkidle',
      timeout: PAGE_TIMEOUT_MS,
    });
    assert.equal(response?.status(), 200, `${task.path} preview HTTP ${response?.status()}`);
    await waitForPageReady(page, task);

    const metadata = await readRenderedMetadata(page);
    assert.equal(metadata.name, task.name, `${task.path} seo-ready 名称错误`);
    assert.equal(metadata.locale, task.locale, `${task.path} lang 错误`);
    assert.equal(metadata.canonical, canonicalFor(task.path), `${task.path} canonical 错误`);
    assert.ok(metadata.title, `${task.path} title 为空`);
    assert.ok(metadata.description, `${task.path} description 为空`);
    assert.equal(metadata.robots, 'index,follow,max-image-preview:large');
    assert.deepEqual(errors, [], `${task.path} 浏览器错误:\n${errors.join('\n')}`);

    await normalizeStaticRouteLinks(page, base);

    const outputPath = outputPathFor(task.path);
    const absoluteOutputPath = resolve(DIST_DIR, outputPath);
    await mkdir(dirname(absoluteOutputPath), { recursive: true });
    await writeFile(absoluteOutputPath, await page.content());

    return {
      ...task,
      ...metadata,
      mode,
      outputPath,
      indexable: true,
    };
  } finally {
    await page.close();
  }
}

async function verifyStaticEntryResponse(origin, base, page) {
  const staticPath = page.path === '/' ? '/' : `${page.path.replace(/\/+$/, '')}/`;
  const response = await fetch(new URL(routeWithBase(staticPath, base), origin));
  assert.equal(response.status, 200, `${staticPath} 静态入口 HTTP ${response.status}`);

  const html = await response.text();
  assert.ok(html.includes(`data-seo-ready="${page.name}"`), `${staticPath} 未命中对应预渲染 HTML`);
  assert.ok(html.includes(`href="${page.canonical}"`), `${staticPath} canonical 未写入静态响应`);
}

async function discoverCatalog(context, origin, base) {
  const page = await context.newPage();
  page.setDefaultTimeout(PAGE_TIMEOUT_MS);
  try {
    const response = await page.goto(new URL(routeWithBase('/', base), origin).toString(), {
      waitUntil: 'networkidle',
      timeout: PAGE_TIMEOUT_MS,
    });
    assert.equal(response?.status(), 200, `首页 preview HTTP ${response?.status()}`);
    await waitForPageReady(page, { name: 'home' });

    const links = await page.locator('a.item').evaluateAll((anchors) =>
      anchors.map((anchor) => {
        const element = anchor;
        return {
          pathname: new URL(element.href).pathname,
          heading: element.querySelector('h3')?.textContent?.trim() ?? '',
          cardDescription: element.querySelector('span')?.textContent?.trim() ?? '',
        };
      }),
    );

    assert.equal(links.length, 92, `首页应发现 92 个 catalog 链接，实际 ${links.length}`);
    const tasks = links.map((link) => {
      const path = pathWithoutBase(link.pathname, base);
      const name = path.split('/').filter(Boolean).at(-1) ?? '';
      assert.ok(path.startsWith('/docs/'), `catalog 路径非法: ${path}`);
      assert.ok(name && link.heading && link.cardDescription, `catalog 数据不完整: ${path}`);
      return { name, path, heading: link.heading };
    });
    assert.equal(new Set(tasks.map((task) => task.path)).size, 92, 'catalog 路径存在重复');
    return tasks;
  } finally {
    await page.close();
  }
}

async function discoverEnglishPilot(context, origin, base) {
  const page = await context.newPage();
  page.setDefaultTimeout(PAGE_TIMEOUT_MS);
  try {
    const response = await page.goto(new URL(routeWithBase('/en', base), origin).toString(), {
      waitUntil: 'networkidle',
      timeout: PAGE_TIMEOUT_MS,
    });
    assert.equal(response?.status(), 200, `English Home preview HTTP ${response?.status()}`);
    await waitForPageReady(page, { name: 'en-home' });

    const links = await page.locator('a.item').evaluateAll((anchors) =>
      anchors.map((anchor) => ({
        pathname: new URL(anchor.href).pathname,
        heading: anchor.querySelector('h3')?.textContent?.trim() ?? '',
        cardDescription: anchor.querySelector('span')?.textContent?.trim() ?? '',
      })),
    );

    assert.equal(links.length, 9, `English Home 应发现 9 个内容链接，实际 ${links.length}`);
    const tasks = links.map((link) => {
      const path = pathWithoutBase(link.pathname, base);
      const slug = path.split('/').filter(Boolean).at(-1) ?? '';
      assert.ok(path.startsWith('/en/docs/'), `English pilot 路径非法: ${path}`);
      assert.ok(slug && link.heading && link.cardDescription, `English pilot 数据不完整: ${path}`);
      return { name: `en-${slug}`, path, heading: link.heading, locale: 'en' };
    });
    assert.equal(new Set(tasks.map((task) => task.path)).size, 9, 'English pilot 路径存在重复');
    return tasks;
  } finally {
    await page.close();
  }
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(items[index], index);
      }
    }),
  );

  return results;
}

async function main() {
  const startedAt = Date.now();
  const mode = readArgument('mode', 'production');
  const concurrency = Number(process.env.SEO_PRERENDER_WORKERS ?? 4);
  assert.ok(Number.isInteger(concurrency) && concurrency > 0, 'SEO_PRERENDER_WORKERS 必须为正整数');

  let server;
  let browser;
  try {
    server = await preview({
      mode,
      logLevel: 'warn',
      preview: { host: '127.0.0.1', port: 4173, strictPort: false },
    });
    const base = server.config.base;
    const origin = previewOrigin(server);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    const catalogTasks = (await discoverCatalog(context, origin, base)).map((task) => ({
      ...task,
      locale: 'zh-CN',
    }));
    const englishTasks = await discoverEnglishPilot(context, origin, base);
    const tasks = [
      { name: 'home', path: '/', heading: '数据结构和算法可视化', locale: 'zh-CN' },
      {
        name: 'complexity',
        path: '/docs/complexity',
        heading: '算法复杂度速查',
        locale: 'zh-CN',
      },
      { name: 'paths', path: '/docs/paths', heading: '算法学习路径', locale: 'zh-CN' },
      ...catalogTasks,
      { name: 'en-home', path: '/en', heading: 'Algorithm Visualizer', locale: 'en' },
      ...englishTasks,
    ];
    assert.equal(tasks.length, 105);
    assert.equal(new Set(tasks.map((task) => task.name)).size, 105, '预渲染 name 存在重复');
    assert.equal(new Set(tasks.map((task) => task.path)).size, 105, '预渲染 path 存在重复');

    const pages = await mapWithConcurrency(tasks, concurrency, (task) =>
      renderTask(context, origin, base, mode, task),
    );
    await mapWithConcurrency(pages, 8, (page) => verifyStaticEntryResponse(origin, base, page));
    const manifest = {
      mode,
      base,
      origin: SITE_ORIGIN,
      generatedAt: new Date().toISOString(),
      pages,
    };

    await writeFile(
      resolve(DIST_DIR, 'seo-manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
    await writeFile(resolve(DIST_DIR, 'sitemap.xml'), buildSitemap(pages));
    await writeFile(resolve(DIST_DIR, 'llms.txt'), buildLlms(pages));

    const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
    console.log(
      `[prerender] ${mode}: ${pages.length} pages, base=${base}, workers=${concurrency}, ${elapsedSeconds}s`,
    );
  } finally {
    await browser?.close();
    await server?.close();
  }
}

await main();
