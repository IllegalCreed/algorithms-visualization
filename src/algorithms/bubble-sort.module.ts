// src/algorithms/bubble-sort.module.ts
import type { AlgorithmModule, ExecPoint, Step, VarRow } from '@/components/player/types';
import { bubbleSortSources } from './bubble-sort.sources';

const ID_I = '0'; // 红箭头（colors[0]）
const ID_J = '1'; // 蓝箭头（colors[1]）

/** 插桩重走标准冒泡，产出逐行粒度的胖步骤 */
export function buildBubbleSortSteps(input: number[]): Step<ExecPoint>[] {
  const steps: Step<ExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;

  let pass = 0;
  let swapCount = 0;
  let sortedFrom = n; // 下标 >= sortedFrom 已就位；初始无

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  const vars = (j: number): VarRow[] => [
    { name: 'n', value: n },
    { name: 'pass', value: pass },
    { name: 'j', value: j },
    { name: 'a[j]', value: work[j]?.[1] ?? '-' },
    { name: 'a[j+1]', value: work[j + 1]?.[1] ?? '-' },
    { name: 'swapCount', value: swapCount },
    { name: 'sortedFrom', value: sortedFrom },
  ];

  const push = (
    point: ExecPoint,
    i: number,
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
      emphasis: { sortedFrom, ...emphasis },
      // 变量面板的 j 取第一个指针（内层循环计数器 = 红箭头位置）；
      // push 的第三参 j 实为 j+1（蓝箭头），用它会让 a[j]/a[j+1] 整体错位一格
      vars: vars(i),
      point,
      caption,
    });
  };

  if (n <= 1) {
    sortedFrom = 0;
    push('done', 0, 0, {}, '完成');
    return steps;
  }

  for (let end = n - 1; end > 0; end--) {
    pass++;
    push('outerLoop', 0, 1, {}, `第 ${pass} 轮`);
    for (let j = 0; j < end; j++) {
      push('innerLoop', j, j + 1, {}, `看位置 ${j} 与 ${j + 1}`);
      const a = work[j][1];
      const b = work[j + 1][1];
      const willSwap = a > b;
      push('compare', j, j + 1, { comparing: [j, j + 1] }, `${a} ${willSwap ? '>' : '≤'} ${b}`);
      if (willSwap) {
        [work[j], work[j + 1]] = [work[j + 1], work[j]];
        swapCount++;
        push('swap', j, j + 1, { comparing: [j, j + 1], swapped: true }, `交换 ${a} 与 ${b}`);
      } else {
        push('noSwap', j, j + 1, { comparing: [j, j + 1], swapped: false }, '不交换');
      }
    }
    sortedFrom = end; // 本轮把 end 位置定下来
  }
  sortedFrom = 0; // 全部就位
  push('done', 0, 1, {}, '完成');
  return steps;
}

export const bubbleSortModule: AlgorithmModule<ExecPoint> = {
  title: '冒泡排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1],
  buildSteps: buildBubbleSortSteps,
  sources: bubbleSortSources,
};
