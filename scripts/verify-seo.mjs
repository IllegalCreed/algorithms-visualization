import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const SITE_ORIGIN = 'https://algo.illegalscreed.cn';
const DIST_DIR = resolve(process.cwd(), 'dist');

function readArgument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function expectedBaseFor(mode) {
  if (mode === 'production') return '/algorithms-visualization/';
  if (mode === 'selfhost') return '/';
  throw new Error(`不支持的 SEO 验证 mode: ${mode}`);
}

function canonicalFor(path) {
  const canonicalPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  return new URL(canonicalPath, `${SITE_ORIGIN}/`).toString();
}

function expectedAlternatesFor(path, localizedSlugs) {
  let chinesePath;
  let englishPath;

  if (path === '/' || path === '/en') {
    chinesePath = '/';
    englishPath = '/en';
  } else {
    const chineseMatch = path.match(/^\/docs\/([^/]+)$/);
    const englishMatch = path.match(/^\/en\/docs\/([^/]+)$/);
    const slug = chineseMatch?.[1] ?? englishMatch?.[1];
    if (!slug || !localizedSlugs.has(slug)) return [];
    chinesePath = `/docs/${slug}`;
    englishPath = `/en/docs/${slug}`;
  }

  const chineseCanonical = canonicalFor(chinesePath);
  return [
    { hreflang: 'zh-CN', href: chineseCanonical },
    { hreflang: 'en', href: canonicalFor(englishPath) },
    { hreflang: 'x-default', href: chineseCanonical },
  ];
}

async function readText(relativePath) {
  return readFile(resolve(DIST_DIR, relativePath), 'utf8');
}

function assertUnique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} 存在重复项`);
}

function assertLocalAssetBase(document, base, pagePath) {
  const elements = document.querySelectorAll(
    'script[src], link[rel="stylesheet"][href], link[rel="modulepreload"][href], link[rel="icon"][href]',
  );

  for (const element of elements) {
    const value = element.getAttribute('src') ?? element.getAttribute('href') ?? '';
    if (!value || /^(?:https?:|data:|blob:)/.test(value)) continue;

    assert.ok(value.startsWith('/'), `${pagePath} 本地资源不是绝对路径: ${value}`);
    if (base === '/') {
      assert.ok(
        !value.startsWith('/algorithms-visualization/'),
        `${pagePath} selfhost 混入 Pages base: ${value}`,
      );
    } else {
      assert.ok(value.startsWith(base), `${pagePath} 资源未使用 ${base}: ${value}`);
    }
  }
}

function assertStaticRouteLinks(document, base, pagePath) {
  const basePrefix = base === '/' ? '' : base.replace(/\/$/, '');

  for (const anchor of document.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href') ?? '';
    if (!href.startsWith('/')) continue;

    const url = new URL(href, 'https://preview.local');
    const routePath = basePrefix ? url.pathname.slice(basePrefix.length) : url.pathname;
    const isIndexableRoute =
      routePath === '/en' || routePath.startsWith('/docs/') || routePath.startsWith('/en/docs/');
    if (!isIndexableRoute) continue;

    assert.ok(routePath.endsWith('/'), `${pagePath} 静态内链缺少尾斜杠: ${href}`);
  }
}

function graphTypes(jsonLd) {
  assert.equal(jsonLd?.['@context'], 'https://schema.org', 'JSON-LD @context 错误');
  assert.ok(Array.isArray(jsonLd?.['@graph']), 'JSON-LD 缺少 @graph');
  return jsonLd['@graph'].map((node) => node?.['@type']);
}

async function verifyPage(page, base, localizedSlugs) {
  const html = await readText(page.outputPath);
  const dom = new JSDOM(html, { url: page.canonical });
  const { document } = dom.window;
  const prefix = `${page.path} (${page.outputPath})`;

  assert.equal(document.documentElement.lang, page.locale, `${prefix} lang 错误`);
  assert.equal(document.title, page.title, `${prefix} title 错误`);
  assert.equal(
    document.querySelector('meta[name="description"]')?.getAttribute('content'),
    page.description,
    `${prefix} description 错误`,
  );
  assert.equal(
    document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    page.robots,
    `${prefix} robots 错误`,
  );
  assert.equal(
    document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    page.canonical,
    `${prefix} canonical 错误`,
  );
  assert.equal(
    document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    page.canonical,
    `${prefix} og:url 错误`,
  );
  assert.equal(
    document.querySelector('meta[property="og:locale"]')?.getAttribute('content'),
    page.locale === 'en' ? 'en_US' : 'zh_CN',
    `${prefix} og:locale 错误`,
  );
  assert.equal(
    document.querySelectorAll('link[rel="canonical"]').length,
    1,
    `${prefix} canonical 重复`,
  );
  assert.equal(document.querySelectorAll('#seo-json-ld').length, 1, `${prefix} JSON-LD 重复`);
  const alternates = [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(
    (link) => ({
      hreflang: link.getAttribute('hreflang') ?? '',
      href: link.getAttribute('href') ?? '',
    }),
  );
  const expectedAlternates = expectedAlternatesFor(page.path, localizedSlugs);
  assert.deepEqual(page.alternates, expectedAlternates, `${prefix} manifest alternate 错误`);
  assert.deepEqual(alternates, expectedAlternates, `${prefix} HTML alternate 错误`);

  const appText = document.querySelector('#app')?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  assert.ok(appText.length >= 80, `${prefix} #app 正文过短，疑似空壳 (${appText.length})`);
  if (page.locale === 'en') {
    assert.doesNotMatch(appText, /[\u3400-\u9fff]/, `${prefix} 英文可见文本残留中文`);
  }

  if (page.name === 'home' || page.name === 'en-home') {
    assert.ok(document.querySelector('h1')?.textContent?.trim(), `${prefix} 缺少 h1`);
  } else {
    const article = document.querySelector('article');
    const articleText = article?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    assert.ok(article?.querySelector('h1')?.textContent?.trim(), `${prefix} 缺少 article h1`);
    assert.ok(
      articleText.length >= 200,
      `${prefix} article 正文过短，疑似只渲染外壳 (${articleText.length})`,
    );
  }

  const jsonLdText = document.querySelector('#seo-json-ld')?.textContent ?? '';
  const types = graphTypes(JSON.parse(jsonLdText));
  if (page.name === 'home' || page.name === 'en-home') {
    assert.deepEqual(types, ['WebSite', 'SoftwareApplication'], `${prefix} 首页 JSON-LD 类型错误`);
  } else {
    assert.deepEqual(
      types,
      ['LearningResource', 'BreadcrumbList'],
      `${prefix} 内容页 JSON-LD 类型错误`,
    );
  }

  assertLocalAssetBase(document, base, page.path);
  assertStaticRouteLinks(document, base, page.path);
}

