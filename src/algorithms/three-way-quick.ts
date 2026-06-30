// src/algorithms/three-way-quick.ts
// 三路快排 oracle：纯正确性参照（升序结果），供 module.spec 校验末步有序。
export interface ThreeWayQuickTrace {
  result: number[]; // 升序结果
}

export function threeWayQuickSortTrace(input: number[]): ThreeWayQuickTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
