import { describe, expect, it } from 'vitest';
import { ENGLISH_CONTENT_PAGES } from '@/i18n/catalog';
import { englishContentRoutes, englishPageLoaders } from './pages';

describe('English static page loaders', () => {
  it('TC-I18N-CATALOG-130-04: catalog、loader 与英文内容路由双向一致', () => {
    const catalogNames = ENGLISH_CONTENT_PAGES.map((page) => page.en.name).sort();
    const loaderNames = Object.keys(englishPageLoaders).sort();
    const routeNames = englishContentRoutes.map((route) => String(route.name)).sort();

    expect(catalogNames).toHaveLength(94);
    expect(loaderNames).toEqual(catalogNames);
    expect(routeNames).toEqual(catalogNames);
    expect(englishContentRoutes.map((route) => route.path).sort()).toEqual(
      ENGLISH_CONTENT_PAGES.map((page) => page.en.path).sort(),
    );
  });
});
