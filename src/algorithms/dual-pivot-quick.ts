// src/algorithms/dual-pivot-quick.ts
// 双轴快排 oracle：纯正确性参照（升序结果），供 module.spec 校验末步有序。
export interface DualPivotQuickTrace {
  result: number[]; // 升序结果
}

export function dualPivotQuickSortTrace(input: number[]): DualPivotQuickTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
