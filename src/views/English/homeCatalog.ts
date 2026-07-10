import type { Category } from '@/views/Home/Main/types';
import { ENGLISH_PILOT_PAGES } from '@/i18n/pilot';
import ArrayIcon from '@/assets/array.svg';
import GraphIcon from '@/assets/graph.svg';
import QuickIcon from '@/assets/quick.svg';
import BinarySearchIcon from '@/assets/binary-search.svg';
import FenwickIcon from '@/assets/fenwick.svg';
import DijkstraIcon from '@/assets/dijkstra.svg';
import KnapsackIcon from '@/assets/knapsack.svg';
import KmpIcon from '@/assets/kmp.svg';
import ConvexHullIcon from '@/assets/convex-hull.svg';

const iconByName: Record<string, string> = {
  'en-complexity': ArrayIcon,
  'en-paths': GraphIcon,
  'en-quick-sort': QuickIcon,
  'en-binary-search': BinarySearchIcon,
  'en-fenwick': FenwickIcon,
  'en-dijkstra': DijkstraIcon,
  'en-knapsack': KnapsackIcon,
  'en-kmp': KmpIcon,
  'en-convex-hull': ConvexHullIcon,
};

const groups = [
  {
    title: 'Learning Toolkit',
    desc: 'Start with a compact reference or follow a guided route through the pilot.',
    names: ['en-complexity', 'en-paths'],
  },
  {
    title: 'Core Techniques',
    desc: 'Learn divide and conquer, logarithmic search, and lowbit-based range aggregation.',
    names: ['en-quick-sort', 'en-binary-search', 'en-fenwick'],
  },
  {
    title: 'Graphs and Optimization',
    desc: 'Trace shortest paths and dynamic-programming choices one state at a time.',
    names: ['en-dijkstra', 'en-knapsack'],
  },
  {
    title: 'Strings and Geometry',
    desc: 'Reuse matched prefixes with KMP, then build a convex boundary with cross products.',
    names: ['en-kmp', 'en-convex-hull'],
  },
] as const;

export function getEnglishHomeCategories(): Category[] {
  const pages = new Map(ENGLISH_PILOT_PAGES.map((page) => [page.name, page]));
  return groups.map((group) => ({
    title: group.title,
    desc: group.desc,
    children: group.names.map((name) => {
      const page = pages.get(name);
      if (!page) throw new Error(`English pilot page is missing: ${name}`);
      return {
        title: page.heading,
        desc: page.description,
        icon: iconByName[name],
        url: page.name,
      };
    }),
  }));
}
