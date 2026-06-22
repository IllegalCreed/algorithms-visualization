export interface ShellSortPass {
  gap: number; // 该轮步长
  array: number[]; // 该 gap-pass 完成后的数组快照
}

/** 标准希尔排序（gap = ⌊n/2⌋ 减半），返回每个 gap-pass 后的快照（纯函数，不改入参） */
export function shellSortPasses(input: number[]): ShellSortPass[] {
  const arr = [...input];
  const n = arr.length;
  const passes: ShellSortPass[] = [];
  for (let gap = n >> 1; gap > 0; gap >>= 1) {
    for (let start = 0; start < gap; start++) {
      for (let i = start + gap; i < n; i += gap) {
        const key = arr[i];
        let j = i;
        while (j >= gap && arr[j - gap] > key) {
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = key;
      }
    }
    passes.push({ gap, array: [...arr] });
  }
  return passes;
}
