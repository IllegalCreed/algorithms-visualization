import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示数组的最大容量（满时禁止插入/追加，避免溢出容器） */
export const ARRAY_MAX = 8;

export interface UseArray {
  items: Ref<[string, number][]>; // [稳定id, 值]；index = 位置；id 驱动 TransitionGroup
  selected: Ref<number | null>; // 当前选中下标（null = 未选）
  hasSelection: ComputedRef<boolean>; // selected != null（访问/删除可用）
  canInsert: ComputedRef<boolean>; // hasSelection && size < ARRAY_MAX
  canAppend: ComputedRef<boolean>; // size < ARRAY_MAX
  select: (i: number) => void; // 点选下标；再点同一格则取消（toggle）
  valueAt: (i: number) => number | null; // 按下标读值（O(1)）；越界返回 null
  insert: () => number | null; // 在 selected 处插入 ++seq、i 起右移；保持选中落新元素；!canInsert 返回 null
  remove: () => number | null; // 删除 selected、后续左移；清空选中；无选中返回 null
  append: () => number | null; // 尾部追加 ++seq；满返回 null
  reset: () => void; // 复位为 [1,2,3,4]、seq=4、清空选中
}

/** 初始预填：让「按下标随机访问」立刻有东西可点；插入后将出现「下标 ≠ 值」 */
const INITIAL = [1, 2, 3, 4];

export function useArray(): UseArray {
  let seq = INITIAL.length; // 下一个插入/追加值 = ++seq（= 5）
  let idn = 0; // 稳定 id 计数（驱动 TransitionGroup）
  const make = (): [string, number][] => INITIAL.map((v) => [`a${idn++}`, v]);

  const items = ref<[string, number][]>(make());
  const selected = ref<number | null>(null);

  const hasSelection = computed(() => selected.value !== null);
  const canInsert = computed(() => selected.value !== null && items.value.length < ARRAY_MAX);
  const canAppend = computed(() => items.value.length < ARRAY_MAX);

  const select = (i: number): void => {
    selected.value = selected.value === i ? null : i;
  };
  const valueAt = (i: number): number | null =>
    i >= 0 && i < items.value.length ? items.value[i][1] : null;
  const insert = (): number | null => {
    if (selected.value === null || items.value.length >= ARRAY_MAX) return null;
    const v = ++seq;
    items.value.splice(selected.value, 0, [`a${idn++}`, v]); // 在 i 处插、i 起右移
    return v;
  };
  const remove = (): number | null => {
    if (selected.value === null) return null;
    const v = items.value.splice(selected.value, 1)[0][1]; // 删 i、后续左移
    selected.value = null;
    return v;
  };
  const append = (): number | null => {
    if (items.value.length >= ARRAY_MAX) return null;
    const v = ++seq;
    items.value.push([`a${idn++}`, v]); // 尾插、谁也不动
    return v;
  };
  const reset = (): void => {
    seq = INITIAL.length;
    items.value = make(); // 新 id（idn 不回退）→ TransitionGroup 干净重建
    selected.value = null;
  };

  return {
    items,
    selected,
    hasSelection,
    canInsert,
    canAppend,
    select,
    valueAt,
    insert,
    remove,
    append,
    reset,
  };
}
