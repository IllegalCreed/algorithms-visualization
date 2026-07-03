// src/components/player/types.ts
export type { Pointer } from '@/types/types';
import type { Pointer } from '@/types/types';

/** 代码面板支持的语言 */
export type Lang = 'ts' | 'python' | 'go' | 'rust';

/** 冒泡的执行点（保留原名，向后兼容） */
export type ExecPoint = 'outerLoop' | 'innerLoop' | 'compare' | 'swap' | 'noSwap' | 'done';

/** 选择排序的执行点（多了 newMin：发现更小值、更新 minIdx） */
export type SelectionExecPoint =
  | 'outerLoop'
  | 'innerLoop'
  | 'compare'
  | 'newMin'
  | 'swap'
  | 'noSwap'
  | 'done';

/** 插入排序的执行点（shift：已排序元素右移腾位；insert：key 落定） */
export type InsertionExecPoint = 'outerLoop' | 'compare' | 'shift' | 'insert' | 'done';

/** 希尔排序的执行点（gap 减半 → 逐组 start → 组内插入：gapChange/groupStart 为分组标记步） */
export type ShellExecPoint =
  | 'gapChange'
  | 'groupStart'
  | 'outerLoop'
  | 'compare'
  | 'shift'
  | 'insert'
  | 'done';

/** 归并排序的执行点（自底向上：width 倍增 → 逐对合并 → 比较取小写 temp → 收尾 drain → 拷回） */
export type MergeExecPoint =
  | 'widthChange'
  | 'mergeStart'
  | 'compare'
  | 'takeLeft'
  | 'takeRight'
  | 'drainLeft'
  | 'drainRight'
  | 'writeBack'
  | 'done';

/** 快速排序的执行点（Lomuto 末位 pivot + 显式区间栈：pop 弹区间 → 选 pivot → 扫描比较 → swap/noSwap → pivot 归位 → push 子区间） */
export type QuickExecPoint =
  | 'pop'
  | 'pivotSelect'
  | 'compare'
  | 'swap'
  | 'noSwap'
  | 'pivotPlace'
  | 'push'
  | 'done';

/** 堆排序的执行点（Floyd 大顶堆 + 单一 siftDown：建堆 heapify → siftDown 内 compare/swap/settle → 排序 extract） */
export type HeapExecPoint = 'heapify' | 'compare' | 'swap' | 'settle' | 'extract' | 'done';

/** 计数排序的执行点（简单计数「萝卜一个坑」：计数 count → 走桶 bucketStart → 回写 writeBack） */
export type CountingExecPoint = 'count' | 'bucketStart' | 'writeBack' | 'done';

/** 基数排序的执行点（LSD：每轮 passStart 宣布位 → distribute 按位入 10 桶 → collect 按桶序收集回写） */
export type RadixExecPoint = 'passStart' | 'distribute' | 'collect' | 'done';

/** 桶排序的执行点（distribute 按值域入桶 → sortBucket 桶内各自排序 → concat 按桶序合并回写） */
export type BucketExecPoint = 'distribute' | 'sortBucket' | 'concat' | 'done';

/** 三路快排的执行点（荷兰国旗：pop 弹区间 → pivotSelect 选基准 → compare 后三路分支 less/greater/equal → push 压子区间） */
export type ThreeWayExecPoint =
  | 'pop'
  | 'pivotSelect'
  | 'compare'
  | 'less'
  | 'greater'
  | 'equal'
  | 'push'
  | 'done';

/** 鸡尾酒排序的执行点（双向冒泡：forwardPass 左→右冒最大 → backwardPass 右→左沉最小；比较/交换带方向以精确映射两个循环） */
export type CocktailExecPoint =
  | 'forwardPass'
  | 'fCompare'
  | 'fSwap'
  | 'fNoSwap'
  | 'backwardPass'
  | 'bCompare'
  | 'bSwap'
  | 'bNoSwap'
  | 'done';

