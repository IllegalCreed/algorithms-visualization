import type { LocationQueryRaw, RouteLocationRaw } from 'vue-router';

export type SiteLocale = 'zh-CN' | 'en';
export type PilotPageKind = 'home' | 'tool' | 'algorithm';

export const ENGLISH_SITE_NAME = 'Algorithm Visualizer';

export interface PilotSourcePage {
  name: string;
  path: string;
}

export interface EnglishPilotPage extends PilotSourcePage {
  heading: string;
  title: string;
  description: string;
  category?: string;
}

export interface PilotPagePair {
  key: string;
  kind: PilotPageKind;
  zh: PilotSourcePage;
  en: EnglishPilotPage;
}

export const PILOT_PAGE_PAIRS: readonly PilotPagePair[] = Object.freeze([
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
        'Explore ten carefully translated algorithm learning pages with step-by-step animation, synchronized code, complexity references, and guided learning paths.',
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
        'Compare the time and space complexity of all seven algorithms in the English pilot, with concise notes and direct links to each visualization.',
      category: 'Learning Tools',
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
        'Follow three focused routes through the English pilot, from search and sorting fundamentals to graphs, dynamic programming, strings, and geometry.',
      category: 'Learning Tools',
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
    },
  },
]);

export const ENGLISH_PILOT_PAGES: readonly EnglishPilotPage[] = Object.freeze(
  PILOT_PAGE_PAIRS.map((pair) => pair.en),
);

const pairsByRouteName = new Map<string, PilotPagePair>();
for (const pair of PILOT_PAGE_PAIRS) {
  pairsByRouteName.set(pair.zh.name, pair);
  pairsByRouteName.set(pair.en.name, pair);
}

export function getPilotPairByRouteName(routeName: unknown): PilotPagePair | undefined {
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
  const pair = getPilotPairByRouteName(routeName);
  if (!pair) return { name: targetLocale === 'en' ? 'en-home' : 'home' };

  const target = targetLocale === 'en' ? pair.en : pair.zh;
  return Object.keys(query).length > 0 ? { name: target.name, query } : { name: target.name };
}