async function main() {
  const mode = readArgument('mode', 'production');
  const expectedBase = expectedBaseFor(mode);
  const manifest = JSON.parse(await readText('seo-manifest.json'));

  assert.equal(manifest.mode, mode, 'manifest mode 错误');
  assert.equal(manifest.base, expectedBase, 'manifest base 错误');
  assert.equal(manifest.origin, SITE_ORIGIN, 'manifest origin 错误');
  assert.ok(Array.isArray(manifest.pages), 'manifest pages 缺失');
  const chinesePages = manifest.pages.filter((page) => page.locale === 'zh-CN');
  const englishPages = manifest.pages.filter((page) => page.locale === 'en');
  const localizedSlugs = new Set(
    englishPages
      .filter((page) => page.path !== '/en')
      .map((page) => page.path.match(/^\/en\/docs\/([^/]+)$/)?.[1]),
  );

  assert.ok(!localizedSlugs.has(undefined), 'manifest 包含非法英文内容路径');
  assert.equal(chinesePages.length, 95, 'manifest 必须包含 95 个中文页');
  assert.deepEqual(manifest.counts, {
    total: manifest.pages.length,
    zhCN: chinesePages.length,
    en: englishPages.length,
  });
  assert.equal(manifest.pages.length, chinesePages.length + englishPages.length);
  assert.equal(
    manifest.pages.filter((page) => page.alternates?.length === 3).length,
    englishPages.length * 2,
    '每个英文页及其中文 counterpart 都必须包含三组 alternate',
  );

  const canonicalSet = new Set(manifest.pages.map((page) => page.canonical));
  for (const page of englishPages) {
    const chinesePath = page.path === '/en' ? '/' : page.path.replace(/^\/en/, '');
    assert.ok(canonicalSet.has(canonicalFor(chinesePath)), `${page.path} 缺少中文 counterpart`);
  }

  assertUnique(
    manifest.pages.map((page) => page.name),
    'manifest name',
  );
  assertUnique(
    manifest.pages.map((page) => page.path),
    'manifest path',
  );
  assertUnique(
    manifest.pages.map((page) => page.title),
    'manifest title',
  );
  assertUnique(
    manifest.pages.map((page) => page.canonical),
    'manifest canonical',
  );

  const sitemapDom = new JSDOM(await readText('sitemap.xml'), { contentType: 'text/xml' });
  assert.equal(sitemapDom.window.document.querySelector('parsererror'), null, 'sitemap XML 无效');
  const sitemapUrls = [...sitemapDom.window.document.querySelectorAll('loc')].map(
    (node) => node.textContent?.trim() ?? '',
  );
  const canonicalUrls = manifest.pages.map((page) => page.canonical);
  assert.deepEqual(
    [...sitemapUrls].sort(),
    [...canonicalUrls].sort(),
    'sitemap 与 manifest URL 不一致',
  );

  const llms = await readText('llms.txt');
  for (const canonical of canonicalUrls) {
    assert.ok(llms.includes(canonical), `llms.txt 缺少 ${canonical}`);
  }

  for (const page of manifest.pages) {
    assert.equal(page.canonical, canonicalFor(page.path));
    await verifyPage(page, expectedBase, localizedSlugs);
  }

  console.log(`[verify-seo] ${mode}: ${manifest.pages.length} pages verified (${expectedBase})`);
}

await main();