/** 二分插入排序的执行点（outerLoop 取 key → probe 折半比较 → goLeft/goRight 区间收缩 → found 定位 → shift 搬移 → insert 落位） */
export type BinaryInsertionExecPoint =
  | 'outerLoop'
  | 'probe'
  | 'goLeft'
  | 'goRight'
  | 'found'
  | 'shift'
  | 'insert'
  | 'done';

/** 自顶向下归并的执行点（递归分治：split 对半下钻 → 回程 merge 七件套同自底向上 → done） */
export type TopDownMergeExecPoint =
  | 'split'
  | 'mergeStart'
  | 'compare'
  | 'takeLeft'
  | 'takeRight'
  | 'drainLeft'
  | 'drainRight'
  | 'writeBack'
  | 'done';

/** 双轴快排的执行点（Yaroslavskiy：双基准 p≤q 首尾取 → lt/i/gt 三段扫描 less/between/greater → pivotPlace 双基准归位） */
export type DualPivotExecPoint =
  | 'pop'
  | 'pivotSelect'
  | 'compare'
  | 'less'
  | 'between'
  | 'greater'
  | 'pivotPlace'
  | 'push'
  | 'done';

/** Dijkstra 单源最短路的执行点（init 初始化 → selectMin 取最近未确定点 → settle 确定 → relaxEdge 考虑出边 → relaxUpdate/relaxSkip 松弛 → done） */
export type DijkstraExecPoint =
  | 'init'
  | 'selectMin'
  | 'settle'
  | 'relaxEdge'
  | 'relaxUpdate'
  | 'relaxSkip'
  | 'done';

/** Kruskal 最小生成树执行点（C-048，复用 GraphView 图轨——无向图 + current/mst/rejected 边） */
export type KruskalExecPoint =
  | 'init' // 边按权升序、MST 空、并查集各自为组
  | 'consider' // 取下一条最短边，查两端是否已连通（current 黄）
  | 'accept' // 两端不连通 → 加入 MST（mst 绿）+ union
  | 'reject' // 两端已连通 → 成环跳过（rejected 虚线）
  | 'done'; // V-1 条边选齐，MST 完成

/** Prim 最小生成树执行点（C-049，复用 GraphView 无向图轨——从起点生长选最小横切边） */
export type PrimExecPoint =
  | 'init' // 树 = {起点 A}
  | 'selectEdge' // 在横切边（一端在树、一端在树外）里选权最小（current 黄）
  | 'addVertex' // 把该边 + 树外端点并入树（mst 绿 + 新点变绿）
  | 'done'; // V-1 条边选齐，MST 完成

/** Bellman-Ford 最短路执行点（C-050，复用 GraphView 有向图轨——含负权、V−1 轮盲扫松弛） */
export type BellmanFordExecPoint =
  | 'init' // dist[源]=0，其余 ∞
  | 'roundStart' // 开始第 k 轮：松弛所有边
  | 'relaxUpdate' // 当前边 (u,v,w)：dist[u]+w < dist[v] → 更新 dist[v]
  | 'relaxSkip' // 当前边：不更短，跳过
  | 'done'; // V−1 轮完成，最短路确定

/** 拓扑排序执行点（C-051，Kahn；复用 GraphView 有向图轨——nodeBadge=入度、doneNodes=已输出） */
export type TopoExecPoint =
  | 'init' // 计算各点入度
  | 'selectNode' // 取一个入度为 0（且下标最小）的点（activeNode 环）
  | 'removeNode' // 输出该点（doneNodes 绿）+ 其后继入度各减 1
  | 'done'; // 所有点输出，拓扑序完成

/** 变量面板的一行 */
export interface VarRow {
  name: string;
  value: string | number | boolean;
}

