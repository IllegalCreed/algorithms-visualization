import { describe, expect, it } from 'vitest';
import router from '@/router';
import { useCategoryData } from '@/views/Home/Main/hooks';
import robots from '../../public/robots.txt?raw';
import { buildJsonLd, getIndexablePages, resolveSeoPage, SITE_ORIGIN } from './site';

interface JsonLdNode {
  '@type'?: string;
  itemListElement?: Array<{ item?: string }>;
}

function graphTypes(value: ReturnType<typeof buildJsonLd>): string[] {
  return value['@graph'].flatMap((node: JsonLdNode) =>
    typeof node['@type'] === 'string' ? [node['@type']] : [],
  );
}

function expectedCanonical(path: string): string {
  const canonicalPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  return new URL(canonicalPath, SITE_ORIGIN).toString();
}

describe('SEO page registry', () => {
  it('TC-SEO-PAGES-124-01: 95 个页面的 name/path/title/canonical 唯一且描述非空', () => {
    const pages = getIndexablePages();

    expect(pages).toHaveLength(95);
    expect(new Set(pages.map((page) => page.name)).size).toBe(95);
    expect(new Set(pages.map((page) => page.path)).size).toBe(95);
    expect(new Set(pages.map((page) => page.title)).size).toBe(95);
    expect(new Set(pages.map((page) => page.canonical)).size).toBe(95);

    for (const page of pages) {
      expect(page.description.trim().length).toBeGreaterThan(10);
      expect(page.heading.trim().length).toBeGreaterThan(0);
      expect(page.indexable).toBe(true);
    }
  });

  it('TC-SEO-PAGES-124-02: registry 与 router 可索引路由和 Home 92 条 catalog 对齐', () => {
    const pages = getIndexablePages();
    const pageNames = pages.map((page) => page.name).sort();
    const routeNames = router
      .getRoutes()
      .map((route) => String(route.name ?? ''))
      .filter((name) => name && name !== 'docs' && name !== 'about')
      .sort();
    const catalogSlugs = useCategoryData().flatMap((category) =>
      category.children.map((item) => item.url),
    );

    expect(pageNames).toEqual(routeNames);
    expect(catalogSlugs).toHaveLength(92);
    expect(pages.filter((page) => catalogSlugs.includes(page.name))).toHaveLength(92);
  });

  it('TC-SEO-PAGES-124-03: canonical 统一主站且非索引路由回退 noindex', () => {
    for (const page of getIndexablePages()) {
      expect(page.canonical).toBe(expectedCanonical(page.path));
      expect(page.robots).toBe('index,follow,max-image-preview:large');
    }

    expect(resolveSeoPage('quick-sort', '/docs/quick-sort?input=9,5,1').canonical).toBe(
      `${SITE_ORIGIN}/docs/quick-sort/`,
    );
    expect(resolveSeoPage('docs', '/docs')).toMatchObject({
      indexable: false,
      robots: 'noindex,nofollow',
    });
    expect(resolveSeoPage('about', '/about')).toMatchObject({
      indexable: false,
      robots: 'noindex,nofollow',
    });
    expect(resolveSeoPage(null, '')).toMatchObject({
      name: 'unknown',
      path: '/',
      canonical: `${SITE_ORIGIN}/`,
      indexable: false,
    });
  });
});

describe('SEO JSON-LD', () => {
  it('TC-GEO-JSONLD-124-01: 首页包含 WebSite 与 SoftwareApplication', () => {
    const page = resolveSeoPage('home', '/');
    const jsonLd = buildJsonLd(page);

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(graphTypes(jsonLd)).toEqual(['WebSite', 'SoftwareApplication']);
    expect(JSON.stringify(jsonLd)).toContain(`${SITE_ORIGIN}/`);
    expect(JSON.stringify(jsonLd)).toContain('zh-CN');
  });

  it('TC-GEO-JSONLD-124-02: 内容页包含 LearningResource 与正确 BreadcrumbList', () => {
    const page = resolveSeoPage('quick-sort', '/docs/quick-sort');
    const jsonLd = buildJsonLd(page);
    const breadcrumb = jsonLd['@graph'].find(
      (node: JsonLdNode) => node['@type'] === 'BreadcrumbList',
    ) as JsonLdNode;

    expect(graphTypes(jsonLd)).toEqual(['LearningResource', 'BreadcrumbList']);
    expect(breadcrumb.itemListElement?.at(-1)?.item).toBe(page.canonical);
    expect(JSON.stringify(jsonLd)).toContain(page.description);
  });

  it('TC-GEO-JSONLD-124-03: 不生成页面不可见的 FAQ、评分或评论声明', () => {
    const page = resolveSeoPage('dijkstra', '/docs/dijkstra');
    const jsonLd = JSON.stringify(buildJsonLd(page));
    const uncategorized = {
      ...resolveSeoPage('complexity', '/docs/complexity'),
      category: undefined,
    };
    const uncategorizedJsonLd = buildJsonLd(uncategorized);
    const noIndexJsonLd = buildJsonLd(resolveSeoPage('about', '/about'));

    expect(jsonLd).toContain(page.description);
    expect(jsonLd).not.toMatch(/FAQPage|Review|AggregateRating|ratingValue/);
    expect(uncategorizedJsonLd['@graph']).toHaveLength(2);
    expect(JSON.stringify(uncategorizedJsonLd)).not.toContain('"about"');
    expect(noIndexJsonLd['@graph']).toEqual([]);
  });
});

describe('robots policy', () => {
  it('TC-SEO-ROBOTS-124-01: 搜索发现、训练抓取与通用 crawler 策略分离', () => {
    expect(robots).toMatch(/User-agent: OAI-SearchBot\s+Allow: \//);
    expect(robots).toMatch(/User-agent: GPTBot\s+Disallow: \//);
    expect(robots).toMatch(/User-agent: \*\s+Allow: \//);
    expect(robots).toContain('Sitemap: https://algo.illegalscreed.cn/sitemap.xml');
  });
});
