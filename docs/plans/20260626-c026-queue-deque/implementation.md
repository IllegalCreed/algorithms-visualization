# 实现：队列·双端（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260626-026
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useDeque` → `T2 DequeViz` → `T3 队列页加节` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。QueueViz / useQueue / 骨架复用、零改动。

---

## T1 — `useDeque.ts` 四向 push/pop（L3，先写测试）

**先写失败测试** `src/components/structures/useDeque.spec.ts`（`TC-DEQUE-LOGIC-*`，10 条，见 test-cases.md）。

**实现** `src/components/structures/useDeque.ts`（见 design §2）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

export const DEQUE_MAX = 6;

export interface UseDeque {
  items: Ref<[string, number][]>;
  size: ComputedRef<number>;
  isEmpty: ComputedRef<boolean>;
  isFull: ComputedRef<boolean>;
  front: ComputedRef<number | null>;
  back: ComputedRef<number | null>;
  pushFront: () => number | null;
  pushBack: () => number | null;
  popFront: () => number | null;
  popBack: () => number | null;
  reset: () => void;
}

const INITIAL = [1, 2, 3];

export function useDeque(): UseDeque {
  let seq = INITIAL.length;
  let idn = 0;
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
    items.value.unshift([`dq${idn++}`, v]);
    return v;
  };
  const pushBack = (): number | null => {
    if (isFull.value) return null;
    const v = ++seq;
    items.value.push([`dq${idn++}`, v]);
    return v;
  };
  const popFront = (): number | null => (isEmpty.value ? null : items.value.shift()![1]);
  const popBack = (): number | null => (isEmpty.value ? null : items.value.pop()![1]);
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
```

**验证**：`pnpm test:unit run src/components/structures/useDeque.spec.ts`。

---

## T2 — `DequeViz.vue` 四向进出互动（L4，先写测试）

**先写失败测试** `src/components/structures/DequeViz.spec.ts`（`TC-VIZ-DEQUEVIZ-*`，8 条，见 test-cases.md）。mount 时 stub `transition-group`；`btn` 用稳定子串（头部入/尾部入/头部出/尾部出/重置）；同步断言 dqitem 数与 status 文本（deque 操作同步、无计时器，多击直接生效）。

**实现** `src/components/structures/DequeViz.vue`（见 design §3；用 `useDeque` + 横向车道）。骨架：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDeque } from './useDeque';

const d = useDeque();
const status = ref('双端队列：头、尾两端都能进出。点四个方向试试。');

const onPushFront = () => {
  const v = d.pushFront();
  if (v !== null) status.value = `头部入：${v} 加到队头`;
};
const onPushBack = () => {
  const v = d.pushBack();
  if (v !== null) status.value = `尾部入：${v} 加到队尾`;
};
const onPopFront = () => {
  const v = d.popFront();
  if (v !== null) status.value = `头部出：队头 ${v} 离开`;
};
const onPopBack = () => {
  const v = d.popBack();
  if (v !== null) status.value = `尾部出：队尾 ${v} 离开`;
};
const onReset = () => {
  d.reset();
  status.value = '已重置 · 头、尾两端都能进出。点四个方向试试。';
};
</script>

<template>
  <div class="deque-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="d.isFull.value" @click="onPushFront">头部入</button>
      <button class="btn" :disabled="d.isFull.value" @click="onPushBack">尾部入</button>
      <button class="btn" :disabled="d.isEmpty.value" @click="onPopFront">头部出</button>
      <button class="btn" :disabled="d.isEmpty.value" @click="onPopBack">尾部出</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <span v-if="!d.items.value.length" class="empty-hint">双端队列为空</span>
        <TransitionGroup name="deque" tag="div" class="lane-inner">
          <div
            v-for="(it, i) in d.items.value"
            :key="it[0]"
            class="dqitem"
            :class="{ 'is-front': i === 0, 'is-back': i === d.items.value.length - 1 }"
          >
            <div class="plate">{{ it[1] }}</div>
            <!-- 头/尾标记挂元素、跟着走 -->
            <div class="markers">
              <div class="dm dm-front">↑ 队头</div>
              <div class="dm dm-back">↑ 队尾</div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 横向车道 + .dqitem(idle 浅绿/is-front 深绿) + 头/尾标记(is-front/is-back 跟随) + 中性纵向进出 TransitionGroup + FLIP；定宽定高、空 empty-hint；取 QueueViz 样式 */
</style>
```

注：四个操作同步改 items + 同步置 status（L4 同步断言、多击直接生效）；元素进出由 TransitionGroup（cosmetic）。**验证**：`pnpm test:unit run src/components/structures/DequeViz.spec.ts`。

---

## T3 — `Queue.vue` 加节（L4，先写测试）

**先写失败测试**：在 `src/views/Article/DataStructure/Queue.spec.ts` **追加** `TC-VIEW-QUEUE-03`（不改 01/02）：

```ts
import DequeViz from '@/components/structures/DequeViz.vue';
// …
it('TC-VIEW-QUEUE-03 队列页含 DequeViz（双端队列节）', () => {
  const w = mountIt();
  expect(w.findComponent(DequeViz).exists()).toBe(true);
});
```

**实现**：在 `Queue.vue` FIFO 对比正文 `</p>` 后、`<h2>队列在哪里用</h2>` 前插入「双端队列 Deque：两端都能进出」节（见 design §4），import `DequeViz`。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Queue.spec.ts`（3 Case 全绿）。

---

## T4 — e2e（L5，Playwright）

在 `e2e/queue.e2e.ts` **追加** `TC-E2E-QUEUE-02`（导航 `/docs/queue`、限定 `.deque-viz`）：初始 3 `.dqitem`；点「头部入」→ 4 `.dqitem`；点「尾部出」→ 3 `.dqitem`；重置 → 回 3 `.dqitem`。**并修一处回归**：`TC-E2E-QUEUE-01` 第 10 行 `page.locator('.playground')`（两个 Playground 后命中 2 个、严格模式）→ `.first()`。**验证**：`pnpm exec playwright test e2e/queue.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（D4 出池/完成），提交 main。

## 自测报告（实现期回填）

- [x] T1 useDeque 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；pushFront/pushBack/popFront/popBack 的满空分支、front/back/size、reset、栈=尾进尾出/队列=尾进头出 概念，一次通过
- [x] T2 DequeViz 全绿（8 Case）— 四操作同步改 items + 同步置 status（L4 同步断言、多击直接生效，无计时器）、空满禁用；初稿 TC-05/06 误写出队后剩 3（实为 2）→ 修测试断言（先红暴露算术错、实现正确）
- [x] T3 队列页 TC-VIEW-QUEUE-03 绿（Queue.spec 3 Case 全绿、01/02 不回归）
- [x] T4 e2e 全绿（TC-E2E-QUEUE-01 修 `.first()` + 新增 TC-E2E-QUEUE-02）— 真机另验（dev server 截图）：5 按钮工具栏、[1,2,3] 首项深绿 is-front、队头/队尾标记各就位；**修两处 e2e**：① 第二个 Playground 后 `.playground` 命中 2 个→ `.first()`；② 头/尾标记每元素都有（仅端元素 display:block），断言限定 `.is-front .dm-front`/`.is-back .dm-back` 到可见的那个
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（Queue.vue/useDeque.ts 经 prettier --write）/ coverage All files 92.49%/89.28%/93.56%/93.62%（聚合过门槛）
- [x] 单测 602 passed（89 文件，含新增 18 单测 Case）+ e2e 22 passed（含新增 1）；QueueViz/useQueue + 8 排序 + 其余结构 + 播放器 零回归；**M4 深度 D4 完成**
