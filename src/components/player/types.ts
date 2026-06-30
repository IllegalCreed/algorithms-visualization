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
