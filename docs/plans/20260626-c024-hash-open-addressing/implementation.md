# 实现：哈希·开放寻址（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260626-024
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useProbe` → `T2 HashProbeViz` → `T3 哈希页加节` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。HashViz / useHash / 骨架复用、零改动。

---

## T1 — `useProbe.ts` 7 格扁平表 + 线性探测（L3，先写测试）

**先写失败测试** `src/components/structures/useProbe.spec.ts`（`TC-PROBE-LOGIC-*`）：见 test-cases.md 10 条。要点：

- 初始 `slots == [null,15,8,23,4,null,null]`、`size==4`、`load≈0.571`、`isFull==false`。
- `hash`：15→1、8→1、23→2、4→4。
- `insert(5)` 非冲突：`{ok,slot:5,path:[5],collision:false}`；`insert(9)` 冲突：`{ok,slot:5,path:[2,3,4,5],collision:true}`；`insert(15)` dup。
- `search(15)`：`{found,slot:1,steps:1}`；`search(8)`：`{found,slot:2,steps:2}`；`search(99)`：`{found:false,steps:5,path 末位空槽}`。
- 填满再插 → `{ok:false,reason:'full'}`（不死循环）；`reset` 复原；`has(8)==true`、`has(99)==false`。

**实现** `src/components/structures/useProbe.ts`（见 design §2）：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

/** 扁平表格数：散列 key % 7 */
export const PROBE_SLOTS = 7;

export interface ProbeInsert {
  ok: boolean;
  reason?: 'dup' | 'full';
  home: number;
  slot: number;
  path: number[];
  collision: boolean;
}
export interface ProbeSearch {
  found: boolean;
  home: number;
  slot: number;
  path: number[];
  steps: number;
}
export interface UseProbe {
  slots: Ref<(number | null)[]>;
  size: ComputedRef<number>;
  load: ComputedRef<number>;
  isFull: ComputedRef<boolean>;
  hash: (key: number) => number;
  has: (key: number) => boolean;
  insert: (key: number) => ProbeInsert;
  search: (key: number) => ProbeSearch;
  reset: () => void;
}

/** 初始预填：探测后落 [_,15,8,23,4,_,_]（格 1-2-3 成一簇） */
const INITIAL = [15, 8, 23, 4];

export function useProbe(): UseProbe {
  const slots = ref<(number | null)[]>([]);

  const hash = (key: number): number => key % PROBE_SLOTS;
  const size = computed(() => slots.value.filter((s) => s !== null).length);
  const load = computed(() => size.value / PROBE_SLOTS);
  const isFull = computed(() => size.value >= PROBE_SLOTS);

  const search = (key: number): ProbeSearch => {
    const home = hash(key);
    const path: number[] = [];
    let i = home;
    for (let c = 0; c < PROBE_SLOTS; c++) {
      path.push(i);
      if (slots.value[i] === null)
        return { found: false, home, slot: -1, path, steps: path.length };
      if (slots.value[i] === key) return { found: true, home, slot: i, path, steps: path.length };
      i = (i + 1) % PROBE_SLOTS;
    }
    return { found: false, home, slot: -1, path, steps: path.length };
  };
  const has = (key: number): boolean => search(key).found;

  const insert = (key: number): ProbeInsert => {
    const home = hash(key);
    if (has(key))
      return { ok: false, reason: 'dup', home, slot: -1, path: [home], collision: false };
    if (isFull.value)
      return { ok: false, reason: 'full', home, slot: -1, path: [], collision: false };
    const path: number[] = [];
    let i = home;
    while (slots.value[i] !== null) {
      path.push(i);
      i = (i + 1) % PROBE_SLOTS;
    }
    path.push(i);
    slots.value[i] = key;
    return { ok: true, home, slot: i, path, collision: path.length > 1 };
  };

  const reset = (): void => {
    slots.value = Array.from({ length: PROBE_SLOTS }, () => null);
    for (const k of INITIAL) insert(k);
  };

  reset();
  return { slots, size, load, isFull, hash, has, insert, search, reset };
}
```

**验证**：`pnpm test:unit run src/components/structures/useProbe.spec.ts`。

---

