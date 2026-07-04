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
  nodeGroup?: (number | null)[]; // 每节点分组号 → 调色板填充（SCC 着色，C-069）；null=未归组（中性灰）；其它算法不设 → 用默认绿
  stackNodes?: number[]; // 当前在栈上的节点（虚线琥珀环）——Tarjan 栈（C-069）；其它算法不设
  checkPair?: [number, number] | null; // 判定阶段高亮的一对文字节点 x/¬x（蓝实线环，C-074 2-SAT）；其它算法不设
  edgeLabel?: Record<string, string>; // 边 key → 文本标签（如 '1/3' 流量/容量，C-076 最大流）；缺省回退到 w
}

/** Tarjan 强连通分量执行点（C-069，图算法第 7 页；扩展 GraphView——一趟 DFS + dfn/low + 栈） */
export type TarjanExecPoint =
  | 'enter' // 访问新节点：dfn=low=时间戳，入栈
  | 'tree' // 子节点递归返回：low = min(low, 子 low)
  | 'back' // 遇到指向栈中节点的回边：low = min(low, dfn[邻])
  | 'scc' // low==dfn 是 SCC 根 → 弹栈到本节点，形成一个 SCC（着色）
  | 'done'; // 全部访问完，共 N 个强连通分量

/** 2-SAT 执行点（C-074，图算法第 8 页；复用 GraphView——蕴含图 + Tarjan SCC 判定 + 逆拓扑序赋值） */
export type TwoSatExecPoint =
  | 'init' // 列出子句 + 2n 文字节点，蕴含图空
  | 'clause' // 处理一条子句 (a∨b)：加两条蕴含边 ¬a→b、¬b→a（高亮）
  | 'scc' // Tarjan 弹出一个强连通分量（复用第 7 页），着色 nodeGroup
  | 'check' // 检查变量 x：x 与 ¬x 是否同 SCC（同→无解；本例都不同 → 可满足）
  | 'assign' // 赋值 x = comp[x] < comp[¬x]，node badge 显示真/假
  | 'done'; // 全部变量赋值完成，输出可满足解

/** AC 自动机 Aho-Corasick 执行点（C-075，字符串第 7 页；复用 GraphView——Trie 状态 + fail 边 + 多模式匹配） */
export type AcExecPoint =
  | 'insert' // 建 Trie：插入一个模式（节点 + trie 边浮现）
  | 'fail' // BFS 建 fail：算一个状态的 fail 指针（非平凡的画虚线 fail 边）
  | 'match' // 匹配：文本走一个字符（含沿 fail 跳）
  | 'hit' // 匹配：到达模式终点，报告命中（含沿输出链的重叠命中）
  | 'done'; // 匹配结束，汇总所有命中

/** 最大流 Ford-Fulkerson 执行点（C-076，图算法第 9 页；复用 GraphView——残量网络 + 增广路 + 反向边） */
export type MaxFlowExecPoint =
  | 'init' // 展示网络，全部 0/cap，标源汇
  | 'find' // 找到一条增广路（高亮路径 + 瓶颈；反向段红色）
  | 'augment' // 沿路增流，更新流量标签（反向边流量减少）
  | 'done'; // 无增广路：最大流 = 最小割

/** 数字筛格状态（C-077，埃氏筛）：special=1（非素非合）/ unknown 未定 / prime 素数 / composite 合数 */
export type SieveCellState = 'special' | 'unknown' | 'prime' | 'composite';

/** 数字网格轨快照——埃氏筛专用（数学与数论大类首发，第 16 轨 C-077） */
export interface SieveTrack {
  n: number; // 上界 N（网格 1..n）
  cols: number; // 列数（布局）
  states: SieveCellState[]; // states[v] = 数 v 的状态（index 1..n；0 占位）
  current?: number | null; // 当前处理的素数 p（琥珀环）
  marking?: number[]; // 本步正在划掉的倍数（红）
  spf?: (number | null)[]; // spf[v] = 划掉合数 v 的最小质因子（C-078 线性筛角标）；null=未划/无
}

