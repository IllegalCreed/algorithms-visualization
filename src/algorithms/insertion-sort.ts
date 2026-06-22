export interface InsertionSortStep {
  array: number[];
  i: number; // 当前轮取出的元素原始下标
  insertedAt: number; // key 最终插入的位置
  shifts: number; // 本轮右移次数
}

/** 标准插入排序，返回每轮一步的步骤序列（纯函数，不改入参） */
export function insertionSortSteps(input: number[]): InsertionSortStep[] {
  const arr = [...input];
  const steps: InsertionSortStep[] = [];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    let shifts = 0;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      shifts++;
    }
    arr[j + 1] = key;
    steps.push({ array: [...arr], i, insertedAt: j + 1, shifts });
  }
  return steps;
}
