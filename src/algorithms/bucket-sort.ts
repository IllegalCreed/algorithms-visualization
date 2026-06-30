// src/algorithms/bucket-sort.ts
// 桶排序 oracle：纯正确性参照（升序结果），供 module.spec 校验末步有序。
export interface BucketTrace {
  result: number[]; // 升序结果
}

export function bucketSortTrace(input: number[]): BucketTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
