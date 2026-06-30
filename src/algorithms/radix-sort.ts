// 基数排序 oracle（LSD 按位分配收集）——纯函数，正确性交叉校验用，不改入参。

export interface RadixTrace {
  result: number[]; // 升序结果
  maxDigits: number; // 最大值的位数 = 轮数（空输入约定为 0）
}

export function radixSortTrace(input: number[]): RadixTrace {
  if (input.length === 0) return { result: [], maxDigits: 0 };
  const result = [...input].sort((a, b) => a - b);
  const maxDigits = String(Math.max(...input)).length;
  return { result, maxDigits };
}
