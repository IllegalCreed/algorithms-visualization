import { SORT_INPUT_SPEC } from '@/components/player/inputSpec';
import type {
  AlgorithmModule,
  HeapExecPoint,
  Step,
  StepEmphasis,
  VarRow,
} from '@/components/player/types';
import { heapSortSources } from './heap-sort.sources';

const DASH = '-';

/** 插桩重走 Floyd 大顶堆 + 单一 siftDown 堆排序，产出逐行粒度的胖步骤（每步带 tree 二叉树轨快照） */
export function buildHeapSortSteps(input: number[]): Step<HeapExecPoint>[] {
  const steps: Step<HeapExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  let swapCount = 0;
  let heapSize = n;

  const vars = (
    phase: string,
    i: number | string,
    l: number | string,
    r: number | string,
    largest: number | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: '阶段', value: phase },
    { name: 'heapSize', value: heapSize },
    { name: 'i', value: i },
    { name: 'left', value: l },
    { name: 'right', value: r },
    { name: 'largest', value: largest },
    { name: 'swapCount', value: swapCount },
  ];

  const push = (point: HeapExecPoint, v: VarRow[], emphasis: StepEmphasis, caption?: string) => {
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers: [], // 堆用节点高亮，不用指针箭头
      emphasis,
      vars: v,
      point,
      tree: { heapSize },
      caption,
    });
  };

  if (n <= 1) {
    push('done', vars('完成', DASH, DASH, DASH, DASH), { sortedFrom: 0 }, '完成');
    return steps;
  }

  // 单一 siftDown：建堆与排序共用；每次循环 compare → (settle | swap 下沉)
  const siftDown = (start: number, size: number, phase: string) => {
    let i = start;
    while (2 * i + 1 < size) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let largest = i;
      if (work[l][1] > work[largest][1]) largest = l;
      if (r < size && work[r][1] > work[largest][1]) largest = r;
      push(
        'compare',
        vars(phase, i, l, r < size ? r : DASH, largest),
        { heapNode: i, comparing: [l, r < size ? r : l] },
        `比较 a[${i}]=${work[i][1]} 与子，最大 = a[${largest}]=${work[largest][1]}`,
      );
      if (largest === i) {
        push(
          'settle',
          vars(phase, i, l, r < size ? r : DASH, largest),
          { heapNode: i },
          `a[${i}] 已是子树最大，子树成堆`,
        );
        break;
      }
      [work[i], work[largest]] = [work[largest], work[i]];
      swapCount++;
      push(
        'swap',
        vars(phase, i, l, r < size ? r : DASH, largest),
        { comparing: [i, largest], swapped: true },
        `下沉：a[${i}] ↔ a[${largest}]`,
      );
      i = largest;
    }
  };

  // 建堆阶段：从最后非叶子节点逆序 siftDown
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    push(
      'heapify',
      vars('建堆', i, 2 * i + 1, 2 * i + 2 < n ? 2 * i + 2 : DASH, i),
      { heapNode: i },
      `建堆：对节点 ${i} 做 siftDown`,
    );
    siftDown(i, n, '建堆');
  }

  // 排序阶段：堆顶最大换末尾、缩堆、恢复
  for (let end = n - 1; end > 0; end--) {
    [work[0], work[end]] = [work[end], work[0]];
    swapCount++;
    heapSize = end;
    push(
      'extract',
      vars('排序', 0, DASH, DASH, DASH),
      { comparing: [0, end], swapped: true, sortedFrom: end },
      `取堆顶最大 ${work[end][1]} → a[${end}] 就位`,
    );
    siftDown(0, end, '排序');
  }
  heapSize = 0;
  push('done', vars('完成', DASH, DASH, DASH, DASH), { sortedFrom: 0 }, '完成，全部有序');
  return steps;
}

export const heapSortModule: AlgorithmModule<HeapExecPoint> = {
  title: '堆排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1], // 与前几个同款，便于横向对比
  buildSteps: buildHeapSortSteps,
  sources: heapSortSources,
  inputSpec: SORT_INPUT_SPEC, // C-110 第一批开放自定义输入
};
