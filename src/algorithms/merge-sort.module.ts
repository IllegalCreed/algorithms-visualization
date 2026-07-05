import { SORT_INPUT_SPEC } from '@/components/player/inputSpec';
import type {
  AlgorithmModule,
  AuxTrack,
  MergeExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { mergeSortSources } from './merge-sort.sources';

const ID_I = '0'; // 红箭头：左段游标 i
const ID_J = '1'; // 蓝箭头：右段游标 j
const DASH = '-';

/** 插桩重走自底向上归并，产出逐行粒度的胖步骤（每步带 aux 辅助轨快照） */
export function buildMergeSortSteps(input: number[]): Step<MergeExecPoint>[] {
  const steps: Step<MergeExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  const tempArr: ([string, number] | undefined)[] = new Array(n).fill(undefined);
  let writeCount = 0;

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  // aux 快照：位置 id 't'+idx 稳定；value 取 tempArr 当前内容（未填记 0，靠 filled 区分空槽）
  const auxSnap = (filled: number[], range?: [number, number], pointer?: number): AuxTrack => ({
    array: Array.from(
      { length: n },
      (_, idx) => [`t${idx}`, tempArr[idx]?.[1] ?? 0] as [string, number],
    ),
    filled: [...filled],
    activeRange: range,
    pointer,
  });

  const vars = (
    width: number | string,
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
    { name: 'width', value: width },
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

  const push = (
    point: MergeExecPoint,
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
      caption,
    });
  };

  if (n <= 1) {
    push(
      'done',
      {},
      vars(DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH),
      { sortedFrom: 0 },
      auxSnap([]),
      '完成',
    );
    return steps;
  }

  for (let width = 1; width < n; width *= 2) {
    push(
      'widthChange',
      {},
      vars(width, DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH),
      {},
      auxSnap([]),
      `width=${width}：合并相邻 ${width} 元素段`,
    );
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      if (mid >= hi) continue; // 残段，无右段可合并，留到更大 width
      const members: number[] = [];
      for (let m = lo; m < hi; m++) members.push(m);
      for (let t = lo; t < hi; t++) tempArr[t] = undefined; // 清空该段 temp
      const filled: number[] = [];
      let i = lo;
      let j = mid;
      let k = lo;
      push(
        'mergeStart',
        { i, j },
        vars(width, lo, mid, hi, i, j, k, work[i][1], work[j][1]),
        { groupMembers: members },
        auxSnap(filled, [lo, hi], k),
        `合并 [${lo},${mid}) 与 [${mid},${hi})`,
      );
      while (i < mid && j < hi) {
        const le = work[i][1] <= work[j][1];
        push(
          'compare',
          { i, j },
          vars(width, lo, mid, hi, i, j, k, work[i][1], work[j][1]),
          { comparing: [i, j], groupMembers: members },
          auxSnap(filled, [lo, hi], k),
          `a[${i}]=${work[i][1]} ${le ? '≤' : '>'} a[${j}]=${work[j][1]}`,
        );
        if (le) {
          tempArr[k] = work[i];
          filled.push(k);
          writeCount++;
          push(
            'takeLeft',
            { i, j },
            vars(width, lo, mid, hi, i, j, k + 1, work[i][1], work[j][1]),
            { groupMembers: members },
            auxSnap(filled, [lo, hi], k + 1),
            `取左 ${work[i][1]} → temp[${k}]`,
          );
          i++;
          k++;
        } else {
          tempArr[k] = work[j];
          filled.push(k);
          writeCount++;
          push(
            'takeRight',
            { i, j },
            vars(width, lo, mid, hi, i, j, k + 1, work[i][1], work[j][1]),
            { groupMembers: members },
            auxSnap(filled, [lo, hi], k + 1),
            `取右 ${work[j][1]} → temp[${k}]`,
          );
          j++;
          k++;
        }
      }
      while (i < mid) {
        tempArr[k] = work[i];
        filled.push(k);
        writeCount++;
        push(
          'drainLeft',
          { i, j },
          vars(width, lo, mid, hi, i, j, k + 1, work[i][1], DASH),
          { groupMembers: members },
          auxSnap(filled, [lo, hi], k + 1),
          `左段剩余 ${work[i][1]} → temp[${k}]`,
        );
        i++;
        k++;
      }
      while (j < hi) {
        tempArr[k] = work[j];
        filled.push(k);
        writeCount++;
        push(
          'drainRight',
          { i, j },
          vars(width, lo, mid, hi, i, j, k + 1, DASH, work[j][1]),
          { groupMembers: members },
          auxSnap(filled, [lo, hi], k + 1),
          `右段剩余 ${work[j][1]} → temp[${k}]`,
        );
        j++;
        k++;
      }
      for (let t = lo; t < hi; t++) work[t] = tempArr[t]!; // 拷回（元素带原 id → 主轨 FLIP 重排）
      push(
        'writeBack',
        {},
        vars(width, lo, mid, hi, DASH, DASH, DASH, DASH, DASH),
        { groupMembers: members },
        auxSnap(filled, [lo, hi]),
        `temp[${lo},${hi}) 拷回原数组`,
      );
    }
  }
  push(
    'done',
    {},
    vars(DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH),
    { sortedFrom: 0 },
    auxSnap([]),
    '完成，全部有序',
  );
  return steps;
}

export const mergeSortModule: AlgorithmModule<MergeExecPoint> = {
  title: '归并排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1], // 与插入/希尔同款，便于横向对比
  buildSteps: buildMergeSortSteps,
  sources: mergeSortSources,
  inputSpec: SORT_INPUT_SPEC, // C-110 第一批开放自定义输入
};
