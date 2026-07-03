import type { Category } from './types';
import ArrayIcon from '@/assets/array.svg';
import LinkIcon from '@/assets/link.svg';
import StackIcon from '@/assets/stack.svg';
import QueueIcon from '@/assets/queue.svg';
import TreeIcon from '@/assets/tree.svg';
import HeapIcon from '@/assets/heap.svg';
import HashIcon from '@/assets/hash.svg';
import GraphIcon from '@/assets/graph.svg';
import TrieIcon from '@/assets/trie.svg';
import UnionFindIcon from '@/assets/union-find.svg';
import LruIcon from '@/assets/lru.svg';
import SkipListIcon from '@/assets/skip-list.svg';
import SegmentTreeIcon from '@/assets/segment-tree.svg';
import BTreeIcon from '@/assets/b-tree.svg';
import BloomIcon from '@/assets/bloom-filter.svg';
import DijkstraIcon from '@/assets/dijkstra.svg';
import KruskalIcon from '@/assets/kruskal.svg';
import PrimIcon from '@/assets/prim.svg';
import BellmanIcon from '@/assets/bellman.svg';
import TopoIcon from '@/assets/topo.svg';
import FloydIcon from '@/assets/floyd.svg';
import EditIcon from '@/assets/editdist.svg';
import BubbleIcon from '@/assets/bubble.svg';
import CocktailIcon from '@/assets/cocktail.svg';
import SelectionIcon from '@/assets/selection.svg';
import InsertionIcon from '@/assets/insertion.svg';
import BinaryInsertionIcon from '@/assets/binary-insertion.svg';
import ShellIcon from '@/assets/shell.svg';
import MergeIcon from '@/assets/merge.svg';
import TopDownMergeIcon from '@/assets/top-down-merge.svg';
import QuickIcon from '@/assets/quick.svg';
import ThreeWayQuickIcon from '@/assets/three-way-quick.svg';
import DualPivotQuickIcon from '@/assets/dual-pivot-quick.svg';
import CountingIcon from '@/assets/counting.svg';
import RadixIcon from '@/assets/radix.svg';
import BucketIcon from '@/assets/bucket.svg';

