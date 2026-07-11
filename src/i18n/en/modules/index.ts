import { englishQuickSortModule } from './quick-sort';
import { englishBsearchModule } from './binary-search';
import { englishDijkstraModule } from './dijkstra';
import { englishKnapsackModule } from './knapsack';
import { englishKmpModule } from './kmp';
import { englishFenwickModule } from './fenwick';
import { englishConvexHullModule } from './convex-hull';
import { englishBubbleSortModule } from './bubble-sort';
import { englishMergeSortModule } from './merge-sort';
import { englishHeapSortModule } from './heap-sort';
import { englishCountingSortModule } from './counting-sort';
import { englishBinaryBoundsModule } from './binary-bounds';
import { englishKruskalModule } from './kruskal';
import { englishPrimModule } from './prim';
import { englishBellmanFordModule } from './bellman-ford';
import { englishTopoModule } from './topological-sort';
import { englishClosestPairModule } from './closest-pair';
import { englishEditDistanceModule } from './edit-distance';
import { englishLcsModule } from './lcs';
import { englishLisModule } from './lis';
import { englishNQueensModule } from './n-queens';
import { englishSubsetsModule } from './subsets';
import { englishMazeModule } from './maze';
import { englishRabinKarpModule } from './rabin-karp';
import { englishManacherModule } from './manacher';
import { englishSieveModule } from './sieve-of-eratosthenes';
import { englishGcdModule } from './gcd';
import { fullParityAlgorithmModules } from './fullParityRegistry';

export { fullParityAlgorithmModules } from './fullParityRegistry';

export {
  englishBinaryBoundsModule,
  englishBsearchModule,
  englishBubbleSortModule,
  englishConvexHullModule,
  englishCountingSortModule,
  englishDijkstraModule,
  englishFenwickModule,
  englishHeapSortModule,
  englishKmpModule,
  englishKnapsackModule,
  englishMergeSortModule,
  englishQuickSortModule,
  englishKruskalModule,
  englishPrimModule,
  englishBellmanFordModule,
  englishTopoModule,
  englishClosestPairModule,
  englishEditDistanceModule,
  englishLcsModule,
  englishLisModule,
  englishNQueensModule,
  englishSubsetsModule,
  englishMazeModule,
  englishRabinKarpModule,
  englishManacherModule,
  englishSieveModule,
  englishGcdModule,
};

export const englishAlgorithmModules = {
  'quick-sort': englishQuickSortModule,
  'binary-search': englishBsearchModule,
  dijkstra: englishDijkstraModule,
  knapsack: englishKnapsackModule,
  kmp: englishKmpModule,
  fenwick: englishFenwickModule,
  'convex-hull': englishConvexHullModule,
  'bubble-sort': englishBubbleSortModule,
  'merge-sort': englishMergeSortModule,
  'heap-sort': englishHeapSortModule,
  'counting-sort': englishCountingSortModule,
  'binary-bounds': englishBinaryBoundsModule,
  kruskal: englishKruskalModule,
  prim: englishPrimModule,
  'bellman-ford': englishBellmanFordModule,
  'topological-sort': englishTopoModule,
  'closest-pair': englishClosestPairModule,
  'edit-distance': englishEditDistanceModule,
  lcs: englishLcsModule,
  lis: englishLisModule,
  'n-queens': englishNQueensModule,
  subsets: englishSubsetsModule,
  maze: englishMazeModule,
  'rabin-karp': englishRabinKarpModule,
  manacher: englishManacherModule,
  'sieve-of-eratosthenes': englishSieveModule,
  gcd: englishGcdModule,
  ...fullParityAlgorithmModules,
} as const;

export type EnglishAlgorithmModuleKey = keyof typeof englishAlgorithmModules;
