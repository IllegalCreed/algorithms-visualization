import { englishAhoCorasickModule } from './aho-corasick';
import { englishAstarModule } from './astar';
import { englishBentleyOttmannModule } from './bentley-ottmann';
import { englishBinaryAnswerModule } from './binary-answer';
import { englishBinaryInsertionSortModule } from './binary-insertion-sort';
import { englishBitonicSortModule } from './bitonic-sort';
import { englishBoyerMooreModule } from './boyer-moore';
import { englishBucketSortModule } from './bucket-sort';
import { englishCocktailSortModule } from './cocktail-sort';
import { englishCoinChangeModule } from './coin-change';
import { englishCombinationSumModule } from './combination-sum';
import { englishCompleteKnapsackModule } from './complete-knapsack';
import { englishCrtModule } from './crt';
import { englishDigitDpModule } from './digit-dp';
import { englishDualPivotQuickSortModule } from './dual-pivot-quick-sort';
import { englishEulerPathModule } from './euler-path';
import { englishEulerPhiModule } from './euler-phi';
import { englishExtGcdModule } from './ext-gcd';
import { englishFastPowerModule } from './fast-power';
import { englishFftModule } from './fft';
import { englishFloydWarshallModule } from './floyd-warshall';
import { englishHungarianModule } from './hungarian';
import { englishInsertionSortModule } from './insertion-sort';
import { englishLcaModule } from './lca';
import { englishLcpArrayModule } from './lcp-array';
import { englishLinearSieveModule } from './linear-sieve';
import { englishMaxFlowModule } from './max-flow';
import { englishMillerRabinModule } from './miller-rabin';
import { englishNumberOfIslandsModule } from './number-of-islands';
import { englishPermutationsModule } from './permutations';
import { englishPollardRhoModule } from './pollard-rho';
import { englishRadixSortModule } from './radix-sort';
import { englishRerootDpModule } from './reroot-dp';
import { englishRotatedSearchModule } from './rotated-search';
import { englishRotatingCalipersModule } from './rotating-calipers';
import { englishSccModule } from './scc';
import { englishSegmentIntersectionModule } from './segment-intersection';
import { englishSelectionSortModule } from './selection-sort';
import { englishShellSortModule } from './shell-sort';
import { englishStoneMergeModule } from './stone-merge';
import { englishSudokuModule } from './sudoku';
import { englishSuffixArrayModule } from './suffix-array';
import { englishTernarySearchModule } from './ternary-search';
import { englishThreeWayQuickSortModule } from './three-way-quick-sort';
import { englishTopDownMergeSortModule } from './top-down-merge-sort';
import { englishTreeDpModule } from './tree-dp';
import { englishTspModule } from './tsp';
import { englishTwoSatModule } from './two-sat';
import { englishWordSearchModule } from './word-search';
import { englishZFunctionModule } from './z-function';

export const fullParityAlgorithmModules = {
  'cocktail-sort': englishCocktailSortModule,
  'bitonic-sort': englishBitonicSortModule,
  'selection-sort': englishSelectionSortModule,
  'insertion-sort': englishInsertionSortModule,
  'binary-insertion-sort': englishBinaryInsertionSortModule,
  'shell-sort': englishShellSortModule,
  'top-down-merge-sort': englishTopDownMergeSortModule,
  'three-way-quick-sort': englishThreeWayQuickSortModule,
  'dual-pivot-quick-sort': englishDualPivotQuickSortModule,
  'radix-sort': englishRadixSortModule,
  'bucket-sort': englishBucketSortModule,
  'floyd-warshall': englishFloydWarshallModule,
  scc: englishSccModule,
  'two-sat': englishTwoSatModule,
  'max-flow': englishMaxFlowModule,
  hungarian: englishHungarianModule,
  lca: englishLcaModule,
  'euler-path': englishEulerPathModule,
  'complete-knapsack': englishCompleteKnapsackModule,
  'coin-change': englishCoinChangeModule,
  'stone-merge': englishStoneMergeModule,
  tsp: englishTspModule,
  'tree-dp': englishTreeDpModule,
  'digit-dp': englishDigitDpModule,
  'reroot-dp': englishRerootDpModule,
  permutations: englishPermutationsModule,
  'combination-sum': englishCombinationSumModule,
  'number-of-islands': englishNumberOfIslandsModule,
  'word-search': englishWordSearchModule,
  sudoku: englishSudokuModule,
  astar: englishAstarModule,
  'boyer-moore': englishBoyerMooreModule,
  'suffix-array': englishSuffixArrayModule,
  'lcp-array': englishLcpArrayModule,
  'aho-corasick': englishAhoCorasickModule,
  'z-function': englishZFunctionModule,
  'linear-sieve': englishLinearSieveModule,
  'fast-power': englishFastPowerModule,
  'ext-gcd': englishExtGcdModule,
  crt: englishCrtModule,
  'euler-phi': englishEulerPhiModule,
  'miller-rabin': englishMillerRabinModule,
  fft: englishFftModule,
  'pollard-rho': englishPollardRhoModule,
  'rotating-calipers': englishRotatingCalipersModule,
  'segment-intersection': englishSegmentIntersectionModule,
  'bentley-ottmann': englishBentleyOttmannModule,
  'rotated-search': englishRotatedSearchModule,
  'binary-answer': englishBinaryAnswerModule,
  'ternary-search': englishTernarySearchModule,
} as const;

export type FullParityAlgorithmModuleKey = keyof typeof fullParityAlgorithmModules;
