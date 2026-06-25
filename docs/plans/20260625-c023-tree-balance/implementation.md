# 实现：树·平衡深化（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260625-023
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useBalance` → `T2 BalanceViz` → `T3 树页加节` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。TreeViz / 骨架复用、零改动。

---

## T1 — `useBalance.ts` 两套布局 + 纯 search（L3，先写测试）

**先写失败测试** `src/components/structures/useBalance.spec.ts`（`TC-BAL-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useBalance } from './useBalance';

describe('useBalance', () => {
  it('TC-BAL-LOGIC-01 chain 结构：7 节点 1-7、6 边、高度 7、最坏 7', () => {
    const b = useBalance();
    expect(b.chain.nodes.map((n) => n.value)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(b.chain.edges).toHaveLength(6);
    expect(b.chain.height).toBe(7);
    expect(b.chain.worst).toBe(7);
  });
  it('TC-BAL-LOGIC-02 balanced 结构：7 节点 4/2/6/1/3/5/7、6 边、高度 3、最坏 3', () => {
    const b = useBalance();
    expect(b.balanced.nodes.map((n) => n.value)).toEqual([4, 2, 6, 1, 3, 5, 7]);
    expect(b.balanced.edges).toHaveLength(6);
    expect(b.balanced.height).toBe(3);
    expect(b.balanced.worst).toBe(3);
  });
  it('TC-BAL-LOGIC-03 节点带坐标 + id 唯一', () => {
    const b = useBalance();
    expect(typeof b.chain.nodes[0].x).toBe('number');
    const ids = [...b.chain.nodes, ...b.balanced.nodes].map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-BAL-LOGIC-04 search(7, chain) 走 7 步（退化 O(n)）', () => {
    const r = useBalance().search(7, 'chain');
    expect(r.steps).toBe(7);
    expect(r.path).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
  it('TC-BAL-LOGIC-05 search(7, balanced) 走 3 步（O(log n)）', () => {
    const r = useBalance().search(7, 'balanced');
    expect(r.steps).toBe(3);
    expect(r.path).toEqual([0, 2, 6]);
  });
  it('TC-BAL-LOGIC-06 chain search 步数 = 值（升序链）', () => {
    const b = useBalance();
    expect(b.search(3, 'chain').steps).toBe(3);
    expect(b.search(5, 'chain').steps).toBe(5);
  });
  it('TC-BAL-LOGIC-07 balanced：根 1 步、叶 3 步', () => {
    const b = useBalance();
    expect(b.search(4, 'balanced').steps).toBe(1);
    expect(b.search(1, 'balanced').steps).toBe(3);
    expect(b.search(5, 'balanced').steps).toBe(3);
  });
  it('TC-BAL-LOGIC-08 同值两 mode 步数不同（7：7 vs 3）', () => {
    const b = useBalance();
    expect(b.search(7, 'chain').steps).not.toBe(b.search(7, 'balanced').steps);
  });
});
```

**实现** `src/components/structures/useBalance.ts`（见 design §2）：

```ts
export interface BNode {
  id: string;
  value: number;
  x: number;
  y: number;
}
export interface BalanceLayout {
  nodes: BNode[];
  edges: [number, number][];
  height: number;
  worst: number;
}
export interface SearchResult {
  path: number[];
  steps: number;
}
export interface UseBalance {
  chain: BalanceLayout;
  balanced: BalanceLayout;
  search: (target: number, mode: 'chain' | 'balanced') => SearchResult;
}

const CHAIN_VALUES = [1, 2, 3, 4, 5, 6, 7];
const BAL_VALUES = [4, 2, 6, 1, 3, 5, 7]; // 完全二叉树 pos 0..6

const depthOf = (p: number) => Math.floor(Math.log2(p + 1));
const xOf = (p: number) => {
  const d = depthOf(p);
  return ((p - (2 ** d - 1) + 0.5) / 2 ** d) * 404;
};

export function useBalance(): UseBalance {
  const chain: BalanceLayout = {
    nodes: CHAIN_VALUES.map((value, i) => ({ id: `c${i}`, value, x: 70 + i * 46, y: 30 + i * 40 })),
    edges: [0, 1, 2, 3, 4, 5].map((i) => [i, i + 1] as [number, number]),
    height: 7,
    worst: 7,
  };
  const balanced: BalanceLayout = {
    nodes: BAL_VALUES.map((value, p) => ({
      id: `b${p}`,
      value,
      x: xOf(p),
      y: 34 + depthOf(p) * 84,
    })),
    edges: [1, 2, 3, 4, 5, 6].map((p) => [p, (p - 1) >> 1] as [number, number]),
    height: 3,
    worst: 3,
  };
  const search = (target: number, mode: 'chain' | 'balanced'): SearchResult => {
    if (mode === 'chain') {
      const path: number[] = [];
      for (let i = 0; i < CHAIN_VALUES.length; i++) {
        path.push(i);
        if (CHAIN_VALUES[i] === target) return { path, steps: path.length };
        if (target < CHAIN_VALUES[i]) break; // 左子树（无）→ 不在
      }
      return { path, steps: path.length };
    }
    const path: number[] = [];
    let p = 0;
    while (p < BAL_VALUES.length) {
      path.push(p);
      if (BAL_VALUES[p] === target) return { path, steps: path.length };
      p = target < BAL_VALUES[p] ? 2 * p + 1 : 2 * p + 2;
    }
    return { path, steps: path.length };
  };
  return { chain, balanced, search };
}
```

**验证**：`pnpm test:unit run src/components/structures/useBalance.spec.ts`。

---

## T2 — `BalanceViz.vue` 退化↔平衡互动（L4，先写测试）

**先写失败测试** `src/components/structures/BalanceViz.spec.ts`（`TC-VIZ-BALVIZ-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BalanceViz from './BalanceViz.vue';

const mountIt = () => mount(BalanceViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('BalanceViz', () => {
  it('TC-VIZ-BALVIZ-01 初始退化：7 节点 + 6 边 + 3 按钮 + 退化 on + readout 7 层/7 次', () => {
    const w = mountIt();
    expect(w.findAll('.node')).toHaveLength(7);
    expect(w.findAll('.edge')).toHaveLength(6);
    expect(btn(w, '退化')).toBeTruthy();
    expect(btn(w, '平衡')).toBeTruthy();
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '退化').classes()).toContain('on');
    const ro = w.find('.readout').text();
    expect(ro).toContain('7 层');
    expect(ro).toContain('7 次');
  });
  it('TC-VIZ-BALVIZ-02 切平衡：readout 3 层/3 次、节点仍 7、平衡 on', async () => {
    const w = mountIt();
    await btn(w, '平衡').trigger('click');
    const ro = w.find('.readout').text();
    expect(ro).toContain('3 层');
    expect(ro).toContain('3 次');
    expect(w.findAll('.node')).toHaveLength(7);
    expect(btn(w, '平衡').classes()).toContain('on');
  });
  it('TC-VIZ-BALVIZ-03 退化节点值 1–7', () => {
    const w = mountIt();
    expect(w.findAll('.node text').map((t) => t.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
    ]);
  });
  it('TC-VIZ-BALVIZ-04 查找 7（退化）status 含「7 步」', async () => {
    const w = mountIt();
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('7 步');
  });
  it('TC-VIZ-BALVIZ-05 查找 7（平衡）status 含「3 步」', async () => {
    const w = mountIt();
    await btn(w, '平衡').trigger('click');
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('3 步');
  });
  it('TC-VIZ-BALVIZ-06 切回退化：readout 回 7 层', async () => {
    const w = mountIt();
    await btn(w, '平衡').trigger('click');
    await btn(w, '退化').trigger('click');
    expect(w.find('.readout').text()).toContain('7 层');
  });
  it('TC-VIZ-BALVIZ-07 退化 vs 平衡 readout 不同', async () => {
    const w = mountIt();
    const a = w.find('.readout').text();
    await btn(w, '平衡').trigger('click');
    const b = w.find('.readout').text();
    expect(a).not.toBe(b);
  });
  it('TC-VIZ-BALVIZ-08 边数两 mode 均 6', async () => {
    const w = mountIt();
    expect(w.findAll('.edge')).toHaveLength(6);
    await btn(w, '平衡').trigger('click');
    expect(w.findAll('.edge')).toHaveLength(6);
  });
});
```

**实现** `src/components/structures/BalanceViz.vue`（见 design §3；用 `useBalance` + SVG）。骨架：

```vue
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useBalance } from './useBalance';

const b = useBalance();
const mode = ref<'chain' | 'balanced'>('chain');
const litPath = ref<number[]>([]);
const hotIdx = ref(-1);
const busy = ref(false);
const status = ref('同样是 1–7 七个值。点「查找 7」看走几步。');
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const cur = computed(() => (mode.value === 'chain' ? b.chain : b.balanced));

const onMode = (m: 'chain' | 'balanced') => {
  if (busy.value) return;
  mode.value = m;
  litPath.value = [];
  hotIdx.value = -1;
  status.value =
    m === 'chain'
      ? '按顺序插入，全挂右边 → 一条链。点「查找 7」看走几步。'
      : '同样 7 个值，平衡后矮胖。点「查找 7」对比走几步。';
};
const onFind = async () => {
  if (busy.value) return;
  busy.value = true;
  litPath.value = [];
  hotIdx.value = -1;
  const r = b.search(7, mode.value);
  status.value =
    mode.value === 'chain'
      ? `查找 7：从根一路比下来，走了 ${r.steps} 步才到 —— 最坏 O(n)，链表速度。`
      : `查找 7：${r.steps} 步到（4 → 6 → 7）—— O(log n)。同样的值，平衡后快得多。`;
  for (let k = 0; k < r.path.length; k++) {
    if (k === r.path.length - 1) hotIdx.value = r.path[k];
    else litPath.value = [...litPath.value, r.path[k]];
    await sleep(560);
  }
  busy.value = false;
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="bal-viz column center">
    <div class="toolbar row-wrap">
      <button
        class="btn"
        :class="{ on: mode === 'chain' }"
        :disabled="busy"
        @click="onMode('chain')"
      >
        顺序插入（退化）
      </button>
      <button
        class="btn"
        :class="{ on: mode === 'balanced' }"
        :disabled="busy"
        @click="onMode('balanced')"
      >
        平衡的树
      </button>
      <button class="btn find" :disabled="busy" @click="onFind">查找 7</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="404" height="296">
          <g class="edges">
            <line
              v-for="(e, i) in cur.edges"
              :key="i"
              class="edge"
              :x1="cur.nodes[e[0]].x"
              :y1="cur.nodes[e[0]].y"
              :x2="cur.nodes[e[1]].x"
              :y2="cur.nodes[e[1]].y"
            />
          </g>
          <g class="verts">
            <g
              v-for="(n, i) in cur.nodes"
              :key="n.id"
              class="node"
              :class="{ path: litPath.includes(i), hot: hotIdx === i }"
              :transform="`translate(${n.x},${n.y})`"
            >
              <circle r="17" />
              <text>{{ n.value }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <p class="readout">
      高度 <span :class="mode === 'chain' ? 'bad' : 'good'">{{ cur.height }} 层</span> · 最坏查找
      <span :class="mode === 'chain' ? 'bad' : 'good'">{{ cur.worst }} 次</span>
      <span class="note">（{{ mode === 'chain' ? '退回 O(n)，和链表一样慢' : 'O(log n)' }}）</span>
    </p>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 圆形节点(idle 浅绿/path 黄/hot 深绿+白环) + SVG 边；readout bad 橙/good 绿；toggle .on 内凹；画布定宽；取原型样式 */
</style>
```

注：`search` 同步返回步数（L4 同步断言 status），走位点亮延时（卸载清理、busy 防重入）。**验证**：`pnpm test:unit run src/components/structures/BalanceViz.spec.ts`。

---

## T3 — `Tree.vue` 加节（L4，先写测试）

**先写失败测试**：在 `src/views/Article/DataStructure/Tree.spec.ts` **追加** `TC-VIEW-TREE-03`（不改 01/02）：

```ts
import BalanceViz from '@/components/structures/BalanceViz.vue';
// …
it('TC-VIEW-TREE-03 树页含 BalanceViz（平衡节）', () => {
  const w = mountIt();
  expect(w.findComponent(BalanceViz).exists()).toBe(true);
});
```

**实现**：在 `Tree.vue` 中序段 `</p>` 后、`<h2>树在哪里用</h2>` 前插入「为什么会失衡 · 平衡的思想」节（见 design §4），import `BalanceViz`。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Tree.spec.ts`（3 Case 全绿）。

---

## T4 — e2e（L5，Playwright）

在 `e2e/tree.e2e.ts` **追加** `TC-E2E-TREE-02`（不改 01）：导航 `/docs/tree`、限定 `.bal-viz`：初始 7 `.node`；点「平衡的树」→ `.readout` 含「3 层」；点「查找 7」→ `.status` 含「3 步」。（树页两个互动件，全部限定各自作用域。）**验证**：`pnpm exec playwright test e2e/tree.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（D1 出池/完成），提交 main。

## 自测报告（实现期回填）

- [x] T1 useBalance 全绿（8 Case）— TDD：先红 → 实现 → 绿；chain/balanced 两布局 + search 步数（7 vs 3）一次通过
- [x] T2 BalanceViz 全绿（8 Case）— 一次通过；search 同步返回步数（L4 同步断言 status/readout）、走位点亮延时、toggle .on
- [x] T3 树页 TC-VIEW-TREE-03 绿（Tree.spec 3 Case 全绿、01/02 不回归）
- [x] T4 e2e 全绿（TC-E2E-TREE-01 + 新增 TC-E2E-TREE-02）— 真机另验（dev server 截图）：退化右斜链 1→…→7、读数 7 层橙警示、切平衡 3 层、查找 3 步；树页两互动件共存。**修一处回归**：加第二个 Playground 后 TC-E2E-TREE-01 第 8 行 `.playground` 命中 2 个（Playwright 严格模式）→ 改 `.first()` 消歧（断言意图不变）
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（Tree.vue 经 prettier --write）/ coverage All files 92.47%/89.86%/92.80%/93.53%（聚合过门槛）
- [x] 单测 545 passed（83 文件，含新增 17 单测 Case）+ e2e 19 passed（含新增 1）；TreeViz/useTree + 8 排序 + 其余 7 结构 + 播放器 零回归；**M4 深度 D1 完成**
