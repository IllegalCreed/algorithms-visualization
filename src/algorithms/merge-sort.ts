export interface MergePass {
  width: number; // 该趟步长
  array: number[]; // 该趟所有相邻段合并后的数组快照
}

/** 自底向上归并排序（width=1 逐次 ×2），返回每趟 width 后的快照（纯函数，不改入参） */
export function mergeSortPasses(input: number[]): MergePass[] {
  const arr = [...input];
  const n = arr.length;
  const passes: MergePass[] = [];
  const temp = new Array<number>(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      if (mid >= hi) continue; // 残段，无右段可合并
      let i = lo;
      let j = mid;
      let k = lo;
      while (i < mid && j < hi) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
      }
      while (i < mid) temp[k++] = arr[i++];
      while (j < hi) temp[k++] = arr[j++];
      for (let t = lo; t < hi; t++) arr[t] = temp[t];
    }
    passes.push({ width, array: [...arr] });
  }
  return passes;
}
