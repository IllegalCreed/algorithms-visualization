import type { LocationQueryRaw, RouteLocationRaw } from 'vue-router';
import { ENGLISH_FULL_PARITY_ADDITIONS } from './en/fullParityPages';
import type { EnglishIconKey } from './en/icons';

export type { EnglishIconKey } from './en/icons';

export type SiteLocale = 'zh-CN' | 'en';
export type LocalizedPageKind = 'home' | 'tool' | 'structure' | 'algorithm';
export type EnglishCategory =
  | 'Learning Tools'
  | 'Data Structures'
  | 'Sorting'
  | 'Graph Algorithms'
  | 'Dynamic Programming'
  | 'Backtracking and Search'
  | 'Strings'
  | 'Math and Number Theory'
  | 'Computational Geometry'
  | 'Searching';
export type EnglishHomeGroupId =
  | 'toolkit'
  | 'data-structures'
  | 'sorting'
  | 'graphs'
  | 'dynamic-programming'
  | 'backtracking'
  | 'strings'
  | 'number-theory'
  | 'geometry'
  | 'searching';
export type EnglishLearningPathId =
  | 'foundations'
  | 'sorting'
  | 'graphs'
  | 'dynamic-programming'
  | 'backtracking'
  | 'strings'
  | 'number-theory'
  | 'geometry';

export const ENGLISH_SITE_NAME = 'Algorithm Visualizer';

export interface LocalizedSourcePage {
  name: string;
  path: string;
}

export interface EnglishPageMetadata extends LocalizedSourcePage {
  heading: string;
  title: string;
  description: string;
  category?: EnglishCategory;
}

export interface EnglishContentMetadata extends EnglishPageMetadata {
  category: EnglishCategory;
  iconKey: EnglishIconKey;
  homeGroup: EnglishHomeGroupId;
  order: number;
}

export interface ComplexityInfo {
  time: string;
  space: string;
  note: string;
}

export interface EnglishLearningMetadata extends EnglishContentMetadata {
  complexity: ComplexityInfo;
  pathTags: readonly EnglishLearningPathId[];
  pathOrder: number;
}

export type EnglishAlgorithmMetadata = EnglishLearningMetadata;
export type EnglishStructureMetadata = EnglishLearningMetadata;

export interface LocalizedHomePagePair {
  key: 'home';
  kind: 'home';
  zh: LocalizedSourcePage;
  en: EnglishPageMetadata;
}

export interface LocalizedToolPagePair {
  key: string;
  kind: 'tool';
  zh: LocalizedSourcePage;
  en: EnglishContentMetadata;
}

export interface LocalizedAlgorithmPagePair {
  key: string;
  kind: 'algorithm';
  zh: LocalizedSourcePage;
  en: EnglishAlgorithmMetadata;
}

export interface LocalizedStructurePagePair {
  key: string;
  kind: 'structure';
  zh: LocalizedSourcePage;
  en: EnglishStructureMetadata;
}

export type LocalizedLearningPagePair = LocalizedStructurePagePair | LocalizedAlgorithmPagePair;

export type LocalizedPagePair =
  | LocalizedHomePagePair
  | LocalizedToolPagePair
  | LocalizedStructurePagePair
  | LocalizedAlgorithmPagePair;