export interface StepEmphasis {
  comparing?: [number, number]; // 正在比较的两个下标
  swapped?: boolean; // 本步是否交换
  sortedFrom?: number; // 冒泡：右侧 [sortedFrom, n) 已就位
  minIndex?: number; // 选择：当前已知最小值下标 → min 态 + min 柱高亮
  sortedUpTo?: number; // 选择：左侧 [0, sortedUpTo) 已就位
  keyIndex?: number; // 插入：被取出的 key 柱当前下标 → key 态（最高优先）
  groupMembers?: number[]; // 希尔：当前子序列的下标集；不在其中且无其它强调 → dimmed 淡出
  pivotIndex?: number; // 快排：当前 pivot 下标 → pivot 态（最高优先，压过 sorted/comparing）
  pivotIndices?: number[]; // 双轴快排：两个基准下标 → 都渲染 pivot 态（与 pivotIndex 并存，additive）
  sortedIndices?: number[]; // 快排：离散「已就位」下标集 → sorted（区别于 sortedFrom/sortedUpTo 的连续前后缀）
  heapNode?: number; // 堆排序：当前 siftDown 活动父节点 → heapNode 态（深紫；sorted 之后、swapped 之前）
  dimFrom?: number; // 计数排序：回写阶段连续后缀 [dimFrom, n) 淡出（原值已计入桶、作废）；区别于希尔的离散集合 groupMembers
}

/** 辅助数组轨（temp）快照——归并排序专用，与主轨等长、上下对齐 */
export interface AuxTrack {
  array: [string, number][]; // 定长 = 主轨长度；位置 id 't0'..'t{n-1}'（稳定渲染）
  filled: number[]; // 已写入的下标集；不在其中 → empty 空槽
  pointer?: number; // k 写入位（ArrowTrack 取 colors[2]=yellow）
  activeRange?: [number, number]; // 当前合并段 [lo, hi)
}

/** 区间栈轨快照——快排专用，与主轨同 slotWidth 坐标系对齐 */
export interface StackTrack {
  frames: { lo: number; hi: number }[]; // 栈内待处理区间；frames[0]=栈底，frames[length-1]=栈顶
  popped?: { lo: number; hi: number }; // 本步刚弹出/正在处理的区间（pop 步高亮）
}

/** 二叉树轨快照——堆排序专用（数组按完全二叉树层序布局） */
export interface TreeTrack {
  heapSize: number; // [0,heapSize) 在堆中，[heapSize,n) 已就位脱离堆
}

/** 计数桶轨快照——计数排序专用，按「值」索引（区别于所有按位置索引的轨） */
export interface CountTrack {
  min: number; // 桶 0 对应的值；桶 b 对应值 b+min
  buckets: number[]; // buckets[v-min] = 值 v 当前计数；长度 = max-min+1
  activeBucket?: number; // 当前高亮桶下标(v-min)：count 步=被 +1 的桶；bucketStart/writeBack 步=正在出货的桶
}

/** 桶轨快照——桶排序专用，桶里装「实际元素列表」（区别于计数轨只装计数） */
export interface BucketTrack {
  buckets: number[][]; // buckets[b] = 第 b 桶当前装的元素值列表（分配后乱序、桶内排序后有序、合并时递减出货）
  ranges: [number, number][]; // ranges[b] = 第 b 桶值域 [lo,hi]（桶底标签，如 0–9）
  activeBucket?: number; // 当前高亮桶：distribute=入桶、sortBucket=正在排序的桶、concat=正在出货的桶
}