/** 埃拉托斯特尼筛执行点（C-077，数学与数论大类首发；新建 SieveView 数字网格轨） */
export type SieveExecPoint =
  | 'init' // 数字网格 1..N，1 特殊，其余未定
  | 'prime' // 遇到未被划掉的数 p → 素数
  | 'mark' // 划掉 p 从 p² 起的所有倍数 → 合数
  | 'rest' // p²>N：剩余未划掉的都是素数
  | 'done'; // 筛完，给出素数清单

/** 线性筛（欧拉筛）执行点（C-078，数学与数论第 2 页；复用 SieveView——每合数只被最小质因子划一次） */
export type LinearSieveExecPoint =
  | 'init' // 数字网格 1..N，1 特殊
  | 'mark' // 外层 i：未划→素数；对素数 p 划 i×p（spf=p），i%p==0 即停
  | 'rest' // i×2>N 后不再划，剩余未划的都是素数
  | 'done'; // 筛完，每合数角标 = 其最小质因子

/** 二分查找执行点（C-091，查找大类首发；纯复用主柱轨 + ArrowTrack + 既有 emphasis） */
export type BsExecPoint =
  | 'init' // 展示有序数组 + 目标 + 候选区间 [lo,hi]
  | 'mid' // 探针：mid = (lo+hi)>>1，与目标比较
  | 'cut' // 扔掉一半：lo=mid+1 或 hi=mid−1，候选区间收缩
  | 'found' // 命中
  | 'empty' // 区间清空：不存在，返回 −1
  | 'done'; // O(log n) 语义

/** 三分查找执行点（C-095，查找第 5 页；纯复用主柱轨——单峰双探针对决） */
export type TerExecPoint =
  | 'init' // 单峰山形登场
  | 'probe' // 双探针 m1/m2 对决 → 丢外侧 1/3
  | 'peak' // lo == hi：峰顶定格
  | 'done'; // 复杂度与变体

/** 二分答案执行点（C-094，查找第 4 页；纯复用主柱轨——柱子=候选答案的语义反转） */
export type BaExecPoint =
  | 'init' // 答案空间 [1, max] 登场
  | 'probe' // 试探一个答案：算可行性 → 收 hi 或抬 lo
  | 'settle' // lo == hi：最小可行答案定格
  | 'done'; // 三要素与应用家族

/** 旋转数组搜索执行点（C-093，查找第 3 页；纯复用主柱轨——判半二分） */
export type RsExecPoint =
  | 'init' // 断崖数组 + 目标
  | 'probe' // 探针：判哪半有序 → 目标在不在 → 去留
  | 'found' // 命中
  | 'done'; // 引理总结与退化坑

/** 二分边界执行点（C-092，查找第 2 页；纯复用主柱轨——半开区间 lower/upper bound） */
export type BbExecPoint =
  | 'init' // 半开区间 [lo, hi) 就位（hi=n 哨兵）
  | 'probe' // 探针：比较 + 收缩一半
  | 'settle' // lo == hi 相遇：边界定格
  | 'range' // 等值区间 [lb, ub) 全绿 + 计数
  | 'done'; // 模板对比与退化语义

/** 米勒-拉宾执行点（C-090，数学与数论第 8 页；纯复用 MatrixView——平方链表） */
export type MrExecPoint =
  | 'init' // 空表 + 动机
  | 'decomp' // 分解 n−1 = 2^s·d
  | 'pow' // x = a^d mod n
  | 'square' // 平方一步，看 ±1
  | 'verdict' // 本试验判定（撞 −1 通过 / 非平凡平方根 → 合数）
  | 'done'; // 概率界与工程实践

/** 欧拉函数执行点（C-089，数学与数论第 7 页；纯复用 SieveView——互质筛网格） */
export type PhiExecPoint =
  | 'init' // 网格 1..n 全未定 + 分解蓝图
  | 'find' // 试除找到质因子 p（琥珀环）
  | 'cross' // 划掉 p 的倍数：res ← res·(1−1/p)
  | 'survive' // 幸存者变绿 = 与 n 互质
  | 'done'; // φ(n) + 欧拉定理/RSA 语义

/** 一个铺砖正方形（C-079，欧几里得 GCD 几何铺砖）：左上角 (x,y) + 边长 + 所属除法步 */
export interface GcdSquare {
  x: number;
  y: number;
  size: number;
  step: number;
}