export const LOCALIZED_PAGE_PAIRS: readonly LocalizedPagePair[] = Object.freeze([
  {
    key: 'home',
    kind: 'home',
    zh: { name: 'home', path: '/' },
    en: {
      name: 'en-home',
      path: '/en',
      heading: ENGLISH_SITE_NAME,
      title: `${ENGLISH_SITE_NAME} | Interactive Algorithms, Step by Step`,
      description:
        'Explore carefully translated algorithm learning pages with step-by-step animation, synchronized code, complexity references, and guided learning paths.',
    },
  },
  {
    key: 'complexity',
    kind: 'tool',
    zh: { name: 'complexity', path: '/docs/complexity' },
    en: {
      name: 'en-complexity',
      path: '/en/docs/complexity',
      heading: 'Algorithm Complexity Reference',
      title: `Algorithm Complexity Reference | ${ENGLISH_SITE_NAME}`,
      description:
        'Compare the time and space complexity of every translated algorithm, with concise notes and direct links to each visualization.',
      category: 'Learning Tools',
      iconKey: 'complexity',
      homeGroup: 'toolkit',
      order: 10,
    },
  },
  {
    key: 'paths',
    kind: 'tool',
    zh: { name: 'paths', path: '/docs/paths' },
    en: {
      name: 'en-paths',
      path: '/en/docs/paths',
      heading: 'Algorithm Learning Paths',
      title: `Algorithm Learning Paths | ${ENGLISH_SITE_NAME}`,
      description:
        'Follow focused learning routes through the translated catalog, from search and sorting fundamentals to graphs, dynamic programming, strings, and geometry.',
      category: 'Learning Tools',
      iconKey: 'paths',
      homeGroup: 'toolkit',
      order: 20,
    },
  },
  {
    key: 'quick-sort',
    kind: 'algorithm',
    zh: { name: 'quick-sort', path: '/docs/quick-sort' },
    en: {
      name: 'en-quick-sort',
      path: '/en/docs/quick-sort',
      heading: 'Quick Sort',
      title: `Quick Sort Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Watch Lomuto partitioning place each pivot, inspect the explicit interval stack, change the input, and follow Quick Sort code in four languages.',
      category: 'Sorting',
      iconKey: 'quick-sort',
      homeGroup: 'sorting',
      order: 100,
      complexity: {
        time: 'Average O(n log n)',
        space: 'O(log n)',
        note: 'In-place; worst case O(n^2) with consistently poor pivots.',
      },
      pathTags: ['sorting'],
      pathOrder: 100,
    },
  },
  {
    key: 'bubble-sort',
    kind: 'algorithm',
    zh: { name: 'bubble-sort', path: '/docs/bubble-sort' },
    en: {
      name: 'en-bubble-sort',
      path: '/en/docs/bubble-sort',
      heading: 'Bubble Sort',
      title: `Bubble Sort Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Watch adjacent comparisons move the largest remaining value to the sorted suffix on every Bubble Sort pass.',
      category: 'Sorting',
      iconKey: 'bubble-sort',
      homeGroup: 'sorting',
      order: 10,
      complexity: {
        time: 'O(n^2)',
        space: 'O(1)',
        note: 'Stable and in-place, but quadratic even when this basic version is already sorted.',
      },
      pathTags: ['sorting'],
      pathOrder: 10,
    },
  },
  {
    key: 'merge-sort',
    kind: 'algorithm',
    zh: { name: 'merge-sort', path: '/docs/merge-sort' },
    en: {
      name: 'en-merge-sort',
      path: '/en/docs/merge-sort',
      heading: 'Merge Sort',
      title: `Merge Sort Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Follow bottom-up Merge Sort as adjacent sorted runs are merged through an auxiliary array and copied back.',
      category: 'Sorting',
      iconKey: 'merge-sort',
      homeGroup: 'sorting',
      order: 80,
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        note: 'Stable with predictable time; the array implementation needs auxiliary storage.',
      },
      pathTags: ['sorting'],
      pathOrder: 80,
    },
  },
  {
    key: 'heap-sort',
    kind: 'algorithm',
    zh: { name: 'heap-sort', path: '/docs/heap-sort' },
    en: {
      name: 'en-heap-sort',
      path: '/en/docs/heap-sort',
      heading: 'Heap Sort',
      title: `Heap Sort Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Build a max heap, extract its root into the sorted suffix, and watch array and tree views stay synchronized.',
      category: 'Sorting',
      iconKey: 'heap-sort',
      homeGroup: 'sorting',
      order: 130,
      complexity: {
        time: 'O(n log n)',
        space: 'O(1)',
        note: 'In-place with a worst-case O(n log n) bound, but not stable.',
      },
      pathTags: ['sorting'],
      pathOrder: 130,
    },
  },
  {
    key: 'counting-sort',
    kind: 'algorithm',
    zh: { name: 'counting-sort', path: '/docs/counting-sort' },
    en: {
      name: 'en-counting-sort',
      path: '/en/docs/counting-sort',
      heading: 'Counting Sort',
      title: `Counting Sort Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Count a compact integer value range into buckets, then write values back in order without comparing elements.',
      category: 'Sorting',
      iconKey: 'counting-sort',
      homeGroup: 'sorting',
      order: 140,
      complexity: {
        time: 'O(n+k)',
        space: 'O(k)',
        note: 'Excellent for a compact integer range k; unsuitable when the range is very sparse.',
      },
      pathTags: ['sorting'],
      pathOrder: 140,
    },
  },
  {
    key: 'binary-search',
    kind: 'algorithm',
    zh: { name: 'binary-search', path: '/docs/binary-search' },
    en: {
      name: 'en-binary-search',
      path: '/en/docs/binary-search',
      heading: 'Binary Search',
      title: `Binary Search Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'See Binary Search discard half of a sorted array at every probe, including both a successful lookup and a clean not-found result.',
      category: 'Searching',
      iconKey: 'binary-search',
      homeGroup: 'searching',
      order: 10,
      complexity: {
        time: 'O(log n)',
        space: 'O(1)',
        note: 'Requires sorted data and discards half of the candidate range per probe.',
      },
      pathTags: ['foundations'],
      pathOrder: 170,
    },
  },
  {
    key: 'binary-bounds',
    kind: 'algorithm',
    zh: { name: 'binary-bounds', path: '/docs/binary-bounds' },
    en: {
      name: 'en-binary-bounds',
      path: '/en/docs/binary-bounds',
      heading: 'Lower and Upper Bound',
      title: `Lower and Upper Bound Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Use half-open Binary Search templates to find the first value at least a target and the first value greater than it.',
      category: 'Searching',
      iconKey: 'binary-bounds',
      homeGroup: 'searching',
      order: 20,
      complexity: {
        time: 'O(log n)',
        space: 'O(1)',
        note: 'Two boundary searches locate an equal range without a special found branch.',
      },
      pathTags: ['foundations'],
      pathOrder: 180,
    },
  },
  {
    key: 'fenwick',
    kind: 'algorithm',
    zh: { name: 'fenwick', path: '/docs/fenwick' },
    en: {
      name: 'en-fenwick',
      path: '/en/docs/fenwick',
      heading: 'Fenwick Tree',
      title: `Fenwick Tree Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Visualize lowbit jumps for prefix queries and point updates in a Fenwick Tree, with every affected range and tree value shown step by step.',
      category: 'Data Structures',
      iconKey: 'fenwick',
      homeGroup: 'data-structures',
      order: 160,
      complexity: {
        time: 'O(log n)',
        space: 'O(n)',
        note: 'Both point updates and prefix queries follow a lowbit chain.',
      },
      pathTags: ['foundations'],
      pathOrder: 160,
    },
  },
  {
    key: 'dijkstra',
    kind: 'algorithm',
    zh: { name: 'dijkstra', path: '/docs/dijkstra' },
    en: {
      name: 'en-dijkstra',
      path: '/en/docs/dijkstra',
      heading: "Dijkstra's Shortest Path",
      title: `Dijkstra's Algorithm Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        "Trace Dijkstra's algorithm as it settles the nearest vertex, relaxes weighted edges, and builds a shortest-path tree on a directed graph.",
      category: 'Graph Algorithms',
      iconKey: 'dijkstra',
      homeGroup: 'graphs',
      order: 10,
      complexity: {
        time: 'O((V+E) log V)',
        space: 'O(V)',
        note: 'Heap-based implementation for graphs with non-negative edge weights.',
      },
      pathTags: ['graphs'],
      pathOrder: 10,
    },
  },
  {
    key: 'kruskal',
    kind: 'algorithm',
    zh: { name: 'kruskal', path: '/docs/kruskal' },
    en: {
      name: 'en-kruskal',
      path: '/en/docs/kruskal',
      heading: "Kruskal's Minimum Spanning Tree",
      title: `Kruskal's Minimum Spanning Tree Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Process weighted edges from lightest to heaviest, use disjoint sets to reject cycles, and watch Kruskal build a minimum spanning tree.',
      category: 'Graph Algorithms',
      iconKey: 'kruskal',
      homeGroup: 'graphs',
      order: 20,
      complexity: {
        time: 'O(E log E)',
        space: 'O(V+E)',
        note: 'Edge sorting dominates; disjoint-set operations are nearly constant amortized.',
      },
      pathTags: ['graphs'],
      pathOrder: 20,
    },
  },
  {
    key: 'prim',
    kind: 'algorithm',
    zh: { name: 'prim', path: '/docs/prim' },
    en: {
      name: 'en-prim',
      path: '/en/docs/prim',
      heading: "Prim's Minimum Spanning Tree",
      title: `Prim's Minimum Spanning Tree Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Grow one connected tree from a starting vertex by repeatedly taking the lightest edge that crosses from the tree to an outside vertex.',
      category: 'Graph Algorithms',
      iconKey: 'prim',
      homeGroup: 'graphs',
      order: 30,
      complexity: {
        time: 'O(E log V)',
        space: 'O(V+E)',
        note: 'A binary heap gives the sparse-graph bound; a dense implementation can use O(V^2).',
      },
      pathTags: ['graphs'],
      pathOrder: 30,
    },
  },
  {
    key: 'bellman-ford',
    kind: 'algorithm',
    zh: { name: 'bellman-ford', path: '/docs/bellman-ford' },
    en: {
      name: 'en-bellman-ford',
      path: '/en/docs/bellman-ford',
      heading: 'Bellman-Ford Shortest Paths',
      title: `Bellman-Ford Shortest Paths Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Relax every directed edge for V-1 rounds, follow distances through negative edges, and reveal the final shortest-path tree.',
      category: 'Graph Algorithms',
      iconKey: 'bellman-ford',
      homeGroup: 'graphs',
      order: 40,
      complexity: {
        time: 'O(VE)',
        space: 'O(V)',
        note: 'Supports negative edges; one additional relaxation round detects a reachable negative cycle.',
      },
      pathTags: ['graphs'],
      pathOrder: 40,
    },
  },
  {
    key: 'topological-sort',
    kind: 'algorithm',
    zh: { name: 'topological-sort', path: '/docs/topological-sort' },
    en: {
      name: 'en-topological-sort',
      path: '/en/docs/topological-sort',
      heading: 'Topological Sort',
      title: `Topological Sort Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        "Run Kahn's algorithm on a directed acyclic graph, remove zero-indegree vertices, and watch each dependency update the final order.",
      category: 'Graph Algorithms',
      iconKey: 'topological-sort',
      homeGroup: 'graphs',
      order: 50,
      complexity: {
        time: 'O(V+E)',
        space: 'O(V)',
        note: 'Every vertex and edge is processed once; leftover vertices reveal a directed cycle.',
      },
      pathTags: ['graphs'],
      pathOrder: 50,
    },
  },
  {
    key: 'knapsack',
    kind: 'algorithm',
    zh: { name: 'knapsack', path: '/docs/knapsack' },
    en: {
      name: 'en-knapsack',
      path: '/en/docs/knapsack',
      heading: '0/1 Knapsack',
      title: `0/1 Knapsack Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Fill the 0/1 Knapsack dynamic-programming table cell by cell and compare the skip and take choices that produce the optimal value.',
      category: 'Dynamic Programming',
      iconKey: 'knapsack',
      homeGroup: 'dynamic-programming',
      order: 20,
      complexity: {
        time: 'O(nW)',
        space: 'O(nW)',
        note: 'Pseudo-polynomial in capacity W; space can be reduced to O(W).',
      },
      pathTags: ['dynamic-programming'],
      pathOrder: 20,
    },
  },
  {
    key: 'edit-distance',
    kind: 'algorithm',
    zh: { name: 'edit-distance', path: '/docs/edit-distance' },
    en: {
      name: 'en-edit-distance',
      path: '/en/docs/edit-distance',
      heading: 'Edit Distance',
      title: `Edit Distance Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Fill the Levenshtein dynamic-programming matrix to find the minimum insertions, deletions, and substitutions between two strings.',
      category: 'Dynamic Programming',
      iconKey: 'edit-distance',
      homeGroup: 'dynamic-programming',
      order: 10,
      complexity: {
        time: 'O(mn)',
        space: 'O(mn)',
        note: 'The full table supports reconstruction; distance alone can be computed with O(n) space.',
      },
      pathTags: ['dynamic-programming'],
      pathOrder: 10,
    },
  },
  {
    key: 'lcs',
    kind: 'algorithm',
    zh: { name: 'lcs', path: '/docs/lcs' },
    en: {
      name: 'en-lcs',
      path: '/en/docs/lcs',
      heading: 'Longest Common Subsequence',
      title: `Longest Common Subsequence Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Build the LCS table from matching and mismatching character pairs, then trace backward to reconstruct an actual common subsequence.',
      category: 'Dynamic Programming',
      iconKey: 'lcs',
      homeGroup: 'dynamic-programming',
      order: 40,
      complexity: {
        time: 'O(mn)',
        space: 'O(mn)',
        note: 'Keeping the table makes the backward reconstruction path explicit.',
      },
      pathTags: ['dynamic-programming'],
      pathOrder: 40,
    },
  },
  {
    key: 'lis',
    kind: 'algorithm',
    zh: { name: 'lis', path: '/docs/lis' },
    en: {
      name: 'en-lis',
      path: '/en/docs/lis',
      heading: 'Longest Increasing Subsequence',
      title: `Longest Increasing Subsequence Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Use one-dimensional dynamic programming to extend increasing subsequences, preserve predecessors, and reconstruct one longest result.',
      category: 'Dynamic Programming',
      iconKey: 'lis',
      homeGroup: 'dynamic-programming',
      order: 50,
      complexity: {
        time: 'O(n^2)',
        space: 'O(n)',
        note: 'This DP exposes predecessors; a patience-sorting variant reaches O(n log n).',
      },
      pathTags: ['dynamic-programming'],
      pathOrder: 50,
    },
  },
  {
    key: 'n-queens',
    kind: 'algorithm',
    zh: { name: 'n-queens', path: '/docs/n-queens' },
    en: {
      name: 'en-n-queens',
      path: '/en/docs/n-queens',
      heading: 'N-Queens',
      title: `N-Queens Backtracking Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Place queens column by column, reject attacked squares, and watch recursive backtracking recover from choices that block the board.',
      category: 'Backtracking and Search',
      iconKey: 'n-queens',
      homeGroup: 'backtracking',
      order: 10,
      complexity: {
        time: 'O(N!)',
        space: 'O(N)',
        note: 'Conflict checks prune the search, while recursion stores at most one choice per column.',
      },
      pathTags: ['backtracking'],
      pathOrder: 10,
    },
  },
  {
    key: 'subsets',
    kind: 'algorithm',
    zh: { name: 'subsets', path: '/docs/subsets' },
    en: {
      name: 'en-subsets',
      path: '/en/docs/subsets',
      heading: 'Subsets',
      title: `Subsets Backtracking Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Traverse an include-or-exclude decision tree depth first and record every leaf to generate the complete power set without duplicates.',
      category: 'Backtracking and Search',
      iconKey: 'subsets',
      homeGroup: 'backtracking',
      order: 20,
      complexity: {
        time: 'O(n*2^n)',
        space: 'O(n*2^n)',
        note: 'There are 2^n outputs, and materializing each subset copies up to n values.',
      },
      pathTags: ['backtracking'],
      pathOrder: 20,
    },
  },
  {
    key: 'maze',
    kind: 'algorithm',
    zh: { name: 'maze', path: '/docs/maze' },
    en: {
      name: 'en-maze',
      path: '/en/docs/maze',
      heading: 'Maze Solving with DFS',
      title: `Maze Solving with DFS Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Explore a grid depth first, mark visited cells, retreat from dead ends, and watch backtracking preserve the final path to the goal.',
      category: 'Backtracking and Search',
      iconKey: 'maze',
      homeGroup: 'backtracking',
      order: 50,
      complexity: {
        time: 'O(RC)',
        space: 'O(RC)',
        note: 'Each open cell is visited at most once; recursion and visited state can cover the grid.',
      },
      pathTags: ['backtracking'],
      pathOrder: 50,
    },
  },
  {
    key: 'kmp',
    kind: 'algorithm',
    zh: { name: 'kmp', path: '/docs/kmp' },
    en: {
      name: 'en-kmp',
      path: '/en/docs/kmp',
      heading: 'KMP String Matching',
      title: `KMP String Matching Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Follow KMP character comparisons and LPS jumps to see why the text pointer never moves backward and matching stays linear.',
      category: 'Strings',
      iconKey: 'kmp',
      homeGroup: 'strings',
      order: 10,
      complexity: {
        time: 'O(n+m)',
        space: 'O(m)',
        note: 'The text pointer never moves backward; preprocessing builds the LPS table.',
      },
      pathTags: ['strings'],
      pathOrder: 10,
    },
  },
  {
    key: 'rabin-karp',
    kind: 'algorithm',
    zh: { name: 'rabin-karp', path: '/docs/rabin-karp' },
    en: {
      name: 'en-rabin-karp',
      path: '/en/docs/rabin-karp',
      heading: 'Rabin-Karp String Matching',
      title: `Rabin-Karp String Matching Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Slide a rolling-hash window across the text, skip unequal hashes in constant time, and verify characters only after a hash match.',
      category: 'Strings',
      iconKey: 'rabin-karp',
      homeGroup: 'strings',
      order: 20,
      complexity: {
        time: 'Average O(n+m)',
        space: 'O(1)',
        note: 'Character verification prevents collision errors; adversarial collisions can cause O(nm) time.',
      },
      pathTags: ['strings'],
      pathOrder: 20,
    },
  },
  {
    key: 'manacher',
    kind: 'algorithm',
    zh: { name: 'manacher', path: '/docs/manacher' },
    en: {
      name: 'en-manacher',
      path: '/en/docs/manacher',
      heading: "Manacher's Longest Palindromic Substring",
      title: `Manacher's Algorithm Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Transform odd and even palindromes into one form, reuse mirror radii inside the rightmost box, and find the longest palindrome in linear time.',
      category: 'Strings',
      iconKey: 'manacher',
      homeGroup: 'strings',
      order: 40,
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
        note: 'Mirror reuse ensures expansion work advances the right boundary only linearly overall.',
      },
      pathTags: ['strings'],
      pathOrder: 40,
    },
  },
  {
    key: 'sieve-of-eratosthenes',
    kind: 'algorithm',
    zh: { name: 'sieve-of-eratosthenes', path: '/docs/sieve-of-eratosthenes' },
    en: {
      name: 'en-sieve-of-eratosthenes',
      path: '/en/docs/sieve-of-eratosthenes',
      heading: 'Sieve of Eratosthenes',
      title: `Sieve of Eratosthenes Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Mark composite multiples from each prime square, stop after the square-root boundary, and reveal every prime in a numeric range.',
      category: 'Math and Number Theory',
      iconKey: 'sieve-of-eratosthenes',
      homeGroup: 'number-theory',
      order: 10,
      complexity: {
        time: 'O(N log log N)',
        space: 'O(N)',
        note: 'Starting at p^2 avoids work already performed by smaller prime factors.',
      },
      pathTags: ['number-theory'],
      pathOrder: 10,
    },
  },
  {
    key: 'gcd',
    kind: 'algorithm',
    zh: { name: 'gcd', path: '/docs/gcd' },
    en: {
      name: 'en-gcd',
      path: '/en/docs/gcd',
      heading: 'Euclidean Algorithm',
      title: `Euclidean GCD Algorithm Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Apply repeated remainders to compute a greatest common divisor while a matching square tiling gives the recurrence a geometric meaning.',
      category: 'Math and Number Theory',
      iconKey: 'gcd',
      homeGroup: 'number-theory',
      order: 30,
      complexity: {
        time: 'O(log min(a,b))',
        space: 'O(1)',
        note: 'Each remainder strictly reduces the pair until the second value reaches zero.',
      },
      pathTags: ['number-theory'],
      pathOrder: 30,
    },
  },
  {
    key: 'convex-hull',
    kind: 'algorithm',
    zh: { name: 'convex-hull', path: '/docs/convex-hull' },
    en: {
      name: 'en-convex-hull',
      path: '/en/docs/convex-hull',
      heading: 'Convex Hull',
      title: `Convex Hull Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        "Build lower and upper hulls with Andrew's monotone chain, using cross products to remove right turns and reveal the final convex polygon.",
      category: 'Computational Geometry',
      iconKey: 'convex-hull',
      homeGroup: 'geometry',
      order: 10,
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        note: "Andrew's monotone chain is dominated by sorting the points.",
      },
      pathTags: ['geometry'],
      pathOrder: 10,
    },
  },
  {
    key: 'closest-pair',
    kind: 'algorithm',
    zh: { name: 'closest-pair', path: '/docs/closest-pair' },
    en: {
      name: 'en-closest-pair',
      path: '/en/docs/closest-pair',
      heading: 'Closest Pair of Points',
      title: `Closest Pair of Points Visualization | ${ENGLISH_SITE_NAME}`,
      description:
        'Divide a planar point set at its median x-coordinate, solve both halves, and inspect a narrow strip for a closer cross-boundary pair.',
      category: 'Computational Geometry',
      iconKey: 'closest-pair',
      homeGroup: 'geometry',
      order: 30,
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        note: 'Presorting and a y-ordered merge strip keep each recursion level linear.',
      },
      pathTags: ['geometry'],
      pathOrder: 30,
    },
  },
  ...ENGLISH_FULL_PARITY_ADDITIONS.map(
    (definition): LocalizedLearningPagePair => ({
      key: definition.key,
      kind: definition.kind,
      zh: { name: definition.key, path: `/docs/${definition.key}` },
      en: {
        name: `en-${definition.key}`,
        path: `/en/docs/${definition.key}`,
        heading: definition.heading,
        title: `${definition.heading} Visualization | ${ENGLISH_SITE_NAME}`,
        description: definition.description,
        category: definition.category,
        iconKey: definition.key,
        homeGroup: definition.homeGroup,
        order: definition.order,
        complexity: definition.complexity,
        pathTags: definition.pathTags,
        pathOrder: definition.pathOrder,
      },
    }),
  ),
]);

