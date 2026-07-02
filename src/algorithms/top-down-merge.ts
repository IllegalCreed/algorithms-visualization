// src/algorithms/top-down-merge.ts
// 自顶向下归并 oracle：纯正确性参照（升序结果），供 module.spec 校验末步有序。
export interface TopDownMergeTrace {
  result: number[]; // 升序结果
}

export function topDownMergeSortTrace(input: number[]): TopDownMergeTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
