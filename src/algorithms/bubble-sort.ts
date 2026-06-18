export interface SortStep {
  array: number[];
  compare: [number, number];
  swapped: boolean;
}

/** 标准冒泡排序，返回每次相邻比较的步骤序列（纯函数，不改入参） */
export function bubbleSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  for (let end = arr.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      let swapped = false;
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
      steps.push({ array: [...arr], compare: [i, i + 1], swapped });
    }
  }
  return steps;
}