/** 矩形铺砖轨快照——欧几里得 GCD 专用（数学与数论第 3 页，第 17 轨 C-079） */
export interface GcdTrack {
  a: number; // 原矩形宽
  b: number; // 原矩形高
  squares: GcdSquare[]; // 已切下的正方形（累加）
  current?: number[]; // 本步新切方块在 squares 中的下标（琥珀高亮）
  remaining?: { x: number; y: number; w: number; h: number } | null; // 剩余子矩形（虚线框）
}

/** 欧几里得算法执行点（C-079，数学与数论第 3 页；新建 GcdView 矩形铺砖轨） */
export type GcdExecPoint =
  | 'init' // 展示 a×b 矩形，未切
  | 'cut' // 一个除法步：从长边切 ⌊a/b⌋ 个 b×b 正方形，剩余收缩
  | 'done'; // 铺满，最小正方形边长 = gcd

/** 一个幂块（C-080，快速幂）：a^(2^k)，附二进制位与是否选中 */
export interface PowerBlock {
  k: number; // 位下标
  exp: number; // 2^k
  value: number; // a^(2^k)
  bit: number; // n 的第 k 位（0/1）
  selected: boolean; // bit===1 → 乘入结果
}

/** 幂块轨快照——快速幂专用（数学与数论第 4 页，第 18 轨 C-080） */
export interface PowerTrack {
  a: number;
  n: number;
  binary: string; // n 的二进制串（高位在左），如 "1101"
  blocks: PowerBlock[]; // 已出现的幂块（累加）
  current?: number | null; // 当前处理的块下标（琥珀）
  result: number; // 当前累乘结果
  done?: boolean;
}

/** 快速幂执行点（C-080，数学与数论第 4 页；新建 PowerView 幂块轨） */
export type PowerExecPoint =
  | 'init' // 展示 n 及其二进制，result=1
  | 'mul' // 当前位为 1：底数平方出块、选中、result 乘入
  | 'skip' // 当前位为 0：底数平方出块但不乘
  | 'done'; // 扫完所有位，result = aⁿ

/** 平面点（C-081，凸包）：数学坐标（y 向上） */
export interface Pt {
  x: number;
  y: number;
}

/** 点平面轨快照——凸包专用（计算几何大类首发，第 19 轨 C-081） */
export interface HullTrack {
  points: Pt[]; // 全部点（已排序，数学坐标）
  edges: [number, number][]; // 当前凸壳链的边（点下标对）
  stack: number[]; // 当前链（栈）下标
  current?: number | null; // 当前处理的点下标（琥珀）
  popped?: number[]; // 本步被弹出的点下标（红）
  phase: 'lower' | 'upper' | 'done';
  finalHull?: number[]; // 完整凸包下标（done）
  activeEdge?: [number, number] | null; // 当前卡壳边（琥珀粗线，C-082 旋转卡壳）；凸包页不设
  caliper?: [number, number] | null; // 当前候选点对（蓝虚线，C-082）；凸包页不设
  best?: [number, number] | null; // 当前最优点对（绿粗线，C-082/C-083）；凸包页不设
  divider?: number | null; // 分治中线 x（数学坐标，紫竖线，C-083 最近点对）；其它页不设
  strip?: [number, number] | null; // δ 带 x 范围 [lo,hi]（浅紫矩形，C-083）；其它页不设
  edgeClasses?: (string | null)[]; // 与 edges 平行的样式类（seg-test/seg-yes/seg-no，C-084 线段相交）；不设用默认
  marks?: Pt[]; // 已发现交点标记（红实心点，C-088 扫描线求交）；其它页不设
  markActive?: Pt | null; // 本步报告的交点（放大 + 琥珀描边，C-088）；其它页不设
}

/** 凸包执行点（C-081，计算几何大类首发；新建 HullView 点平面轨——Andrew 单调链） */
export type HullExecPoint =
  | 'init' // 展示散点
  | 'lower' // 构下凸壳：加一个点（含右转弹栈）
  | 'upper' // 构上凸壳：加一个点
  | 'done'; // 下 + 上凸壳拼成完整凸包

