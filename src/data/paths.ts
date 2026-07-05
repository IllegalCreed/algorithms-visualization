// src/data/paths.ts —— 学习路径数据资产（C-115，M11-S3）
// steps 为九大类 url slug（有效性由 paths.spec 锁死）；顺序即推荐学习顺序。
export interface LearningPath {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  steps: string[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'starter',
    emoji: '🌱',
    title: '新手入门',
    desc: '零基础第一圈：先摸熟基础结构，再用三个简单排序建立「算法在动」的手感，收在二分与快排。',
    steps: [
      'array',
      'stack',
      'queue',
      'link',
      'bubble-sort',
      'selection-sort',
      'insertion-sort',
      'binary-search',
      'hash',
      'tree',
      'heap',
      'quick-sort',
    ],
  },
  {
    id: 'interview',
    emoji: '🎯',
    title: '面试高频',
    desc: '大厂笔面出镜率最高的一批：排序三剑客 + 二分家族 + LRU/KMP + 经典 DP + 回溯与图两把刷子。',
    steps: [
      'quick-sort',
      'merge-sort',
      'heap-sort',
      'binary-search',
      'binary-bounds',
      'lru',
      'kmp',
      'knapsack',
      'lcs',
      'coin-change',
      'n-queens',
      'number-of-islands',
      'dijkstra',
      'topological-sort',
    ],
  },
  {
    id: 'graph',
    emoji: '🕸',
    title: '图论专线',
    desc: '从图的存储一路打穿：最短路三兄弟 → 两种 MST → 拓扑与连通性 → 网络流，收在树上问题的 LCA。',
    steps: [
      'graph',
      'dijkstra',
      'bellman-ford',
      'floyd-warshall',
      'kruskal',
      'prim',
      'topological-sort',
      'scc',
      'max-flow',
      'lca',
    ],
  },
  {
    id: 'advanced',
    emoji: '🚀',
    title: '进阶专题',
    desc: '刷完前面还想再上一层：高级结构、字符串重器、状压/数位/换根三种 DP 硬骨头，收在 FFT 与大数分解。',
    steps: [
      'segment-tree',
      'fenwick',
      'suffix-array',
      'aho-corasick',
      'z-function',
      'tsp',
      'digit-dp',
      'reroot-dp',
      'fft',
      'pollard-rho',
    ],
  },
];
