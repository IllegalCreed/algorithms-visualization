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
  it('TC-MENU-TOOLS-132-01: 返回学习工具和九个学习分类', () => {
    const data = useCategoryData();
    expect(data.map((category) => category.title)).toEqual([
      '学习工具',
      '数据结构',
      '经典排序算法',
      '图算法',
      '动态规划',
      '回溯与搜索',
      '字符串',
      '数学与数论',
      '计算几何',
      '查找',
    ]);
    expect(data[0].children).toEqual([
      { title: '算法复杂度速查', url: 'complexity' },
      { title: '算法学习路径', url: 'paths' },
    ]);

    const category = (title: string) => data.find((item) => item.title === title)!;
    expect(category('查找').children.map((c) => c.url)).toEqual([
      'binary-search',
      'binary-bounds',
      'rotated-search',
      'binary-answer',
      'ternary-search',
    ]);
    expect(category('计算几何').children.map((c) => c.url)).toEqual([
      'convex-hull',
      'rotating-calipers',
      'closest-pair',
      'segment-intersection',
      'bentley-ottmann',
    ]);
    expect(category('数学与数论').children.map((c) => c.url)).toEqual([
      'sieve-of-eratosthenes',
      'linear-sieve',
      'gcd',
      'fast-power',
      'ext-gcd',
      'crt',
      'euler-phi',
      'miller-rabin',
      'fft',
      'pollard-rho',
    ]);
    expect(category('图算法').children).toHaveLength(12);
    expect(category('图算法').children.map((c) => c.url)).toEqual([
      'dijkstra',
      'kruskal',
      'prim',
      'bellman-ford',
      'topological-sort',
      'floyd-warshall',
      'scc',
      'two-sat',
      'max-flow',
      'hungarian',
      'lca',
      'euler-path',
    ]);
    expect(category('动态规划').children.map((c) => c.url)).toEqual([
      'edit-distance',
      'knapsack',
      'complete-knapsack',
      'lcs',
      'lis',
      'coin-change',
      'stone-merge',
      'tsp',
      'tree-dp',
      'digit-dp',
      'reroot-dp',
    ]);
    expect(category('动态规划').children).toHaveLength(11);
    expect(category('回溯与搜索').children.map((c) => c.url)).toEqual([
      'n-queens',
      'subsets',
      'permutations',
      'combination-sum',
      'maze',
      'number-of-islands',
      'word-search',
      'sudoku',
      'astar',
    ]);
    expect(category('字符串').children.map((c) => c.url)).toEqual([
      'kmp',
      'rabin-karp',
      'boyer-moore',
      'manacher',
      'suffix-array',
      'lcp-array',
      'aho-corasick',
      'z-function',
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

  it('TC-HOOK-02-4: 数据结构含 16 项（新增树状数组 C-102），排序算法含 16 项', () => {
    const data = useCategoryData();
    const structures = data.find((category) => category.title === '数据结构')!;
    const sorting = data.find((category) => category.title === '经典排序算法')!;
    expect(structures.children).toHaveLength(16);
    expect(structures.children[15].url).toBe('fenwick');
    expect(sorting.children).toHaveLength(16);
    expect(sorting.children[2].url).toBe('bitonic-sort');
    expect(sorting.children.map((c) => c.url)).toContain('binary-insertion-sort');
    expect(sorting.children.map((c) => c.url)).toContain('cocktail-sort');
  });
});