/** 旋转卡壳执行点（C-082，计算几何第 2 页；复用 HullView——凸包直径/最远点对） */
export type CalipersExecPoint =
  | 'init' // 展示凸包 + 散点
  | 'spin' // 卡壳推进一条边：对踵点单调前移 + 检查两候选距离
  | 'done'; // 转完一圈，best = 直径

/** 扫描线求交执行点（C-088，计算几何第 5 页；复用 HullView——additive marks/markActive） */
export type BentleyExecPoint =
  | 'init' // 展示线段全貌 + 事件队列
  | 'start' // 起点事件：线段入状态结构，查新相邻对
  | 'cross' // 交点事件：报告交点，状态结构换序，查新相邻对
  | 'end' // 终点事件：线段离场
  | 'done'; // 扫完，输出全部交点

/** 扩展欧几里得执行点（C-086，数学与数论第 5 页；纯复用 MatrixView——回代表） */
export type ExtGcdExecPoint =
  | 'init' // 空表
  | 'down' // 下行：填一行 a, b, q（除法链）
  | 'base' // 基例：b=0，gcd=a，(x,y)=(1,0)
  | 'up' // 回代：x=y'、y=x'−q·y'
  | 'done'; // Bézout 系数出炉

/** 中国剩余定理执行点（C-087，数学与数论第 6 页；纯复用 MatrixView——构造表） */
export type CrtExecPoint =
  | 'init' // 同余组 + M = ∏mᵢ
  | 'mi' // Mᵢ = M/mᵢ：对异模 ≡0，只在第 i 条同余「有声音」
  | 'inv' // tᵢ = Mᵢ⁻¹ (mod mᵢ)：扩欧求逆，把声音校准成 1
  | 'term' // 专属项 rᵢ·Mᵢ·tᵢ：本模 ≡rᵢ、异模 ≡0
  | 'sum' // 各项相加
  | 'done'; // mod M 归约出最小非负解

/** 一个比较器（C-085，双调排序网络）：连接 wire a、b，dir 决定小值去向 */
export interface Comparator {
  col: number; // 所在列（同列可并行）
  a: number;
  b: number;
  dir: 'asc' | 'desc'; // asc：保证 wire[a]<=wire[b]；desc 反之
}

/** 比较器网络轨快照——双调排序专用（排序阶段三，第 20 轨 C-085） */
export interface NetworkTrack {
  wires: number[]; // 各 wire 当前值（随交换更新）
  comparators: Comparator[]; // 全部比较器（网络固定，与数据无关）
  cols: number; // 列数
  currentCol?: number | null; // 当前执行列（琥珀）；小于它的列已执行（绿）
  done?: boolean;
}

/** 双调排序执行点（C-085，排序阶段三；新建 NetworkView 比较器网络轨） */
export type NetworkExecPoint =
  | 'init' // 展示固定网络 + 输入值
  | 'column' // 执行一列比较器（同列并行）
  | 'done'; // 全部列执行完，输出有序

/** 线段相交执行点（C-084，计算几何第 4 页；复用 HullView——跨立试验逐对判定） */
export type SegIntExecPoint =
  | 'init' // 三对线段灰显
  | 'test' // 当前对琥珀高亮，算四叉积
  | 'verdict' // 判定：相交绿 / 不相交灰虚线
  | 'done'; // 三对判完，汇总

/** 最近点对执行点（C-083，计算几何第 3 页；复用 HullView——分治 + δ 带合并） */
export type ClosestPairExecPoint =
  | 'init' // 散点（已按 x 排序）
  | 'divide' // 中线出现，分左右两半
  | 'half' // 一侧递归（此处暴力）求最近，更新 δ
  | 'strip' // 高亮中线两侧 δ 带，收集带内点（按 y 排序）
  | 'merge' // 带内一次近邻比较（可能刷新最近对）
  | 'done'; // 最近点对确定

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
  pathCells?: [number, number][]; // 回溯路径格（绿环）——LCS 等需从 DP 表恢复解的题设，编辑距离/背包/Floyd 不设 → 无 .mx-path
}

