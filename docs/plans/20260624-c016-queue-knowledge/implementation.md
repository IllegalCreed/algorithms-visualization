# 实现：队列 Queue 知识页（TDD 任务分解 T1–T4）

> Status: approved
> Stable ID: C-20260624-016
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useQueue` → `T2 QueueViz` → `T3 队列页` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。骨架（`Article`/`Callout`/`Playground`）复用 C-015、零改动、不重测。

---

## T1 — `useQueue.ts` 队列逻辑（L3，先写测试）

**先写失败测试** `src/components/structures/useQueue.spec.ts`（`TC-QUEUE-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useQueue, QUEUE_MAX } from './useQueue';

describe('useQueue', () => {
  it('TC-QUEUE-LOGIC-01 初始空：items 空、front null、canDequeue F、canEnqueue T', () => {
    const q = useQueue();
    expect(q.items.value).toEqual([]);
    expect(q.front.value).toBe(null);
    expect(q.canDequeue.value).toBe(false);
    expect(q.canEnqueue.value).toBe(true);
  });
  it('TC-QUEUE-LOGIC-02 enqueue 追加递增序号、返回值；FIFO 下 front 保持队首不变', () => {
    const q = useQueue();
    expect(q.enqueue()).toBe(1);
    expect(q.front.value).toBe(1);
    expect(q.enqueue()).toBe(2);
    expect(q.items.value.map((t) => t[1])).toEqual([1, 2]);
    expect(q.front.value).toBe(1); // enqueue 不改 front（区别于栈 top）
  });
  it('TC-QUEUE-LOGIC-03 dequeue 删队首返回原队首；空 dequeue 返回 null', () => {
    const q = useQueue();
    q.enqueue();
    q.enqueue();
    expect(q.dequeue()).toBe(1);
    expect(q.items.value.map((t) => t[1])).toEqual([2]);
    expect(q.front.value).toBe(2);
    expect(q.dequeue()).toBe(2);
    expect(q.dequeue()).toBe(null);
  });
  it('TC-QUEUE-LOGIC-04 peek 返回队首但不改变 items', () => {
    const q = useQueue();
    q.enqueue();
    q.enqueue();
    expect(q.peek()).toBe(1);
    expect(q.items.value.length).toBe(2);
  });
  it('TC-QUEUE-LOGIC-05 reset 清空且 seq 归零', () => {
    const q = useQueue();
    q.enqueue();
    q.enqueue();
    q.reset();
    expect(q.items.value).toEqual([]);
    expect(q.enqueue()).toBe(1);
  });
  it('TC-QUEUE-LOGIC-06 canEnqueue 满 QUEUE_MAX 为 false、enqueue 返回 null', () => {
    const q = useQueue();
    for (let i = 0; i < QUEUE_MAX; i++) q.enqueue();
    expect(q.items.value.length).toBe(QUEUE_MAX);
    expect(q.canEnqueue.value).toBe(false);
    expect(q.enqueue()).toBe(null);
    expect(q.items.value.length).toBe(QUEUE_MAX);
  });
  it('TC-QUEUE-LOGIC-07 每个元素 id 唯一', () => {
    const q = useQueue();
    q.enqueue();
    q.enqueue();
    q.enqueue();
    const ids = q.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-QUEUE-LOGIC-08 canDequeue 随空/非空切换', () => {
    const q = useQueue();
    expect(q.canDequeue.value).toBe(false);
    q.enqueue();
    expect(q.canDequeue.value).toBe(true);
    q.dequeue();
    expect(q.canDequeue.value).toBe(false);
  });
});
```

**实现** `src/components/structures/useQueue.ts`（见 design §2，对标 `useStack`）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

export const QUEUE_MAX = 6;

export interface UseQueue {
  items: Ref<[string, number][]>;
  front: ComputedRef<number | null>;
  canEnqueue: ComputedRef<boolean>;
  canDequeue: ComputedRef<boolean>;
  enqueue: () => number | null;
  dequeue: () => number | null;
  peek: () => number | null;
  reset: () => void;
}

export function useQueue(): UseQueue {
  const items = ref<[string, number][]>([]);
  let seq = 0;
  let idn = 0;
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
```

**验证**：`pnpm test:unit run src/components/structures/useQueue.spec.ts`。

---

## T2 — `QueueViz.vue` 队列互动组件（L4，先写测试）

**先写失败测试** `src/components/structures/QueueViz.spec.ts`（`TC-VIZ-QUEUEVIZ-*`，TransitionGroup stub 即时）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import QueueViz from './QueueViz.vue';

