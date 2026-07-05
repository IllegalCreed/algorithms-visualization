// src/algorithms/fenwick.ts
// 树状数组 oracle。数据结构第 16 页（C-102，纯复用主柱轨——lowbit 链跳跃）。
// a=[3,2,5,1,4,2,3,1] → tree=[3,5,5,11,4,6,3,21]；query(6)=17、update(3,+2) 后 19。

export const BIT_A = [3, 2, 5, 1, 4, 2, 3, 1];
export const BIT_N = BIT_A.length;

export const lowbit = (i: number): number => i & -i;

/** 建树（tree[i] = 管辖长 lowbit(i) 区段和；1-indexed）。 */
export function buildTree(a: number[] = BIT_A): number[] {
  const tree = new Array<number>(a.length + 1).fill(0);
  for (let idx = 1; idx <= a.length; idx++) {
    let i = idx;
    while (i <= a.length) {
      tree[i] += a[idx - 1];
      i += lowbit(i);
    }
  }
  return tree;
}

export interface QueryHop {
  i: number;
  val: number; // tree[i]
  acc: number; // 累计
}

/** 前缀和查询轨迹（沿 i -= lowbit 往前跳）。 */
export function queryTrace(tree: number[], i: number): { hops: QueryHop[]; sum: number } {
  const hops: QueryHop[] = [];
  let s = 0;
  while (i > 0) {
    s += tree[i];
    hops.push({ i, val: tree[i], acc: s });
    i -= lowbit(i);
  }
  return { hops, sum: s };
}

export interface UpdateHop {
  i: number;
  after: number; // 更新后的 tree[i]
}

/** 单点加轨迹（沿 i += lowbit 往后跳；原地修改 tree）。 */
export function updateTrace(tree: number[], i: number, d: number): { hops: UpdateHop[] } {
  const hops: UpdateHop[] = [];
  while (i < tree.length) {
    tree[i] += d;
    hops.push({ i, after: tree[i] });
    i += lowbit(i);
  }
  return { hops };
}

/** 暴力前缀和（独立真值）。 */
export function brutePrefix(a: number[], i: number): number {
  let s = 0;
  for (let k = 0; k < i; k++) s += a[k];
  return s;
}
