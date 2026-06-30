import type {
  AlgorithmModule,
  StackTrack,
  Step,
  ThreeWayExecPoint,
  VarRow,
} from '@/components/player/types';
import { threeWayQuickSortSources } from './three-way-quick.sources';

const ID_LT = '3'; // 绿：小于区右边界 lt（== 区左界、写位）
const ID_I = '1'; // 蓝：扫描游标 i
const ID_GT = '0'; // 红：大于区左边界 gt
const DASH = '-';

/** 荷兰国旗三路划分 + 显式区间栈，产出逐行粒度胖步骤（每步带 stack 区间栈快照 + lt/i/gt 三指针） */
export function buildThreeWayQuickSortSteps(input: number[]): Step<ThreeWayExecPoint>[] {
  const steps: Step<ThreeWayExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]); // 位置键稳定
  const n = work.length;
  const placed: number[] = []; // 累积已钉死下标
  const stack: { lo: number; hi: number }[] = [];

  const snap = () => work.map((t) => [t[0], t[1]] as [string, number]);
  const clamp = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));
  const range = (lo: number, hi: number) => {
    const r: number[] = [];
    for (let m = lo; m <= hi; m++) r.push(m);
    return r;
  };
  const stackSnap = (popped?: { lo: number; hi: number }): StackTrack => ({
    frames: stack.map((f) => ({ ...f })),
    ...(popped ? { popped: { ...popped } } : {}),
  });
  const vars = (
    lo: number | string,
    hi: number | string,
    pivot: number | string,
    lt: number | string,
    i: number | string,
    gt: number | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: '栈深', value: stack.length },
    { name: 'lo', value: lo },
    { name: 'hi', value: hi },
    { name: 'pivot', value: pivot },
    { name: 'lt', value: lt },
    { name: 'i', value: i },
    { name: 'gt', value: gt },
  ];

  const emit = (
    point: ThreeWayExecPoint,
    ptr: { lt?: number; i?: number; gt?: number },
    v: VarRow[],
    emphasis: Step['emphasis'],
    stk: StackTrack,
    caption?: string,
  ) => {
    const pointers = [];
    if (ptr.lt !== undefined) pointers.push({ id: ID_LT, index: clamp(ptr.lt) });
    if (ptr.i !== undefined) pointers.push({ id: ID_I, index: clamp(ptr.i) });
    if (ptr.gt !== undefined) pointers.push({ id: ID_GT, index: clamp(ptr.gt) });
    steps.push({ array: snap(), pointers, emphasis, vars: v, point, stack: stk, caption });
  };

  if (n <= 1) {
    emit(
      'done',
      {},
      vars(DASH, DASH, DASH, DASH, DASH, DASH),
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
    emit(
      'pop',
      {},
      vars(lo, hi, DASH, DASH, DASH, DASH),
      { groupMembers: range(lo, hi), sortedIndices: [...placed] },
      stackSnap(frame),
      `弹出区间 [${lo},${hi}]`,
    );
    const pivot = work[lo][1];
    let lt = lo;
    let i = lo;
    let gt = hi;
    emit(
      'pivotSelect',
      { lt, i, gt },
      vars(lo, hi, pivot, lt, i, gt),
      { groupMembers: range(lo, hi), sortedIndices: [...placed] },
      stackSnap(),
      `基准 pivot = a[${lo}] = ${pivot}（三路：< / == / >）`,
    );
    while (i <= gt) {
      const ai = work[i][1];
      const rel = ai < pivot ? '<' : ai > pivot ? '>' : '==';
      emit(
        'compare',
        { lt, i, gt },
        vars(lo, hi, pivot, lt, i, gt),
        { groupMembers: range(lo, hi), sortedIndices: [...placed] },
        stackSnap(),
        `a[${i}]=${ai} ${rel} pivot=${pivot}`,
      );
      if (ai < pivot) {
        [work[lt], work[i]] = [work[i], work[lt]];
        lt++;
        i++;
        emit(
          'less',
          { lt, i, gt },
          vars(lo, hi, pivot, lt, i, gt),
          { groupMembers: range(lo, hi), sortedIndices: [...placed] },
          stackSnap(),
          `< pivot：换入小于区，lt→${lt}，i→${i}`,
        );
      } else if (ai > pivot) {
        [work[i], work[gt]] = [work[gt], work[i]];
        gt--;
        emit(
          'greater',
          { lt, i, gt },
          vars(lo, hi, pivot, lt, i, gt),
          { groupMembers: range(lo, hi), sortedIndices: [...placed] },
          stackSnap(),
          `> pivot：换入大于区，gt→${gt}（i 不动，待查换入值）`,
        );
      } else {
        i++;
        emit(
          'equal',
          { lt, i, gt },
          vars(lo, hi, pivot, lt, i, gt),
          { groupMembers: range(lo, hi), sortedIndices: [...placed] },
          stackSnap(),
          `== pivot：留在等于区，i→${i}`,
        );
      }
    }
    // [lt, gt] 段全 == pivot，钉死
    for (let m = lt; m <= gt; m++) placed.push(m);
    // 先压右、后压左 → pop 先取左；单元素子区间直接钉死
    if (gt + 1 < hi) stack.push({ lo: gt + 1, hi });
    else if (gt + 1 === hi) placed.push(hi);
    if (lt - 1 > lo) stack.push({ lo, hi: lt - 1 });
    else if (lt - 1 === lo) placed.push(lo);
    emit(
      'push',
      {},
      vars(lo, hi, pivot, lt, DASH, gt),
      { groupMembers: range(lo, hi), sortedIndices: [...placed] },
      stackSnap(),
      `等于区 [${lt},${gt}] 钉死；压入子区间，待处理 ${stack.length} 个`,
    );
  }
  emit(
    'done',
    {},
    vars(DASH, DASH, DASH, DASH, DASH, DASH),
    { sortedIndices: Array.from({ length: n }, (_, k) => k) },
    stackSnap(),
    '完成，全部有序',
  );
  return steps;
}

export const threeWayQuickSortModule: AlgorithmModule<ThreeWayExecPoint> = {
  title: '三路快排',
  initialInput: () => [5, 3, 8, 3, 5, 8, 3, 5],
  buildSteps: buildThreeWayQuickSortSteps,
  sources: threeWayQuickSortSources,
};
