import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示队列的最大容量（满时禁止 enqueue，避免溢出车道） */
export const QUEUE_MAX = 6;

export interface UseQueue {
  items: Ref<[string, number][]>; // [稳定id, 值]；index 0 = 队首，末位 = 队尾；id 驱动 TransitionGroup
  front: ComputedRef<number | null>; // 队首值（最旧；空为 null）
  canEnqueue: ComputedRef<boolean>; // size < QUEUE_MAX
  canDequeue: ComputedRef<boolean>; // size > 0
  enqueue: () => number | null; // 入队尾，返回入队值；满则返回 null
  dequeue: () => number | null; // 出队首，返回原队首值；空返回 null
  peek: () => number | null; // 返回队首值，不改变
  reset: () => void; // 清空、seq 归零
}

export function useQueue(): UseQueue {
  const items = ref<[string, number][]>([]);
  let seq = 0; // 递增序号（enqueue 的值）
  let idn = 0; // 稳定 id 计数（驱动 TransitionGroup）

  const front = computed(() => (items.value.length ? items.value[0][1] : null));
  const canEnqueue = computed(() => items.value.length < QUEUE_MAX);
  const canDequeue = computed(() => items.value.length > 0);

  const enqueue = (): number | null => {
    if (!canEnqueue.value) return null;
    const v = ++seq;
    items.value.push([`q${idn++}`, v]); // 入队尾
    return v;
  };
  const dequeue = (): number | null => {
    if (!canDequeue.value) return null;
    return items.value.shift()![1]; // 出队首
  };
  const peek = (): number | null => front.value;
  const reset = (): void => {
    items.value = [];
    seq = 0;
  };

  return { items, front, canEnqueue, canDequeue, enqueue, dequeue, peek, reset };
}
