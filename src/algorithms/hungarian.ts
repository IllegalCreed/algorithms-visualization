// src/algorithms/hungarian.ts
// 匈牙利算法 oracle。图算法第 10 页（C-097，纯复用 GraphView——二分图增广路）。
// L1:{R1,R2}、L2:{R1}、L3:{R2,R3}：直配 → 让路增广 → 死路回退换岗，最大匹配 3。

export const HG_N = 3; // 左右各 3
export const HG_ADJ: number[][] = [
  [0, 1], // L1 → R1, R2
  [0], // L2 → R1
  [1, 2], // L3 → R2, R3
];

export interface HgEvent {
  type: 'round' | 'try' | 'match' | 'fail';
  u: number; // 左点（fail 时为无路的左点）
  v?: number; // 右点（try/match）
  note?: string; // try 的结果：'free' 或 'taken by k'（k=占用左点）
  matchR: number[]; // 事件后的 matchR 快照
}

/** DFS 增广全事件流（邻接序 + seen 集，全确定）。 */
export function hungarianTrace(): { events: HgEvent[]; matchR: number[]; count: number } {
  const matchR = new Array<number>(HG_N).fill(-1);
  const events: HgEvent[] = [];
  const snap = (): number[] => [...matchR];

  const dfs = (u: number, seen: Set<number>): boolean => {
    for (const v of HG_ADJ[u]) {
      if (seen.has(v)) continue;
      seen.add(v);
      if (matchR[v] < 0) {
        events.push({ type: 'try', u, v, note: 'free', matchR: snap() });
        matchR[v] = u;
        events.push({ type: 'match', u, v, matchR: snap() });
        return true;
      }
      events.push({ type: 'try', u, v, note: `taken by ${matchR[v]}`, matchR: snap() });
      if (dfs(matchR[v], seen)) {
        matchR[v] = u;
        events.push({ type: 'match', u, v, matchR: snap() });
        return true;
      }
    }
    events.push({ type: 'fail', u, matchR: snap() });
    return false;
  };

  let count = 0;
  for (let u = 0; u < HG_N; u++) {
    events.push({ type: 'round', u, matchR: snap() });
    if (dfs(u, new Set())) count++;
  }
  return { events, matchR, count };
}

/** 暴力枚举全部合法指派（独立真值）。 */
export function bruteMaxMatching(): number {
  let best = 0;
  const assign = new Array<number>(HG_N).fill(-1); // 左 u → 右 v 或 -1
  const usedR = new Array<boolean>(HG_N).fill(false);
  const go = (u: number, cnt: number): void => {
    if (u === HG_N) {
      best = Math.max(best, cnt);
      return;
    }
    go(u + 1, cnt); // u 不配
    for (const v of HG_ADJ[u]) {
      if (!usedR[v]) {
        usedR[v] = true;
        assign[u] = v;
        go(u + 1, cnt + 1);
        assign[u] = -1;
        usedR[v] = false;
      }
    }
  };
  go(0, 0);
  return best;
}
