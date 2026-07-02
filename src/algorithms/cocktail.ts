// src/algorithms/cocktail.ts
// 鸡尾酒排序 oracle：纯正确性参照（升序结果），供 module.spec 校验末步有序。
export interface CocktailTrace {
  result: number[]; // 升序结果
}

export function cocktailSortTrace(input: number[]): CocktailTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