/** 最长递增子序列 LIS 执行点（C-061，DP 第 4 页；复用 MatrixView 两行表——一维 dp 数组） */
export type LisExecPoint =
  | 'init' // dp[i] 全部初始化为 1（每个元素自身是长度 1 的递增子序列）
  | 'scan' // 回看某个 j<i：比较 a[j] 与 a[i]（不更新）
  | 'extend' // a[j]<a[i] 且 dp[j]+1>dp[i] → dp[i]=dp[j]+1（接在 a[j] 结尾的 LIS 后）
  | 'fillDone' // dp 填完：max(dp) = LIS 长度
  | 'result'; // 回溯 pred 恢复出 LIS，高亮构成元素

/** 最长公共子序列 LCS 执行点（C-060，DP 第 3 页；扩展 MatrixView——填表 + 回溯恢复解） */
export type LcsExecPoint =
  | 'init' // 填边界：第 0 行 / 第 0 列 = 0（空串无公共子序列）
  | 'match' // X[i-1]===Y[j-1]：dp[i][j]=dp[i-1][j-1]+1（取左上对角 + 1）
  | 'mismatch' // 不同：dp[i][j]=max(dp[i-1][j], dp[i][j-1])（取上/左较大）
  | 'fillDone' // 表填满：右下角 = LCS 长度
  | 'trace' // 回溯：从右下角沿路径回走一步（匹配则收字符走对角，否则走上/左）
  | 'done'; // 回溯完：恢复出 LCS 字符串

/** 编辑距离执行点（C-053，DP 大类首发；复用 MatrixView 矩阵轨——填 DP 表） */
export type EditDistExecPoint =
  | 'init' // 填边界：第 0 行 [0..n]、第 0 列 [0..m]
  | 'cellMatch' // 字符相同：dp[i][j]=dp[i-1][j-1]（取左上）
  | 'cellDiff' // 字符不同：dp[i][j]=1+min(左上,上,左)
  | 'done'; // 右下角 = 编辑距离

/** 硬币找零方案数执行点（C-070，DP 第 6 页 · 计数 DP；纯复用 MatrixView——行=硬币面额、列=金额） */
export type CoinChangeExecPoint =
  | 'init' // 填边界：dp[0][0]=1（凑 0 元 1 种方案），第 0 行其余 0
  | 'skip' // 面额 > 金额：dp[i][a]=dp[i-1][a]（沿用上一行）
  | 'add' // 面额 ≤ 金额：dp[i][a]=dp[i-1][a]（不用）+ dp[i][a-面额]（用一枚，本行）——方案数相加
  | 'done'; // 右下角 = 方案数

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
  prunedIds?: number[]; // 剪枝节点（红/虚线 ✗）——组合总和等带剪枝的回溯题设，子集/排列不设 → 无 .pruned
}

/** 子集生成执行点（C-056，回溯第 2 页；新建 DecisionTreeView 决策树轨——选/不选二叉决策树 DFS） */
export type SubsetsExecPoint =
  | 'start' // 位于根：空集，准备对元素 0 决策
  | 'include' // 沿「选 k」边下降到 include 子节点
  | 'exclude' // 沿「跳过 k」边下降到 exclude 子节点
  | 'record' // 到达叶（决策完所有元素）→ 记录一个子集
  | 'backtrack' // 一个子树探索完，回退到父节点换另一分支
  | 'done'; // 全部 2^n 子集枚举完毕

/** 字符串匹配轨快照——字符串大类原语（KMP 文本+模式对齐滑动 + LPS；为 Rabin-Karp/BM 铺路） */
export interface KmpTrack {
  text: string; // 文本 T
  pattern: string; // 模式 P
  lps: number[]; // 部分匹配表（预置展示）
  offset: number; // 模式串行相对文本行的左偏移（对齐起点 = i - j）
  matchedLen: number; // pattern[0..matchedLen) 已匹配前缀（绿）
  compareText?: number | null; // 当前比较的文本下标（琥珀）
  comparePat?: number | null; // 当前比较的模式下标（琥珀）
  lpsActive?: number | null; // 跳转时用到的 lps 下标（高亮）
  status?: 'match' | 'mismatch' | 'found' | null; // 当前比较结果
  found: number[]; // 已命中的匹配起点（文本下标）
  windowStart?: number | null; // 当前窗口在文本的起点（高亮 [windowStart, windowStart+m)）——Rabin-Karp 设，KMP 不设
  matchedFrom?: number | null; // 已匹配后缀起点：pattern[matchedFrom..m) 标绿（Boyer-Moore 从右往左匹配后缀）——KMP/RK 不设
}

