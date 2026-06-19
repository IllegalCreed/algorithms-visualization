// src/components/player/types.ts
export type { Pointer } from '@/types/types';
import type { Pointer } from '@/types/types';

/** 代码面板支持的语言 */
export type Lang = 'ts' | 'python' | 'go' | 'rust';

/** 执行点：源码里语义上的一个位置，用于跨语言定位"当前高亮行" */
export type ExecPoint =
  | 'outerLoop' // 外层循环头
  | 'innerLoop' // 内层循环头
  | 'compare' // 比较 a[j] 与 a[j+1]
  | 'swap' // 发生交换
  | 'noSwap' // 条件不成立、不交换
  | 'done'; // 排序完成

/** 变量面板的一行 */
export interface VarRow {
  name: string;
  value: string | number | boolean;
}

export interface StepEmphasis {
  comparing?: [number, number]; // 正在比较的两个下标
  swapped?: boolean; // 本步是否交换
  sortedFrom?: number; // 已排序边界：该下标起已就位
}

/** 胖步骤：自带渲染所需的一切 */
export interface Step {
  array: [string, number][]; // 当前数组快照；[0]=稳定 key（驱动柱子 FLIP），[1]=值
  pointers: Pointer[]; // 指针箭头（冒泡里是 i、j）
  emphasis: StepEmphasis;
  vars: VarRow[]; // 变量面板按顺序渲染
  point: ExecPoint; // 当前执行点 → 经 lineMap 查每语言行号
  caption?: string; // 解说，如 "10 > 9，交换"
}

export interface LangSource {
  lang: Lang;
  label: string; // Tab 文案，如 "TypeScript"
  code: string; // 该语言完整源码（静态字符串）
  lineMap: Record<ExecPoint, number>; // 执行点 → 1-based 行号
}

export interface AlgorithmModule {
  title: string;
  initialInput(): number[];
  buildSteps(input: number[]): Step[];
  sources: LangSource[];
}
