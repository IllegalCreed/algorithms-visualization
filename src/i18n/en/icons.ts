import AhoCorasickIcon from '@/assets/aho-corasick.svg';
import ArrayIcon from '@/assets/array.svg';
import AstarIcon from '@/assets/astar.svg';
import BTreeIcon from '@/assets/b-tree.svg';
import BellmanIcon from '@/assets/bellman.svg';
import BentleyOttmannIcon from '@/assets/bentley-ottmann.svg';
import BinaryAnswerIcon from '@/assets/binary-answer.svg';
import BinaryBoundsIcon from '@/assets/binary-bounds.svg';
import BinaryInsertionIcon from '@/assets/binary-insertion.svg';
import BinarySearchIcon from '@/assets/binary-search.svg';
import BitonicIcon from '@/assets/bitonic.svg';
import BloomIcon from '@/assets/bloom-filter.svg';
import BoyerMooreIcon from '@/assets/boyermoore.svg';
import BubbleIcon from '@/assets/bubble.svg';
import BucketIcon from '@/assets/bucket.svg';
import CocktailIcon from '@/assets/cocktail.svg';
import CoinChangeIcon from '@/assets/coin-change.svg';
import ClosestPairIcon from '@/assets/closest-pair.svg';
import CombsumIcon from '@/assets/combsum.svg';
import CompleteKnapsackIcon from '@/assets/complete-knapsack.svg';
import ConvexHullIcon from '@/assets/convex-hull.svg';
import CountingIcon from '@/assets/counting.svg';
import CrtIcon from '@/assets/crt.svg';
import DigitDpIcon from '@/assets/digit-dp.svg';
import DijkstraIcon from '@/assets/dijkstra.svg';
import DualPivotQuickIcon from '@/assets/dual-pivot-quick.svg';
import EditIcon from '@/assets/editdist.svg';
import EulerPathIcon from '@/assets/euler-path.svg';
import EulerPhiIcon from '@/assets/euler-phi.svg';
import ExtGcdIcon from '@/assets/ext-gcd.svg';
import FastPowerIcon from '@/assets/fast-power.svg';
import FenwickIcon from '@/assets/fenwick.svg';
import FftIcon from '@/assets/fft.svg';
import FloydIcon from '@/assets/floyd.svg';
import GcdIcon from '@/assets/gcd.svg';
import GraphIcon from '@/assets/graph.svg';
import HashIcon from '@/assets/hash.svg';
import HeapIcon from '@/assets/heap.svg';
import HungarianIcon from '@/assets/hungarian.svg';
import InsertionIcon from '@/assets/insertion.svg';
import IslandsIcon from '@/assets/islands.svg';
import KmpIcon from '@/assets/kmp.svg';
import KnapsackIcon from '@/assets/knapsack.svg';
import KruskalIcon from '@/assets/kruskal.svg';
import LcaIcon from '@/assets/lca.svg';
import LcpArrayIcon from '@/assets/lcp-array.svg';
import LcsIcon from '@/assets/lcs.svg';
import LinearSieveIcon from '@/assets/linear-sieve.svg';
import LinkIcon from '@/assets/link.svg';
import LisIcon from '@/assets/lis.svg';
import LruIcon from '@/assets/lru.svg';
import ManacherIcon from '@/assets/manacher.svg';
import MaxFlowIcon from '@/assets/max-flow.svg';
import MazeIcon from '@/assets/maze.svg';
import MergeIcon from '@/assets/merge.svg';
import MillerRabinIcon from '@/assets/miller-rabin.svg';
import PermuteIcon from '@/assets/permute.svg';
import PollardRhoIcon from '@/assets/pollard-rho.svg';
import PrimIcon from '@/assets/prim.svg';
import QueensIcon from '@/assets/queens.svg';
import QueueIcon from '@/assets/queue.svg';
import QuickIcon from '@/assets/quick.svg';
import RabinKarpIcon from '@/assets/rabinkarp.svg';
import RadixIcon from '@/assets/radix.svg';
import RerootDpIcon from '@/assets/reroot-dp.svg';
import RotatedSearchIcon from '@/assets/rotated-search.svg';
import RotatingCalipersIcon from '@/assets/rotating-calipers.svg';
import SccIcon from '@/assets/scc.svg';
import SegmentIntersectionIcon from '@/assets/segment-intersection.svg';
import SegmentTreeIcon from '@/assets/segment-tree.svg';
import SelectionIcon from '@/assets/selection.svg';
import ShellIcon from '@/assets/shell.svg';
import SieveIcon from '@/assets/sieve.svg';
import SkipListIcon from '@/assets/skip-list.svg';
import StackIcon from '@/assets/stack.svg';
import StoneMergeIcon from '@/assets/stone-merge.svg';
import SubsetsIcon from '@/assets/subsets.svg';
import SudokuIcon from '@/assets/sudoku.svg';
import SuffixArrayIcon from '@/assets/suffix-array.svg';
import TernarySearchIcon from '@/assets/ternary-search.svg';
import ThreeWayQuickIcon from '@/assets/three-way-quick.svg';
import TopDownMergeIcon from '@/assets/top-down-merge.svg';
import TopoIcon from '@/assets/topo.svg';
import TreeDpIcon from '@/assets/tree-dp.svg';
import TreeIcon from '@/assets/tree.svg';
import TrieIcon from '@/assets/trie.svg';
import TspIcon from '@/assets/tsp.svg';
import TwoSatIcon from '@/assets/two-sat.svg';
import UnionFindIcon from '@/assets/union-find.svg';
import WordSearchIcon from '@/assets/word-search.svg';
import ZFunctionIcon from '@/assets/z-function.svg';

