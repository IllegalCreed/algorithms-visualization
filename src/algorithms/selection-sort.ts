export interface SelectionSortStep {
  array: number[];
  i: number; // 当前轮（要填的位置）
  minIdx: number; // 该轮选出的最小值下标
  swapped: boolean; // 是否发生交换
}

/** 标准选择排序，返回每轮一步的步骤序列（纯函数，不改入参） */
export function selectionSortSteps(input: number[]): SelectionSortStep[] {
  const arr = [...input];
  const steps: SelectionSortStep[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    let swapped = false;
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swapped = true;
    }
    steps.push({ array: [...arr], i, minIdx, swapped });
  }
  return steps;
}
