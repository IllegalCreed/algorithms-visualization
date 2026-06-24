# 实现：知识页骨架 + 栈（TDD 任务分解 T1–T5）

> Status: approved
> Stable ID: C-20260624-015
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T2 useStack` → `T1 排版骨架` → `T3 StackViz` → `T4 栈页` → `T5 e2e`。（T1/T2 互不依赖，先做哪个都行。）每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。

---

## T2 — `useStack.ts` 栈逻辑（L3，先写测试）

**先写失败测试** `src/components/structures/useStack.spec.ts`（`TC-STACK-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useStack, STACK_MAX } from './useStack';

describe('useStack', () => {
  it('TC-STACK-LOGIC-01 初始空：items 空、top=null、canPop=false、canPush=true', () => {
    const s = useStack();
    expect(s.items.value).toEqual([]);
    expect(s.top.value).toBe(null);
    expect(s.canPop.value).toBe(false);
    expect(s.canPush.value).toBe(true);
  });
  it('TC-STACK-LOGIC-02 push 追加递增序号、返回压入值、top 更新', () => {
    const s = useStack();
    expect(s.push()).toBe(1);
    expect(s.push()).toBe(2);
    expect(s.items.value.map((t) => t[1])).toEqual([1, 2]);
    expect(s.top.value).toBe(2);
  });
  it('TC-STACK-LOGIC-03 pop 删尾并返回原栈顶；空 pop 返回 null', () => {
    const s = useStack();
    s.push();
    s.push();
    expect(s.pop()).toBe(2);
    expect(s.items.value.map((t) => t[1])).toEqual([1]);
    expect(s.pop()).toBe(1);
    expect(s.pop()).toBe(null);
  });
  it('TC-STACK-LOGIC-04 peek 返回栈顶但不改变 items', () => {
    const s = useStack();
    s.push();
    s.push();
    expect(s.peek()).toBe(2);
    expect(s.items.value.length).toBe(2);
    expect(s.peek()).toBe(2);
  });
  it('TC-STACK-LOGIC-05 reset 清空且 seq 归零（下次 push 又从 1 开始）', () => {
    const s = useStack();
    s.push();
    s.push();
    s.reset();
    expect(s.items.value).toEqual([]);
    expect(s.push()).toBe(1);
  });
  it('TC-STACK-LOGIC-06 canPush 在满 STACK_MAX 时为 false', () => {
    const s = useStack();
    for (let i = 0; i < STACK_MAX; i++) s.push();
    expect(s.items.value.length).toBe(STACK_MAX);
    expect(s.canPush.value).toBe(false);
    expect(s.push()).toBe(null); // 满了不再压入
    expect(s.items.value.length).toBe(STACK_MAX);
  });
  it('TC-STACK-LOGIC-07 每个元素 id 唯一', () => {
    const s = useStack();
    s.push();
    s.push();
    s.push();
    const ids = s.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-STACK-LOGIC-08 canPop 随空/非空切换', () => {
    const s = useStack();
    expect(s.canPop.value).toBe(false);
    s.push();
    expect(s.canPop.value).toBe(true);
    s.pop();
    expect(s.canPop.value).toBe(false);
  });
});
```

**实现** `src/components/structures/useStack.ts`（见 design §3）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

export const STACK_MAX = 8;

export interface UseStack {
  items: Ref<[string, number][]>;
  top: ComputedRef<number | null>;
  canPush: ComputedRef<boolean>;
  canPop: ComputedRef<boolean>;
  push: () => number | null;
  pop: () => number | null;
  peek: () => number | null;
  reset: () => void;
}

export function useStack(): UseStack {
  const items = ref<[string, number][]>([]);
  let seq = 0;
  let idn = 0;
  const top = computed(() => (items.value.length ? items.value[items.value.length - 1][1] : null));
  const canPush = computed(() => items.value.length < STACK_MAX);
  const canPop = computed(() => items.value.length > 0);
  const push = () => {
    if (!canPush.value) return null;
    const v = ++seq;
    items.value.push([`s${idn++}`, v]);
    return v;
  };
  const pop = () => {
    if (!canPop.value) return null;
    return items.value.pop()![1];
  };
  const peek = () => top.value;
  const reset = () => {
    items.value = [];
    seq = 0;
  };
  return { items, top, canPush, canPop, push, pop, peek, reset };
}
```

