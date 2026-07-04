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
  it('TC-HOOK-02-1: 返回 8 个分类，新增计算几何（C-081）', () => {
    const data = useCategoryData();
    expect(data).toHaveLength(8);
    expect(data[0].title).toBe('数据结构');
    expect(data[1].title).toBe('经典排序算法');
    expect(data[2].title).toBe('图算法');
    expect(data[3].title).toBe('动态规划');
    expect(data[4].title).toBe('回溯与搜索');
    expect(data[5].title).toBe('字符串');
    expect(data[6].title).toBe('数学与数论');
    expect(data[7].title).toBe('计算几何');
    expect(data[7].children.map((c) => c.url)).toEqual([
      'convex-hull',
      'rotating-calipers',
      'closest-pair',
      'segment-intersection',
    ]);
    expect(data[6].children.map((c) => c.url)).toEqual([
      'sieve-of-eratosthenes',
      'linear-sieve',
      'gcd',
      'fast-power',
      'ext-gcd',
    ]);
    expect(data[2].children).toHaveLength(9);
    expect(data[2].children.map((c) => c.url)).toEqual([
      'dijkstra',
      'kruskal',
      'prim',
      'bellman-ford',
      'topological-sort',
      'floyd-warshall',
      'scc',
      'two-sat',
      'max-flow',
    ]);
    expect(data[3].children.map((c) => c.url)).toEqual([
      'edit-distance',
      'knapsack',
      'complete-knapsack',
      'lcs',
      'lis',
      'coin-change',
    ]);
    expect(data[4].children.map((c) => c.url)).toEqual([
      'n-queens',
      'subsets',
      'permutations',
      'combination-sum',
      'maze',
      'number-of-islands',
      'word-search',
      'sudoku',
    ]);
    expect(data[5].children.map((c) => c.url)).toEqual([
      'kmp',
      'rabin-karp',
      'boyer-moore',
      'manacher',
      'suffix-array',
      'lcp-array',
      'aho-corasick',
    ]);
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

  it('TC-HOOK-02-4: 数据结构含 15 项，排序算法含 15 项（新增鸡尾酒排序 C-045）', () => {
    const data = useCategoryData();
    expect(data[0].children).toHaveLength(15);
    expect(data[1].children).toHaveLength(16);
    expect(data[1].children[2].url).toBe('bitonic-sort');
    expect(data[1].children.map((c) => c.url)).toContain('binary-insertion-sort');
    expect(data[1].children.map((c) => c.url)).toContain('cocktail-sort');
  });
});
