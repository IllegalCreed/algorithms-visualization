# 实现：堆 Heap 知识页（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260625-020
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useHeap` → `T2 HeapViz` → `T3 堆页` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。骨架 / TreeView / 堆排序复用、零改动。

---

## T1 — `useHeap.ts` 大顶堆逻辑（L3，先写测试）

**先写失败测试** `src/components/structures/useHeap.spec.ts`（`TC-HEAPDS-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useHeap, HEAP_MAX } from './useHeap';

const vals = (h: ReturnType<typeof useHeap>) => h.items.value.map((t) => t[1]);
const isMaxHeap = (a: number[]) => {
  for (let i = 0; i < a.length; i++) {
    if (2 * i + 1 < a.length && a[i] < a[2 * i + 1]) return false;
    if (2 * i + 2 < a.length && a[i] < a[2 * i + 2]) return false;
  }
  return true;
};
const fullInsert = (h: ReturnType<typeof useHeap>, v: number) => {
  let i = h.insert(v);
  if (i === null) return;
  while ((i = h.siftUpStep(i)) >= 0);
};
const fullExtract = (h: ReturnType<typeof useHeap>) => {
  const m = h.extractRoot();
  let i = 0;
  while ((i = h.siftDownStep(i)) >= 0);
  return m;
};

