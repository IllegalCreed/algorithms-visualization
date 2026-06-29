import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** LRU 缓存容量 */
export const LRU_CAP = 4;

export interface LruResult {
  type: 'hit' | 'miss' | 'put-new' | 'put-update';
  key: number;
  value: number | null;
  evicted: number | null; // 被淘汰的 key（put-new 溢出时），否则 null
}
export interface UseLRU {
  entries: Ref<[string, number, number][]>; // [稳定id, key, value]；index 0 = MRU、末位 = LRU
  capacity: number;
  size: ComputedRef<number>;
  get: (key: number) => LruResult;
  put: (key: number, value: number) => LruResult;
  reset: () => void;
}

/** 初始预填：MRU→LRU = 3,2,1（值 30/20/10） */
const INITIAL: [number, number][] = [
  [3, 30],
  [2, 20],
  [1, 10],
];

export function useLRU(): UseLRU {
  let idn = 0;
  const make = (): [string, number, number][] => INITIAL.map(([k, v]) => [`lru${idn++}`, k, v]);
  const entries = ref<[string, number, number][]>(make());
  const size = computed(() => entries.value.length);

  const get = (key: number): LruResult => {
    const idx = entries.value.findIndex((e) => e[1] === key);
    if (idx === -1) return { type: 'miss', key, value: null, evicted: null };
    const [e] = entries.value.splice(idx, 1);
    entries.value.unshift(e); // 命中 → 移到最前（最近用）
    return { type: 'hit', key, value: e[2], evicted: null };
  };
  const put = (key: number, value: number): LruResult => {
    const idx = entries.value.findIndex((e) => e[1] === key);
    if (idx !== -1) {
      const [e] = entries.value.splice(idx, 1);
      entries.value.unshift([e[0], key, value]); // 已有键 → 同 id 新值、移最前
      return { type: 'put-update', key, value, evicted: null };
    }
    entries.value.unshift([`lru${idn++}`, key, value]); // 新键放最前
    let evicted: number | null = null;
    if (entries.value.length > LRU_CAP) {
      const removed = entries.value.pop()!; // 满了 → 淘汰末位（最久没用）
      evicted = removed[1];
    }
    return { type: 'put-new', key, value, evicted };
  };
  const reset = (): void => {
    entries.value = make();
  };

  return { entries, capacity: LRU_CAP, size, get, put, reset };
}
