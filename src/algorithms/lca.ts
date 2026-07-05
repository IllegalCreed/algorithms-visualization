// src/algorithms/lca.ts —— LCA 倍增 oracle（C-104）：建表 + 三段式查询轨迹 + 暴力爬父链对拍
export const LCA_N = 8;
/** 固定 8 节点树的父数组（0 为根）：0-1,0-2,1-3,1-4,2-5,3-6,6-7 */
export const LCA_PAR = [-1, 0, 0, 1, 1, 2, 3, 6];
/** 2^2=4 ≥ 最大深度 4，三层跳表足够 */
export const LCA_LOG = 3;

/** 建 depth 与倍增表 up[k][u]（u 往上跳 2^k 步的祖先，越界为 -1） */
export function buildUp(): { depth: number[]; up: number[][] } {
  const depth = new Array(LCA_N).fill(0);
  for (let u = 1; u < LCA_N; u++) depth[u] = depth[LCA_PAR[u]] + 1;
  const up: number[][] = [[...LCA_PAR]];
  for (let k = 1; k < LCA_LOG; k++) {
    const prev = up[k - 1];
    up.push(prev.map((p) => (p < 0 ? -1 : prev[p])));
  }
  return { depth, up };
}

export interface LcaAlign {
  from: number;
  to: number;
  k: number;
}

export interface LcaCheck {
  k: number;
  u: number;
  v: number;
  same: boolean;
  uTo?: number;
  vTo?: number;
}

export interface LcaTrace {
  u0: number;
  v0: number;
  aligns: LcaAlign[];
  checks: LcaCheck[];
  answer: number;
}

/** 三段式查询：①深的按深度差二进制对齐 ②相同即答案 ③高位试跳（不同才跳），父即答案 */
export function lcaTrace(u0: number, v0: number): LcaTrace {
  const { depth, up } = buildUp();
  let u = u0;
  let v = v0;
  if (depth[u] < depth[v]) [u, v] = [v, u];
  const aligns: LcaAlign[] = [];
  const diff = depth[u] - depth[v];
  for (let k = LCA_LOG - 1; k >= 0; k--) {
    if (diff & (1 << k)) {
      aligns.push({ from: u, to: up[k][u], k });
      u = up[k][u];
    }
  }
  const checks: LcaCheck[] = [];
  if (u === v) return { u0, v0, aligns, checks, answer: u };
  for (let k = LCA_LOG - 1; k >= 0; k--) {
    if (up[k][u] !== up[k][v]) {
      checks.push({ k, u, v, same: false, uTo: up[k][u], vTo: up[k][v] });
      u = up[k][u];
      v = up[k][v];
    } else {
      checks.push({ k, u, v, same: true });
    }
  }
  return { u0, v0, aligns, checks, answer: up[0][u] };
}

/** 独立真值：u 的祖先集 + v 逐步爬父链，首个命中即 LCA */
export function bruteLca(u: number, v: number): number {
  const anc = new Set<number>();
  for (let x = u; x >= 0; x = LCA_PAR[x]) anc.add(x);
  let y = v;
  while (!anc.has(y)) y = LCA_PAR[y];
  return y;
}