export const ENGLISH_PAGES: readonly EnglishPageMetadata[] = Object.freeze(
  LOCALIZED_PAGE_PAIRS.map((pair) => pair.en),
);

export const ENGLISH_CONTENT_PAGES: readonly (
  | LocalizedToolPagePair
  | LocalizedStructurePagePair
  | LocalizedAlgorithmPagePair
)[] = Object.freeze(
  LOCALIZED_PAGE_PAIRS.filter(
    (
      pair,
    ): pair is LocalizedToolPagePair | LocalizedStructurePagePair | LocalizedAlgorithmPagePair =>
      pair.kind !== 'home',
  ),
);

const HOME_SECTION_DEFINITIONS: ReadonlyArray<{
  id: EnglishHomeGroupId;
  title: string;
  description: string;
  order: number;
}> = [
  {
    id: 'toolkit',
    title: 'Learning Toolkit',
    description: 'Start with a compact reference or follow a guided route through the catalog.',
    order: 10,
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Understand compact structures that make repeated updates and queries efficient.',
    order: 20,
  },
  {
    id: 'sorting',
    title: 'Sorting',
    description: 'Compare adjacent swaps, divide and conquer, heaps, and non-comparison counting.',
    order: 30,
  },
  {
    id: 'graphs',
    title: 'Graph Algorithms',
    description:
      'Trace shortest paths, spanning structures, and dependency order one edge at a time.',
    order: 40,
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Build reusable state transitions and compare competing choices.',
    order: 50,
  },
  {
    id: 'backtracking',
    title: 'Backtracking and Search',
    description: 'Explore a decision space, reject invalid branches, and undo choices safely.',
    order: 60,
  },
  {
    id: 'strings',
    title: 'String Algorithms',
    description: 'Reuse prefix and palindrome structure to avoid repeated comparisons.',
    order: 70,
  },
  {
    id: 'number-theory',
    title: 'Math and Number Theory',
    description: 'Turn divisibility and prime structure into efficient iterative procedures.',
    order: 80,
  },
  {
    id: 'geometry',
    title: 'Computational Geometry',
    description: 'Use geometric invariants to reason about boundaries and distances.',
    order: 90,
  },
  {
    id: 'searching',
    title: 'Searching',
    description: 'Maintain a precise candidate interval and discard impossible answers.',
    order: 100,
  },
];