describe('useHeap', () => {
  it('TC-HEAPDS-LOGIC-01 初始大顶堆 [90,70,80,40,60,30,50]、peek 90、边界', () => {
    const h = useHeap();
    expect(vals(h)).toEqual([90, 70, 80, 40, 60, 30, 50]);
    expect(h.peek()).toBe(90);
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.canInsert.value).toBe(true);
    expect(h.canExtract.value).toBe(true);
  });
  it('TC-HEAPDS-LOGIC-02 insert 末尾追加（不 sift）、返回新下标', () => {
    const h = useHeap();
    expect(h.insert(95)).toBe(7);
    expect(h.items.value[7][1]).toBe(95);
    expect(h.items.value).toHaveLength(8);
  });
  it('TC-HEAPDS-LOGIC-03 siftUpStep 单步上浮', () => {
    const h = useHeap();
    h.insert(95); // idx7、父 idx3=40
    expect(h.siftUpStep(7)).toBe(3);
    expect(h.items.value[3][1]).toBe(95);
    expect(h.siftUpStep(0)).toBe(-1);
  });
  it('TC-HEAPDS-LOGIC-04 完整插入后仍是大顶堆、root 为最大', () => {
    const h = useHeap();
    fullInsert(h, 95);
    expect(h.peek()).toBe(95);
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.items.value).toHaveLength(8);
  });
  it('TC-HEAPDS-LOGIC-05 extractRoot 取根（最大）、末位补根', () => {
    const h = useHeap();
    expect(h.extractRoot()).toBe(90);
    expect(h.items.value[0][1]).toBe(50);
    expect(h.items.value).toHaveLength(6);
  });
  it('TC-HEAPDS-LOGIC-06 完整弹出后仍是大顶堆、返回最大、新堆顶', () => {
    const h = useHeap();
    expect(fullExtract(h)).toBe(90);
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.peek()).toBe(80);
    expect(h.items.value).toHaveLength(6);
  });
  it('TC-HEAPDS-LOGIC-07 siftDownStep 单步下沉', () => {
    const h = useHeap();
    h.extractRoot(); // [50,70,80,40,60,30]，根 50 待下沉
    expect(h.siftDownStep(0)).toBe(2);
    expect(h.items.value[0][1]).toBe(80);
  });
  it('TC-HEAPDS-LOGIC-08 不变量：连续插入/弹出后仍大顶堆、peek=max', () => {
    const h = useHeap();
    [95, 10, 88, 45, 99].forEach((v) => fullInsert(h, v));
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.peek()).toBe(Math.max(...vals(h)));
    fullExtract(h);
    fullExtract(h);
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.peek()).toBe(Math.max(...vals(h)));
  });
  it('TC-HEAPDS-LOGIC-09 边界：满 15 insert null；空 extractRoot/peek null；id 唯一', () => {
    const h = useHeap();
    while (h.items.value.length < HEAP_MAX) h.insert(h.items.value.length);
    expect(h.canInsert.value).toBe(false);
    expect(h.insert(1)).toBe(null);
    const ids = h.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
    const e = useHeap();
    while (e.items.value.length) e.extractRoot();
    expect(e.canExtract.value).toBe(false);
    expect(e.extractRoot()).toBe(null);
    expect(e.peek()).toBe(null);
  });
  it('TC-HEAPDS-LOGIC-10 reset 复位初始堆', () => {
    const h = useHeap();
    fullInsert(h, 99);
    fullExtract(h);
    h.reset();
    expect(vals(h)).toEqual([90, 70, 80, 40, 60, 30, 50]);
  });
});
```

**实现** `src/components/structures/useHeap.ts`（见 design §2）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 演示堆的最大节点数（满 15 = 完全二叉树 4 层；禁止再插入） */
export const HEAP_MAX = 15;

export interface UseHeap {
  items: Ref<[string, number][]>; // [稳定id, 值]；index = 完全二叉树 pos；大顶堆
  canInsert: ComputedRef<boolean>;
  canExtract: ComputedRef<boolean>;
  peek: () => number | null;
  insert: (value: number) => number | null; // 末尾追加（不 sift），返回新下标
  siftUpStep: (i: number) => number; // 一步上浮：交换并返回 parent；否则 -1
  extractRoot: () => number | null; // 取根、末位补根，返回最大
  siftDownStep: (i: number) => number; // 一步下沉：与较大孩子交换并返回其下标；否则 -1
  reset: () => void;
}

const INITIAL = [90, 70, 80, 40, 60, 30, 50];

export function useHeap(): UseHeap {
  let idn = 0;
  const items = ref<[string, number][]>([]);
  const make = (): [string, number][] => INITIAL.map((v) => [`h${idn++}`, v]);

  const canInsert = computed(() => items.value.length < HEAP_MAX);
  const canExtract = computed(() => items.value.length > 0);
  const peek = (): number | null => (items.value.length ? items.value[0][1] : null);

  const insert = (value: number): number | null => {
    if (items.value.length >= HEAP_MAX) return null;
    items.value.push([`h${idn++}`, value]);
    return items.value.length - 1;
  };
  const siftUpStep = (i: number): number => {
    if (i <= 0) return -1;
    const p = (i - 1) >> 1;
    if (items.value[i][1] > items.value[p][1]) {
      [items.value[i], items.value[p]] = [items.value[p], items.value[i]];
      return p;
    }
    return -1;
  };
  const extractRoot = (): number | null => {
    if (!items.value.length) return null;
    const max = items.value[0][1];
    const last = items.value.pop()!;
    if (items.value.length) items.value[0] = last;
    return max;
  };
  const siftDownStep = (i: number): number => {
    const n = items.value.length;
    let big = i;
    if (2 * i + 1 < n && items.value[2 * i + 1][1] > items.value[big][1]) big = 2 * i + 1;
    if (2 * i + 2 < n && items.value[2 * i + 2][1] > items.value[big][1]) big = 2 * i + 2;
    if (big !== i) {
      [items.value[i], items.value[big]] = [items.value[big], items.value[i]];
      return big;
    }
    return -1;
  };
  const reset = (): void => {
    items.value = make();
  };

  reset();
  return {
    items,
    canInsert,
    canExtract,
    peek,
    insert,
    siftUpStep,
    extractRoot,
    siftDownStep,
    reset,
  };
}
```

**验证**：`pnpm test:unit run src/components/structures/useHeap.spec.ts`。

---

## T2 — `HeapViz.vue` 堆互动组件（L4，先写测试）

