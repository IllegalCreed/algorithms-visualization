import { describe, expect, it } from 'vitest';
import { LOCALIZED_PAGE_PAIRS, getEnglishAlgorithmPages } from '../../src/i18n/catalog';
import { getIndexablePages } from '../../src/seo/site';
import { useCategoryData } from '../../src/views/Home/Main/hooks';
import { SITE_FACTS, validateMarketingFactClaims } from './site-facts';

describe('marketing site facts', () => {
  it('TC-AUTO-FACTS-127-01 快照与当前 SEO、locale 和 Home catalog 对拍', () => {
    const pages = getIndexablePages();
    const categories = useCategoryData();

    expect(SITE_FACTS).toMatchObject({
      origin: 'https://algo.illegalscreed.cn',
      categoryCount: categories.length,
      catalogEntryCount: categories.reduce(
        (count, category) => count + category.children.length,
        0,
      ),
      indexablePageCount: pages.length,
      chinesePageCount: pages.filter((page) => page.locale === 'zh-CN').length,
      englishPageCount: pages.filter((page) => page.locale === 'en').length,
      localizedPairCount: LOCALIZED_PAGE_PAIRS.length,
      englishAlgorithmCount: getEnglishAlgorithmPages().length,
      analyticsMode: 'utm-only',
    });
    expect(SITE_FACTS).toMatchObject({
      categoryCount: 9,
      catalogEntryCount: 92,
      indexablePageCount: 125,
      chinesePageCount: 95,
      englishPageCount: 30,
      localizedPairCount: 30,
      englishAlgorithmCount: 27,
    });
    expect('unitTestCount' in SITE_FACTS).toBe(false);
  });

  it('TC-AUTO-FACTS-127-02 拒绝旧页面规模与易漂移测试数量声明', () => {
    expect(
      validateMarketingFactClaims(
        'The site has 125 indexable pages, including 95 Chinese pages and 30 English pages.',
      ),
    ).toEqual([]);
    expect(validateMarketingFactClaims('首页覆盖 9 大类、92 个条目。')).toEqual([]);

    expect(validateMarketingFactClaims('The English pilot has 10 pages.')).toContain(
      'STALE_SITE_FACT',
    );
    expect(validateMarketingFactClaims('The site has 105 indexable pages.')).toContain(
      'STALE_SITE_FACT',
    );
    expect(validateMarketingFactClaims('The English catalog has 29 pages.')).toContain(
      'STALE_SITE_FACT',
    );
    expect(validateMarketingFactClaims('The site has 94 Chinese pages.')).toContain(
      'STALE_SITE_FACT',
    );
    expect(validateMarketingFactClaims('2073 tests passed.')).toContain('EPHEMERAL_TEST_FACT');
    expect(validateMarketingFactClaims('已有 286 个测试文件。')).toContain('EPHEMERAL_TEST_FACT');
  });
});