## T2 — `HashProbeViz.vue` 线性探测互动（L4，先写测试）

**先写失败测试** `src/components/structures/HashProbeViz.spec.ts`（`TC-VIZ-PROBEVIZ-*`，8 条，见 test-cases.md）。`btn` 用稳定子串（插入/查找/重置）；同步断言 slots filled 数与 status 文本，不推进计时器。填满用连点插入（7→格0、5→格5、6→格6）。

**实现** `src/components/structures/HashProbeViz.vue`（见 design §3；用 `useProbe` + 扁平表）。骨架：

```vue
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useProbe, PROBE_SLOTS } from './useProbe';

const h = useProbe();
const val = ref(9);
const status = ref('输入一个数，点「插入」——撞了就在表内往后探一格。');
const homeMark = ref(-1);
const probeAt = ref(-1);
const landAt = ref(-1);
const hitAt = ref(-1);
const enterAt = ref(-1);
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const clearMarks = () => {
  homeMark.value = -1;
  probeAt.value = -1;
  landAt.value = -1;
  hitAt.value = -1;
  enterAt.value = -1;
};
const pct = computed(() => Math.round(h.load.value * 100));
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
  busy.value = true;
  clearMarks();
  const r = h.insert(v); // 同步：查重 / 满 / 探测落座
  homeMark.value = r.home;
  if (!r.ok && r.reason === 'dup') {
    status.value = `查 ${v}：探测命中，${v} 已在表里，不重复插入。`;
  } else if (!r.ok && r.reason === 'full') {
    status.value = '表满了（装载因子 = 7/7 = 1）—— 该扩容 rehash 了。';
  } else {
    enterAt.value = r.slot;
    status.value = r.collision
      ? `hash(${v}) = ${v} % 7 = ${r.home}，被占 → 线性探测往后，第 ${r.slot} 号落座（探测 ${r.path.length} 次）。`
      : `hash(${v}) = ${v} % 7 = ${r.home}，${r.home} 号空 → 直接落座（探测 1 次）。`;
    for (let k = 0; k < r.path.length; k++) {
      const idx = r.path[k];
      if (k < r.path.length - 1) {
        probeAt.value = idx;
        await sleep(560);
        probeAt.value = -1;
      } else {
        enterAt.value = -1;
        landAt.value = idx;
        await sleep(640);
      }
    }
  }
  await sleep(600);
  clearMarks();
  busy.value = false;
};

const onSearch = async () => {
  if (busy.value) return;
  const v = validVal();
  if (v === null) return;
  busy.value = true;
  clearMarks();
  const r = h.search(v); // 同步：found + slot + steps
  homeMark.value = r.home;
  status.value = r.found
    ? `查找 ${v}：从 ${r.home} 号起线性探测 ${r.steps} 次，在 ${r.slot} 号命中！`
    : `查找 ${v}：从 ${r.home} 号起探测 ${r.steps} 次遇到空位 → 不在表中。`;
  for (let k = 0; k < r.path.length; k++) {
    const idx = r.path[k];
    probeAt.value = idx;
    await sleep(540);
    if (r.found && idx === r.slot) {
      probeAt.value = -1;
      hitAt.value = idx;
      break;
    }
    probeAt.value = -1;
  }
  await sleep(720);
  clearMarks();
  busy.value = false;
};

const onReset = () => {
  clearTimers(); // 重置可随时中断探测动画
  busy.value = false;
  clearMarks();
  h.reset();
  status.value = '已重置 · [_,15,8,23,4,_,_]，格 1-2-3 成一簇。输入一个数试试。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="probe-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="val" type="number" min="1" max="99" />
      <button class="btn" :disabled="busy" @click="onInsert">插入</button>
      <button class="btn" :disabled="busy" @click="onSearch">查找</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <div v-for="(s, i) in h.slots.value" :key="i" class="slot">
          <div
            class="cell"
            :class="{
              filled: s !== null,
              home: homeMark === i,
              probe: probeAt === i,
              land: landAt === i,
              hit: hitAt === i,
              enter: enterAt === i,
            }"
          >
            {{ s !== null && enterAt !== i ? s : '' }}
          </div>
          <div class="idx">{{ i }}</div>
        </div>
      </div>
    </div>
    <div class="readout">
      <span class="lf-label">装载因子</span>
      <span class="lf-val" :class="{ full: h.isFull.value }"
        >{{ h.size.value }}/{{ PROBE_SLOTS }}</span
      >
      <span class="lf-pct">≈ {{ pct }}%</span>
      <span class="bar"><i :class="{ full: h.isFull.value }" :style="{ width: pct + '%' }" /></span>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 扁平 7 格(空 inset/filled 浅绿凸起/home 虚框/probe 黄上浮/land 绿/hit 深绿/enter 渐入) + 装载因子条(近满橙)；画布定宽高；取原型样式 */
</style>
```