/** 回文轨快照——Manacher 专用（第 13 条播放器轨，C-067；转换串 + 半径数组 + 中心/镜像/最右回文带/最长回文） */
export interface ManacherTrack {
  s: string; // 转换串（# 分隔，如 #b#a#b#a#d#）
  p: (number | null)[]; // 半径数组，未算为 null（显示空）
  center?: number | null; // 当前中心 i（琥珀环）
  mirror?: number | null; // 镜像点 2C-i（蓝环）——仅 mirror 步设
  boxL?: number | null; // 当前最右回文左边界 L（浅蓝带 [L..R]）
  boxR?: number | null; // 当前最右回文右边界 R
  best?: [number, number] | null; // 目前最长回文在转换串上的区间 [l,r]（绿）
  status?: 'mirror' | 'expand' | 'done' | null;
}

/** Boyer-Moore 执行点（C-064，字符串第 3 页；复用 KmpView——从右往左比、坏字符表大步跳） */
export type BoyerMooreExecPoint =
  | 'start' // 模式对齐到文本开头，从模式末尾开始（右→左）
  | 'match' // P[j]===T[s+j]：字符相等，j 左移，已匹配后缀 +1
  | 'badChar' // P[j]≠T[s+j]：失配，按坏字符表把模式右移 max(1, j−last[坏字符])
  | 'found' // j 越过左端 → 整段匹配，命中
  | 'done'; // 文本扫描完

/** Rabin-Karp 执行点（C-063，字符串第 2 页；复用 KmpView——滚动哈希 + 命中才验证） */
export type RabinKarpExecPoint =
  | 'start' // 算出模式哈希，窗口停在开头
  | 'skip' // 窗口哈希 ≠ 模式哈希 → 滑到下一个窗口（不逐字符比）
  | 'hashHit' // 窗口哈希 = 模式哈希 → 需要逐字符验证
  | 'verify' // 逐字符验证窗口 = 模式
  | 'found' // 验证通过 → 命中
  | 'done'; // 文本扫描完

/** KMP 执行点（C-062，字符串大类首发；新建 KmpView——失配用 LPS 跳转、文本指针不回退） */
export type KmpExecPoint =
  | 'start' // 开始，i=0 j=0 对齐开头
  | 'match' // T[i]===P[j]：双指针前进，已匹配前缀 +1
  | 'jump' // 失配且 j>0：j 跳到 lps[j-1]，模式串右滑（文本指针不回退）
  | 'advance' // 失配且 j=0：文本指针 +1，模式串右移一格
  | 'found' // j 到模式末尾：命中，记录起点，j 跳到 lps[j-1] 继续
  | 'done'; // 文本扫描完

/** 迷宫轨快照——回溯与搜索网格搜索原语（迷宫寻路 DFS + 回溯；为岛屿/单词搜索/BFS 铺路） */
export interface MazeTrack {
  rows: number;
  cols: number;
  walls: boolean[][]; // walls[r][c] = 是否墙（迷宫=墙；岛屿=水）
  start?: [number, number] | null; // 起点（迷宫 S）——岛屿不设 → 不渲染
  goal?: [number, number] | null; // 终点（迷宫 🚩）——岛屿不设 → 不渲染
  current?: [number, number] | null; // 当前格（mark + 琥珀环）
  path?: [number, number][]; // 当前 DFS 栈路径 start..current（琥珀 trail）
  visited?: [number, number][]; // 已进入过的格（浅蓝；含已放弃的死路）
  solved?: boolean; // path 即解路径 → 整条标绿
  filled?: [number, number][]; // 已确认属于岛屿的陆地（绿，复用 .mz-solution）——岛屿 Flood Fill（C-066）；迷宫不设
  mark?: string; // 当前格图标（缺省 '🐭'）——岛屿用扫描图标（C-066）
  letters?: string[][]; // 每格显示的字母——单词搜索（C-068）；迷宫/岛屿不设 → 不显示字母
}

