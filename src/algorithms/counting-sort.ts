// 计数排序 oracle（简单计数「萝卜一个坑」）——纯函数，正确性交叉校验用，不改入参。

export interface CountingTrace {
  counts: number[]; // 按值索引计数：counts[v-min]；空桶为 0
  min: number; // 值域下界（空输入约定为 0）
  max: number; // 值域上界（空输入约定为 0）
  result: number[]; // 升序结果
}

export function countingSortTrace(input: number[]): CountingTrace {
  if (input.length === 0) return { counts: [], min: 0, max: 0, result: [] };
  const min = Math.min(...input);
  const max = Math.max(...input);
  const counts = new Array<number>(max - min + 1).fill(0);
  for (const x of input) counts[x - min]++;
  const result: number[] = [];
  for (let b = 0; b < counts.length; b++) for (let c = 0; c < counts[b]; c++) result.push(b + min);
  return { counts, min, max, result };
}