注：`insert`/`search` 同步改 slots、同步置 status（L4 同步断言），走位点亮延时（卸载清理、busy 防重入）；`reset` 中断动画。**验证**：`pnpm test:unit run src/components/structures/HashProbeViz.spec.ts`。

---

## T3 — `Hash.vue` 加节（L4，先写测试）

**先写失败测试**：在 `src/views/Article/DataStructure/Hash.spec.ts` **追加** `TC-VIEW-HASH-03`（不改 01/02）：

```ts
import HashProbeViz from '@/components/structures/HashProbeViz.vue';
// …
it('TC-VIEW-HASH-03 哈希页含 HashProbeViz（开放寻址节）', () => {
  const w = mountIt();
  expect(w.findComponent(HashProbeViz).exists()).toBe(true);
});
```

**实现**：在 `Hash.vue` 拉链正文 `</p>` 后、`<h2>哈希表在哪里用</h2>` 前插入「另一种解冲突：开放寻址」节（见 design §4），import `HashProbeViz`。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Hash.spec.ts`（3 Case 全绿）。

---

## T4 — e2e（L5，Playwright）

在 `e2e/hash.e2e.ts` **追加** `TC-E2E-HASH-02`（导航 `/docs/hash`、限定 `.probe-viz`）：初始 7 `.cell`、4 `.cell.filled`；输入 9 → 插入 → `.status` 含「探测」；输入 99 → 查找 → `.status` 含「不在表中」；重置 → 回 4 `.cell.filled`。**并修一处回归**：`TC-E2E-HASH-01` 第 7 行 `page.locator('.playground')`（两个 Playground 后命中 2 个、严格模式）→ `.first()`。**验证**：`pnpm exec playwright test e2e/hash.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（D2 出池/完成），提交 main。

## 自测报告（实现期回填）

- [x] T1 useProbe 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；线性探测 insert 非冲突/冲突(9→探2,3,4落5)/dup/full、search 命中(15→1步,8→2步)/未命中(99→空止5步)、has、reset、满表守卫不死循环，一次通过
- [x] T2 HashProbeViz 全绿（8 Case）— insert/search 同步改 slots + 同步置 status（L4 同步断言 filled 数/status 文本，不推进计时器）、探测走位延时（卸载清理、busy 防重入）、reset 中断；填满 TC 用 `vi.useFakeTimers()` + `runAllTimersAsync` 排空动画连插 3 次（7→0/5→5/6→6）再验 full
- [x] T3 哈希页 TC-VIEW-HASH-03 绿（Hash.spec 3 Case 全绿、01/02 不回归）
- [x] T4 e2e 全绿（TC-E2E-HASH-01 修 `.first()` + 新增 TC-E2E-HASH-02）— 真机另验（dev server 截图）：7 格扁平表、格 1-2-3 成簇（15/8/23）+ 格4、空格 0/5/6 凹陷、装载因子 4/7 进度条；**修一处回归**：加第二个 Playground 后 TC-E2E-HASH-01 第 7 行 `.playground` 命中 2 个（Playwright 严格模式）→ 改 `.first()` 消歧（断言意图不变）
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（Hash.vue/useProbe.ts 经 prettier --write）/ coverage All files 92.25%/89.38%/93.16%/93.33%（聚合过门槛）
- [x] 单测 564 passed（85 文件，含新增 19 单测 Case）+ e2e 20 passed（含新增 1）；HashViz/useHash + 8 排序 + 其余结构 + 播放器 零回归；**M4 深度 D2 完成**
