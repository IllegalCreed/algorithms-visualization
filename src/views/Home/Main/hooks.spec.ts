import { describe, it, expect } from 'vitest';
import { useCategoryData } from './hooks';

// TC-HOOK-01: Home/Main useCategoryData
describe('Home/Main useCategoryData', () => {
  const data = useCategoryData();

  it('TC-HOOK-01-1: 返回 6 个分类（+字符串），字符串含 KMP（C-062）', () => {
    expect(data).toHaveLength(6);
    expect(data[0].title).toBe('数据结构');
    expect(data[1].title).toBe('经典排序算法');
    expect(data[2].title).toBe('图算法');
    expect(data[3].title).toBe('动态规划');
    expect(data[4].title).toBe('回溯与搜索');
    expect(data[5].title).toBe('字符串');
    expect(data[2].children).toHaveLength(6);
    expect(data[3].children.map((c) => c.url)).toEqual(['edit-distance', 'knapsack', 'lcs', 'lis']);
    expect(data[4].children.map((c) => c.url)).toEqual([
      'n-queens',
      'subsets',
      'permutations',
      'combination-sum',
      'maze',
    ]);
    expect(data[5].children.map((c) => c.url)).toEqual(['kmp']);
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
