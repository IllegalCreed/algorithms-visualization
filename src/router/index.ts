import { createRouter, createWebHistory } from 'vue-router';
import Master from '../views/Master/Master.vue';
import Home from '../views/Home/Home.vue';
import Docs from '../views/Docs/Docs.vue';
import About from '../views/About/About.vue';

const routes = [
  {
    path: '/',
    component: Master,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: '/docs',
        name: 'docs',
        component: Docs,
        children: [
          {
            path: '/docs/array',
            name: 'array',
            component: () => import('../views/Article/DataStructure/Array.vue'),
          },
          {
            path: '/docs/link',
            name: 'link',
            component: () => import('../views/Article/DataStructure/Link.vue'),
          },
          {
            path: '/docs/stack',
            name: 'stack',
            component: () => import('../views/Article/DataStructure/Stack.vue'),
          },
          {
            path: '/docs/queue',
            name: 'queue',
            component: () => import('../views/Article/DataStructure/Queue.vue'),
          },
          {
            path: '/docs/tree',
            name: 'tree',
            component: () => import('../views/Article/DataStructure/Tree.vue'),
          },
          {
            path: '/docs/heap',
            name: 'heap',
            component: () => import('../views/Article/DataStructure/Heap.vue'),
          },
          {
            path: '/docs/hash',
            name: 'hash',
            component: () => import('../views/Article/DataStructure/Hash.vue'),
          },
          {
            path: '/docs/graph',
            name: 'graph',
            component: () => import('../views/Article/DataStructure/Graph.vue'),
          },
          {
            path: '/docs/trie',
            name: 'trie',
            component: () => import('../views/Article/DataStructure/Trie.vue'),
          },
          {
            path: '/docs/union-find',
            name: 'union-find',
            component: () => import('../views/Article/DataStructure/UnionFind.vue'),
          },
          {
            path: '/docs/lru',
            name: 'lru',
            component: () => import('../views/Article/DataStructure/Lru.vue'),
          },
          {
            path: '/docs/skip-list',
            name: 'skip-list',
            component: () => import('../views/Article/DataStructure/SkipList.vue'),
          },
          {
            path: '/docs/segment-tree',
            name: 'segment-tree',
            component: () => import('../views/Article/DataStructure/SegmentTree.vue'),
          },
          {
            path: '/docs/b-tree',
            name: 'b-tree',
            component: () => import('../views/Article/DataStructure/BTree.vue'),
          },
          {
            path: '/docs/bloom-filter',
            name: 'bloom-filter',
            component: () => import('../views/Article/DataStructure/BloomFilter.vue'),
          },
          {
            path: '/docs/dijkstra',
            name: 'dijkstra',
            component: () => import('../views/Article/Algorithm/Dijkstra.vue'),
          },
          {
            path: '/docs/kruskal',
            name: 'kruskal',
            component: () => import('../views/Article/Algorithm/Kruskal.vue'),
          },
          {
            path: '/docs/prim',
            name: 'prim',
            component: () => import('../views/Article/Algorithm/Prim.vue'),
          },
          {
            path: '/docs/bellman-ford',
            name: 'bellman-ford',
            component: () => import('../views/Article/Algorithm/Bellman.vue'),
          },
          {
            path: '/docs/topological-sort',
            name: 'topological-sort',
            component: () => import('../views/Article/Algorithm/Topo.vue'),
          },
          {
            path: '/docs/floyd-warshall',
            name: 'floyd-warshall',
            component: () => import('../views/Article/Algorithm/Floyd.vue'),
          },
          {
            path: '/docs/scc',
            name: 'scc',
            component: () => import('../views/Article/Algorithm/Scc.vue'),
          },
          {
            path: '/docs/two-sat',
            name: 'two-sat',
            component: () => import('../views/Article/Algorithm/TwoSat.vue'),
          },
          {
            path: '/docs/max-flow',
            name: 'max-flow',
            component: () => import('../views/Article/Algorithm/MaxFlow.vue'),
          },
          {
            path: '/docs/edit-distance',
            name: 'edit-distance',
            component: () => import('../views/Article/Algorithm/Edit.vue'),
          },
          {
            path: '/docs/knapsack',
            name: 'knapsack',
            component: () => import('../views/Article/Algorithm/Knapsack.vue'),
          },
          {
            path: '/docs/complete-knapsack',
            name: 'complete-knapsack',
            component: () => import('../views/Article/Algorithm/CompleteKnapsack.vue'),
          },
          {
            path: '/docs/lcs',
            name: 'lcs',
            component: () => import('../views/Article/Algorithm/Lcs.vue'),
          },
          {
            path: '/docs/lis',
            name: 'lis',
            component: () => import('../views/Article/Algorithm/Lis.vue'),
          },
          {
            path: '/docs/coin-change',
            name: 'coin-change',
            component: () => import('../views/Article/Algorithm/CoinChange.vue'),
          },
          {
            path: '/docs/n-queens',
            name: 'n-queens',
            component: () => import('../views/Article/Algorithm/Queens.vue'),
          },
          {
            path: '/docs/subsets',
            name: 'subsets',
            component: () => import('../views/Article/Algorithm/Subsets.vue'),
          },
          {
            path: '/docs/permutations',
            name: 'permutations',
            component: () => import('../views/Article/Algorithm/Permute.vue'),
          },
          {
            path: '/docs/combination-sum',
            name: 'combination-sum',
            component: () => import('../views/Article/Algorithm/Combsum.vue'),
          },
          {
            path: '/docs/maze',
            name: 'maze',
            component: () => import('../views/Article/Algorithm/Maze.vue'),
          },
          {
            path: '/docs/number-of-islands',
            name: 'number-of-islands',
            component: () => import('../views/Article/Algorithm/Islands.vue'),
          },
          {
            path: '/docs/word-search',
            name: 'word-search',
            component: () => import('../views/Article/Algorithm/WordSearch.vue'),
          },
          {
            path: '/docs/sudoku',
            name: 'sudoku',
            component: () => import('../views/Article/Algorithm/Sudoku.vue'),
          },
          {
            path: '/docs/kmp',
            name: 'kmp',
            component: () => import('../views/Article/Algorithm/Kmp.vue'),
          },
          {
            path: '/docs/rabin-karp',
            name: 'rabin-karp',
            component: () => import('../views/Article/Algorithm/RabinKarp.vue'),
          },
          {
            path: '/docs/boyer-moore',
            name: 'boyer-moore',
            component: () => import('../views/Article/Algorithm/BoyerMoore.vue'),
          },
          {
            path: '/docs/manacher',
            name: 'manacher',
            component: () => import('../views/Article/Algorithm/Manacher.vue'),
          },
          {
            path: '/docs/suffix-array',
            name: 'suffix-array',
            component: () => import('../views/Article/Algorithm/SuffixArray.vue'),
          },
          {
            path: '/docs/lcp-array',
            name: 'lcp-array',
            component: () => import('../views/Article/Algorithm/LcpArray.vue'),
          },
          {
            path: '/docs/aho-corasick',
            name: 'aho-corasick',
            component: () => import('../views/Article/Algorithm/AhoCorasick.vue'),
          },
          {
            path: '/docs/sieve-of-eratosthenes',
            name: 'sieve-of-eratosthenes',
            component: () => import('../views/Article/Algorithm/SieveOfEratosthenes.vue'),
          },
          {
            path: '/docs/linear-sieve',
            name: 'linear-sieve',
            component: () => import('../views/Article/Algorithm/LinearSieve.vue'),
          },
          {
            path: '/docs/gcd',
            name: 'gcd',
            component: () => import('../views/Article/Algorithm/Gcd.vue'),
          },
          {
            path: '/docs/fast-power',
            name: 'fast-power',
            component: () => import('../views/Article/Algorithm/FastPower.vue'),
          },
          {
            path: '/docs/ext-gcd',
            name: 'ext-gcd',
            component: () => import('../views/Article/Algorithm/ExtGcd.vue'),
          },
          {
            path: '/docs/crt',
            name: 'crt',
            component: () => import('../views/Article/Algorithm/Crt.vue'),
          },
          {
            path: '/docs/euler-phi',
            name: 'euler-phi',
            component: () => import('../views/Article/Algorithm/EulerPhi.vue'),
          },
          {
            path: '/docs/miller-rabin',
            name: 'miller-rabin',
            component: () => import('../views/Article/Algorithm/MillerRabin.vue'),
          },
          {
            path: '/docs/convex-hull',
            name: 'convex-hull',
            component: () => import('../views/Article/Algorithm/ConvexHull.vue'),
          },
          {
            path: '/docs/rotating-calipers',
            name: 'rotating-calipers',
            component: () => import('../views/Article/Algorithm/RotatingCalipers.vue'),
          },
          {
            path: '/docs/closest-pair',
            name: 'closest-pair',
            component: () => import('../views/Article/Algorithm/ClosestPair.vue'),
          },
          {
            path: '/docs/segment-intersection',
            name: 'segment-intersection',
            component: () => import('../views/Article/Algorithm/SegmentIntersection.vue'),
          },
          {
            path: '/docs/bentley-ottmann',
            name: 'bentley-ottmann',
            component: () => import('../views/Article/Algorithm/BentleyOttmann.vue'),
          },
          {
            path: '/docs/binary-search',
            name: 'binary-search',
            component: () => import('../views/Article/Algorithm/BinarySearch.vue'),
          },
          {
            path: '/docs/bubble-sort',
            name: 'bubble-sort',
            component: () => import('../views/Article/SortAlgorithm/BubbleSort.vue'),
          },
          {
            path: '/docs/bitonic-sort',
            name: 'bitonic-sort',
            component: () => import('../views/Article/SortAlgorithm/BitonicSort.vue'),
          },
          {
            path: '/docs/cocktail-sort',
            name: 'cocktail-sort',
            component: () => import('../views/Article/SortAlgorithm/CocktailSort.vue'),
          },
          {
            path: '/docs/selection-sort',
            name: 'selection-sort',
            component: () => import('../views/Article/SortAlgorithm/SelectionSort.vue'),
          },
          {
            path: '/docs/insertion-sort',
            name: 'insertion-sort',
            component: () => import('../views/Article/SortAlgorithm/InsertionSort.vue'),
          },
          {
            path: '/docs/binary-insertion-sort',
            name: 'binary-insertion-sort',
            component: () => import('../views/Article/SortAlgorithm/BinaryInsertionSort.vue'),
          },
          {
            path: '/docs/shell-sort',
            name: 'shell-sort',
            component: () => import('../views/Article/SortAlgorithm/ShellSort.vue'),
          },
          {
            path: '/docs/merge-sort',
            name: 'merge-sort',
            component: () => import('../views/Article/SortAlgorithm/MergeSort.vue'),
          },
          {
            path: '/docs/top-down-merge-sort',
            name: 'top-down-merge-sort',
            component: () => import('../views/Article/SortAlgorithm/TopDownMergeSort.vue'),
          },
          {
            path: '/docs/quick-sort',
            name: 'quick-sort',
            component: () => import('../views/Article/SortAlgorithm/QuickSort.vue'),
          },
          {
            path: '/docs/three-way-quick-sort',
            name: 'three-way-quick-sort',
            component: () => import('../views/Article/SortAlgorithm/ThreeWayQuickSort.vue'),
          },
          {
            path: '/docs/dual-pivot-quick-sort',
            name: 'dual-pivot-quick-sort',
            component: () => import('../views/Article/SortAlgorithm/DualPivotQuickSort.vue'),
          },
          {
            path: '/docs/heap-sort',
            name: 'heap-sort',
            component: () => import('../views/Article/SortAlgorithm/HeapSort.vue'),
          },
          {
            path: '/docs/counting-sort',
            name: 'counting-sort',
            component: () => import('../views/Article/SortAlgorithm/CountingSort.vue'),
          },
          {
            path: '/docs/radix-sort',
            name: 'radix-sort',
            component: () => import('../views/Article/SortAlgorithm/RadixSort.vue'),
          },
          {
            path: '/docs/bucket-sort',
            name: 'bucket-sort',
            component: () => import('../views/Article/SortAlgorithm/BucketSort.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;
