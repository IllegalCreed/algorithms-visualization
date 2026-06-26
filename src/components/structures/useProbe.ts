import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 扁平表格数：散列 key % 7 */
export const PROBE_SLOTS = 7;

export interface ProbeInsert {
  ok: boolean;
  reason?: 'dup' | 'full';
  home: number; // hash(key)
  slot: number; // 落座槽（ok 时），否则 -1
  path: number[]; // 探测路径（依次试过的槽下标，末位=落座槽）
  collision: boolean; // 是否发生过探测（home 已被占）
}
export interface ProbeSearch {
  found: boolean;
  home: number;
  slot: number; // 命中槽，否则 -1
  path: number[]; // 探测路径（依次看过的槽，末位=命中槽或终止空槽）
  steps: number; // 看过的格数 = path.length
}
export interface UseProbe {
  slots: Ref<(number | null)[]>; // 7 格扁平表；index = 槽号
  size: ComputedRef<number>;
  load: ComputedRef<number>; // 装载因子 size / 7
  isFull: ComputedRef<boolean>;
  hash: (key: number) => number;
  has: (key: number) => boolean;
  insert: (key: number) => ProbeInsert;
  search: (key: number) => ProbeSearch;
  reset: () => void;
}

/** 初始预填：探测后落 [_,15,8,23,4,_,_]（格 1-2-3 成一簇） */
const INITIAL = [15, 8, 23, 4];

export function useProbe(): UseProbe {
  const slots = ref<(number | null)[]>([]);

  const hash = (key: number): number => key % PROBE_SLOTS;
  const size = computed(() => slots.value.filter((s) => s !== null).length);
  const load = computed(() => size.value / PROBE_SLOTS);
  const isFull = computed(() => size.value >= PROBE_SLOTS);

  const search = (key: number): ProbeSearch => {
    const home = hash(key);
    const path: number[] = [];
    let i = home;
    for (let c = 0; c < PROBE_SLOTS; c++) {
      path.push(i);
      if (slots.value[i] === null)
        return { found: false, home, slot: -1, path, steps: path.length };
      if (slots.value[i] === key) return { found: true, home, slot: i, path, steps: path.length };
      i = (i + 1) % PROBE_SLOTS;
    }
    return { found: false, home, slot: -1, path, steps: path.length };
  };
  const has = (key: number): boolean => search(key).found;

  const insert = (key: number): ProbeInsert => {
    const home = hash(key);
    if (has(key))
      return { ok: false, reason: 'dup', home, slot: -1, path: [home], collision: false };
    if (isFull.value)
      return { ok: false, reason: 'full', home, slot: -1, path: [], collision: false };
    const path: number[] = [];
    let i = home;
    while (slots.value[i] !== null) {
      path.push(i);
      i = (i + 1) % PROBE_SLOTS;
    }
    path.push(i);
    slots.value[i] = key;
    return { ok: true, home, slot: i, path, collision: path.length > 1 };
  };

  const reset = (): void => {
    slots.value = Array.from({ length: PROBE_SLOTS }, () => null);
    for (const k of INITIAL) insert(k);
  };

  reset();
  return { slots, size, load, isFull, hash, has, insert, search, reset };
}
