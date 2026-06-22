import type { AlgorithmModule, ShellExecPoint, Step, VarRow } from '@/components/player/types';
import { shellSortSources } from './shell-sort.sources';

const ID_I = '0'; // 红箭头（colors[0]）：本轮取出元素的原始下标
const ID_J = '1'; // 蓝箭头（colors[1]）：左探位置（被比较元素，按 gap 跳）

/** 插桩重走「按组显式三层」希尔排序，产出逐行粒度的胖步骤 */
export function buildShellSortSteps(input: number[]): Step<ShellExecPoint>[] {
  const steps: Step<ShellExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;

  let shiftCount = 0;
  let gap = 0;
  let start = -1; // -1：尚未进入子序列（gapChange/done 帧 group 显示 '-'）

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  const vars = (i: number, key: number, j: number): VarRow[] => [
    { name: 'n', value: n },
    { name: 'gap', value: gap },
    { name: 'group', value: start >= 0 ? start : '-' },
    { name: 'i', value: i },
    { name: 'key', value: key },
    { name: 'j', value: j },
    { name: 'a[j]', value: work[j]?.[1] ?? '-' },
    { name: 'shiftCount', value: shiftCount },
  ];

  const push = (
    point: ShellExecPoint,
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
      emphasis,
      vars: vars(i, key, j),
      point,
      caption,
    });
  };

  if (n <= 1) {
    push('done', 0, work[0]?.[1] ?? 0, 0, { sortedFrom: 0 }, '完成');
    return steps;
  }

  const groupOf = (s: number, g: number): number[] => {
    const r: number[] = [];
    for (let k = s; k < n; k += g) r.push(k);
    return r;
  };

  for (gap = n >> 1; gap > 0; gap >>= 1) {
    start = -1;
    push('gapChange', 0, work[0][1], 0, {}, `gap=${gap}：步长减半，分 ${gap} 组`);
    for (start = 0; start < gap; start++) {
      const members = groupOf(start, gap);
      push(
        'groupStart',
        start,
        work[start][1],
        start,
        { groupMembers: members },
        `步长 ${gap} · 组 ${start}`,
      );
      for (let i = start + gap; i < n; i += gap) {
        const key = work[i][1];
        let keyIdx = i;
        let j = i - gap;
        push(
          'outerLoop',
          i,
          key,
          j,
          { keyIndex: keyIdx, groupMembers: members },
          `取出 key=${key}（下标 ${i}）`,
        );
        while (j >= start) {
          const aj = work[j][1];
          const greater = aj > key;
          push(
            'compare',
            i,
            key,
            j,
            { comparing: [j, keyIdx], keyIndex: keyIdx, groupMembers: members },
            `a[${j}]=${aj} ${greater ? '>' : '≤'} key=${key}`,
          );
          if (!greater) break; // 找到插入点，停
          // 跨 gap 交换：key 与左邻 work[j] 换位；key 左跳、aj 右让
          [work[j], work[keyIdx]] = [work[keyIdx], work[j]];
          keyIdx = j;
          shiftCount++;
          push(
            'shift',
            i,
            key,
            j,
            { keyIndex: keyIdx, groupMembers: members },
            `${aj} 右移 gap=${gap}，key 跳到 ${keyIdx}`,
          );
          j -= gap;
        }
        push(
          'insert',
          i,
          key,
          j,
          { keyIndex: keyIdx, groupMembers: members },
          `key=${key} 插入下标 ${keyIdx}`,
        );
      }
    }
  }
  start = -1;
  push('done', n - 1, work[n - 1][1], n - 1, { sortedFrom: 0 }, '完成，全部有序');
  return steps;
}

export const shellSortModule: AlgorithmModule<ShellExecPoint> = {
  title: '希尔排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1], // 与插入排序同款，便于横向对比
  buildSteps: buildShellSortSteps,
  sources: shellSortSources,
};
