import { describe, it, expect } from 'vitest';
import { useCategoryData } from './hooks';

// TC-HOOK-01: Home/Main useCategoryData
describe('Home/Main useCategoryData', () => {
  const data = useCategoryData();

  it('TC-HOOK-01-1: 返回 4 个分类（+动态规划），图算法 6 项 + 编辑距离（C-053）', () => {
    expect(data).toHaveLength(4);
    expect(data[0].title).toBe('数据结构');
    expect(data[1].title).toBe('经典排序算法');
    expect(data[2].title).toBe('图算法');
    expect(data[3].title).toBe('动态规划');
    expect(data[2].children).toHaveLength(6);
    expect(data[2].children.map((c) => c.url)).toEqual([
      'dijkstra',
      'kruskal',
      'prim',
      'bellman-ford',
      'topological-sort',
      'floyd-warshall',
    ]);
    expect(data[3].children.map((c) => c.url)).toEqual(['edit-distance']);
  });

  it('TC-HOOK-01-2: 数据结构分类含 15 项（…/线段树/B+ 树/布隆过滤器 C-036）', () => {
    expect(data[0].children).toHaveLength(15);
  });

  it('TC-HOOK-01-3: 每个条目含 title/desc/icon/url', () => {
    for (const cat of data) {
      for (const item of cat.children) {
        expect(item.title).toBeTruthy();
        expect(item.desc).toBeTruthy();
        expect(item.icon).toBeTruthy();
        expect(item.url).toBeTruthy();
      }
    }
  });

  it('TC-HOOK-01-4: 所有 url 唯一', () => {
    const urls = data.flatMap((c) => c.children.map((i) => i.url));
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('TC-HOOK-01-5: 每个分类含 desc', () => {
    for (const cat of data) {
      expect(cat.desc).toBeTruthy();
    }
  });
});
