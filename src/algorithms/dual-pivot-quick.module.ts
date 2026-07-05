import { SORT_INPUT_SPEC } from '@/components/player/inputSpec';
import type {
  AlgorithmModule,
  DualPivotExecPoint,
  StackTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { dualPivotQuickSortSources } from './dual-pivot-quick.sources';

const ID_LT = '3'; // 绿：< p 段右边界 lt
const ID_I = '1'; // 蓝：扫描游标 i
const ID_GT = '0'; // 红：> q 段左边界 gt
const DASH = '-';

/** Yaroslavskiy 双轴快排 + 显式区间栈：双基准 p≤q 首尾取（反了先换端），lt/i/gt 一趟三段扫描，双基准归位钉死 */
export function buildDualPivotQuickSortSteps(input: number[]): Step<DualPivotExecPoint>[] {
  const steps: Step<DualPivotExecPoint>[] = [];
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
    p: number | string,
    q: number | string,
    lt: number | string,
    i: number | string,
    gt: number | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: '栈深', value: stack.length },
    { name: 'lo', value: lo },
    { name: 'hi', value: hi },
    { name: 'p', value: p },
    { name: 'q', value: q },
    { name: 'lt', value: lt },
    { name: 'i', value: i },
    { name: 'gt', value: gt },
  ];

  const emit = (
    point: DualPivotExecPoint,
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
      vars(DASH, DASH, DASH, DASH, DASH, DASH, DASH),
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
      vars(lo, hi, DASH, DASH, DASH, DASH, DASH),
      { groupMembers: range(lo, hi), sortedIndices: [...placed] },
      stackSnap(frame),
      `弹出区间 [${lo},${hi}]`,
    );
    const swapped = work[lo][1] > work[hi][1];
    if (swapped) [work[lo], work[hi]] = [work[hi], work[lo]]; // 保证 p ≤ q
    const p = work[lo][1];
    const q = work[hi][1];
    let lt = lo + 1;
    let i = lo + 1;
    let gt = hi - 1;
    emit(
      'pivotSelect',
      { lt, i, gt },
      vars(lo, hi, p, q, lt, i, gt),
      { groupMembers: range(lo, hi), sortedIndices: [...placed], pivotIndices: [lo, hi] },
      stackSnap(),
      swapped
        ? `a[${lo}]>a[${hi}]，先交换两端 → 双基准 p=${p} ≤ q=${q}（三段：<p / [p,q] / >q）`
        : `双基准 p=a[${lo}]=${p} ≤ q=a[${hi}]=${q}（三段：<p / [p,q] / >q）`,
    );
    while (i <= gt) {
      const ai = work[i][1];
      const rel = ai < p ? `< p=${p}` : ai > q ? `> q=${q}` : `∈ [${p},${q}]`;
      emit(
        'compare',
        { lt, i, gt },
        vars(lo, hi, p, q, lt, i, gt),
        { groupMembers: range(lo, hi), sortedIndices: [...placed], pivotIndices: [lo, hi] },
        stackSnap(),
        `a[${i}]=${ai} ${rel}`,
      );
      if (ai < p) {
        [work[lt], work[i]] = [work[i], work[lt]];
        lt++;
        i++;
        emit(
          'less',
          { lt, i, gt },
          vars(lo, hi, p, q, lt, i, gt),
          { groupMembers: range(lo, hi), sortedIndices: [...placed], pivotIndices: [lo, hi] },
          stackSnap(),
          `< p：换入左段，lt→${lt}，i→${i}`,
        );
      } else if (ai > q) {
        [work[i], work[gt]] = [work[gt], work[i]];
        gt--;
        emit(
          'greater',
          { lt, i, gt },
          vars(lo, hi, p, q, lt, i, gt),
          { groupMembers: range(lo, hi), sortedIndices: [...placed], pivotIndices: [lo, hi] },
          stackSnap(),
          `> q：换入右段，gt→${gt}（i 不动，待查换入值）`,
        );
      } else {
        i++;
        emit(
          'between',
          { lt, i, gt },
          vars(lo, hi, p, q, lt, i, gt),
          { groupMembers: range(lo, hi), sortedIndices: [...placed], pivotIndices: [lo, hi] },
          stackSnap(),
          `∈ [p,q]：留中段，i→${i}`,
        );
      }
    }
    lt--;
    gt++;
    [work[lo], work[lt]] = [work[lt], work[lo]]; // p 归位到 lt
    [work[hi], work[gt]] = [work[gt], work[hi]]; // q 归位到 gt
    placed.push(lt, gt);
    emit(
      'pivotPlace',
      { lt, gt },
      vars(lo, hi, p, q, lt, DASH, gt),
      { groupMembers: range(lo, hi), sortedIndices: [...placed] },
      stackSnap(),
      `双基准归位：p=${p} → a[${lt}]、q=${q} → a[${gt}]（钉死）`,
    );
    // 先右、再中、后左压栈 → pop 先取左；单元素子区间直接钉死
    if (hi > gt + 1) stack.push({ lo: gt + 1, hi });
    else if (gt + 1 === hi) placed.push(hi);
    if (gt - 1 > lt + 1) stack.push({ lo: lt + 1, hi: gt - 1 });
    else if (lt + 1 === gt - 1) placed.push(lt + 1);
    if (lt - 1 > lo) stack.push({ lo, hi: lt - 1 });
    else if (lt - 1 === lo) placed.push(lo);
    emit(
      'push',
      {},
      vars(lo, hi, p, q, lt, DASH, gt),
      { groupMembers: range(lo, hi), sortedIndices: [...placed] },
      stackSnap(),
      stack.length ? `压入子区间，待处理 ${stack.length} 个` : `无子区间`,
    );
  }
  emit(
    'done',
    {},
    vars(DASH, DASH, DASH, DASH, DASH, DASH, DASH),
    { sortedIndices: Array.from({ length: n }, (_, k) => k) },
    stackSnap(),
    '完成，全部有序',
  );
  return steps;
}

export const dualPivotQuickSortModule: AlgorithmModule<DualPivotExecPoint> = {
  title: '双轴快排',
  initialInput: () => [3, 5, 9, 1, 6, 2, 4, 7],
  buildSteps: buildDualPivotQuickSortSteps,
  sources: dualPivotQuickSortSources,
  inputSpec: SORT_INPUT_SPEC, // C-110 第一批开放自定义输入
};
