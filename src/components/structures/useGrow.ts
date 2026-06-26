import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 动态数组初始容量 */
export const GROW_INIT_CAP = 4;

export interface AppendResult {
  value: number;
  grew: boolean; // 是否触发扩容
  copies: number; // 本次扩容拷贝的元素数（grew 时 = 旧 length，否则 0）
  capacity: number; // 操作后容量
}
export interface UseGrow {
  items: Ref<[string, number][]>; // 已用元素
  capacity: Ref<number>; // 当前容量
  length: ComputedRef<number>;
  appends: Ref<number>; // 累计 append 次数
  totalCopies: Ref<number>; // 累计拷贝次数
  amortized: ComputedRef<number>; // (appends + totalCopies) / appends，append 0 时 0
  append: () => AppendResult;
  reset: () => void;
}

/** 初始预填：长度 3、容量 4——留 1 空位先演 O(1) 直放、再演满了扩容 */
const INITIAL = [1, 2, 3];

export function useGrow(): UseGrow {
  let seq = INITIAL.length; // 下一个 append 值 = ++seq（= 4）
  let idn = 0; // 稳定 id 计数
  const make = (): [string, number][] => INITIAL.map((v) => [`g${idn++}`, v]);
  const items = ref<[string, number][]>(make());
  const capacity = ref(GROW_INIT_CAP);
  const appends = ref(0);
  const totalCopies = ref(0);

  const length = computed(() => items.value.length);
  const amortized = computed(() =>
    appends.value === 0 ? 0 : (appends.value + totalCopies.value) / appends.value,
  );

  const append = (): AppendResult => {
    const v = ++seq;
    let grew = false;
    let copies = 0;
    if (items.value.length === capacity.value) {
      capacity.value *= 2; // 满了：开 2 倍新数组
      copies = items.value.length; // 把旧元素全部拷过去，O(n)
      grew = true;
    }
    items.value.push([`g${idn++}`, v]); // 放入新元素
    appends.value += 1;
    totalCopies.value += copies;
    return { value: v, grew, copies, capacity: capacity.value };
  };
  const reset = (): void => {
    seq = INITIAL.length;
    items.value = make();
    capacity.value = GROW_INIT_CAP;
    appends.value = 0;
    totalCopies.value = 0;
  };

  return { items, capacity, length, appends, totalCopies, amortized, append, reset };
}
