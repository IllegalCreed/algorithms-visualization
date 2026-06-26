# 实现：链表·双向（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260626-025
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useDlink` → `T2 DlinkViz` → `T3 链表页加节` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。LinkViz / useLink / 骨架复用、零改动。

---

## T1 — `useDlink.ts` 双向链 + 双序 + O(1) 删除（L3，先写测试）

**先写失败测试** `src/components/structures/useDlink.spec.ts`（`TC-DLINK-LOGIC-*`，10 条，见 test-cases.md）。

**实现** `src/components/structures/useDlink.ts`（见 design §2）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

export const DLINK_MAX = 6;

export interface DlinkRewire {
  left: number | 'head';
  right: number | 'tail';
}
export interface UseDlink {
  items: Ref<[string, number][]>;
  selected: Ref<number | null>;
  hasSelection: ComputedRef<boolean>;
  forward: ComputedRef<number[]>;
  backward: ComputedRef<number[]>;
  select: (i: number) => void;
  removeAt: () => { value: number; rewire: DlinkRewire } | null;
  reset: () => void;
}

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
    items.value.splice(i, 1); // 自带 prev/next → 两步接线即可，O(1)
    selected.value = null;
    return { value, rewire };
  };
  const reset = (): void => {
    items.value = make();
    selected.value = null;
  };

  return { items, selected, hasSelection, forward, backward, select, removeAt, reset };
}
```

**验证**：`pnpm test:unit run src/components/structures/useDlink.spec.ts`。

---

## T2 — `DlinkViz.vue` 反向遍历 + O(1) 删除互动（L4，先写测试）

**先写失败测试** `src/components/structures/DlinkViz.spec.ts`（`TC-VIZ-DLINKVIZ-*`，8 条，见 test-cases.md）。mount 时 stub `transition-group`；`btn` 用稳定子串（反向/删除/重置）；同步断言 dnode 数与 status 文本，不推进计时器。

**实现** `src/components/structures/DlinkViz.vue`（见 design §3；用 `useDlink` + 双向箭头）。骨架：

```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useDlink } from './useDlink';

const d = useDlink();
const status = ref('双向链：每个节点都有 prev 和 next。点「反向遍历」或点节点删除试试。');
const lit = ref(-1); // 反向遍历当前点亮的节点下标
const rewired = ref<(number | 'head')[]>([]); // 接线改写脉冲
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const flashRewire = (keys: (number | 'head')[]) => {
  rewired.value = keys;
  timers.push(setTimeout(() => (rewired.value = []), 700));
};

const onSelect = (i: number) => {
  if (busy.value) return;
  d.select(i);
  status.value =
    d.selected.value === null
      ? '已取消选中'
      : `选中 a[${d.selected.value}]（值 ${d.items.value[d.selected.value][1]}）· 可删除`;
};
const onReverse = async () => {
  if (busy.value) return;
  busy.value = true;
  lit.value = -1;
  status.value = `反向遍历（沿 prev 从 tail 往回）：${d.backward.value.join(' → ')}。单链表只有 next，做不到。`;
  for (let i = d.items.value.length - 1; i >= 0; i--) {
    lit.value = i;
    await sleep(480);
  }
  await sleep(360);
  lit.value = -1;
  busy.value = false;
};
const onRemove = () => {
  if (busy.value) return;
  if (d.selected.value === null) {
    status.value = '先点一个节点选中，再删除。';
    return;
  }
  const i = d.selected.value;
  const r = d.removeAt(); // 同步改 items
  if (r) {
    flashRewire([r.rewire.left]);
    status.value = `删除 a[${i}]=${r.value}：节点自带 prev → 直接 prev.next=next、next.prev=prev，O(1)，不用从 head 找前驱。`;
  }
};
const onReset = () => {
  clearTimers();
  busy.value = false;
  lit.value = -1;
  rewired.value = [];
  d.reset();
  status.value = '已重置 · 点「反向遍历」或点节点删除试试。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="dlink-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="busy" @click="onReverse">← 反向遍历</button>
      <button class="btn" :disabled="busy || !d.hasSelection.value" @click="onRemove">
        {{ d.hasSelection.value ? `删除 a[${d.selected.value}]` : '删除选中' }}
      </button>
      <button class="btn" :disabled="busy" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <div class="chain">
          <div class="dnullbox">∅</div>
          <span class="conn" :class="{ rewired: rewired.includes('head') }"
            ><i class="nx">→</i><i class="pv">←</i></span
          >
          <TransitionGroup name="dlink" tag="div" class="dnodes">
            <div
              v-for="(it, i) in d.items.value"
              :key="it[0]"
              class="dnode"
              :class="{ 'is-sel': i === d.selected.value, lit: i === lit }"
              :data-i="i"
            >
              <span v-if="i === 0" class="danchor head">head</span>
              <span v-if="i === d.items.value.length - 1" class="danchor tail">tail</span>
              <div class="box" @click="onSelect(i)">{{ it[1] }}</div>
              <span class="conn" :class="{ rewired: rewired.includes(i) }"
                ><i class="nx">→</i><i class="pv">←</i></span
              >
            </div>
          </TransitionGroup>
          <div class="dnullbox">∅</div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 节点 .dnode(idle 浅绿/is-sel 深绿环不位移/lit 白底绿环抬起) + .conn 双箭头(→/←, rewired 脉冲) + head/tail 胶囊 + 两端 ∅；车道定宽定高；TransitionGroup 滑入/离场/FLIP；取 LinkViz 样式 */
</style>
```

