import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示堆的最大节点数（满 15 = 完全二叉树 4 层；禁止再插入） */
export const HEAP_MAX = 15;

export interface UseHeap {
  items: Ref<[string, number][]>; // [稳定id, 值]；index = 完全二叉树 pos；大顶堆
  canInsert: ComputedRef<boolean>;
  canExtract: ComputedRef<boolean>;
  peek: () => number | null; // 堆顶值（根）
  insert: (value: number) => number | null; // 末尾追加（不 sift），返回新下标；满返回 null
  siftUpStep: (i: number) => number; // 一步上浮：items[i] > parent 则交换、返回 parent；否则 -1
  extractRoot: () => number | null; // 取走根（最大）、末位补根，返回最大值；空返回 null
  siftDownStep: (i: number) => number; // 一步下沉：与较大孩子交换并返回其下标；否则 -1
  reset: () => void; // 复位为初始大顶堆
}

/** 初始预填：一棵合法大顶堆（pos 0..6，3 层） */
const INITIAL = [90, 70, 80, 40, 60, 30, 50];

export function useHeap(): UseHeap {
  let idn = 0;
  const items = ref<[string, number][]>([]);
  const make = (): [string, number][] => INITIAL.map((v) => [`h${idn++}`, v]);

  const canInsert = computed(() => items.value.length < HEAP_MAX);
  const canExtract = computed(() => items.value.length > 0);
  const peek = (): number | null => (items.value.length ? items.value[0][1] : null);

  const insert = (value: number): number | null => {
    if (items.value.length >= HEAP_MAX) return null;
    items.value.push([`h${idn++}`, value]); // 末尾追加（树的下一个叶子）
    return items.value.length - 1;
  };
  const siftUpStep = (i: number): number => {
    if (i <= 0) return -1;
    const p = (i - 1) >> 1;
    if (items.value[i][1] > items.value[p][1]) {
      [items.value[i], items.value[p]] = [items.value[p], items.value[i]];
      return p;
    }
    return -1;
  };
  const extractRoot = (): number | null => {
    if (!items.value.length) return null;
    const max = items.value[0][1];
    const last = items.value.pop()!;
    if (items.value.length) items.value[0] = last; // 末位补根（待下沉）
    return max;
  };
  const siftDownStep = (i: number): number => {
    const n = items.value.length;
    let big = i;
    if (2 * i + 1 < n && items.value[2 * i + 1][1] > items.value[big][1]) big = 2 * i + 1;
    if (2 * i + 2 < n && items.value[2 * i + 2][1] > items.value[big][1]) big = 2 * i + 2;
    if (big !== i) {
      [items.value[i], items.value[big]] = [items.value[big], items.value[i]];
      return big;
    }
    return -1;
  };
  const reset = (): void => {
    items.value = make();
  };

  reset();
  return {
    items,
    canInsert,
    canExtract,
    peek,
    insert,
    siftUpStep,
    extractRoot,
    siftDownStep,
    reset,
  };
}