const LEARNING_PATH_DEFINITIONS: ReadonlyArray<{
  id: EnglishLearningPathId;
  title: string;
  description: string;
  order: number;
}> = [
  {
    id: 'foundations',
    title: 'Foundations',
    description:
      'Build a feel for logarithmic elimination, partitioning, and compact cumulative data.',
    order: 10,
  },
  {
    id: 'sorting',
    title: 'Sorting Systems',
    description: 'Compare how different invariants move values into their final order.',
    order: 20,
  },
  {
    id: 'graphs',
    title: 'Graph Structure',
    description: 'Build paths and global structure by processing vertices and edges safely.',
    order: 30,
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Define states, preserve dependencies, and reuse solved subproblems.',
    order: 40,
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    description: 'Choose, validate, recurse, and undo while exploring a constrained search space.',
    order: 50,
  },
  {
    id: 'strings',
    title: 'String Structure',
    description: 'Preprocess reusable structure so comparisons can skip repeated work.',
    order: 60,
  },
  {
    id: 'number-theory',
    title: 'Number Theory',
    description: 'Follow divisibility invariants through prime generation and greatest divisors.',
    order: 70,
  },
  {
    id: 'geometry',
    title: 'Geometry',
    description: 'Use orientation and distance invariants to reason about point sets.',
    order: 80,
  },
];

