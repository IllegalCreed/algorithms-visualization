import type { RouteRecordRaw } from 'vue-router';
import { ENGLISH_CONTENT_PAGES } from '@/i18n/catalog';

export const englishPageLoaders = {
  'en-complexity': () => import('./Complexity.vue'),
  'en-paths': () => import('./Paths.vue'),
  'en-quick-sort': () => import('./QuickSort.vue'),
  'en-binary-search': () => import('./BinarySearch.vue'),
  'en-dijkstra': () => import('./Dijkstra.vue'),
  'en-knapsack': () => import('./Knapsack.vue'),
  'en-kmp': () => import('./Kmp.vue'),
  'en-fenwick': () => import('./Fenwick.vue'),
  'en-convex-hull': () => import('./ConvexHull.vue'),
  'en-bubble-sort': () => import('./BubbleSort.vue'),
  'en-merge-sort': () => import('./MergeSort.vue'),
  'en-heap-sort': () => import('./HeapSort.vue'),
  'en-counting-sort': () => import('./CountingSort.vue'),
  'en-binary-bounds': () => import('./BinaryBounds.vue'),
  'en-kruskal': () => import('./Kruskal.vue'),
  'en-prim': () => import('./Prim.vue'),
  'en-bellman-ford': () => import('./BellmanFord.vue'),
  'en-topological-sort': () => import('./TopologicalSort.vue'),
  'en-closest-pair': () => import('./ClosestPair.vue'),
  'en-edit-distance': () => import('./EditDistance.vue'),
  'en-lcs': () => import('./LongestCommonSubsequence.vue'),
  'en-lis': () => import('./LongestIncreasingSubsequence.vue'),
  'en-n-queens': () => import('./NQueens.vue'),
  'en-subsets': () => import('./Subsets.vue'),
  'en-maze': () => import('./Maze.vue'),
  'en-rabin-karp': () => import('./RabinKarp.vue'),
  'en-manacher': () => import('./Manacher.vue'),
  'en-sieve-of-eratosthenes': () => import('./SieveOfEratosthenes.vue'),
  'en-gcd': () => import('./EuclideanAlgorithm.vue'),
} as const;

export type EnglishContentRouteName = keyof typeof englishPageLoaders;

function isEnglishContentRouteName(name: string): name is EnglishContentRouteName {
  return name in englishPageLoaders;
}

export const englishContentRoutes: readonly RouteRecordRaw[] = Object.freeze(
  ENGLISH_CONTENT_PAGES.map((page) => {
    const name = page.en.name;
    if (!isEnglishContentRouteName(name)) {
      throw new Error(`English page loader is missing: ${name}`);
    }
    return {
      path: page.en.path,
      name,
      component: englishPageLoaders[name],
    } satisfies RouteRecordRaw;
  }),
);
