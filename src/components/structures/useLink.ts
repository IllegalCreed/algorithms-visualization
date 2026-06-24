import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示链表的最大节点数（满时禁止插入/头插，避免溢出容器） */
export const LINK_MAX = 6;

export interface UseLink {
  items: Ref<[string, number][]>; // [稳定id, 值]；顺序 = 从 head 起的链序，index 0 = head
  selected: Ref<number | null>; // 当前选中节点下标（null = 未选）
  hasSelection: ComputedRef<boolean>; // selected != null（查找/删除可用）
  canInsert: ComputedRef<boolean>; // hasSelection && size < LINK_MAX
  canPrepend: ComputedRef<boolean>; // size < LINK_MAX
  select: (i: number) => void; // 点选节点；再点同一个取消（toggle）
  valueAt: (i: number) => number | null; // 按位置读值（演示为逐跳，概念 O(n)）；越界返回 null
  insertAfter: () => number | null; // 在 selected 后插入 ++seq；选中落新节点(i+1)；!canInsert 返回 null
  remove: () => number | null; // 删除 selected（前驱 next 跳过）；清空选中；无选中返回 null
  prepend: () => number | null; // 头插 ++seq（unshift）；满返回 null；selected 非空则 +1
  reset: () => void; // 复位为 [1,2,3]、seq=3、清空选中
}

/** 初始预填：让链表一上来就有节点可点 */
const INITIAL = [1, 2, 3];

export function useLink(): UseLink {
  let seq = INITIAL.length; // 下一个值 = ++seq（= 4）
  let idn = 0; // 稳定 id 计数（驱动 TransitionGroup）
  const make = (): [string, number][] => INITIAL.map((v) => [`l${idn++}`, v]);

  const items = ref<[string, number][]>(make());
  const selected = ref<number | null>(null);

  const hasSelection = computed(() => selected.value !== null);
  const canInsert = computed(() => selected.value !== null && items.value.length < LINK_MAX);
  const canPrepend = computed(() => items.value.length < LINK_MAX);

  const select = (i: number): void => {
    selected.value = selected.value === i ? null : i;
  };
  const valueAt = (i: number): number | null =>
    i >= 0 && i < items.value.length ? items.value[i][1] : null;
  const insertAfter = (): number | null => {
    if (selected.value === null || items.value.length >= LINK_MAX) return null;
    const v = ++seq;
    items.value.splice(selected.value + 1, 0, [`l${idn++}`, v]); // 选中后插（改 2 根 next）
    selected.value = selected.value + 1; // 选中落新节点
    return v;
  };
  const remove = (): number | null => {
    if (selected.value === null) return null;
    const v = items.value.splice(selected.value, 1)[0][1]; // 删选中（前驱 next 跳过）
    selected.value = null;
    return v;
  };
  const prepend = (): number | null => {
    if (items.value.length >= LINK_MAX) return null;
    const v = ++seq;
    items.value.unshift([`l${idn++}`, v]); // 头插（改 head + 新节点 next）
    if (selected.value !== null) selected.value = selected.value + 1;
    return v;
  };
  const reset = (): void => {
    seq = INITIAL.length;
    items.value = make();
    selected.value = null;
  };

  return {
    items,
    selected,
    hasSelection,
    canInsert,
    canPrepend,
    select,
    valueAt,
    insertAfter,
    remove,
    prepend,
    reset,
  };
}