export function getEnglishAlgorithmPages(): readonly LocalizedAlgorithmPagePair[] {
  return LOCALIZED_PAGE_PAIRS.filter(
    (pair): pair is LocalizedAlgorithmPagePair => pair.kind === 'algorithm',
  );
}

export function getEnglishLearningPages(): readonly LocalizedLearningPagePair[] {
  return LOCALIZED_PAGE_PAIRS.filter(
    (pair): pair is LocalizedLearningPagePair =>
      pair.kind === 'structure' || pair.kind === 'algorithm',
  );
}

export function getEnglishHomeSections(): ReadonlyArray<{
  id: EnglishHomeGroupId;
  title: string;
  description: string;
  pages: ReadonlyArray<
    LocalizedToolPagePair | LocalizedStructurePagePair | LocalizedAlgorithmPagePair
  >;
}> {
  return [...HOME_SECTION_DEFINITIONS]
    .sort((left, right) => left.order - right.order)
    .map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      pages: ENGLISH_CONTENT_PAGES.filter((page) => page.en.homeGroup === section.id).sort(
        (left, right) => left.en.order - right.en.order,
      ),
    }))
    .filter((section) => section.pages.length > 0);
}

export function getEnglishLearningPaths(): ReadonlyArray<{
  id: EnglishLearningPathId;
  title: string;
  description: string;
  steps: readonly LocalizedLearningPagePair[];
}> {
  const learningPages = getEnglishLearningPages();
  return [...LEARNING_PATH_DEFINITIONS]
    .sort((left, right) => left.order - right.order)
    .map((path) => ({
      id: path.id,
      title: path.title,
      description: path.description,
      steps: learningPages
        .filter((page) => page.en.pathTags.includes(path.id))
        .sort((left, right) => left.en.pathOrder - right.en.pathOrder),
    }))
    .filter((path) => path.steps.length > 0);
}

const pairsByRouteName = new Map<string, LocalizedPagePair>();
for (const pair of LOCALIZED_PAGE_PAIRS) {
  pairsByRouteName.set(pair.zh.name, pair);
  pairsByRouteName.set(pair.en.name, pair);
}

export function getLocalizedPairByRouteName(routeName: unknown): LocalizedPagePair | undefined {
  if (typeof routeName !== 'string') return undefined;
  return pairsByRouteName.get(routeName);
}

export function siteLocaleFromPath(routePath: string): SiteLocale {
  const path = routePath.split(/[?#]/, 1)[0] || '/';
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh-CN';
}

export function getLanguageSwitchRoute(
  routeName: unknown,
  targetLocale: SiteLocale,
  query: LocationQueryRaw = {},
): RouteLocationRaw {
  const pair = getLocalizedPairByRouteName(routeName);
  if (!pair) return { name: targetLocale === 'en' ? 'en-home' : 'home' };

  const target = targetLocale === 'en' ? pair.en : pair.zh;
  return Object.keys(query).length > 0 ? { name: target.name, query } : { name: target.name };
}
