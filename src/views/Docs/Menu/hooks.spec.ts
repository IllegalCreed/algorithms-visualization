import { describe, it, expect, vi } from 'vitest';
import { useCategoryData } from './hooks';

// TC-HOOK-02: Docs/Menu hooks
// useMenuSelect 依赖 provide + onBeforeRouteUpdate 生命周期上下文，
// 无法在组件外调用，留待 Task 9 的 Menu 组件挂载测试覆盖。
vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'array' }),
  onBeforeRouteUpdate: vi.fn(),
}));

describe('Docs/Menu useCategoryData', () => {
  it('TC-HOOK-02-1: 返回 3 个分类（数据结构/排序/图算法 C-037）', () => {
    const data = useCategoryData();
    expect(data).toHaveLength(3);
    expect(data[0].title).toBe('数据结构');
    expect(data[1].title).toBe('经典排序算法');
    expect(data[2].title).toBe('图算法');
    expect(data[2].children.map((c) => c.url)).toContain('dijkstra');
  });

  it('TC-HOOK-02-2: 每项含 title/url 且均非空', () => {
    const data = useCategoryData();
    for (const cat of data) {
      expect(cat.title).toBeTruthy();
      for (const item of cat.children) {
        expect(item.title).toBeTruthy();
        expect(item.url).toBeTruthy();
      }
    }
  });

  it('TC-HOOK-02-3: 所有 url 唯一', () => {
    const data = useCategoryData();
    const urls = data.flatMap((c) => c.children.map((i) => i.url));
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('TC-HOOK-02-4: 数据结构含 15 项（…/线段树/B+ 树/布隆过滤器 C-036），排序算法含 8 项', () => {
    const data = useCategoryData();
    expect(data[0].children).toHaveLength(15);
    expect(data[1].children).toHaveLength(8);
  });
});
