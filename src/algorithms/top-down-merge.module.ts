import { SORT_INPUT_SPEC } from '@/components/player/inputSpec';
import type {
  AlgorithmModule,
  AuxTrack,
  StackTrack,
  Step,
  TopDownMergeExecPoint,
  VarRow,
} from '@/components/player/types';
import { topDownMergeSortSources } from './top-down-merge.sources';

const ID_I = '0'; // 红箭头：左段游标 i（同自底向上归并 C-011）
const ID_J = '1'; // 蓝箭头：右段游标 j
const DASH = '-';

/** 真递归重走自顶向下归并，产出逐行粒度胖步骤（每步同时带 aux temp 轨 + stack 递归调用栈快照） */
export function buildTopDownMergeSortSteps(input: number[]): Step<TopDownMergeExecPoint>[] {
  const steps: Step<TopDownMergeExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]); // 位置键稳定
  const n = work.length;
  const tempArr: ([string, number] | undefined)[] = new Array(n).fill(undefined);
  const callStack: { lo: number; hi: number }[] = []; // 递归调用链（闭区间帧）
  let writeCount = 0;

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));
  const range = (lo: number, hi: number) => {
    const r: number[] = [];
    for (let m = lo; m <= hi; m++) r.push(m);
    return r;
  };
  // aux 快照：同 C-011（位置 id 't'+idx 稳定；activeRange 半开 [lo, hi+1)）
  const auxSnap = (filled: number[], activeTo?: [number, number], pointer?: number): AuxTrack => ({
    array: Array.from(
      { length: n },
      (_, idx) => [`t${idx}`, tempArr[idx]?.[1] ?? 0] as [string, number],
    ),
    filled: [...filled],
    activeRange: activeTo,
    pointer,
  });
  // 栈快照：递归调用链深拷贝，栈顶 = 当前活动区间（StackView .top 高亮）
  const stackSnap = (): StackTrack => ({ frames: callStack.map((f) => ({ ...f })) });

  const vars = (
    lo: number | string,
    mid: number | string,
    hi: number | string,
    i: number | string,
    j: number | string,
    k: number | string,
    ai: number | string,
    aj: number | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: '深度', value: callStack.length },
    { name: 'lo', value: lo },
    { name: 'mid', value: mid },
    { name: 'hi', value: hi },
    { name: 'i', value: i },
    { name: 'j', value: j },
    { name: 'k', value: k },
    { name: 'a[i]', value: ai },
    { name: 'a[j]', value: aj },
    { name: 'writeCount', value: writeCount },
  ];

  const emit = (
    point: TopDownMergeExecPoint,
    ptr: { i?: number; j?: number },
    v: VarRow[],
    emphasis: Step['emphasis'],
    aux: AuxTrack,
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
      aux,
      stack: stackSnap(),
      caption,
    });
  };

  if (n <= 1) {
    emit(
      'done',
      {},
      vars(DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH),
      { sortedFrom: 0 },
      auxSnap([]),
      '完成',
    );
    return steps;
  }

  // 真递归：闭区间 [lo,hi]，长度 <2 直接返回（不发步不压栈）
  const sortRange = (lo: number, hi: number) => {
    if (lo >= hi) return;
    callStack.push({ lo, hi });
    const mid = (lo + hi) >> 1;
    const members = range(lo, hi);
    emit(
      'split',
      {},
      vars(lo, mid, hi, DASH, DASH, DASH, DASH, DASH),
      { groupMembers: members },
      auxSnap([]),
      `下钻 [${lo},${hi}]：对半为 [${lo},${mid}] 与 [${mid + 1},${hi}]`,
    );
    sortRange(lo, mid);
    sortRange(mid + 1, hi);

    // 回程合并（粒度镜像 C-011：mergeStart → compare→take → drain → writeBack）
    for (let t = lo; t <= hi; t++) tempArr[t] = undefined;
    const filled: number[] = [];
    let i = lo;
    let j = mid + 1;
    let k = lo;
    emit(
      'mergeStart',
      { i, j },
      vars(lo, mid, hi, i, j, k, work[i][1], work[j][1]),
      { groupMembers: members },
      auxSnap(filled, [lo, hi + 1], k),
      `合并 [${lo},${mid}] 与 [${mid + 1},${hi}]`,
    );
    while (i <= mid && j <= hi) {
      const le = work[i][1] <= work[j][1];
      emit(
        'compare',
        { i, j },
        vars(lo, mid, hi, i, j, k, work[i][1], work[j][1]),
        { comparing: [i, j], groupMembers: members },
        auxSnap(filled, [lo, hi + 1], k),
        `a[${i}]=${work[i][1]} ${le ? '≤' : '>'} a[${j}]=${work[j][1]}`,
      );
      if (le) {
        tempArr[k] = work[i];
        filled.push(k);
        writeCount++;
        emit(
          'takeLeft',
          { i, j },
          vars(lo, mid, hi, i, j, k + 1, work[i][1], work[j][1]),
          { groupMembers: members },
          auxSnap(filled, [lo, hi + 1], k + 1),
          `取左 ${work[i][1]} → temp[${k}]`,
        );
        i++;
        k++;
      } else {
        tempArr[k] = work[j];
        filled.push(k);
        writeCount++;
        emit(
          'takeRight',
          { i, j },
          vars(lo, mid, hi, i, j, k + 1, work[i][1], work[j][1]),
          { groupMembers: members },
          auxSnap(filled, [lo, hi + 1], k + 1),
          `取右 ${work[j][1]} → temp[${k}]`,
        );
        j++;
        k++;
      }
    }
    while (i <= mid) {
      tempArr[k] = work[i];
      filled.push(k);
      writeCount++;
      emit(
        'drainLeft',
        { i, j },
        vars(lo, mid, hi, i, j, k + 1, work[i][1], DASH),
        { groupMembers: members },
        auxSnap(filled, [lo, hi + 1], k + 1),
        `左段剩余 ${work[i][1]} → temp[${k}]`,
      );
      i++;
      k++;
    }
    while (j <= hi) {
      tempArr[k] = work[j];
      filled.push(k);
      writeCount++;
      emit(
        'drainRight',
        { i, j },
        vars(lo, mid, hi, i, j, k + 1, DASH, work[j][1]),
        { groupMembers: members },
        auxSnap(filled, [lo, hi + 1], k + 1),
        `右段剩余 ${work[j][1]} → temp[${k}]`,
      );
      j++;
      k++;
    }
    for (let t = lo; t <= hi; t++) work[t] = tempArr[t]!; // 拷回（原 id → 主轨 FLIP）
    emit(
      'writeBack',
      {},
      vars(lo, mid, hi, DASH, DASH, DASH, DASH, DASH),
      { groupMembers: members },
      auxSnap(filled, [lo, hi + 1]),
      `temp[${lo},${hi}] 拷回原数组，区间 [${lo},${hi}] 有序`,
    );
    callStack.pop(); // 该区间完成，递归返回（栈在后续步自然收缩）
  };

  sortRange(0, n - 1);
  emit(
    'done',
    {},
    vars(DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH),
    { sortedFrom: 0 },
    auxSnap([]),
    '完成，全部有序',
  );
  return steps;
}

export const topDownMergeSortModule: AlgorithmModule<TopDownMergeExecPoint> = {
  title: '自顶向下归并',
  initialInput: () => [6, 3, 8, 1, 9, 2, 7, 4],
  buildSteps: buildTopDownMergeSortSteps,
  sources: topDownMergeSortSources,
  inputSpec: SORT_INPUT_SPEC, // C-110 第一批开放自定义输入
};
