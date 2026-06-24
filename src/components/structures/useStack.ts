import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示栈的最大容量（满时禁止 push，避免溢出容器） */
export const STACK_MAX = 8;

export interface UseStack {
  items: Ref<[string, number][]>; // [稳定id, 值]；数组尾 = 栈顶；id 驱动 TransitionGroup
  top: ComputedRef<number | null>; // 栈顶值（空为 null）
  canPush: ComputedRef<boolean>; // size < STACK_MAX
  canPop: ComputedRef<boolean>; // size > 0
  push: () => number | null; // 压入递增序号，返回压入值；满则返回 null
  pop: () => number | null; // 弹出并返回原栈顶值（空返回 null）
  peek: () => number | null; // 返回栈顶值，不改变
  reset: () => void; // 清空、seq 归零
}

export function useStack(): UseStack {
  const items = ref<[string, number][]>([]);
  let seq = 0; // 递增序号（push 的值）
  let idn = 0; // 稳定 id 计数（驱动 TransitionGroup）

  const top = computed(() => (items.value.length ? items.value[items.value.length - 1][1] : null));
  const canPush = computed(() => items.value.length < STACK_MAX);
  const canPop = computed(() => items.value.length > 0);

  const push = (): number | null => {
    if (!canPush.value) return null;
    const v = ++seq;
    items.value.push([`s${idn++}`, v]);
    return v;
  };
  const pop = (): number | null => {
    if (!canPop.value) return null;
    return items.value.pop()![1];
  };
  const peek = (): number | null => top.value;
  const reset = (): void => {
    items.value = [];
    seq = 0;
  };

  return { items, top, canPush, canPop, push, pop, peek, reset };
}