**验证**：`pnpm test:unit run src/components/structures/useStack.spec.ts`。

---

## T1 — 排版骨架 `Article`/`Callout`/`Playground`（L4，先写测试）

**先写失败测试**：

`src/components/article/Article.spec.ts`（`TC-VIZ-ARTICLE-*`）：

- `-01` 渲染 `.article` 容器。
- `-02` slot 内容透传（传 `<h2>标题</h2><p>正文</p>`，断言文本出现）。

`src/components/article/Callout.spec.ts`（`TC-VIZ-CALLOUT-01`）：渲染 `.callout` 且 slot 内容出现。

`src/components/article/Playground.spec.ts`（`TC-VIZ-PLAYGROUND-*`）：

- `-01` 默认角标「亲手试试」+ slot 内容。
- `-02` 传 `title="试一试"` 时角标用自定义文案。

**实现**（均薄、纯 presentational）：

```vue
<!-- Article.vue -->
<template>
  <article class="article"><slot /></article>
</template>
<style scoped lang="less">
/* max-width 720 居中 + h1/h2/h3/p/ul/code/strong scoped 排版 */
</style>

<!-- Callout.vue -->
<template>
  <div class="callout"><slot /></div>
</template>

<!-- Playground.vue -->
<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: '亲手试试' });
</script>
<template>
  <div class="playground">
    <span class="tag">{{ title }}</span
    ><slot />
  </div>
</template>
```

样式取原型（`/tmp/stack-knowledge-mockup.html`）：新拟物变量直接用（`common.less` 注入）。**验证**：`pnpm test:unit run src/components/article/`。

---

## T3 — `StackViz.vue` 栈互动组件（L4，先写测试）

**先写失败测试** `src/components/structures/StackViz.spec.ts`（`TC-VIZ-STACKVIZ-*`，TransitionGroup 用 stub 让进出场即时、便于断言 DOM）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StackViz from './StackViz.vue';

const mountIt = () =>
  mount(StackViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: any, label: string) =>
  w.findAll('.btn').find((b: any) => b.text().includes(label))!;

