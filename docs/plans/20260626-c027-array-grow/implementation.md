# 实现：数组·扩容（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260626-027
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useGrow` → `T2 ArrayGrowViz` → `T3 数组页加节` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。ArrayViz / useArray / 骨架复用、零改动。

---

## T1 — `useGrow.ts` 翻倍扩容 + 均摊统计（L3，先写测试）

**先写失败测试** `src/components/structures/useGrow.spec.ts`（`TC-GROW-LOGIC-*`，10 条，见 test-cases.md）。

**实现** `src/components/structures/useGrow.ts`（见 design §2）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

export const GROW_INIT_CAP = 4;

export interface AppendResult {
  value: number;
  grew: boolean;
  copies: number;
  capacity: number;
}
export interface UseGrow {
  items: Ref<[string, number][]>;
  capacity: Ref<number>;
  length: ComputedRef<number>;
  appends: Ref<number>;
  totalCopies: Ref<number>;
  amortized: ComputedRef<number>;
  append: () => AppendResult;
  reset: () => void;
}

const INITIAL = [1, 2, 3];

export function useGrow(): UseGrow {
  let seq = INITIAL.length;
  let idn = 0;
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
      copies = items.value.length; // 把旧元素全部拷过去 O(n)
      grew = true;
    }
    items.value.push([`g${idn++}`, v]);
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
```

**验证**：`pnpm test:unit run src/components/structures/useGrow.spec.ts`。

---

## T2 — `ArrayGrowViz.vue` 扩容互动（L4，先写测试）

**先写失败测试** `src/components/structures/ArrayGrowViz.spec.ts`（`TC-VIZ-GROWVIZ-*`，8 条，见 test-cases.md）。`btn` 用稳定子串（追加/重置）；同步断言 gcell/filled 数与 status/stats 文本（append 同步、无计时器锁，多击直接生效）。

**实现** `src/components/structures/ArrayGrowViz.vue`（见 design §3；用 `useGrow` + 定容格阵）。骨架：

```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useGrow } from './useGrow';

const g = useGrow();
const status = ref('容量满了会怎样？一直点「追加」看看。');
const copying = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const onAppend = () => {
  const r = g.append(); // 同步改 items/capacity/计数
  if (r.grew) {
    status.value = `容量满了！开一个 2 倍的新数组（容量 ${r.capacity}），把 ${r.copies} 个元素逐个拷过去（O(n)），再放入 ${r.value}。这次贵，但很少发生。`;
    copying.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copying.value = false), 700);
  } else {
    status.value = `还有空位：直接把 ${r.value} 放到末尾，O(1)。`;
  }
};
const onReset = () => {
  clearTimeout(timer);
  copying.value = false;
  g.reset();
  status.value = '已重置 · 一直点「追加」，看容量满了怎么翻倍。';
};
onUnmounted(() => clearTimeout(timer));
</script>

<template>
  <div class="array-grow-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" @click="onAppend">追加 append</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <div
          v-for="i in g.capacity.value"
          :key="i - 1"
          class="gcell"
          :class="{ filled: i - 1 < g.length.value, copying: copying && i - 1 < g.length.value }"
        >
          {{ i - 1 < g.length.value ? g.items.value[i - 1][1] : '' }}
        </div>
      </div>
    </div>
    <p class="readout">
      长度 <b>{{ g.length.value }}</b> / 容量
      <b :class="{ full: g.length.value === g.capacity.value }">{{ g.capacity.value }}</b>
    </p>
    <p class="stats">
      append <b>{{ g.appends.value }}</b> 次 · 总拷贝 <b>{{ g.totalCopies.value }}</b> · 均摊
      <b class="amort">{{ g.amortized.value.toFixed(1) }}</b> 次/append（≈ O(1)）
    </p>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 定容格阵 .gcell(filled 浅绿/预留虚框/copying 黄) + 长度/容量读数(满橙) + 均摊 stats + status；取 ArrayViz 格子样式；格阵随容量横向扩展不错乱 */
</style>
```

注：`append` 同步改 items/capacity/计数 + 同步置 status（L4 同步断言）；拷贝高亮延时（卸载清理）。**验证**：`pnpm test:unit run src/components/structures/ArrayGrowViz.spec.ts`。

---

## T3 — `Array.vue` 加节（L4，先写测试）

**先写失败测试**：在 `src/views/Article/DataStructure/Array.spec.ts` **追加** `TC-VIEW-ARRAY-03`（不改 01/02）：

```ts
import ArrayGrowViz from '@/components/structures/ArrayGrowViz.vue';
// …
it('TC-VIEW-ARRAY-03 数组页含 ArrayGrowViz（扩容节）', () => {
  const w = mountIt();
  expect(w.findComponent(ArrayGrowViz).exists()).toBe(true);
});
```

**实现**：在 `Array.vue` 下标搬移正文 `</p>` 后、`<h2>数组在哪里用</h2>` 前插入「动态数组：容量满了怎么办——翻倍扩容」节（见 design §4），import `ArrayGrowViz`。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Array.spec.ts`（3 Case 全绿）。

---

## T4 — e2e（L5，Playwright）

在 `e2e/array.e2e.ts` **追加** `TC-E2E-ARRAY-02`（导航 `/docs/array`、限定 `.array-grow-viz`）：初始 4 `.gcell`、3 `.gcell.filled`；连点「追加」到触发扩容 → `.gcell` 变 8、`.status` 含「扩容」；重置 → 回 4 `.gcell`。**并修一处回归**：`TC-E2E-ARRAY-01` 第 10 行 `page.locator('.playground')`（两个 Playground 后命中 2 个、严格模式）→ `.first()`。**验证**：`pnpm exec playwright test e2e/array.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（D5 出池/完成、**M4 深度收官**），提交 main。

## 自测报告（实现期回填）

- [x] T1 useGrow 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；append 未满/扩容两分支、翻倍 4→8→16、appends/totalCopies 累计、amortized 公式 + 有界（20 次 ≤3）、value ++seq、reset，一次通过
- [x] T2 ArrayGrowViz 全绿（8 Case）— append 同步改 items/capacity/计数 + 同步置 status（L4 同步断言、多击直接生效）、扩容/未满两分支、均摊 stats、reset 中断拷贝高亮；初稿 status 未含术语「扩容」→ 改解说「触发扩容——…」（更准）
- [x] T3 数组页 TC-VIEW-ARRAY-03 绿（Array.spec 3 Case 全绿、01/02 不回归）
- [x] T4 e2e 全绿（TC-E2E-ARRAY-01 修 `.first()` + 新增 TC-E2E-ARRAY-02）— 真机另验（dev server 截图）：扩容后 5 已用 + 3 预留 = 容量 8、长度 5/容量 8、均摊 3.0（≈O(1)）、扩容解说齐全
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（Array.vue/ArrayGrowViz 经 prettier --write）/ coverage All files 92.6%/89.48%/93.34%/93.8%（聚合过门槛）
- [x] 单测 621 passed（91 文件，含新增 18 单测 Case）+ e2e 23 passed（含新增 1）；ArrayViz/useArray + 8 排序 + 其余结构 + 播放器 零回归；**M4 深度 D5 完成、深度 D1–D5 收官**
