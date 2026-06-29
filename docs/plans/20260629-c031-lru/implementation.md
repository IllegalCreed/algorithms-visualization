# 实现：LRU 缓存（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260629-031
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序

`T1 useLRU` → `T2 LruViz` → `T3 新页 + 4 处接线 + 改 2 HOOK` → `T4 e2e`。先写失败测试 → 跑红 → 实现 → 跑绿。

---

## T1 — `useLRU.ts`（L3，先写测试）

**先写失败测试** `src/components/structures/useLRU.spec.ts`（`TC-LRU-LOGIC-*`，10 条）。

**实现** `src/components/structures/useLRU.ts`：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

export const LRU_CAP = 4;

export interface LruResult {
  type: 'hit' | 'miss' | 'put-new' | 'put-update';
  key: number;
  value: number | null;
  evicted: number | null;
}
export interface UseLRU {
  entries: Ref<[string, number, number][]>; // [id, key, value]；0=MRU、末位=LRU
  capacity: number;
  size: ComputedRef<number>;
  get: (key: number) => LruResult;
  put: (key: number, value: number) => LruResult;
  reset: () => void;
}

const INITIAL: [number, number][] = [
  [3, 30],
  [2, 20],
  [1, 10],
]; // MRU→LRU

export function useLRU(): UseLRU {
  let idn = 0;
  const make = (): [string, number, number][] => INITIAL.map(([k, v]) => [`lru${idn++}`, k, v]);
  const entries = ref<[string, number, number][]>(make());
  const size = computed(() => entries.value.length);

  const get = (key: number): LruResult => {
    const idx = entries.value.findIndex((e) => e[1] === key);
    if (idx === -1) return { type: 'miss', key, value: null, evicted: null };
    const [e] = entries.value.splice(idx, 1);
    entries.value.unshift(e); // 移到最前（最近用）
    return { type: 'hit', key, value: e[2], evicted: null };
  };
  const put = (key: number, value: number): LruResult => {
    const idx = entries.value.findIndex((e) => e[1] === key);
    if (idx !== -1) {
      const [e] = entries.value.splice(idx, 1);
      entries.value.unshift([e[0], key, value]); // 同 id 新值、移最前
      return { type: 'put-update', key, value, evicted: null };
    }
    entries.value.unshift([`lru${idn++}`, key, value]);
    let evicted: number | null = null;
    if (entries.value.length > LRU_CAP) {
      const removed = entries.value.pop()!; // 淘汰末位（LRU）
      evicted = removed[1];
    }
    return { type: 'put-new', key, value, evicted };
  };
  const reset = (): void => {
    entries.value = make();
  };

  return { entries, capacity: LRU_CAP, size, get, put, reset };
}
```

**验证**：`pnpm test:unit run src/components/structures/useLRU.spec.ts`。

---

## T2 — `LruViz.vue`（L4，先写测试）

**先写失败测试** `src/components/structures/LruViz.spec.ts`（`TC-VIZ-LRUVIZ-*`，8 条）。mount 时 stub `transition-group`；key/value 用 `.val-input`（[0]=key、[1]=value）；`btn` 用稳定子串（get/put/重置）；同步断言 lru-cell 数、lru-key 文本、status（操作同步、无锁）。

**实现** `src/components/structures/LruViz.vue`（用 `useLRU` + 横向车道）。骨架：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useLRU, LRU_CAP } from './useLRU';

const lru = useLRU();
const keyVal = ref(1);
const valVal = ref(100);
const status = ref('缓存按「最近使用」排：左=最近用，右=最久没用。get/put 试试。');

const onGet = () => {
  const r = lru.get(keyVal.value);
  status.value =
    r.type === 'hit'
      ? `get(${keyVal.value})：找到了，值 ${r.value}，移到最前（最近用）。`
      : `get(${keyVal.value})：缓存里没有 ${keyVal.value}，未命中。`;
};
const onPut = () => {
  const r = lru.put(keyVal.value, valVal.value);
  if (r.type === 'put-update') {
    status.value = `put(${keyVal.value},${valVal.value})：${keyVal.value} 已在，更新为 ${valVal.value} 并移到最前。`;
  } else if (r.evicted !== null) {
    status.value = `put(${keyVal.value},${valVal.value})：缓存满了，淘汰最久没用的 ${r.evicted}，新键放最前。`;
  } else {
    status.value = `put(${keyVal.value},${valVal.value})：新键放到最前（最近用）。`;
  }
};
const onReset = () => {
  lru.reset();
  status.value = '已重置 · 缓存按最近使用排，右端最久没用、下一个被淘汰。';
};
</script>

<template>
  <div class="lru-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="keyVal" type="number" min="1" max="99" />
      <input class="val-input" v-model.number="valVal" type="number" min="1" max="999" />
      <button class="btn" @click="onGet">get</button>
      <button class="btn" @click="onPut">put</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <span v-if="!lru.entries.value.length" class="empty-hint">缓存为空</span>
        <TransitionGroup name="lru" tag="div" class="lane-inner">
          <div
            v-for="(e, i) in lru.entries.value"
            :key="e[0]"
            class="lru-cell"
            :class="{ 'is-mru': i === 0, 'is-lru': i === lru.entries.value.length - 1 }"
          >
            <div class="lru-key">{{ e[1] }}</div>
            <div class="lru-val">{{ e[2] }}</div>
            <div class="markers">
              <div class="m m-mru">↑ 最近用</div>
              <div class="m m-lru">↑ 最久没用</div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <p class="readout">
      容量
      <b :class="{ full: lru.size.value === lru.capacity }">{{ lru.size.value }}/{{ LRU_CAP }}</b>
    </p>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 横向车道 + .lru-cell(浅绿，.lru-key 大/.lru-val 小) + MRU/LRU 端标记 + 中性纵向进出 TransitionGroup + FLIP；容量读数满橙；定宽定高、空 empty-hint；取 DequeViz 样式 */
</style>
```