/** 迷宫寻路执行点（C-059，回溯第 5 页；新建 MazeView 迷宫轨——网格 DFS + 回溯） */
export type MazeExecPoint =
  | 'start' // 位于起点
  | 'move' // 沿某方向前进一格（入栈）
  | 'deadend' // 当前格四周无未访问通路 → 死路
  | 'backtrack' // 退回上一格（出栈）
  | 'goal' // 到达终点
  | 'done'; // 结束（解路径标绿）

/** A\* 寻路执行点（C-096，回溯与搜索第 9 页；纯复用 MazeView——letters 作 f 值标注） */
export type AstarExecPoint =
  | 'init' // 网格 + 起终点 + f=g+h 规则
  | 'expand' // 弹出 open 中 f 最小格，松弛邻居
  | 'goal' // 弹出的就是终点
  | 'trace' // parent 回溯最优路径（solved 绿）
  | 'done'; // 扩展数对比 BFS + 可采纳性

/** 岛屿数量执行点（C-066，回溯网格搜索第 2 页；复用 MazeView 网格轨——扫描 + DFS Flood Fill 数连通块） */
export type IslandsExecPoint =
  | 'scan' // 扫描指针移到某格（水 / 已数过的陆地 → 跳过）
  | 'found' // 命中未访问的新陆地 → 岛屿计数 +1，开始 Flood Fill
  | 'flood' // Flood Fill 把一个四连通陆地格并入当前岛屿（标绿）
  | 'done'; // 扫描完毕（共 N 个岛屿）

/** 单词搜索执行点（C-068，回溯网格搜索第 3 页；复用 MazeView 字母网格轨——DFS 逐字母试探 + 回溯） */
export type WordSearchExecPoint =
  | 'start' // 某格作为单词首字母的起点
  | 'match' // 相邻格匹配下一个字母 → 深入（入栈）
  | 'mismatch' // 相邻格字母不符 / 已在路径 → 换方向
  | 'backtrack' // 当前格四方向试完仍未拼完 → 撤销标记、回退（出栈）
  | 'found'; // 拼出完整单词 → 路径标绿

/** 数独轨快照——回溯棋盘约束（C-071，第 14 条播放器轨；n×n 数字盘 + 宫线 + 试填/冲突/回退） */
export interface SudokuTrack {
  n: number; // 盘大小（4）
  box: number; // 宫边长（2 = √n）
  given: boolean[][]; // 是否初始给定（加粗、不可改）
  grid: (number | null)[][]; // 当前填充（null=空）
  current?: [number, number] | null; // 当前格（琥珀环）
  tryNum?: number | null; // 当前试填的数字
  status?: 'reject' | 'place' | 'backtrack' | null; // 当前动作 → 红/绿/退
  solved?: boolean; // 全部填满
}

/** 数独执行点（C-071，回溯棋盘约束第 2 例；新建 SudokuView——试填 + 行/列/宫约束检查 + 回溯） */
export type SudokuExecPoint =
  | 'init' // 展示初始盘（给定加粗）
  | 'reject' // 试某数字与行/列/宫冲突 → 换下一个
  | 'place' // 试某数字合法 → 填入，下探
  | 'backtrack' // 当前格 1..n 都填不了 → 撤销上一个填入、回退
  | 'done'; // 全部填满，终盘

/** 后缀数组轨快照——字符串后缀结构（C-072 倍增构造 + C-073 LCP 模式；原串 + 后缀表） */
export interface SuffixArrayTrack {
  s: string; // 原串（如 banana）
  k: number; // 当前倍增长度（1 = 已按首字符；下一轮比较 2k）
  order: number[]; // 当前 sa（排序后的后缀起点）
  rank: number[]; // 每个起点 i 的当前 rank（0 基）
  phase?: 'sort' | 'rank' | null; // 本步高亮：重排 / 重编号（构造模式）
  done?: boolean; // 构造：rank 全不同 sa 定型 / LCP：全填完
  lcp?: (number | null)[]; // LCP 列：lcp[i]=LCP(sa[i-1], sa[i])，null=未算（C-073 LCP 模式；构造不设 → 不渲染 LCP 列）
  current?: number | null; // 当前处理行（排序位次）——LCP 模式琥珀高亮（C-073）
  compareRow?: number | null; // 排序前驱行——LCP 模式蓝高亮（C-073）
}

