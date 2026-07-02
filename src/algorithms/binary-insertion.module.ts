import type {
  AlgorithmModule,
  BinaryInsertionExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { binaryInsertionSortSources } from './binary-insertion.sources';

const ID_LO = '3'; // 绿：搜索区间左界 lo
const ID_MID = '1'; // 蓝：折半探针 mid
const ID_HI = '0'; // 红：搜索区间右界 hi（半开）
const DASH = '-';

/** 插桩重走二分插入排序：折半定位（lo/mid/hi 夹逼）+ 相邻交换滑动搬移（同 C-008 FLIP） */
export function buildBinaryInsertionSortSteps(input: number[]): Step<BinaryInsertionExecPoint>[] {
  const steps: Step<BinaryInsertionExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]); // 位置键稳定
  const n = work.length;
  let shiftCount = 0;
  let sortedUpTo = 1; // [0, sortedUpTo) 已（相对）就位

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));
  const snap = () => work.map((t) => [t[0], t[1]] as [string, number]);
  const vars = (
    i: number | string,
    key: number | string,
    lo: number | string,
    mid: number | string,
    hi: number | string,
    pos: number | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: 'i', value: i },
    { name: 'key', value: key },
    { name: 'lo', value: lo },
    { name: 'mid', value: mid },
    { name: 'hi', value: hi },
    { name: 'pos', value: pos },
    { name: 'shiftCount', value: shiftCount },
    { name: 'sortedUpTo', value: sortedUpTo },
  ];

  const emit = (
    point: BinaryInsertionExecPoint,
    ptr: { lo?: number; mid?: number; hi?: number },
    v: VarRow[],
    emphasis: Step['emphasis'],
    caption?: string,
  ) => {
    const pointers = [];
    if (ptr.lo !== undefined) pointers.push({ id: ID_LO, index: clampIdx(ptr.lo) });
    if (ptr.mid !== undefined) pointers.push({ id: ID_MID, index: clampIdx(ptr.mid) });
    if (ptr.hi !== undefined) pointers.push({ id: ID_HI, index: clampIdx(ptr.hi) });
    steps.push({
      array: snap(),
      pointers,
      emphasis: { sortedUpTo, ...emphasis },
      vars: v,
      point,
      caption,
    });
  };

  if (n <= 1) {
    sortedUpTo = n;
    emit('done', {}, vars(DASH, DASH, DASH, DASH, DASH, DASH), {}, '完成');
    return steps;
  }

  for (let i = 1; i < n; i++) {
    const key = work[i][1];
    let keyIdx = i;
    emit(
      'outerLoop',
      {},
      vars(i, key, DASH, DASH, DASH, DASH),
      { keyIndex: keyIdx },
      `第 ${i} 轮：取出 key=${key}，在已排序前缀 [0,${i}) 里折半找插入点`,
    );
    let lo = 0;
    let hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const goLeft = key < work[mid][1];
      emit(
        'probe',
        { lo, mid, hi },
        vars(i, key, lo, mid, hi, DASH),
        { comparing: [mid, keyIdx], keyIndex: keyIdx },
        `探测 mid=${mid}：key=${key} ${goLeft ? '<' : '≥'} a[${mid}]=${work[mid][1]}`,
      );
      if (goLeft) {
        hi = mid;
        emit(
          'goLeft',
          { lo, hi },
          vars(i, key, lo, DASH, hi, DASH),
          { keyIndex: keyIdx },
          `key 更小 → 往左半收：hi→${hi}，区间 [${lo},${hi})`,
        );
      } else {
        lo = mid + 1;
        emit(
          'goRight',
          { lo, hi },
          vars(i, key, lo, DASH, hi, DASH),
          { keyIndex: keyIdx },
          `key 不小于 → 往右半收（保稳定）：lo→${lo}，区间 [${lo},${hi})`,
        );
      }
    }
    const pos = lo;
    emit(
      'found',
      { lo: pos },
      vars(i, key, lo, DASH, hi, pos),
      { keyIndex: keyIdx },
      `lo==hi：插入点定位 pos=${pos}${pos === i ? '（原位，无需搬移）' : ''}`,
    );
    for (let k = i; k > pos; k--) {
      [work[k - 1], work[k]] = [work[k], work[k - 1]]; // key 元组左滑一格、邻元素右让 → FLIP
      keyIdx = k - 1;
      shiftCount++;
      emit(
        'shift',
        { lo: pos },
        vars(i, key, DASH, DASH, DASH, pos),
        { keyIndex: keyIdx },
        `${work[k][1]} 右让一格，key 滑到 ${keyIdx}`,
      );
    }
    sortedUpTo = i + 1;
    emit(
      'insert',
      { lo: pos },
      vars(i, key, DASH, DASH, DASH, pos),
      { keyIndex: keyIdx },
      `key=${key} 落位 ${pos}，前缀 [0,${i + 1}) 有序`,
    );
  }
  sortedUpTo = n;
  emit('done', {}, vars(DASH, DASH, DASH, DASH, DASH, DASH), {}, '完成，全部有序');
  return steps;
}

export const binaryInsertionSortModule: AlgorithmModule<BinaryInsertionExecPoint> = {
  title: '二分插入排序',
  initialInput: () => [5, 2, 9, 4, 7, 1, 8, 3],
  buildSteps: buildBinaryInsertionSortSteps,
  sources: binaryInsertionSortSources,
};
