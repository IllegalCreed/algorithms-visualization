import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 桶数：散列 key % 7 */
export const HASH_BUCKETS = 7;
/** 演示总容量（满时禁止插入） */
export const HASH_MAX = 16;

export interface InsertResult {
  ok: boolean;
  reason?: 'dup' | 'full';
  bucket: number; // hash(key)
  collision?: boolean; // 入桶前该桶非空
}
export interface SearchResult {
  found: boolean;
  bucket: number;
  steps: number; // 沿链比较次数
}
export interface UseHash {
  buckets: Ref<[string, number][][]>; // 7 个桶，每桶一条 [id, key] 链；index = 桶号
  size: ComputedRef<number>;
  canInsert: ComputedRef<boolean>;
  hash: (key: number) => number;
  has: (key: number) => boolean;
  insert: (key: number) => InsertResult;
  search: (key: number) => SearchResult;
  reset: () => void;
}

/** 初始预填：桶1 = [15,8]（冲突）、桶2 = [23]、桶4 = [4] */
const INITIAL = [15, 8, 23, 4];

export function useHash(): UseHash {
  let idn = 0;
  const buckets = ref<[string, number][][]>([]);

  const hash = (key: number): number => key % HASH_BUCKETS;
  const size = computed(() => buckets.value.reduce((s, b) => s + b.length, 0));
  const canInsert = computed(() => size.value < HASH_MAX);
  const has = (key: number): boolean => buckets.value[hash(key)].some((e) => e[1] === key);

  const insert = (key: number): InsertResult => {
    const b = hash(key);
    if (has(key)) return { ok: false, reason: 'dup', bucket: b };
    if (size.value >= HASH_MAX) return { ok: false, reason: 'full', bucket: b };
    const collision = buckets.value[b].length > 0;
    buckets.value[b].push([`e${idn++}`, key]); // 空放 / 冲突追加链尾
    return { ok: true, bucket: b, collision };
  };
  const search = (key: number): SearchResult => {
    const b = hash(key);
    const chain = buckets.value[b];
    for (let i = 0; i < chain.length; i++) {
      if (chain[i][1] === key) return { found: true, bucket: b, steps: i + 1 };
    }
    return { found: false, bucket: b, steps: chain.length };
  };
  const reset = (): void => {
    buckets.value = Array.from({ length: HASH_BUCKETS }, () => []);
    for (const k of INITIAL) buckets.value[hash(k)].push([`e${idn++}`, k]);
  };

  reset();
  return { buckets, size, canInsert, hash, has, insert, search, reset };
}
