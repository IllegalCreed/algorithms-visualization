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
}

/** 胖步骤：自带渲染所需的一切。P = 该算法的执行点集合 */
export interface Step<P extends string = string> {
  array: [string, number][]; // 当前数组快照；[0]=稳定 key（驱动柱子 FLIP），[1]=值
  pointers: Pointer[]; // 指针箭头
  emphasis: StepEmphasis;
  vars: VarRow[]; // 变量面板按顺序渲染
  point: P; // 当前执行点 → 经 lineMap 查每语言行号
  caption?: string; // 解说
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
