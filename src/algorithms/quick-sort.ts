export interface PartitionEvent {
  lo: number; // 该次 partition 的区间左界
  hi: number; // 该次 partition 的区间右界
  pivotIndex: number; // partition 后 pivot 的最终落点（钉死位置）
  array: number[]; // 该次 partition 完成后的整数组快照
}

/**
 * 快速排序 oracle（Lomuto 末位 pivot + 显式区间栈，栈序「先右后左」→ pop 先取左半）。
 * 返回每次 partition 完成后的事件序列（纯函数，不改入参）。单元素子区间无需 partition，不产生事件。
 */
export function quickSortPartitions(input: number[]): PartitionEvent[] {
  const a = [...input];
  const events: PartitionEvent[] = [];
  const stack: Array<[number, number]> = [];
  if (a.length >= 2) stack.push([0, a.length - 1]);
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()!;
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]]; // pivot 归位到 i
    const p = i;
    events.push({ lo, hi, pivotIndex: p, array: [...a] });
    if (hi > p + 1) stack.push([p + 1, hi]); // 先压右子区间（多元素才入栈）
    if (p - 1 > lo) stack.push([lo, p - 1]); // 后压左子区间 → pop 先取左
  }
  return events;
}