注：`removeAt` 同步改 items、`onReverse`/`onRemove` 同步置 status（L4 同步断言），点亮/脉冲延时（卸载清理、busy 锁反向遍历）；`reset` 中断。**验证**：`pnpm test:unit run src/components/structures/DlinkViz.spec.ts`。

---

## T3 — `Link.vue` 加节（L4，先写测试）

**先写失败测试**：在 `src/views/Article/DataStructure/Link.spec.ts` **追加** `TC-VIEW-LINK-03`（不改 01/02）：

```ts
import DlinkViz from '@/components/structures/DlinkViz.vue';
// …
it('TC-VIEW-LINK-03 链表页含 DlinkViz（双向链表节）', () => {
  const w = mountIt();
  expect(w.findComponent(DlinkViz).exists()).toBe(true);
});
```

**实现**：在 `Link.vue` 查找逐跳正文 `</p>` 后、`<h2>链表在哪里用</h2>` 前插入「双向链表：再加一根 prev 指针」节（见 design §4），import `DlinkViz`。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Link.spec.ts`（3 Case 全绿）。

---

## T4 — e2e（L5，Playwright）

在 `e2e/link.e2e.ts` **追加** `TC-E2E-LINK-02`（导航 `/docs/link`、限定 `.dlink-viz`）：初始 4 `.dnode`；点「反向遍历」→ `.status` 含「反向」；点首个 `.dnode` 选中后点「删除」→ `.dnode`→3；重置 → 回 4 `.dnode`。**并修一处回归**：`TC-E2E-LINK-01` 第 10 行 `page.locator('.playground')`（两个 Playground 后命中 2 个、严格模式）→ `.first()`。**验证**：`pnpm exec playwright test e2e/link.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（D3 出池/完成），提交 main。

## 自测报告（实现期回填）

- [x] T1 useDlink 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；forward/backward 双序、select toggle、removeAt 中/头/尾 的 items 与 rewire（{left,right} 锚点）、无选中 null、删后 backward 更新、reset，一次通过
- [x] T2 DlinkViz 全绿（8 Case）— removeAt 同步改 items + 同步置 status（L4 同步断言 dnode 数/status 文本，不推进计时器）、反向遍历 status 同步含完整反向序、busy 锁工具栏、reset 中断；未选中删除按钮 disabled（与 LinkViz 一致）
- [x] T3 链表页 TC-VIEW-LINK-03 绿（Link.spec 3 Case 全绿、01/02 不回归）
- [x] T4 e2e 全绿（TC-E2E-LINK-01 修 `.first()` + 新增 TC-E2E-LINK-02）— 真机另验（dev server 截图）：4 节点 →/← 双箭头贯穿、head/tail 锚点就位、两端 null、删除按钮未选中置灰；e2e 把「选中+删除」放反向遍历前（反向遍历 busy 锁工具栏 ~2.3s），重置点击靠 Playwright 自动等 busy 解除；**修一处回归**：加第二个 Playground 后 TC-E2E-LINK-01 第 10 行 `.playground` 命中 2 个（严格模式）→ 改 `.first()`（断言意图不变）
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（Link.vue 经 prettier --write）/ coverage All files 92.26%/89.34%/93.29%/93.44%（聚合过门槛）
- [x] 单测 583 passed（87 文件，含新增 19 单测 Case）+ e2e 21 passed（含新增 1）；LinkViz/useLink + 8 排序 + 其余结构 + 播放器 零回归；**M4 深度 D3 完成**
