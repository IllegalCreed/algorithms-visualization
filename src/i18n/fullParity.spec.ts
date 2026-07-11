import { describe, expect, it } from 'vitest';
import router from '@/router';
import { getIndexablePages } from '@/seo/site';
import { useCategoryData } from '@/views/Home/Main/hooks';
import { englishContentRoutes, englishPageLoaders } from '@/views/English/pages';
import {
  ENGLISH_CONTENT_PAGES,
  LOCALIZED_PAGE_PAIRS,
  getEnglishAlgorithmPages,
  getEnglishHomeSections,
  getEnglishLearningPaths,
  getLanguageSwitchRoute,
  getLocalizedPairByRouteName,
} from './catalog';

interface LearningMetadata {
  category: string;
  iconKey: string;
  complexity: { time: string; space: string; note: string };
  pathTags: readonly string[];
}

const chineseCatalogSlugs = useCategoryData().flatMap((category) =>
  category.children.map((item) => item.url),
);

describe('C131 English full parity', () => {
  it('TC-I18N-CATALOG-131-01: 95 组包含 1 Home、2 工具、15 数据结构和 77 算法', () => {
    expect(LOCALIZED_PAGE_PAIRS).toHaveLength(95);
    expect(LOCALIZED_PAGE_PAIRS.filter((page) => page.kind === 'home')).toHaveLength(1);
    expect(LOCALIZED_PAGE_PAIRS.filter((page) => page.kind === 'tool')).toHaveLength(2);
    expect(LOCALIZED_PAGE_PAIRS.filter((page) => String(page.kind) === 'structure')).toHaveLength(
      15,
    );
    expect(getEnglishAlgorithmPages()).toHaveLength(77);
    expect(ENGLISH_CONTENT_PAGES).toHaveLength(94);
  });

  it('TC-I18N-CATALOG-131-02: 中英 route name/path 全局唯一且英文路径位于 /en', () => {
    for (const field of ['name', 'path'] as const) {
      expect(new Set(LOCALIZED_PAGE_PAIRS.map((page) => page.zh[field])).size).toBe(95);
      expect(new Set(LOCALIZED_PAGE_PAIRS.map((page) => page.en[field])).size).toBe(95);
    }
    expect(
      LOCALIZED_PAGE_PAIRS.every(
        (page) => page.en.path === '/en' || page.en.path.startsWith('/en/'),
      ),
    ).toBe(true);
  });

  it('TC-I18N-CATALOG-131-03: 92 个学习页与中文 Home catalog 集合全等', () => {
    expect(chineseCatalogSlugs).toHaveLength(92);
    const pairedContentSlugs = LOCALIZED_PAGE_PAIRS.filter(
      (page) => page.kind !== 'home' && page.kind !== 'tool',
    ).map((page) => page.key);

    expect(new Set(pairedContentSlugs)).toEqual(new Set(chineseCatalogSlugs));
  });

  it('TC-I18N-CATALOG-131-04: 94 个 catalog、loader 与 router 内容路由双向全等', () => {
    const catalogNames = ENGLISH_CONTENT_PAGES.map((page) => page.en.name).sort();
    const loaderNames = Object.keys(englishPageLoaders).sort();
    const contentRouteNames = englishContentRoutes.map((route) => String(route.name)).sort();
    const routerNames = router
      .getRoutes()
      .map((route) => String(route.name ?? ''))
      .filter((name) => name.startsWith('en-') && name !== 'en-home' && name !== 'en-docs')
      .sort();

    expect(catalogNames).toHaveLength(94);
    expect(loaderNames).toEqual(catalogNames);
    expect(contentRouteNames).toEqual(catalogNames);
    expect(routerNames).toEqual(catalogNames);
  });

  it('TC-I18N-CATALOG-131-05: 英文 Home 覆盖 2 个工具和 92 个学习页', () => {
    const homePages = getEnglishHomeSections().flatMap((section) => section.pages);
    expect(homePages).toHaveLength(94);
    expect(new Set(homePages.map((page) => page.en.name))).toEqual(
      new Set(ENGLISH_CONTENT_PAGES.map((page) => page.en.name)),
    );
  });

  it('TC-I18N-CATALOG-131-06: 92 个学习页具备目录、复杂度和路径 metadata', () => {
    const learningPages = LOCALIZED_PAGE_PAIRS.filter(
      (page) => page.kind !== 'home' && page.kind !== 'tool',
    );
    expect(learningPages).toHaveLength(92);

    for (const page of learningPages) {
      const metadata = page.en as typeof page.en & LearningMetadata;
      expect(metadata.category.length, page.key).toBeGreaterThan(2);
      expect(metadata.iconKey.length, page.key).toBeGreaterThan(1);
      expect(metadata.complexity.time.length, page.key).toBeGreaterThan(1);
      expect(metadata.complexity.space.length, page.key).toBeGreaterThan(1);
      expect(metadata.complexity.note.length, page.key).toBeGreaterThan(10);
      expect(metadata.pathTags.length, page.key).toBeGreaterThan(0);
    }
  });

  it('TC-I18N-CATALOG-131-07: 学习路径覆盖全部 92 个学习页', () => {
    const pathKeys = getEnglishLearningPaths().flatMap((path) =>
      path.steps.map((page) => page.key),
    );
    expect(new Set(pathKeys)).toEqual(new Set(chineseCatalogSlugs));

    const homeLearningKeys = getEnglishHomeSections().flatMap((section) =>
      section.pages.filter((page) => page.kind !== 'tool').map((page) => page.key),
    );
    expect(homeLearningKeys).toEqual(chineseCatalogSlugs);
  });

  it('TC-I18N-CATALOG-131-08: 95 组语言切换进入对应 route 并保留 query', () => {
    const query = { input: '9,5,1' };
    for (const pair of LOCALIZED_PAGE_PAIRS) {
      expect(getLocalizedPairByRouteName(pair.zh.name)?.key).toBe(pair.key);
      expect(getLocalizedPairByRouteName(pair.en.name)?.key).toBe(pair.key);
      expect(getLanguageSwitchRoute(pair.zh.name, 'en', query)).toEqual({
        name: pair.en.name,
        query,
      });
      expect(getLanguageSwitchRoute(pair.en.name, 'zh-CN', query)).toEqual({
        name: pair.zh.name,
        query,
      });
    }

    expect(getLanguageSwitchRoute('array', 'en')).toEqual({ name: 'en-array' });
    expect(getIndexablePages()).toHaveLength(190);
    expect(getIndexablePages().filter((page) => page.alternates.length === 3)).toHaveLength(190);
  });
});