**先写失败测试** `src/components/structures/HeapViz.spec.ts`（`TC-VIZ-HEAPVIZ-*`；数组用 TransitionGroup stub 即时、树绝对定位）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HeapViz from './HeapViz.vue';

const mountIt = () =>
  mount(HeapViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setVal = (w: ReturnType<typeof mountIt>, v: number | string) =>
  w.find('.val-input').setValue(String(v));

describe('HeapViz', () => {
  it('TC-VIZ-HEAPVIZ-01 初始 7 格 + 7 节点 + 6 边 + 输入框 + 3 按钮', () => {
    const w = mountIt();
    expect(w.findAll('.cell')).toHaveLength(7);
    expect(w.findAll('.node')).toHaveLength(7);
    expect(w.findAll('.edge')).toHaveLength(6);
    expect(w.find('.val-input').exists()).toBe(true);
    expect(btn(w, '插入')).toBeTruthy();
    expect(btn(w, '弹出')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });
  it('TC-VIZ-HEAPVIZ-02 insert 双视图各 +1', async () => {
    const w = mountIt();
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(8);
    expect(w.findAll('.node')).toHaveLength(8);
  });
  it('TC-VIZ-HEAPVIZ-03 insert 出现新值 95', async () => {
    const w = mountIt();
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.cell').some((c) => c.text() === '95')).toBe(true);
    expect(w.findAll('.node').some((n) => n.text() === '95')).toBe(true);
  });
  it('TC-VIZ-HEAPVIZ-04 extract 双视图各 -1', async () => {
    const w = mountIt();
    await btn(w, '弹出').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(6);
    expect(w.findAll('.node')).toHaveLength(6);
  });
  it('TC-VIZ-HEAPVIZ-05 extract 解说弹出 + 最大值 90', async () => {
    const w = mountIt();
    await btn(w, '弹出').trigger('click');
    expect(w.find('.status').text()).toContain('弹出');
    expect(w.find('.status').text()).toContain('90');
  });
  it('TC-VIZ-HEAPVIZ-06 双视图同步：格数 == 节点数', async () => {
    const w = mountIt();
    expect(w.findAll('.cell').length).toBe(w.findAll('.node').length);
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.cell').length).toBe(w.findAll('.node').length);
  });
  it('TC-VIZ-HEAPVIZ-07 边数 = 节点数 - 1', async () => {
    const w = mountIt();
    expect(w.findAll('.edge')).toHaveLength(6);
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.edge')).toHaveLength(7);
  });
  it('TC-VIZ-HEAPVIZ-08 非法值提示、不增', async () => {
    const w = mountIt();
    await setVal(w, 0);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('请输入');
    expect(w.findAll('.cell')).toHaveLength(7);
  });
  it('TC-VIZ-HEAPVIZ-09 reset 复位 7 格', async () => {
    const w = mountIt();
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(7);
  });
  it('TC-VIZ-HEAPVIZ-10 insert 解说含「上浮」', async () => {
    const w = mountIt();
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('上浮');
  });
});
```

**实现** `src/components/structures/HeapViz.vue`（见 design §3；数组轨借 ArrayViz 范式、树轨借 TreeViz 定位；分步用步进式 useHeap + 延时）。骨架：

```vue
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useHeap } from './useHeap';

const LEVEL_H = 64;
const h = useHeap();
const val = ref(95);
const status = ref('输入一个数，点「插入」，看它从数组末尾上浮到位。');
const cmp = ref<number[]>([]); // 比较交换中的 pos（黄）
const hot = ref(-1); // 到位 / 堆顶（深绿）
const enterId = ref<string | null>(null);
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};

