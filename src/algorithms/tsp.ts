// src/algorithms/tsp.ts
// 旅行商 TSP oracle。动态规划第 8 页（C-099，纯复用 MatrixView——状压状态表）。
// d=[[0,4,1,3],[4,0,2,1],[1,2,0,5],[3,1,5,0]]：12 fill → close min(11,7,7)=7 = 暴力全排列。

export const TSP_DIST = [
  [0, 4, 1, 3],
  [4, 0, 2, 1],
  [1, 2, 0, 5],
  [3, 1, 5, 0],
];
export const TSP_N = 4;
export const TSP_FULL = (1 << TSP_N) - 1;

export interface TspFill {
  mask: number;
  i: number;
  cands: { j: number; cost: number }[];
  bestJ: number;
  val: number;
}

/** Held-Karp pull 式填表（mask 升序；候选与胜者全记录）。 */
export function tspDp(): {
  fills: TspFill[];
  close: { i: number; cost: number }[];
  best: number;
} {
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: 1 << TSP_N }, () =>
    new Array<number>(TSP_N).fill(INF),
  );
  dp[1][0] = 0;
  const fills: TspFill[] = [];
  for (let mask = 3; mask <= TSP_FULL; mask++) {
    if (!(mask & 1)) continue; // 必含起点
    for (let i = 1; i < TSP_N; i++) {
      if (!(mask & (1 << i))) continue;
      const prev = mask ^ (1 << i);
      const cands: { j: number; cost: number }[] = [];
      let best = INF;
      let bestJ = -1;
      for (let j = 0; j < TSP_N; j++) {
        if (prev & (1 << j) && dp[prev][j] < INF) {
          const cost = dp[prev][j] + TSP_DIST[j][i];
          cands.push({ j, cost });
          if (cost < best) {
            best = cost;
            bestJ = j;
          }
        }
      }
      dp[mask][i] = best;
      fills.push({ mask, i, cands, bestJ, val: best });
    }
  }
  const close = [];
  for (let i = 1; i < TSP_N; i++) {
    close.push({ i, cost: dp[TSP_FULL][i] + TSP_DIST[i][0] });
  }
  const best = Math.min(...close.map((c) => c.cost));
  return { fills, close, best };
}

/** 暴力全排列（独立真值）。 */
export function bruteTsp(): number {
  const cities = [1, 2, 3];
  let best = Infinity;
  const go = (rest: number[], cur: number, cost: number): void => {
    if (!rest.length) {
      best = Math.min(best, cost + TSP_DIST[cur][0]);
      return;
    }
    for (let k = 0; k < rest.length; k++) {
      const next = rest[k];
      go([...rest.slice(0, k), ...rest.slice(k + 1)], next, cost + TSP_DIST[cur][next]);
    }
  };
  go(cities, 0, 0);
  return best;
}
