// src/algorithms/bitonic.ts
// 双调排序网络 oracle。排序阶段三（C-085，新建 NetworkView 比较器网络轨）。
// n=8 → 6 列 24 比较器；列 2 后完美双调；对任意输入排序（200 随机对拍）。

import type { Comparator } from '@/components/player/types';

export const BS_INPUT = [5, 2, 7, 1, 8, 3, 6, 4];

/** 位运算展开双调网络：k=2,4..n（子序列长）× j=k/2..1（比较距离），每个 (k,j) 一列。 */
export function buildComparators(n: number): { comparators: Comparator[]; cols: number } {
  const comparators: Comparator[] = [];
  let col = 0;
  for (let k = 2; k <= n; k *= 2) {
    for (let j = k >> 1; j >= 1; j >>= 1) {
      for (let i = 0; i < n; i++) {
        const l = i ^ j;
        if (l > i) comparators.push({ col, a: i, b: l, dir: (i & k) === 0 ? 'asc' : 'desc' });
      }
      col++;
    }
  }
  return { comparators, cols: col };
}

/** 在网络上执行输入，返回每列执行后的快照（snapshots[0] 为输入）。 */
export function runNetwork(input: number[]): number[][] {
  const { comparators, cols } = buildComparators(input.length);
  const w = [...input];
  const snapshots: number[][] = [[...w]];
  for (let c = 0; c < cols; c++) {
    for (const cp of comparators) {
      if (cp.col !== c) continue;
      const bad = cp.dir === 'asc' ? w[cp.a] > w[cp.b] : w[cp.a] < w[cp.b];
      if (bad) {
        const t = w[cp.a];
        w[cp.a] = w[cp.b];
        w[cp.b] = t;
      }
    }
    snapshots.push([...w]);
  }
  return snapshots;
}

/** 自检：trials 组随机输入全部被网络排序（排序网络与数据无关的验证）。 */
export function networkSortsAll(trials: number): boolean {
  let seed = 42;
  const rnd = (): number => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed;
  };
  for (let t = 0; t < trials; t++) {
    const input = Array.from({ length: 8 }, () => rnd() % 100);
    const out = runNetwork(input).at(-1)!;
    const ref = [...input].sort((a, b) => a - b);
    for (let i = 0; i < 8; i++) if (out[i] !== ref[i]) return false;
  }
  return true;
}