const depthOf = (i: number) => Math.floor(Math.log2(i + 1));
const xPctOf = (i: number) => {
  const d = depthOf(i);
  return ((i - (2 ** d - 1) + 0.5) / 2 ** d) * 100;
};
const topOf = (i: number) => depthOf(i) * LEVEL_H + 6;
const laid = computed(() =>
  h.items.value.map((it, i) => ({ id: it[0], val: it[1], i, xPct: xPctOf(i), top: topOf(i) })),
);
const edges = computed(() =>
  h.items.value
    .map((_, i) => i)
    .filter((i) => i > 0)
    .map((i) => {
      const p = (i - 1) >> 1;
      return { i, x1: xPctOf(i), y1: topOf(i) + 20, x2: xPctOf(p), y2: topOf(p) + 20 };
    }),
);
const validVal = (): number | null => {
  if (!Number.isInteger(val.value) || val.value < 1 || val.value > 99) {
    status.value = '请输入 1–99 的整数。';
    return null;
  }
  return val.value;
};

const onInsert = async () => {
  if (busy.value) return;
  const v = validVal();
  if (v === null) return;
  if (!h.canInsert.value) {
    status.value = '堆满了（演示限 15 个），先弹出或重置。';
    return;
  }
  busy.value = true;
  cmp.value = [];
  hot.value = -1;
  let i = h.insert(v)!; // 末尾追加（同步）
  enterId.value = h.items.value[i][0];
  status.value = `插入 ${v}：先放到数组末尾（最后一个叶子），开始上浮……`;
  await sleep(600);
  enterId.value = null;
  let hops = 0;
  while (i > 0 && h.items.value[i][1] > h.items.value[(i - 1) >> 1][1]) {
    cmp.value = [i, (i - 1) >> 1];
    await sleep(520);
    i = h.siftUpStep(i); // 交换、返回 parent
    cmp.value = [];
    hops++;
    await sleep(340);
  }
  hot.value = i;
  status.value = `插入 ${v}：上浮 ${hops} 次到位，堆顶始终是最大值 ${h.peek()}，O(log n)。`;
  await sleep(700);
  hot.value = -1;
  busy.value = false;
};
const onExtract = async () => {
  if (busy.value || !h.canExtract.value) return;
  busy.value = true;
  cmp.value = [];
  const max = h.extractRoot(); // 取根、末位补根（同步）
  status.value = `弹出堆顶 ${max}（最大值）：末尾元素补到根，开始下沉……`;
  if (!h.items.value.length) {
    busy.value = false;
    return;
  }
  hot.value = 0;
  await sleep(560);
  hot.value = -1;
  let i = 0;
  let hops = 0;
  while (true) {
    const n = h.items.value.length;
    let big = i;
    if (2 * i + 1 < n && h.items.value[2 * i + 1][1] > h.items.value[big][1]) big = 2 * i + 1;
    if (2 * i + 2 < n && h.items.value[2 * i + 2][1] > h.items.value[big][1]) big = 2 * i + 2;
    if (big === i) break;
    cmp.value = [i, big];
    await sleep(520);
    i = h.siftDownStep(i);
    cmp.value = [];
    hops++;
    await sleep(340);
  }
  status.value = `弹出堆顶 ${max}：末位补根后下沉 ${hops} 次归位，新堆顶 ${h.peek()}，O(log n)。`;
  busy.value = false;
};
const onReset = () => {
  clearTimers(); // 重置可随时中断进行中的上浮/下沉动画
  busy.value = false;
  cmp.value = [];
  hot.value = -1;
  enterId.value = null;
  h.reset();
  status.value = '已重置 · 输入一个数，点「插入」看它上浮。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="heap-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="val" type="number" min="1" max="99" />
      <button class="btn" :disabled="busy" @click="onInsert">插入</button>
      <button class="btn" :disabled="busy || !h.canExtract.value" @click="onExtract">
        弹出堆顶
      </button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <div class="row-label">数组</div>
        <div class="arr">
          <TransitionGroup name="cellmv" tag="div" class="cells">
            <div
              v-for="(it, i) in h.items.value"
              :key="it[0]"
              class="cell"
              :class="{ cmp: cmp.includes(i), hot: hot === i }"
              :data-i="i"
            >
              {{ it[1] }}
            </div>
          </TransitionGroup>
          <div class="indices">
            <div v-for="(it, i) in h.items.value" :key="i" class="idx">{{ i }}</div>
          </div>
        </div>
        <div class="row-label">树（同一个堆）</div>
        <div class="tree">
          <svg class="edges" width="524" height="280">
            <line
              v-for="e in edges"
              :key="e.i"
              class="edge"
              :x1="e.x1 + '%'"
              :y1="e.y1"
              :x2="e.x2 + '%'"
              :y2="e.y2"
            />
          </svg>
          <span v-if="!h.items.value.length" class="empty-hint">堆为空</span>
          <div
            v-for="nd in laid"
            :key="nd.id"
            class="node"
            :class="{ cmp: cmp.includes(nd.i), hot: hot === nd.i, enter: nd.id === enterId }"
            :data-i="nd.i"
            :style="{ left: nd.xPct + '%', top: nd.top + 'px' }"
          >
            {{ nd.val }}
          </div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 数组轨：cells flex(TransitionGroup move FLIP) + 固定下标行；树轨：节点绝对定位过渡 left/top + SVG 边；
   cmp 黄 / hot 深绿；画布定宽；取原型样式 */
</style>
```

注：数组格与树节点**同 id 同 items**，交换时 FLIP/过渡两视图同步；`insert`/`extractRoot` 同步改数据（L4 可断言数量），sift 分步用延时（卸载清理、busy 防重入）。**验证**：`pnpm test:unit run src/components/structures/HeapViz.spec.ts`。

---

## T3 — `Heap.vue` 堆页（L4，先写测试）

**先写失败测试** `src/views/Article/DataStructure/Heap.spec.ts`（`TC-VIEW-HEAPDS-*`）：

- `-01` 挂载渲染 `Article` + `HeapViz`（`findComponent` 存在）。
- `-02` 含「堆」标题与 `Playground`（`.playground` 存在）。

**实现**：填充 `Heap.vue`（见 design §4 大纲），正文以原型文案为基础。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Heap.spec.ts`。

---

## T4 — e2e（L5，Playwright）

`e2e/heap.e2e.ts`（`TC-E2E-HEAPDS-01`）：导航 `/docs/heap`、见标题「堆」与 `.playground`；限定 `.heap-viz` 内：初始 7 格 + 7 节点；填输入框 `95` 点插入见 8 格 + 8 节点且有文本 `95`；重置回 7 格。（菜单也用 `.btn`，全部限定 `.heap-viz`/`.article`。）**验证**：`pnpm exec playwright test e2e/heap.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 useHeap 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；步进式 siftUpStep/siftDownStep + insert/extractRoot 一次通过，不变量（isMaxHeap/peek=max）验证
- [x] T2 HeapViz 全绿（10 Case）— 中途修正：重置改为**可中断 abort**（清计时器 + 解锁 busy + 复位，按钮常驻），原 `if(busy)return` 在动画中挡住了重置；数组轨 TransitionGroup-FLIP + 树轨过渡 left/top、双视图同 id 同步
- [x] T3 堆页全绿（2 Case）
- [x] T4 e2e 全绿（TC-E2E-HEAPDS-01）— 真机另验（dev server 截图）：数组 `[90,70,80,40,60,30,50]` + 同步树双视图、插入 95 上浮成新堆顶、双视图同步移动；e2e 验证插入双视图各 +1 + 含值 95 + 重置回 7
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（useHeap/Heap 经 prettier --write）/ coverage All files 92.45%/90.09%/91.75%/93.24%（聚合过门槛；HeapViz 动画循环由 e2e 覆盖、单文件偏低）
- [x] 单测 484 passed（75 文件，含新增 22 单测 Case）+ e2e 16 passed（含新增 1）；8 排序（含堆排序 `TC-HEAP-*`）+ 栈 + 队列 + 数组 + 链表 + 树 + 播放器 + TreeView 全部现有 Case 零回归；**骨架 / TreeView / 堆排序零改动**；Case 命名空间 `HEAPDS` 避让成功