export const ENGLISH_ICON_BY_KEY = {
  complexity: ArrayIcon,
  paths: GraphIcon,
  array: ArrayIcon,
  link: LinkIcon,
  stack: StackIcon,
  queue: QueueIcon,
  tree: TreeIcon,
  heap: HeapIcon,
  hash: HashIcon,
  graph: GraphIcon,
  trie: TrieIcon,
  'union-find': UnionFindIcon,
  lru: LruIcon,
  'skip-list': SkipListIcon,
  'segment-tree': SegmentTreeIcon,
  'b-tree': BTreeIcon,
  'bloom-filter': BloomIcon,
  fenwick: FenwickIcon,
  'bubble-sort': BubbleIcon,
  'cocktail-sort': CocktailIcon,
  'bitonic-sort': BitonicIcon,
  'selection-sort': SelectionIcon,
  'insertion-sort': InsertionIcon,
  'binary-insertion-sort': BinaryInsertionIcon,
  'shell-sort': ShellIcon,
  'merge-sort': MergeIcon,
  'top-down-merge-sort': TopDownMergeIcon,
  'quick-sort': QuickIcon,
  'three-way-quick-sort': ThreeWayQuickIcon,
  'dual-pivot-quick-sort': DualPivotQuickIcon,
  'heap-sort': HeapIcon,
  'counting-sort': CountingIcon,
  'radix-sort': RadixIcon,
  'bucket-sort': BucketIcon,
  dijkstra: DijkstraIcon,
  kruskal: KruskalIcon,
  prim: PrimIcon,
  'bellman-ford': BellmanIcon,
  'topological-sort': TopoIcon,
  'floyd-warshall': FloydIcon,
  scc: SccIcon,
  'two-sat': TwoSatIcon,
  'max-flow': MaxFlowIcon,
  hungarian: HungarianIcon,
  lca: LcaIcon,
  'euler-path': EulerPathIcon,
  'edit-distance': EditIcon,
  knapsack: KnapsackIcon,
  'complete-knapsack': CompleteKnapsackIcon,
  lcs: LcsIcon,
  lis: LisIcon,
  'coin-change': CoinChangeIcon,
  'stone-merge': StoneMergeIcon,
  tsp: TspIcon,
  'tree-dp': TreeDpIcon,
  'digit-dp': DigitDpIcon,
  'reroot-dp': RerootDpIcon,
  'n-queens': QueensIcon,
  subsets: SubsetsIcon,
  permutations: PermuteIcon,
  'combination-sum': CombsumIcon,
  maze: MazeIcon,
  'number-of-islands': IslandsIcon,
  'word-search': WordSearchIcon,
  sudoku: SudokuIcon,
  astar: AstarIcon,
  kmp: KmpIcon,
  'rabin-karp': RabinKarpIcon,
  'boyer-moore': BoyerMooreIcon,
  manacher: ManacherIcon,
  'suffix-array': SuffixArrayIcon,
  'lcp-array': LcpArrayIcon,
  'aho-corasick': AhoCorasickIcon,
  'z-function': ZFunctionIcon,
  'sieve-of-eratosthenes': SieveIcon,
  'linear-sieve': LinearSieveIcon,
  gcd: GcdIcon,
  'fast-power': FastPowerIcon,
  'ext-gcd': ExtGcdIcon,
  crt: CrtIcon,
  'euler-phi': EulerPhiIcon,
  'miller-rabin': MillerRabinIcon,
  fft: FftIcon,
  'pollard-rho': PollardRhoIcon,
  'convex-hull': ConvexHullIcon,
  'rotating-calipers': RotatingCalipersIcon,
  'closest-pair': ClosestPairIcon,
  'segment-intersection': SegmentIntersectionIcon,
  'bentley-ottmann': BentleyOttmannIcon,
  'binary-search': BinarySearchIcon,
  'binary-bounds': BinaryBoundsIcon,
  'rotated-search': RotatedSearchIcon,
  'binary-answer': BinaryAnswerIcon,
  'ternary-search': TernarySearchIcon,
} as const;

export type EnglishIconKey = keyof typeof ENGLISH_ICON_BY_KEY;
