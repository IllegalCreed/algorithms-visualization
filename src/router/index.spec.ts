import { describe, expect, it } from 'vitest';
import router from './index';
import { useCategoryData as useHomeCategoryData } from '@/views/Home/Main/hooks';
import { useCategoryData as useMenuCategoryData } from '@/views/Docs/Menu/hooks';

function slugsFrom(categories: Array<{ children: Array<{ url: string }> }>): string[] {
  return categories.flatMap((category) => category.children.map((item) => item.url));
}

describe('router article route coverage', () => {
  it('TC-MENU-TOOLS-132-04: 菜单学习分类与首页一致，并额外包含两个工具路由', () => {
    const homeSlugs = slugsFrom(useHomeCategoryData()).sort();
    const menuCategories = useMenuCategoryData();
    const menuLearningSlugs = slugsFrom(menuCategories.slice(1)).sort();
    const menuToolSlugs = slugsFrom(menuCategories.slice(0, 1));

    expect(homeSlugs).toEqual(menuLearningSlugs);
    expect(homeSlugs).toHaveLength(92);
    expect(menuToolSlugs).toEqual(['complexity', 'paths']);
    expect(slugsFrom(menuCategories)).toHaveLength(94);
  });

  it('TC-ROUTER-CATALOG-02: 每个侧边菜单 slug 都有同名 /docs 路由（C-119/C-132）', () => {
    const routeMap = new Map(
      router.getRoutes().map((route) => [String(route.name), route.path] as const),
    );

    for (const slug of slugsFrom(useMenuCategoryData())) {
      expect(routeMap.get(slug)).toBe(`/docs/${slug}`);
    }
  });
});
