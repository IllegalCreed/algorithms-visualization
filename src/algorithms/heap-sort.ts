export interface HeapTrace {
  built: number[]; // 建堆后大顶堆快照
  result: number[]; // 升序结果
}

/** 大顶堆性质校验：任意节点 ≥ 其存在的左右子 */
export function isMaxHeap(a: number[], size: number = a.length): boolean {
  for (let i = 0; i < size; i++) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < size && a[l] > a[i]) return false;
    if (r < size && a[r] > a[i]) return false;
  }
  return true;
}

/** 堆排序 oracle（Floyd 自底向上建大顶堆 + 单一 siftDown），返回建堆快照与升序结果（纯函数，不改入参） */
export function heapSortTrace(input: number[]): HeapTrace {
  const a = [...input];
  const n = a.length;

  const siftDown = (start: number, size: number) => {
    let i = start;
    while (2 * i + 1 < size) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let largest = i;
      if (a[l] > a[largest]) largest = l;
      if (r < size && a[r] > a[largest]) largest = r;
      if (largest === i) break;
      [a[i], a[largest]] = [a[largest], a[i]];
      i = largest;
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(i, n);
  const built = [...a];
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(0, end);
  }
  return { built, result: [...a] };
}
