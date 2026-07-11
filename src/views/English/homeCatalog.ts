import type { Category } from '@/views/Home/Main/types';
import { getEnglishHomeSections, type EnglishIconKey } from '@/i18n/catalog';
import ArrayIcon from '@/assets/array.svg';
import GraphIcon from '@/assets/graph.svg';
import QuickIcon from '@/assets/quick.svg';
import BinarySearchIcon from '@/assets/binary-search.svg';
import FenwickIcon from '@/assets/fenwick.svg';
import DijkstraIcon from '@/assets/dijkstra.svg';
import KnapsackIcon from '@/assets/knapsack.svg';
import KmpIcon from '@/assets/kmp.svg';
import ConvexHullIcon from '@/assets/convex-hull.svg';
import BubbleIcon from '@/assets/bubble.svg';
import MergeIcon from '@/assets/merge.svg';
import HeapIcon from '@/assets/heap.svg';
import CountingIcon from '@/assets/counting.svg';
import BinaryBoundsIcon from '@/assets/binary-bounds.svg';
import KruskalIcon from '@/assets/kruskal.svg';
import PrimIcon from '@/assets/prim.svg';
import BellmanFordIcon from '@/assets/bellman.svg';
import TopologicalSortIcon from '@/assets/topo.svg';
import ClosestPairIcon from '@/assets/closest-pair.svg';
import EditDistanceIcon from '@/assets/editdist.svg';
import LcsIcon from '@/assets/lcs.svg';
import LisIcon from '@/assets/lis.svg';
import NQueensIcon from '@/assets/queens.svg';
import SubsetsIcon from '@/assets/subsets.svg';
import MazeIcon from '@/assets/maze.svg';
import RabinKarpIcon from '@/assets/rabinkarp.svg';
import ManacherIcon from '@/assets/manacher.svg';
import SieveIcon from '@/assets/sieve.svg';
import GcdIcon from '@/assets/gcd.svg';

const iconByKey: Record<EnglishIconKey, string> = {
  complexity: ArrayIcon,
  paths: GraphIcon,
  'quick-sort': QuickIcon,
  'binary-search': BinarySearchIcon,
  fenwick: FenwickIcon,
  dijkstra: DijkstraIcon,
  knapsack: KnapsackIcon,
  kmp: KmpIcon,
  'convex-hull': ConvexHullIcon,
  'bubble-sort': BubbleIcon,
  'merge-sort': MergeIcon,
  'heap-sort': HeapIcon,
  'counting-sort': CountingIcon,
  'binary-bounds': BinaryBoundsIcon,
  kruskal: KruskalIcon,
  prim: PrimIcon,
  'bellman-ford': BellmanFordIcon,
  'topological-sort': TopologicalSortIcon,
  'closest-pair': ClosestPairIcon,
  'edit-distance': EditDistanceIcon,
  lcs: LcsIcon,
  lis: LisIcon,
  'n-queens': NQueensIcon,
  subsets: SubsetsIcon,
  maze: MazeIcon,
  'rabin-karp': RabinKarpIcon,
  manacher: ManacherIcon,
  'sieve-of-eratosthenes': SieveIcon,
  gcd: GcdIcon,
};

export function getEnglishHomeCategories(): Category[] {
  return getEnglishHomeSections().map((section) => ({
    title: section.title,
    desc: section.description,
    children: section.pages.map((page) => ({
      title: page.en.heading,
      desc: page.en.description,
      icon: iconByKey[page.en.iconKey],
      url: page.en.name,
    })),
  }));
}
