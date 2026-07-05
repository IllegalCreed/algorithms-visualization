// src/algorithms/reroot.ts
// 换根 DP oracle。动态规划第 11 页（C-103，纯复用 MatrixView——二次扫描）。
// 5 节点完全二叉树：后序 size/down → root ans[0]=6 → 换根 DFS 序 1,3,4,2 → ans=[6,5,9,8,8]。

export const RR_N = 5;
// 完全二叉树邻接（0 根；孩子 2i+1 / 2i+2）
export const RR_ADJ: number[][] = [[1, 2], [0, 3, 4], [0], [1], [1]];

const kids = (u: number, p: number): number[] => RR_ADJ[u].filter((v) => v !== p);

export interface DownFill {
  u: number;
  kids: number[];
  size: number;
  down: number;
}

export interface RerootStep {
  v: number;
  parent: number;
  sizeV: number;
  ansP: number;
  ansV: number;
}

/** 二次扫描全轨迹（后序 fills + 前序换根步）。 */
export function rerootTrace(): {
  postOrder: number[];
  downFills: DownFill[];
  reroots: RerootStep[];
  ans: number[];
} {
  const size = new Array<number>(RR_N).fill(1);
  const down = new Array<number>(RR_N).fill(0);
  const ans = new Array<number>(RR_N).fill(0);
  const postOrder: number[] = [];
  const downFills: DownFill[] = [];

  const dfs1 = (u: number, p: number): void => {
    for (const v of kids(u, p)) {
      dfs1(v, u);
      size[u] += size[v];
      down[u] += down[v] + size[v]; // 子树整体抬 1 步
    }
    postOrder.push(u);
    downFills.push({ u, kids: kids(u, p), size: size[u], down: down[u] });
  };
  dfs1(0, -1);

  ans[0] = down[0];
  const reroots: RerootStep[] = [];
  const dfs2 = (u: number, p: number): void => {
    for (const v of kids(u, p)) {
      ans[v] = ans[u] - size[v] + (RR_N - size[v]); // 近 size[v] 远 n−size[v]
      reroots.push({ v, parent: u, sizeV: size[v], ansP: ans[u], ansV: ans[v] });
      dfs2(v, u);
    }
  };
  dfs2(0, -1);

  return { postOrder, downFills, reroots, ans };
}

/** 暴力：逐点 BFS 求距离和（独立真值）。 */
export function bruteDist(): number[] {
  const out: number[] = [];
  for (let s = 0; s < RR_N; s++) {
    const dist = new Map<number, number>([[s, 0]]);
    const queue = [s];
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of RR_ADJ[u]) {
        if (!dist.has(v)) {
          dist.set(v, dist.get(u)! + 1);
          queue.push(v);
        }
      }
    }
    let sum = 0;
    for (const d of dist.values()) sum += d;
    out.push(sum);
  }
  return out;
}
