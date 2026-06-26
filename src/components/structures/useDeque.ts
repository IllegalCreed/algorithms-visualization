import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示双端队列的最大容量（满时禁止入队，避免溢出车道） */
export const DEQUE_MAX = 6;

export interface UseDeque {
  items: Ref<[string, number][]>; // [稳定id, 值]；index 0 = 队头 front、末位 = 队尾 back
  size: ComputedRef<number>;
  isEmpty: ComputedRef<boolean>;
  isFull: ComputedRef<boolean>;
  front: ComputedRef<number | null>;
  back: ComputedRef<number | null>;
  pushFront: () => number | null; // 队头入 ++seq；满返回 null
  pushBack: () => number | null; // 队尾入 ++seq；满返回 null
  popFront: () => number | null; // 队头出，返回值；空返回 null
  popBack: () => number | null; // 队尾出，返回值；空返回 null
  reset: () => void;
}

/** 初始预填：让双端队列一上来就有元素可从两端出 */
const INITIAL = [1, 2, 3];

export function useDeque(): UseDeque {
  let seq = INITIAL.length; // 下一个值 = ++seq（= 4）
  let idn = 0; // 稳定 id 计数（驱动 TransitionGroup）
  const make = (): [string, number][] => INITIAL.map((v) => [`dq${idn++}`, v]);
  const items = ref<[string, number][]>(make());

  const size = computed(() => items.value.length);
  const isEmpty = computed(() => items.value.length === 0);
  const isFull = computed(() => items.value.length >= DEQUE_MAX);
  const front = computed(() => (items.value.length ? items.value[0][1] : null));
  const back = computed(() => (items.value.length ? items.value[items.value.length - 1][1] : null));

  const pushFront = (): number | null => {
    if (isFull.value) return null;
    const v = ++seq;
    items.value.unshift([`dq${idn++}`, v]); // 队头入
    return v;
  };
  const pushBack = (): number | null => {
    if (isFull.value) return null;
    const v = ++seq;
    items.value.push([`dq${idn++}`, v]); // 队尾入
    return v;
  };
  const popFront = (): number | null => (isEmpty.value ? null : items.value.shift()![1]); // 队头出
  const popBack = (): number | null => (isEmpty.value ? null : items.value.pop()![1]); // 队尾出
  const reset = (): void => {
    seq = INITIAL.length;
    items.value = make();
  };

  return {
    items,
    size,
    isEmpty,
    isFull,
    front,
    back,
    pushFront,
    pushBack,
    popFront,
    popBack,
    reset,
  };
}
