import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 并查集元素数：0..7 */
export const UF_SIZE = 8;

export interface FindResult {
  root: number;
  path: number[]; // x 一路到根（含 x 与 root）
}
export interface UnionResult {
  merged: boolean;
  root: number; // 合并后（或已同组的）根
  child: number; // 被指过去的根；未合并为 -1
}
export interface UseUnionFind {
  parent: Ref<number[]>; // root 满足 parent[i]===i
  groupCount: ComputedRef<number>; // 根的个数 = 组数（连通分量）
  find: (x: number) => FindResult; // 纯走位，不改 parent
  union: (a: number, b: number) => UnionResult; // rootA → rootB
  connected: (a: number, b: number) => boolean;
  compress: (x: number) => FindResult; // 路径压缩：沿途指根（改 parent）
  reset: () => void;
}

const initial = (): number[] => Array.from({ length: UF_SIZE }, (_, i) => i);

export function useUnionFind(): UseUnionFind {
  const parent = ref<number[]>(initial());
  const groupCount = computed(() => parent.value.filter((p, i) => p === i).length);

  const find = (x: number): FindResult => {
    const path = [x];
    let cur = x;
    while (parent.value[cur] !== cur) {
      cur = parent.value[cur];
      path.push(cur);
    }
    return { root: cur, path };
  };
  const union = (a: number, b: number): UnionResult => {
    const ra = find(a).root;
    const rb = find(b).root;
    if (ra === rb) return { merged: false, root: ra, child: -1 };
    parent.value[ra] = rb; // 把 a 的根指向 b 的根
    return { merged: true, root: rb, child: ra };
  };
  const connected = (a: number, b: number): boolean => find(a).root === find(b).root;
  const compress = (x: number): FindResult => {
    const { root, path } = find(x);
    for (const n of path) if (n !== root) parent.value[n] = root; // 沿途直接指根
    return { root, path };
  };
  const reset = (): void => {
    parent.value = initial();
  };

  return { parent, groupCount, find, union, connected, compress, reset };
}