export function useCategoryData(): Category[] {
  const categoryData: Category[] = [
    {
      title: '数据结构',
      desc: '计算机存储、组织数据的方式',
      children: [
        {
          title: '数组',
          desc: '数组是有序元素的序列,每个元素都会被分配一个自增连续下标',
          icon: ArrayIcon,
          url: 'array',
        },
        {
          title: '链表',
          desc: '链表由一系列节点组成,每个节点包含储存数据的部分和保存相邻节点指针的部分',
          icon: LinkIcon,
          url: 'link',
        },
        {
          title: '栈',
          desc: '栈是一种特殊的线性表,栈顶允许操作,栈底不允许操作',
          icon: StackIcon,
          url: 'stack',
        },
        {
          title: '队列',
          desc: '队列是一种特殊的线性表,允许在队列的一端进行插入，而在队列的另一端进行删除',
          icon: QueueIcon,
          url: 'queue',
        },
        {
          title: '树',
          desc: '树是由n(n>=1)个有限节点组成一个具有层次关系的集合',
          icon: TreeIcon,
          url: 'tree',
        },
        {
          title: '堆',
          desc: '堆可以看做是一颗用数组实现的二叉树',
          icon: HeapIcon,
          url: 'heap',
        },
        {
          title: '哈希表',
          desc: '哈希表是根据键和值直接进行访问的数据结构',
          icon: HashIcon,
          url: 'hash',
        },
        {
          title: '图',
          desc: '图是一系列顶点的集合，这些顶点通过一系列边连接起来组成图这种数据结构。',
          icon: GraphIcon,
          url: 'graph',
        },
        {
          title: '字典树',
          desc: '把字符摊在边上的前缀树，路径拼出单词，天生支持前缀匹配与自动补全',
          icon: TrieIcon,
          url: 'trie',
        },
        {
          title: '并查集',
          desc: '极快维护「谁和谁同组」：合并、找根、路径压缩，连通性问题利器',
          icon: UnionFindIcon,
          url: 'union-find',
        },
        {
          title: 'LRU 缓存',
          desc: '哈希表 + 双向链表的经典组合，O(1) 读写，满了淘汰最久没用的',
          icon: LruIcon,
          url: 'lru',
        },
        {
          title: '跳表',
          desc: '给有序链表加几层快车道，楼梯式查找平均 O(log n)，Redis 有序集合底层',
          icon: SkipListIcon,
          url: 'skip-list',
        },
        {
          title: '线段树',
          desc: '每个节点管一段区间存聚合，区间查询拆整段、单点更新走一条路径，均 O(log n)',
          icon: SegmentTreeIcon,
          url: 'segment-tree',
        },
        {
          title: 'B+ 树',
          desc: '多路平衡查找树，数据全在叶 + 叶链，多路下钻查找 + 范围扫描，数据库索引的底层',
          icon: BTreeIcon,
          url: 'b-tree',
        },
        {
          title: '布隆过滤器',
          desc: '位数组 + 多哈希的概率型存在性判断，会误判不漏判、极省空间，缓存穿透/去重必备',
          icon: BloomIcon,
          url: 'bloom-filter',
        },
      ],
    },
    {
      title: '经典排序算法',
      desc: '根据不同数据结构对无序元素进行有序化的计算方法',
      children: [
        {
          title: '冒泡排序',
          desc: '每次循环找出目前数组中最大的数,放在当前数组末尾',
          icon: BubbleIcon,
          url: 'bubble-sort',
        },
        {
          title: '鸡尾酒排序',
          desc: '双向冒泡,来回扫描两端收缩,尾部小元素一趟到家,零交换提前收工',
          icon: CocktailIcon,
          url: 'cocktail-sort',
        },
        {
          title: '选择排序',
          desc: '每次循环找出目前数组中最小的数,放在当前数组头部',
          icon: SelectionIcon,
          url: 'selection-sort',
        },
        {
          title: '插入排序',
          desc: '顺序遍历数组每一个数字,然后和该数字前面的数组比较,将其放在适当的位置',
          icon: InsertionIcon,
          url: 'insertion-sort',
        },
        {
          title: '二分插入排序',
          desc: '插入排序变体,在已排序前缀里折半查找插入点,比较降到对数级,搬移不变保稳定',
          icon: BinaryInsertionIcon,
          url: 'binary-insertion-sort',
        },
        {
          title: '希尔排序',
          desc: '核心是一个插入排序,步进数1改为数组长度的一半,每完成一次步进都减小一半',
          icon: ShellIcon,
          url: 'shell-sort',
        },
        {
          title: '归并排序',
          desc: '通过递归构建二叉树结构，然进行左右两个节点的有序数组合并。',
          icon: MergeIcon,
          url: 'merge-sort',
        },
        {
          title: '自顶向下归并',
          desc: '递归分治版归并,对半下钻回程合并,配递归调用栈看分治全程,与迭代版对照',
          icon: TopDownMergeIcon,
          url: 'top-down-merge-sort',
        },
        {
          title: '快速排序',
          desc: '选取一个基准数,将比它小的放在前面,比它大的放在后面,左右两部分重复这一过程',
          icon: QuickIcon,
          url: 'quick-sort',
        },
        {
          title: '三路快排',
          desc: '荷兰国旗划分,把数组分成小于/等于/大于基准三段,等值元素一次归位,治大量重复',
          icon: ThreeWayQuickIcon,
          url: 'three-way-quick-sort',
        },
        {
          title: '双轴快排',
          desc: '两个基准一趟分三段,递归更浅缓存更友好,Java Arrays.sort 基本类型实际采用',
          icon: DualPivotQuickIcon,
          url: 'dual-pivot-quick-sort',
        },
        {
          title: '堆排序',
          desc: '利用大顶堆性质每次找出最大的数放在末尾，然后重复构造和维护大顶堆',
          icon: HeapIcon,
          url: 'heap-sort',
        },
        {
          title: '计数排序',
          desc: '在已知取值范围的情况下，按照一种萝卜一个坑的思想进行排序',
          icon: CountingIcon,
          url: 'counting-sort',
        },
        {
          title: '基数排序',
          desc: '不比较大小，按位（个位→十位…）反复分配到 10 个桶再收集，线性时间',
          icon: RadixIcon,
          url: 'radix-sort',
        },
        {
          title: '桶排序',
          desc: '按值域把元素撒进若干桶，桶内各自排序后按桶序合并，均匀分布时近线性',
          icon: BucketIcon,
          url: 'bucket-sort',
        },
      ],
    },
    {
      title: '图算法',
      desc: '在图（点 + 边）上求解的算法，如最短路、连通性、最小生成树',
      children: [
        {
          title: 'Dijkstra 最短路',
          desc: '带权图单源最短路：每次取当前最近的点松弛邻边，逐步确定到各点的最短距离',
          icon: DijkstraIcon,
          url: 'dijkstra',
        },
        {
          title: 'Kruskal 最小生成树',
          desc: '边按权重排序 + 并查集判环，不成环就加入，逐条生成总权最小的生成树',
          icon: KruskalIcon,
          url: 'kruskal',
        },
        {
          title: 'Prim 最小生成树',
          desc: '从一个起点生长：每步选「一端在树、一端在树外」的最小横切边并入，同图与 Kruskal 得同一棵 MST',
          icon: PrimIcon,
          url: 'prim',
        },
        {
          title: 'Bellman-Ford 最短路',
          desc: '反复松弛所有边 V−1 轮，能处理负权边（Dijkstra 不能）、还能检测负环',
          icon: BellmanIcon,
          url: 'bellman-ford',
        },
        {
          title: '拓扑排序',
          desc: '有向无环图的依赖排序：反复取入度 0 的点输出（Kahn），得到满足所有先后依赖的线性顺序',
          icon: TopoIcon,
          url: 'topological-sort',
        },
        {
          title: 'Floyd 多源最短路',
          desc: '一张距离矩阵 + 三重循环，逐个点试作中转，一次算出任意两点间的最短路（矩阵动态规划）',
          icon: FloydIcon,
          url: 'floyd-warshall',
        },
      ],
    },
    {
      title: '动态规划',
      desc: '把大问题拆成子问题、子问题的解填进表格、后面直接查表复用——「填表」范式',
      children: [
        {
          title: '编辑距离',
          desc: '把一个词改成另一个词的最少插入/删除/替换次数：二维 DP 逐格填表，相同取左上、不同取 1+三邻最小',
          icon: EditIcon,
          url: 'edit-distance',
        },
      ],
    },
  ];
  return categoryData;
}
