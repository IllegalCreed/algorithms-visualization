import type { AlgorithmModule, SelectionExecPoint, Step, VarRow } from '@/components/player/types';
import { selectionSortSources } from './selection-sort.sources';

const ID_I = '0'; // 红箭头（colors[0]）：待填位
const ID_J = '1'; // 蓝箭头（colors[1]）：扫描位
const ID_MIN = '2'; // 黄箭头（colors[2]）：当前最小

/** 插桩重走标准选择排序，产出逐行粒度的胖步骤 */
export function buildSelectionSortSteps(input: number[]): Step<SelectionExecPoint>[] {
  const steps: Step<SelectionExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;

  let swapCount = 0;
  let sortedUpTo = 0; // [0, sortedUpTo) 已就位

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  const vars = (i: number, j: number, minIdx: number): VarRow[] => [
    { name: 'n', value: n },
    { name: 'i', value: i },
    { name: 'j', value: j },
    { name: 'minIdx', value: minIdx },
    { name: 'a[j]', value: work[j]?.[1] ?? '-' },
    { name: 'a[minIdx]', value: work[minIdx]?.[1] ?? '-' },
    { name: 'swapCount', value: swapCount },
    { name: 'sortedUpTo', value: sortedUpTo },
  ];

  const push = (
    point: SelectionExecPoint,
    i: number,
    j: number,
    minIdx: number,
    emphasis: Step['emphasis'] = {},
    caption?: string,
  ) => {
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers: [
        { id: ID_I, index: clampIdx(i) },
        { id: ID_J, index: clampIdx(j) },
        { id: ID_MIN, index: clampIdx(minIdx) },
      ],
      emphasis: { sortedUpTo, ...emphasis },
      vars: vars(i, j, minIdx),
      point,
      caption,
    });
  };

  if (n <= 1) {
    sortedUpTo = n;
    push('done', 0, 0, 0, {}, '完成');
    return steps;
  }

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    push('outerLoop', i, i, minIdx, { minIndex: minIdx }, `第 ${i + 1} 轮：先假定位置 ${i} 最小`);
    for (let j = i + 1; j < n; j++) {
      push('innerLoop', i, j, minIdx, { minIndex: minIdx }, `看位置 ${j}`);
      const aj = work[j][1];
      const amin = work[minIdx][1];
      const smaller = aj < amin;
      push(
        'compare',
        i,
        j,
        minIdx,
        { comparing: [j, minIdx], minIndex: minIdx },
        `${aj} ${smaller ? '<' : '≥'} ${amin}`,
      );
      if (smaller) {
        minIdx = j;
        push('newMin', i, j, minIdx, { minIndex: minIdx }, `更小，min ← ${j}`);
      }
    }
    if (minIdx !== i) {
      const a = work[i][1];
      const b = work[minIdx][1];
      [work[i], work[minIdx]] = [work[minIdx], work[i]];
      swapCount++;
      push('swap', i, i, minIdx, { comparing: [i, minIdx], swapped: true }, `交换 ${a} 与 ${b}`);
    } else {
      push('noSwap', i, i, i, { minIndex: i }, `位置 ${i} 已是最小，不交换`);
    }
    sortedUpTo = i + 1;
  }
  sortedUpTo = n;
  push('done', n - 1, n - 1, n - 1, {}, '完成');
  return steps;
}

export const selectionSortModule: AlgorithmModule<SelectionExecPoint> = {
  title: '选择排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1],
  buildSteps: buildSelectionSortSteps,
  sources: selectionSortSources,
};
