import { describe, it, expect } from 'vitest';
import { useCategoryData } from './hooks';

// TC-HOOK-01: Home/Main useCategoryData
describe('Home/Main useCategoryData', () => {
  const data = useCategoryData();

  it('TC-HOOK-01-1: 返回数据结构/排序/图算法三个分类，图算法含 Dijkstra+Kruskal（C-038）', () => {
    expect(data).toHaveLength(3);
    expect(data[0].title).toBe('数据结构');
    expect(data[1].title).toBe('经典排序算法');
    expect(data[2].title).toBe('图算法');
    expect(data[2].children).toHaveLength(2);
    expect(data[2].children.map((c) => c.url)).toEqual(['dijkstra', 'kruskal']);
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