/** 图轨快照——图算法专用（通用：Dijkstra 有向 + dist 徽标 + settled；Kruskal 无向 + 边分类 + 分量） */
export interface GraphTrack {
  vertices: { id: number; label: string; x: number; y: number }[]; // 固定布局节点
  edges: { key: string; from: number; to: number; w?: number }[]; // 边（key 唯一，如 '0-1'）；w 可选——无权图（如拓扑排序 C-051）省略，GraphView 权重标签渲染空
  directed: boolean; // 有向（Dijkstra 画箭头）/ 无向（Kruskal）
  nodeBadge?: (string | null)[]; // 每节点徽标（Dijkstra=dist，∞ 记 '∞'；null=不显）
  activeNode?: number | null; // 当前操作节点（琥珀高亮环）
  doneNodes?: number[]; // 已确定/已并入的节点（绿填充）
  edgeClass?: Record<string, string>; // 边 key → 状态类（relaxed/tree（Dijkstra）| current/mst/rejected（Kruskal））
}

/** 矩阵轨快照——通用矩阵原语：Floyd 全源最短路（方阵 + labels 双用）/ DP 填表（行列异标签 + 空白未填） */
export interface MatrixTrack {
  labels: string[]; // 行/列标签（方阵：节点名 A,B,C,D；缺省行列标签时双用）
  cells: (number | null)[][]; // 矩阵；null = 未定义（Floyd=∞、DP=未填，由 emptyText 决定显示）
  rowLabels?: string[]; // 行标签（缺省用 labels）——DP 表源串（C-053）
  colLabels?: string[]; // 列标签（缺省用 labels）——DP 表目标串（C-053）
  emptyText?: string; // null 单元显示文案（缺省 '∞'）——DP 未填格设 '' 空白（C-053）
  pivot?: number | null; // 当前中转点 k（高亮第 k 行 + 第 k 列）——Floyd
  active?: [number, number] | null; // 当前考察/更新的单元 (i,j)（琥珀环）
  sources?: [number, number][]; // 参与计算的源单元（Floyd=(i,k)/(k,j)；DP=依赖格）（黄高亮）
  updatedCell?: [number, number] | null; // 本步刚更新/填入的单元（绿闪）
}

/** 编辑距离执行点（C-053，DP 大类首发；复用 MatrixView 矩阵轨——填 DP 表） */
export type EditDistExecPoint =
  | 'init' // 填边界：第 0 行 [0..n]、第 0 列 [0..m]
  | 'cellMatch' // 字符相同：dp[i][j]=dp[i-1][j-1]（取左上）
  | 'cellDiff' // 字符不同：dp[i][j]=1+min(左上,上,左)
  | 'done'; // 右下角 = 编辑距离

/** 0-1 背包执行点（C-054，DP 大类 DP2；纯复用 MatrixView 矩阵轨——行=物品、列=容量） */
export type KnapsackExecPoint =
  | 'init' // 填边界：第 0 行/列 = 0
  | 'cellSkip' // 装不下（重 > 容量）：dp[i][w]=dp[i-1][w]（沿用上一行）
  | 'cellChoose' // 装得下：dp[i][w]=max(不取=上格, 取=左上偏移格+价值)
  | 'done'; // 右下角 = 最大价值

/** 棋盘轨快照——回溯与搜索专用（通用棋盘原语，为回溯题数独/排列/迷宫铺路） */
export interface BoardTrack {
  n: number; // 棋盘大小
  queens: (number | null)[]; // queens[col] = 该列皇后所在行；null=未放
  tryCell?: [number, number] | null; // 当前尝试格 [row, col]（琥珀环）
  conflictCells?: [number, number][]; // 与 tryCell 冲突的已放皇后 [row, col]（红）
}

/** 决策树轨快照——回溯与搜索通用原语（子集/排列/组合/组合总和：DFS 走决策树 + 回溯） */
export interface DecisionTreeTrack {
  nodes: { id: number; label: string; x: number; y: number }[]; // 固定布局决策树；label 仅叶子标最终解、内部为空
  edges: { from: number; to: number; label?: string }[]; // 父→子；label = 决策（「选 k」/「跳过 k」）
  activeId?: number | null; // 当前访问节点（琥珀环）
  pathIds?: number[]; // 当前递归栈 root→current（路径高亮）
  visitedIds?: number[]; // 已进入过的节点（淡实色）
  solutionIds?: number[]; // 已到达并记录的解叶（绿）
}

