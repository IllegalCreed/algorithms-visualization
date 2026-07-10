import { describe, expect, it } from 'vitest';
import router from './index';
import { useCategoryData as useHomeCategoryData } from '@/views/Home/Main/hooks';
import { useCategoryData as useMenuCategoryData } from '@/views/Docs/Menu/hooks';

function slugsFrom(categories: Array<{ children: Array<{ url: string }> }>): string[] {
  return categories.flatMap((category) => category.children.map((item) => item.url));
}

describe('router article route coverage', () => {
  it('TC-ROUTER-CATALOG-01: 首页与侧边菜单 slug 完全一致（C-119）', () => {
    const homeSlugs = slugsFrom(useHomeCategoryData()).sort();
    const menuSlugs = slugsFrom(useMenuCategoryData()).sort();

    expect(homeSlugs).toEqual(menuSlugs);
    expect(homeSlugs).toHaveLength(92);
  });

  it('TC-ROUTER-CATALOG-02: 每个首页/菜单 slug 都有同名 /docs 路由（C-119）', () => {
    const routeMap = new Map(
      router.getRoutes().map((route) => [String(route.name), route.path] as const),
    );

    for (const slug of slugsFrom(useHomeCategoryData())) {
      expect(routeMap.get(slug)).toBe(`/docs/${slug}`);
    }
  });
});
