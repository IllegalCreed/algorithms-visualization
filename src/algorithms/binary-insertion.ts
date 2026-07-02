// src/algorithms/binary-insertion.ts
// 二分插入排序 oracle：纯正确性参照（升序结果），供 module.spec 校验末步有序。
export interface BinaryInsertionTrace {
  result: number[]; // 升序结果
}

export function binaryInsertionSortTrace(input: number[]): BinaryInsertionTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
