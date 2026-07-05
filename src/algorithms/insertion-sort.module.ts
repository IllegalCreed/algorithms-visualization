import { SORT_INPUT_SPEC } from '@/components/player/inputSpec';
import type { AlgorithmModule, InsertionExecPoint, Step, VarRow } from '@/components/player/types';
import { insertionSortSources } from './insertion-sort.sources';

const ID_I = '0'; // 红箭头（colors[0]）：本轮边界 / 已排序区右界
const ID_J = '1'; // 蓝箭头（colors[1]）：左探位置

/** 插桩重走标准插入排序，产出逐行粒度的胖步骤 */
export function buildInsertionSortSteps(input: number[]): Step<InsertionExecPoint>[] {
  const steps: Step<InsertionExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;

  let shiftCount = 0;
  let sortedUpTo = 1; // [0, sortedUpTo) 已（相对）就位；单元素天然有序

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  const vars = (i: number, key: number, j: number): VarRow[] => [
    { name: 'n', value: n },
    { name: 'i', value: i },
    { name: 'key', value: key },
    { name: 'j', value: j },
    { name: 'a[j]', value: work[j]?.[1] ?? '-' },
    { name: 'shiftCount', value: shiftCount },
    { name: 'sortedUpTo', value: sortedUpTo },
  ];

  const push = (
    point: InsertionExecPoint,
    i: number,
    key: number,
    j: number,
    emphasis: Step['emphasis'] = {},
    caption?: string,
  ) => {
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers: [
        { id: ID_I, index: clampIdx(i) },
        { id: ID_J, index: clampIdx(j) },
      ],
      emphasis: { sortedUpTo, ...emphasis },
      vars: vars(i, key, j),
      point,
      caption,
    });
  };

  if (n <= 1) {
    sortedUpTo = n;
    push('done', 0, work[0]?.[1] ?? 0, 0, {}, '完成');
    return steps;
  }

  for (let i = 1; i < n; i++) {
    const key = work[i][1];
    let keyIdx = i;
    let j = i - 1;
    push('outerLoop', i, key, j, { keyIndex: keyIdx }, `第 ${i} 轮：取出 key=${key}`);
    while (j >= 0) {
      const aj = work[j][1];
      const greater = aj > key;
      push(
        'compare',
        i,
        key,
        j,
        { comparing: [j, keyIdx], keyIndex: keyIdx },
        `a[${j}]=${aj} ${greater ? '>' : '≤'} key=${key}`,
      );
      if (!greater) break; // a[j] ≤ key，找到插入点，停
      // 右移：key 与左邻 a[j] 相邻交换（keyIdx == j+1）；key 左滑、aj 右让
      [work[j], work[keyIdx]] = [work[keyIdx], work[j]];
      keyIdx = j;
      shiftCount++;
      push('shift', i, key, j, { keyIndex: keyIdx }, `${aj} 右移，key 滑到 ${keyIdx}`);
      j--;
    }
    push('insert', i, key, j, { keyIndex: keyIdx }, `key=${key} 插入位置 ${keyIdx}`);
    sortedUpTo = i + 1;
  }
  sortedUpTo = n;
  push('done', n - 1, work[n - 1][1], n - 1, {}, '完成');
  return steps;
}

export const insertionSortModule: AlgorithmModule<InsertionExecPoint> = {
  title: '插入排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1],
  buildSteps: buildInsertionSortSteps,
  sources: insertionSortSources,
  inputSpec: SORT_INPUT_SPEC, // C-110 第一批开放自定义输入
};