/** 子集生成执行点（C-056，回溯第 2 页；新建 DecisionTreeView 决策树轨——选/不选二叉决策树 DFS） */
export type SubsetsExecPoint =
  | 'start' // 位于根：空集，准备对元素 0 决策
  | 'include' // 沿「选 k」边下降到 include 子节点
  | 'exclude' // 沿「跳过 k」边下降到 exclude 子节点
  | 'record' // 到达叶（决策完所有元素）→ 记录一个子集
  | 'backtrack' // 一个子树探索完，回退到父节点换另一分支
  | 'done'; // 全部 2^n 子集枚举完毕

/** N 皇后执行点（C-055，回溯大类首发；复用 BoardView 棋盘轨——递归试探 + 剪枝 + 回溯） */
export type NQueensExecPoint =
  | 'init' // 空棋盘
  | 'tryConflict' // 试探 (row,col) 但与已放皇后冲突（红显冲突）
  | 'place' // 试探 (row,col) 不冲突 → 放下皇后
  | 'backtrack' // 本列无处可放 → 退回上一列、挪走那里的皇后
  | 'solved'; // N 个皇后全放好，得到一个解

/** Floyd-Warshall 全源最短路执行点（C-052，矩阵上的动态规划——三重循环中转松弛） */
export type FloydExecPoint =
  | 'init' // 矩阵 = 邻接（对角 0、边权、其余 ∞）
  | 'pivotStart' // 开始以 k 为中转：高亮第 k 行/列
  | 'relaxUpdate' // (i,j)：dist[i][k]+dist[k][j] < dist[i][j] → 更新
  | 'relaxSkip' // (i,j)：经 k 不更短，跳过
  | 'done'; // 三重循环完成，全源最短距离矩阵定

/** 胖步骤：自带渲染所需的一切。P = 该算法的执行点集合 */
export interface Step<P extends string = string> {
  array: [string, number][]; // 当前数组快照；[0]=稳定 key（驱动柱子 FLIP），[1]=值
  pointers: Pointer[]; // 指针箭头
  emphasis: StepEmphasis;
  vars: VarRow[]; // 变量面板按顺序渲染
  point: P; // 当前执行点 → 经 lineMap 查每语言行号
  caption?: string; // 解说
  aux?: AuxTrack; // 纯加法：归并的辅助轨；其它算法不设 → AuxView 不渲染
  stack?: StackTrack; // 纯加法：快排的区间栈轨；其它算法不设 → StackView 不渲染
  tree?: TreeTrack; // 纯加法：堆排序的二叉树轨；其它算法不设 → TreeView 不渲染
  count?: CountTrack; // 纯加法：计数排序的计数桶轨；其它算法不设 → CountView 不渲染
  bucket?: BucketTrack; // 纯加法：桶排序的桶轨（桶装实际元素）；其它算法不设 → BucketView 不渲染
  graph?: GraphTrack; // 纯加法：图算法的图轨；其它算法不设 → GraphView 不渲染
  matrix?: MatrixTrack; // 纯加法：Floyd 的矩阵轨；其它算法不设 → MatrixView 不渲染
  board?: BoardTrack; // 纯加法：回溯的棋盘轨；其它算法不设 → BoardView 不渲染
  decisionTree?: DecisionTreeTrack; // 纯加法：回溯的决策树轨；其它算法不设 → DecisionTreeView 不渲染
}

export interface LangSource<P extends string = string> {
  lang: Lang;
  label: string; // Tab 文案
  code: string; // 该语言完整源码（静态字符串）
  lineMap: Record<P, number>; // 执行点 → 1-based 行号
}

export interface AlgorithmModule<P extends string = string> {
  title: string;
  initialInput(): number[];
  buildSteps(input: number[]): Step<P>[];
  sources: LangSource<P>[];
}
