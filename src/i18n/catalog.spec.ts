import { describe, expect, it } from 'vitest';
import router from '@/router';
import {
  ENGLISH_CONTENT_PAGES,
  ENGLISH_PAGES,
  LOCALIZED_PAGE_PAIRS,
  getEnglishAlgorithmPages,
  getEnglishHomeSections,
  getEnglishLearningPages,
  getEnglishLearningPaths,
  getLanguageSwitchRoute,
  getLocalizedPairByRouteName,
  siteLocaleFromPath,
} from './catalog';

describe('English locale catalog migration', () => {
  it('TC-I18N-CATALOG-131-09: 最终为 95 页、77/15/2/1 边界且路由唯一', () => {
    expect(LOCALIZED_PAGE_PAIRS).toHaveLength(95);
    expect(ENGLISH_CONTENT_PAGES).toHaveLength(94);
    expect(LOCALIZED_PAGE_PAIRS.filter((page) => page.kind === 'algorithm')).toHaveLength(77);
    expect(LOCALIZED_PAGE_PAIRS.filter((page) => page.kind === 'structure')).toHaveLength(15);
    expect(LOCALIZED_PAGE_PAIRS.filter((page) => page.kind === 'tool')).toHaveLength(2);
    expect(LOCALIZED_PAGE_PAIRS.filter((page) => page.kind === 'home')).toHaveLength(1);

    for (const field of ['name', 'path'] as const) {
      expect(new Set(LOCALIZED_PAGE_PAIRS.map((page) => page.zh[field])).size).toBe(95);
      expect(new Set(LOCALIZED_PAGE_PAIRS.map((page) => page.en[field])).size).toBe(95);
    }

    expect(ENGLISH_PAGES).toHaveLength(95);
    const routeNames = new Set(router.getRoutes().map((route) => String(route.name ?? '')));
    for (const pair of LOCALIZED_PAGE_PAIRS) {
      expect(routeNames.has(pair.zh.name), pair.zh.name).toBe(true);
      expect(routeNames.has(pair.en.name), pair.en.name).toBe(true);
      expect(pair.en.heading.length).toBeGreaterThan(2);
      expect(pair.en.description.length).toBeGreaterThan(40);
    }
  });

  it('TC-I18N-CATALOG-131-10: 九十二个学习页 metadata 足以派生目录、复杂度和学习路径', () => {
    const learningPages = getEnglishLearningPages();

    expect(getEnglishAlgorithmPages()).toHaveLength(77);
    expect(learningPages).toHaveLength(92);
    for (const page of learningPages) {
      expect(page.en.category.length, page.key).toBeGreaterThan(2);
      expect(page.en.iconKey.length, page.key).toBeGreaterThan(1);
      expect(page.en.homeGroup.length, page.key).toBeGreaterThan(1);
      expect(page.en.order, page.key).toBeGreaterThanOrEqual(0);
      expect(page.en.complexity.time.length, page.key).toBeGreaterThan(1);
      expect(page.en.complexity.space.length, page.key).toBeGreaterThan(1);
      expect(page.en.complexity.note.length, page.key).toBeGreaterThan(10);
      expect(page.en.pathTags.length, page.key).toBeGreaterThan(0);
      expect(page.en.pathOrder, page.key).toBeGreaterThanOrEqual(0);
    }
  });

  it('TC-I18N-CATALOG-131-11: Home 与学习路径由 catalog 派生且无孤儿学习页', () => {
    const homeNames = getEnglishHomeSections().flatMap((section) =>
      section.pages.map((page) => page.en.name),
    );
    const contentNames = ENGLISH_CONTENT_PAGES.map((page) => page.en.name);
    expect(homeNames).toHaveLength(94);
    expect(new Set(homeNames)).toEqual(new Set(contentNames));

    const pathNames = getEnglishLearningPaths().flatMap((path) =>
      path.steps.map((page) => page.en.name),
    );
    const learningPageNames = getEnglishLearningPages().map((page) => page.en.name);
    expect(new Set(pathNames)).toEqual(new Set(learningPageNames));
  });

  it('TC-I18N-CATALOG-130-05: 成对页面切换语言并保留安全 query', () => {
    const query = { input: '9,5,1' };

    expect(getLanguageSwitchRoute('quick-sort', 'en', query)).toEqual({
      name: 'en-quick-sort',
      query,
    });
    expect(getLanguageSwitchRoute('en-gcd', 'zh-CN', query)).toEqual({
      name: 'gcd',
      query,
    });
    expect(getLocalizedPairByRouteName('en-manacher')?.zh.name).toBe('manacher');
    expect(siteLocaleFromPath('/en')).toBe('en');
    expect(siteLocaleFromPath('/en/docs/kmp')).toBe('en');
    expect(siteLocaleFromPath('/docs/kmp')).toBe('zh-CN');
  });

  it('TC-I18N-CATALOG-131-12: 新增页面正确切换，未知页面回退目标语言 Home', () => {
    expect(getLanguageSwitchRoute('array', 'en', { input: 'safe' })).toEqual({
      name: 'en-array',
      query: { input: 'safe' },
    });
    expect(getLanguageSwitchRoute('unknown', 'zh-CN', { q: 'x' })).toEqual({ name: 'home' });
    expect(getLocalizedPairByRouteName('array')?.en.name).toBe('en-array');
  });
});