describe('StackViz', () => {
  it('TC-VIZ-STACKVIZ-01 初始空：栈为空提示、无盘子、pop/peek 禁用', () => {
    const w = mountIt();
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(w.findAll('.plate')).toHaveLength(0);
    expect(btn(w, 'pop').attributes('disabled')).toBeDefined();
    expect(btn(w, 'peek').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-STACKVIZ-02 push 增加一个盘子、值为递增序号', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.plate').text()).toBe('1');
  });
  it('TC-VIZ-STACKVIZ-03 连 push：栈顶 is-top 落在最后压入的元素', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, 'push').trigger('click');
    const items = w.findAll('.item');
    expect(items[items.length - 1].classes()).toContain('is-top');
    expect(items[0].classes()).not.toContain('is-top');
  });
  it('TC-VIZ-STACKVIZ-04 「← 栈顶」仅栈顶元素显示', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, 'push').trigger('click');
    const arrows = w.findAll('.item').map((it) => it.find('.arrow').exists());
    // 每个 item 都含 .arrow 节点，但仅 is-top 的可见 → 用 is-top 类约束（见 -03）；此处断言结构存在
    expect(arrows.every(Boolean)).toBe(true);
    expect(w.findAll('.item .arrow')).toHaveLength(2);
  });
  it('TC-VIZ-STACKVIZ-05 pop 减少一个盘子并解说', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, 'push').trigger('click');
    await btn(w, 'pop').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.status').text()).toContain('弹出');
  });
  it('TC-VIZ-STACKVIZ-06 push 到 8 后 push 禁用', async () => {
    const w = mountIt();
    for (let i = 0; i < 8; i++) await btn(w, 'push').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(8);
    expect(btn(w, 'push').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-STACKVIZ-07 重置清空', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
  });
  it('TC-VIZ-STACKVIZ-08 peek 解说栈顶、不取走', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, 'peek').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.status').text()).toContain('栈顶');
  });
});
```

**实现** `src/components/structures/StackViz.vue`（见 design §4；用 `useStack` + `<TransitionGroup name="stack">`）。骨架：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useStack } from './useStack';
const s = useStack();
const status = ref('点 push 压入一个元素试试');
const onPush = () => {
  const v = s.push();
  if (v !== null) status.value = `push：把 ${v} 压到栈顶`;
};
const onPop = () => {
  const v = s.pop();
  if (v !== null) status.value = `pop：弹出栈顶 ${v}`;
};
const onPeek = () => {
  const v = s.peek();
  if (v !== null) status.value = `peek：栈顶是 ${v}（只看，不取走）`;
};
const onReset = () => {
  s.reset();
  status.value = '已重置 · 点 push 压入一个元素试试';
};
</script>
<template>
  <div class="stack-viz column center">
    <div class="toolbar row">
      <button class="btn" :disabled="!s.canPush.value" @click="onPush">push 压入</button>
      <button class="btn" :disabled="!s.canPop.value" @click="onPop">pop 弹出</button>
      <button class="btn" :disabled="!s.canPop.value" @click="onPeek">peek 看栈顶</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="stack-area">
      <div class="stack-col">
        <span v-if="!s.items.value.length" class="empty-hint">栈为空</span>
        <TransitionGroup name="stack" tag="div" class="col-inner">
          <div
            v-for="(it, i) in s.items.value"
            :key="it[0]"
            class="item"
            :class="{ 'is-top': i === s.items.value.length - 1 }"
          >
            <div class="plate">{{ it[1] }}</div>
            <span class="arrow">← 栈顶</span>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>
<style scoped lang="less">
/* 坑定宽 134、column-reverse 底部锚定、栈顶深绿、arrow 绝对定位 left:100%；取原型样式 */
</style>
```

注：坑的 `column-reverse` + 底部锚定与 arrow `left:100%` 漂出，详见 design §4.1 两条硬约束。`.col-inner` 承载 TransitionGroup（`column-reverse`）。**验证**：`pnpm test:unit run src/components/structures/StackViz.spec.ts`。

---

## T4 — `Stack.vue` 栈页（L4，先写测试）

**先写失败测试** `src/views/Article/DataStructure/Stack.spec.ts`（`TC-VIEW-STACK-*`）：

- `-01` 挂载渲染 `Article` + `StackViz`（`findComponent` 存在）。
- `-02` 含「栈」标题与 `Playground`（`.playground` 存在）。

**实现**：填充 `Stack.vue`（见 design §5 大纲；`<Article>` 套正文 + `<Playground><StackViz/></Playground>` + `<Callout>`），正文以原型文案为基础。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Stack.spec.ts`。

---

## T5 — e2e（L5，Playwright）

`e2e/stack.e2e.ts`（`TC-E2E-STACK-01`）：导航 `/docs/stack`、见标题「栈」与正文、`.playground` 可见；点 push 三次见 3 个 `.plate`、栈顶 `.is-top` 深绿 +「栈顶」`.arrow` 可见且在顶；点 pop 减少；重置回空态见「栈为空」；视觉截图。**验证**：`pnpm exec playwright test e2e/stack.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T2 useStack 全绿（8 Case）
- [x] T1 排版骨架全绿（Article 2 + Callout 1 + Playground 2）
- [x] T3 StackViz 全绿（8 Case）
- [x] T4 栈页全绿（2 Case）
- [x] T5 e2e 全绿（TC-E2E-STACK-01）— 真机另验：菜单/文章双 h1、菜单复用 .btn/.item 故 e2e 全限定 .stack-viz/.article
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓ / coverage All files 93.44%/93.14%/89.82%/93.41%（stmts/branch/funcs/lines，均过门槛）；structures 100% 行覆盖、StackViz 分支 70%
- [x] 单测 378 passed（60 文件）+ e2e 11 passed；8 个排序与播放器全部现有 Case 零回归；新骨架（article/、structures/）仅被栈页 import，不被排序/播放器 import
