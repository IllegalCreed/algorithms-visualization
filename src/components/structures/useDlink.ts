import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示双向链表的最大节点数 */
export const DLINK_MAX = 6;

export interface DlinkRewire {
  left: number | 'head'; // 被删节点的前驱锚（删头则 'head'）—— 它的 next 改向
  right: number | 'tail'; // 被删节点的后继锚（删尾则 'tail'）—— 它的 prev 改向
}
export interface UseDlink {
  items: Ref<[string, number][]>; // [稳定id, 值]；顺序 = head→tail
  selected: Ref<number | null>;
  hasSelection: ComputedRef<boolean>;
  forward: ComputedRef<number[]>; // 正向值序 head→tail（沿 next）
  backward: ComputedRef<number[]>; // 反向值序 tail→head（沿 prev）
  select: (i: number) => void; // 点选 toggle
  removeAt: () => { value: number; rewire: DlinkRewire } | null; // 删 selected，O(1) 接线
  reset: () => void;
}

/** 初始预填：4 节点，便于演示中部删除 + 反向遍历 */
const INITIAL = [10, 20, 30, 40];

export function useDlink(): UseDlink {
  let idn = 0;
  const make = (): [string, number][] => INITIAL.map((v) => [`d${idn++}`, v]);
  const items = ref<[string, number][]>(make());
  const selected = ref<number | null>(null);

  const hasSelection = computed(() => selected.value !== null);
  const forward = computed(() => items.value.map((it) => it[1]));
  const backward = computed(() => items.value.map((it) => it[1]).reverse());

  const select = (i: number): void => {
    selected.value = selected.value === i ? null : i;
  };
  const removeAt = (): { value: number; rewire: DlinkRewire } | null => {
    if (selected.value === null) return null;
    const i = selected.value;
    const len = items.value.length;
    const value = items.value[i][1];
    const rewire: DlinkRewire = {
      left: i - 1 >= 0 ? i - 1 : 'head',
      right: i + 1 < len ? i + 1 : 'tail',
    };
    items.value.splice(i, 1); // 节点自带 prev/next → 两步接线即可，O(1)
    selected.value = null;
    return { value, rewire };
  };
  const reset = (): void => {
    items.value = make();
    selected.value = null;
  };

  return { items, selected, hasSelection, forward, backward, select, removeAt, reset };
}