/** 后缀数组执行点（C-072，字符串第 5 页；新建 SuffixArrayView——倍增 sort → rerank） */
export type SuffixArrayExecPoint =
  | 'init' // 列出后缀，按首字符定初始 rank + 排序
  | 'sort' // 按 (rank[i], rank[i+k]) 稳定重排
  | 'rank' // 由相邻关键字是否相等重编 0 基 rank，k 翻倍
  | 'done'; // rank 全不同，sa 定型

/** LCP/height 数组执行点（C-073，字符串第 6 页；扩展 SuffixArrayView LCP 模式——Kasai 逐原始下标） */
export type LcpExecPoint =
  | 'init' // 展示已排好的后缀表 + 空 LCP 列
  | 'fill' // 处理原始下标 i（rank>0）：与排序前驱比较、h 只减 1 起扩、填 lcp[rank[i]]
  | 'skip' // 原始下标 i 的 rank=0，无排序前驱，跳过（h 归 0）
  | 'done'; // LCP 全填完（不同子串数 / 最长重复子串）

/** Manacher 最长回文子串执行点（C-067，字符串第 4 页；新建 ManacherView 回文轨——转换串 + 半径数组 + 对称性复用） */
export type ManacherExecPoint =
  | 'init' // 预处理：插 # 得转换串，半径数组 p 全空
  | 'mirror' // 中心 i 在最右回文内 → p[i]=min(R-i, p[2C-i]) 复用对称性，再尝试扩展
  | 'expand' // 中心 i 超出最右回文 → 从 p=0 纯中心扩展
  | 'done'; // 全部算完，max(p) 对应最长回文（标绿）

/** 组合总和执行点（C-058，回溯第 4 页；扩展 DecisionTreeView——决策树 + 剪枝：和 > 目标即砍枝） */
export type CombSumExecPoint =
  | 'start' // 根：空组合，和 0
  | 'include' // 加一个数（和 ≤ 目标），下降
  | 'prune' // 加一个数会使和 > 目标 → 剪枝，标红、不展开
  | 'record' // 和 = 目标 → 记录一个组合
  | 'backtrack' // 一支探索完，回退换下一个数
  | 'done'; // 全部探索完

/** 全排列执行点（C-057，回溯第 3 页；复用 DecisionTreeView 决策树轨——每位从剩余挑一个的多叉决策树 DFS） */
export type PermuteExecPoint =
  | 'start' // 位于根：空排列，全部元素可选
  | 'choose' // 沿「选 k」边下降：从剩余未用元素挑一个放到下一位
  | 'record' // 到达叶（元素全用完）→ 记录一个排列
  | 'backtrack' // 一个子树探索完，回退到父节点挑下一个剩余元素
  | 'done'; // 全部 n! 个排列枚举完毕

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
  maze?: MazeTrack; // 纯加法：回溯的迷宫轨；其它算法不设 → MazeView 不渲染
  kmp?: KmpTrack; // 纯加法：字符串匹配轨；其它算法不设 → KmpView 不渲染
  manacher?: ManacherTrack; // 纯加法：Manacher 回文轨；其它算法不设 → ManacherView 不渲染
  sudoku?: SudokuTrack; // 纯加法：数独轨；其它算法不设 → SudokuView 不渲染
  suffixArray?: SuffixArrayTrack; // 纯加法：后缀数组轨；其它算法不设 → SuffixArrayView 不渲染
  sieve?: SieveTrack; // 纯加法：埃氏筛数字网格轨（C-077）；其它算法不设 → SieveView 不渲染
  gcd?: GcdTrack; // 纯加法：欧几里得 GCD 矩形铺砖轨（C-079）；其它算法不设 → GcdView 不渲染
  power?: PowerTrack; // 纯加法：快速幂幂块轨（C-080）；其它算法不设 → PowerView 不渲染
  hull?: HullTrack; // 纯加法：凸包点平面轨（C-081）；其它算法不设 → HullView 不渲染
  network?: NetworkTrack; // 纯加法：双调排序比较器网络轨（C-085）；其它算法不设 → NetworkView 不渲染
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