注：get/put/reset 同步改 entries + 同步置 status（L4 可断言、多操作直接生效）；重排/进出由 TransitionGroup（cosmetic）。**验证**：`pnpm test:unit run src/components/structures/LruViz.spec.ts`。

---

## T3 — 新页 `Lru.vue` + 4 处接线 + 改 2 HOOK（L4，先写测试）

**先写失败测试**（视图）`src/views/Article/DataStructure/Lru.spec.ts`（`TC-VIEW-LRU-01/02`，仿 UnionFind.spec）。

**改 HOOK 计数**：`Home/Main/hooks.spec.ts` TC-HOOK-01-2 `10`→`11`；`Docs/Menu/hooks.spec.ts` TC-HOOK-02-4 数据结构 `10`→`11`（排序仍 8）。

**实现**：

1. `Lru.vue`（见 design §4）。
2. `router/index.ts`：union-find 之后 + `{ path: '/docs/lru', name: 'lru', component: () => import('../views/Article/DataStructure/Lru.vue') }`。
3. `Docs/Menu/hooks.ts`：数据结构 children 末（并查集后）+ `{ title: 'LRU 缓存', url: 'lru' }`。
4. `Home/Main/hooks.ts`：import `LruIcon from '@/assets/lru.svg'`；数据结构 children 末 + `{ title: 'LRU 缓存', desc: '哈希表 + 双向链表的经典组合，满了淘汰最久没用的', icon: LruIcon, url: 'lru' }`。
5. `assets/lru.svg`：1024 viewBox 黑剪影（3 个缓存格 + 顶上一条回到最前的弧线箭头，象征「最近用移到最前」）：

```svg
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <g fill="#333333">
    <rect x="150" y="470" width="180" height="200" rx="34" />
    <rect x="420" y="470" width="180" height="200" rx="34" />
    <rect x="690" y="470" width="180" height="200" rx="34" />
  </g>
  <g fill="none" stroke="#333333" stroke-width="40" stroke-linecap="round">
    <path d="M780 360 Q512 200 244 360" />
    <path d="M244 360 L250 300" />
    <path d="M244 360 L312 384" />
  </g>
</svg>
```

**验证**：`pnpm test:unit run src/views/Article/DataStructure/Lru.spec.ts src/views/Home/Main/hooks.spec.ts src/views/Docs/Menu/hooks.spec.ts`。

---

## T4 — e2e（L5）

新建 `e2e/lru.e2e.ts`（`TC-E2E-LRU-01`，导航 `/docs/lru`、限定 `.lru-viz`）：3 `.lru-cell`；输入 key=1 点 get → 首个 `.lru-key`=1（跳最前）；put 到溢出 → `.status` 含「淘汰」；重置 → 回 3 `.lru-cell`。**验证**：`pnpm exec playwright test e2e/lru.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（B3 出池/完成），提交 main。

## 自测报告（实现期回填）

- [x] T1 useLRU 全绿（10 Case）— TDD：先红 → 实现 → 绿；get 命中(移最前)/未命中 + put 新键/更新(同 id 新值)/满后淘汰末位 + size + reset，一次通过
- [x] T2 LruViz 全绿（8 Case）— get/put/reset 同步改 entries + 同步置 status（L4 可断言），命中跳最前/淘汰/更新；MRU/LRU 端标记；TransitionGroup 重排/进出
- [x] T3 LRU 页 TC-VIEW-LRU-01/02 绿 + 4 处接线（router /docs/lru / Menu / Home + LruIcon / lru.svg）+ 改 2 HOOK（TC-HOOK-01-2、TC-HOOK-02-4 数据结构 10→11）绿；菜单/首页/路由可达
- [x] T4 e2e 全绿（新增 TC-E2E-LRU-01）— 真机另验：put(4,40) 填满后 put(5,50) 淘汰最久没用的 1、5 进最前、容量 4/4 满、MRU/LRU 标记就位
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓ / coverage All files 92.7%/89.74%/93.52%/93.85%（聚合过门槛）
- [x] 单测 683 passed（100 文件，含新增 20 单测 + 改 2 HOOK）+ e2e 26 passed（含新增 1）；既有 10 结构 + 8 排序 + 播放器 + 骨架零回归；**M4 广度 B3 落地**