const mountIt = () =>
  mount(QueueViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('QueueViz', () => {
  it('TC-VIZ-QUEUEVIZ-01 初始空：队列为空 + dequeue/peek 禁用', () => {
    const w = mountIt();
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(w.findAll('.plate')).toHaveLength(0);
    expect(btn(w, 'dequeue').attributes('disabled')).toBeDefined();
    expect(btn(w, 'peek').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-QUEUEVIZ-02 enqueue 增元素、值为递增序号', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.plate').text()).toBe('1');
  });
  it('TC-VIZ-QUEUEVIZ-03 队首 is-front 落 index0、队尾 is-rear 落末位', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'enqueue').trigger('click');
    const items = w.findAll('.qitem');
    expect(items[0].classes()).toContain('is-front');
    expect(items[items.length - 1].classes()).toContain('is-rear');
    expect(items[0].classes()).not.toContain('is-rear');
  });
  it('TC-VIZ-QUEUEVIZ-04 每个 qitem 含队首/队尾 marker 节点', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'enqueue').trigger('click');
    expect(w.findAll('.qitem .m-front')).toHaveLength(2);
    expect(w.findAll('.qitem .m-rear')).toHaveLength(2);
  });
  it('TC-VIZ-QUEUEVIZ-05 dequeue 移除队首并解说', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'dequeue').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.plate').text()).toBe('2'); // 队首 1 已出，2 成新队首
    expect(w.find('.status').text()).toContain('出队');
  });
  it('TC-VIZ-QUEUEVIZ-06 enqueue 到 6 后 enqueue 禁用', async () => {
    const w = mountIt();
    for (let i = 0; i < 6; i++) await btn(w, 'enqueue').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(6);
    expect(btn(w, 'enqueue').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-QUEUEVIZ-07 重置清空', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
  });
  it('TC-VIZ-QUEUEVIZ-08 peek 解说队首、不取走', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'peek').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.status').text()).toContain('队首');
  });
});
```

**实现** `src/components/structures/QueueViz.vue`（见 design §3；用 `useQueue` + `<TransitionGroup name="queue">`）。骨架：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useQueue } from './useQueue';
const q = useQueue();
const status = ref('点 enqueue 从队尾加入一个元素试试');
const onEnqueue = () => {
  const v = q.enqueue();
  if (v !== null) status.value = `enqueue：${v} 从队尾入队`;
};
const onDequeue = () => {
  const v = q.dequeue();
  if (v !== null) status.value = `dequeue：队首 ${v} 出队`;
};
const onPeek = () => {
  const v = q.peek();
  if (v !== null) status.value = `peek：队首是 ${v}（只看，不拿走）`;
};
const onReset = () => {
  q.reset();
  status.value = '已重置 · 点 enqueue 从队尾加入一个元素试试';
};
</script>
<template>
  <div class="queue-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="!q.canEnqueue.value" @click="onEnqueue">enqueue 入队</button>
      <button class="btn" :disabled="!q.canDequeue.value" @click="onDequeue">dequeue 出队</button>
      <button class="btn" :disabled="!q.canDequeue.value" @click="onPeek">peek 看队首</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <span v-if="!q.items.value.length" class="empty-hint">队列为空</span>
        <TransitionGroup name="queue" tag="div" class="lane-inner">
          <div
            v-for="(it, i) in q.items.value"
            :key="it[0]"
            class="qitem"
            :class="{ 'is-front': i === 0, 'is-rear': i === q.items.value.length - 1 }"
          >
            <div class="plate">{{ it[1] }}</div>
            <div class="markers">
              <div class="m m-front">↑ 队首</div>
              <div class="m m-rear">↑ 队尾</div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>
<style scoped lang="less">
/* 车道定宽 472、flex-row 左对齐、队首深绿、marker 绝对定位盘下、enter 右/leave 左；取原型样式 */
</style>
```

注：`.lane-inner` 承载 TransitionGroup（flex-row）。两条硬约束见 design §3.1。**验证**：`pnpm test:unit run src/components/structures/QueueViz.spec.ts`。

---

## T3 — `Queue.vue` 队列页（L4，先写测试）

**先写失败测试** `src/views/Article/DataStructure/Queue.spec.ts`（`TC-VIEW-QUEUE-*`）：

- `-01` 挂载渲染 `Article` + `QueueViz`（`findComponent` 存在）。
- `-02` 含「队列」标题与 `Playground`（`.playground` 存在）。

**实现**：填充 `Queue.vue`（见 design §4 大纲；`<Article>` 套正文 + `<Playground><QueueViz/></Playground>` + `<Callout>`），正文以原型文案为基础。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Queue.spec.ts`。

---

## T4 — e2e（L5，Playwright）

`e2e/queue.e2e.ts`（`TC-E2E-QUEUE-01`）：导航 `/docs/queue`、见标题「队列」与 `.playground`；限定 `.queue-viz` 内：enqueue×3 见 3 元素、队首 `.qitem` 首个 `is-front` 深绿且 plate=1、末个 `is-rear`；dequeue 减到 2 且新队首 plate=2、status 含「出队」；重置回空态见「队列为空」。（菜单也用 `.btn`/`.item`，全部限定 `.queue-viz`/`.article`。）**验证**：`pnpm exec playwright test e2e/queue.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 useQueue 全绿（8 Case）
- [x] T2 QueueViz 全绿（8 Case）
- [x] T3 队列页全绿（2 Case）
- [x] T4 e2e 全绿（TC-E2E-QUEUE-01）— 真机另验：横向车道 + 队首/队尾双指针；e2e 限定 .queue-viz/.article 避开菜单 .btn/.item；dequeue 先等数量降再断言新队首（避离场瞬时双 is-front）
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓ / coverage All files 93.84%/93%/90.53%/93.82%（stmts/branch/funcs/lines，均过门槛）；QueueViz 100% 行覆盖、分支 70%
- [x] 单测 396 passed（62 文件）+ e2e 12 passed；8 排序 + 栈 + 播放器全部现有 Case 零回归；**骨架（article/）零改动复用**——验证可复用性达成
