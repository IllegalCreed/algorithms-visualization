import type { Category } from './types';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { ref, provide } from 'vue';

export function useCategoryData(): Category[] {
  const categoryData: Category[] = [
    {
      title: '数据结构',
      children: [
        {
          title: '数组',
          url: 'array',
        },
        {
          title: '链表',
          url: 'link',
        },
        {
          title: '栈',
          url: 'stack',
        },
        {
          title: '队列',
          url: 'queue',
        },
        {
          title: '树',
          url: 'tree',
        },
        {
          title: '堆',
          url: 'heap',
        },
        {
          title: '哈希表',
          url: 'hash',
        },
        {
          title: '图',
          url: 'graph',
        },
        {
          title: '字典树',
          url: 'trie',
        },
        {
          title: '并查集',
          url: 'union-find',
        },
        {
          title: 'LRU 缓存',
          url: 'lru',
        },
        {
          title: '跳表',
          url: 'skip-list',
        },
        {
          title: '线段树',
          url: 'segment-tree',
        },
        {
          title: 'B+ 树',
          url: 'b-tree',
        },
        {
          title: '布隆过滤器',
          url: 'bloom-filter',
        },
      ],
    },
    {
      title: '经典排序算法',
      children: [
        {
          title: '冒泡排序',
          url: 'bubble-sort',
        },
        {
          title: '鸡尾酒排序',
          url: 'cocktail-sort',
        },
        {
          title: '双调排序',
          url: 'bitonic-sort',
        },
        {
          title: '选择排序',
          url: 'selection-sort',
        },
        {
          title: '插入排序',
          url: 'insertion-sort',
        },
        {
          title: '二分插入排序',
          url: 'binary-insertion-sort',
        },
        {
          title: '希尔排序',
          url: 'shell-sort',
        },
        {
          title: '归并排序',
          url: 'merge-sort',
        },
        {
          title: '自顶向下归并',
          url: 'top-down-merge-sort',
        },
        {
          title: '快速排序',
          url: 'quick-sort',
        },
        {
          title: '三路快排',
          url: 'three-way-quick-sort',
        },
        {
          title: '双轴快排',
          url: 'dual-pivot-quick-sort',
        },
        {
          title: '堆排序',
          url: 'heap-sort',
        },
        {
          title: '计数排序',
          url: 'counting-sort',
        },
        {
          title: '基数排序',
          url: 'radix-sort',
        },
        {
          title: '桶排序',
          url: 'bucket-sort',
        },
      ],
    },
    {
      title: '图算法',
      children: [
        {
          title: 'Dijkstra 最短路',
          url: 'dijkstra',
        },
        {
          title: 'Kruskal 最小生成树',
          url: 'kruskal',
        },
        {
          title: 'Prim 最小生成树',
          url: 'prim',
        },
        {
          title: 'Bellman-Ford 最短路',
          url: 'bellman-ford',
        },
        {
          title: '拓扑排序',
          url: 'topological-sort',
        },
        {
          title: 'Floyd 多源最短路',
          url: 'floyd-warshall',
        },
        {
          title: '强连通分量',
          url: 'scc',
        },
        {
          title: '2-SAT',
          url: 'two-sat',
        },
        {
          title: '最大流',
          url: 'max-flow',
        },
      ],
    },
    {
      title: '动态规划',
      children: [
        {
          title: '编辑距离',
          url: 'edit-distance',
        },
        {
          title: '0-1 背包',
          url: 'knapsack',
        },
        {
          title: '完全背包',
          url: 'complete-knapsack',
        },
        {
          title: '最长公共子序列',
          url: 'lcs',
        },
        {
          title: '最长递增子序列',
          url: 'lis',
        },
        {
          title: '硬币找零方案数',
          url: 'coin-change',
        },
      ],
    },
    {
      title: '回溯与搜索',
      children: [
        {
          title: 'N 皇后',
          url: 'n-queens',
        },
        {
          title: '子集生成',
          url: 'subsets',
        },
        {
          title: '全排列',
          url: 'permutations',
        },
        {
          title: '组合总和',
          url: 'combination-sum',
        },
        {
          title: '迷宫寻路',
          url: 'maze',
        },
        {
          title: '岛屿数量',
          url: 'number-of-islands',
        },
        {
          title: '单词搜索',
          url: 'word-search',
        },
        {
          title: '数独',
          url: 'sudoku',
        },
      ],
    },
    {
      title: '字符串',
      children: [
        {
          title: 'KMP 字符串匹配',
          url: 'kmp',
        },
        {
          title: 'Rabin-Karp',
          url: 'rabin-karp',
        },
        {
          title: 'Boyer-Moore',
          url: 'boyer-moore',
        },
        {
          title: 'Manacher',
          url: 'manacher',
        },
        {
          title: '后缀数组',
          url: 'suffix-array',
        },
        {
          title: 'LCP / height 数组',
          url: 'lcp-array',
        },
        {
          title: 'AC 自动机',
          url: 'aho-corasick',
        },
      ],
    },
    {
      title: '数学与数论',
      children: [
        {
          title: '埃氏筛',
          url: 'sieve-of-eratosthenes',
        },
        {
          title: '线性筛',
          url: 'linear-sieve',
        },
        {
          title: '欧几里得算法',
          url: 'gcd',
        },
        {
          title: '快速幂',
          url: 'fast-power',
        },
      ],
    },
    {
      title: '计算几何',
      children: [
        {
          title: '凸包',
          url: 'convex-hull',
        },
        {
          title: '旋转卡壳',
          url: 'rotating-calipers',
        },
        {
          title: '最近点对',
          url: 'closest-pair',
        },
        {
          title: '线段相交',
          url: 'segment-intersection',
        },
      ],
    },
  ];
  return categoryData;
}

export function useMenuSelect(): void {
  const currentSelectMenuItemKey = ref<string | null>(null);
  provide('currentSelectMenuItemKey', currentSelectMenuItemKey);
  onBeforeRouteUpdate(async (to) => {
    currentSelectMenuItemKey.value = to.name as string;
  });
  const route = useRoute();
  currentSelectMenuItemKey.value = route.name as string;
}
