import { SORT_INPUT_SPEC } from '@/components/player/inputSpec';
import type {
  AlgorithmModule,
  QuickExecPoint,
  StackTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { quickSortSources } from './quick-sort.sources';

const ID_I = '0'; // 红箭头：小于区右边界游标 i
const ID_J = '1'; // 蓝箭头：扫描游标 j
const DASH = '-';

/** 插桩重走 Lomuto 末位 pivot + 显式区间栈快排，产出逐行粒度的胖步骤（每步带 stack 区间栈快照） */
export function buildQuickSortSteps(input: number[]): Step<QuickExecPoint>[] {
  const steps: Step<QuickExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  const sorted: number[] = []; // 离散已就位下标（累积）
  let swapCount = 0;
  const stack: { lo: number; hi: number }[] = [];

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));
  const range = (lo: number, hi: number) => {
    const r: number[] = [];
    for (let m = lo; m <= hi; m++) r.push(m);
    return r;
  };
  // 栈轨快照：frames 取当前真实栈的深拷贝；popped 仅 pop 步传入（标记刚弹出/正在处理的区间）
  const stackSnap = (popped?: { lo: number; hi: number }): StackTrack => ({
    frames: stack.map((f) => ({ ...f })),
    ...(popped ? { popped: { ...popped } } : {}),
  });

  const vars = (
    depth: number | string,
    lo: number | string,
    hi: number | string,
    pivot: number | string,
    i: number | string,
    j: number | string,
    aj: number | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: '栈深', value: depth },
    { name: 'lo', value: lo },
    { name: 'hi', value: hi },
    { name: 'pivot', value: pivot },
    { name: 'i', value: i },
    { name: 'j', value: j },
    { name: 'a[j]', value: aj },
    { name: 'swapCount', value: swapCount },
  ];

  const push = (
    point: QuickExecPoint,
    ptr: { i?: number; j?: number },
    v: VarRow[],
    emphasis: Step['emphasis'],
    stk: StackTrack,
    caption?: string,
  ) => {
    const pointers = [];
    if (ptr.i !== undefined) pointers.push({ id: ID_I, index: clampIdx(ptr.i) });
    if (ptr.j !== undefined) pointers.push({ id: ID_J, index: clampIdx(ptr.j) });
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers,
      emphasis,
      vars: v,
      point,
      stack: stk,
      caption,
    });
  };

  if (n <= 1) {
    push(
      'done',
      {},
      vars(0, DASH, DASH, DASH, DASH, DASH, DASH),
      { sortedIndices: n ? [0] : [] },
      stackSnap(),
      '完成',
    );
    return steps;
  }

  stack.push({ lo: 0, hi: n - 1 });
  while (stack.length > 0) {
    const frame = stack.pop()!;
    const { lo, hi } = frame;
    push(
      'pop',
      {},
      vars(stack.length, lo, hi, DASH, DASH, DASH, DASH),
      { groupMembers: range(lo, hi), sortedIndices: [...sorted] },
      stackSnap(frame),
      `弹出区间 [${lo},${hi}]`,
    );
    const pivot = work[hi][1];
    push(
      'pivotSelect',
      { i: lo, j: lo },
      vars(stack.length, lo, hi, pivot, lo, lo, work[lo][1]),
      { pivotIndex: hi, groupMembers: range(lo, hi), sortedIndices: [...sorted] },
      stackSnap(),
      `基准 pivot = a[${hi}] = ${pivot}`,
    );
    let i = lo;
    for (let j = lo; j < hi; j++) {
      const lt = work[j][1] < pivot;
      push(
        'compare',
        { i, j },
        vars(stack.length, lo, hi, pivot, i, j, work[j][1]),
        {
          comparing: [j, hi],
          pivotIndex: hi,
          groupMembers: range(lo, hi),
          sortedIndices: [...sorted],
        },
        stackSnap(),
        `a[${j}]=${work[j][1]} ${lt ? '<' : '≥'} pivot=${pivot}`,
      );
      if (lt) {
        [work[i], work[j]] = [work[j], work[i]];
        swapCount++;
        i++;
        push(
          'swap',
          { i, j },
          vars(stack.length, lo, hi, pivot, i, j, work[j][1]),
          { pivotIndex: hi, groupMembers: range(lo, hi), sortedIndices: [...sorted] },
          stackSnap(),
          `a[${j}] < pivot：交换入小于区，i→${i}`,
        );
      } else {
        push(
          'noSwap',
          { i, j },
          vars(stack.length, lo, hi, pivot, i, j, work[j][1]),
          { pivotIndex: hi, groupMembers: range(lo, hi), sortedIndices: [...sorted] },
          stackSnap(),
          `a[${j}] ≥ pivot：不交换，继续扫描`,
        );
      }
    }
    [work[i], work[hi]] = [work[hi], work[i]]; // pivot 一步归位到 i
    swapCount++;
    sorted.push(i);
    const p = i;
    push(
      'pivotPlace',
      { i: p },
      vars(stack.length, lo, hi, pivot, p, DASH, DASH),
      { groupMembers: range(lo, hi), sortedIndices: [...sorted] },
      stackSnap(),
      `pivot 归位到 ${p}（钉死最终位置）`,
    );
    // 先右后左入栈；单元素子区间直接就位；空区间忽略
    if (hi > p + 1) stack.push({ lo: p + 1, hi });
    else if (p + 1 === hi) sorted.push(hi);
    if (p - 1 > lo) stack.push({ lo, hi: p - 1 });
    else if (p - 1 === lo) sorted.push(lo);
    push(
      'push',
      {},
      vars(stack.length, lo, hi, DASH, DASH, DASH, DASH),
      { groupMembers: range(lo, hi), sortedIndices: [...sorted] },
      stackSnap(),
      `压入子区间，待处理 ${stack.length} 个`,
    );
  }
  push(
    'done',
    {},
    vars(0, DASH, DASH, DASH, DASH, DASH, DASH),
    { sortedIndices: Array.from({ length: n }, (_, k) => k) },
    stackSnap(),
    '完成，全部有序',
  );
  return steps;
}

export const quickSortModule: AlgorithmModule<QuickExecPoint> = {
  title: '快速排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1], // 与插入/希尔/归并同款，便于横向对比
  buildSteps: buildQuickSortSteps,
  sources: quickSortSources,
  inputSpec: SORT_INPUT_SPEC, // C-110 第一批开放自定义输入
};
