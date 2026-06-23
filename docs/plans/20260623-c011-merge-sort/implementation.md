# 归并排序动画 实现计划

> Status: draft
> Stable ID: C-20260623-011
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Progress: 0%
> Blocked by: none
> Next action: 按 Task 1→8 逐个 TDD 落地
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007、C-20260621-008、C-20260622-010
> Related tests: test-cases.md
> Related design: design.md

> **For agentic workers:** 本计划用 superpowers:executing-plans（inline）或 superpowers:subagent-driven-development 逐 Task 执行。步骤用 `- [ ]` 复选框跟踪。每个 Task 结束都有可独立测试的交付物。

**Goal:** 用 C-006「算法播放器」框架接入归并排序——自底向上迭代（`width` 倍增、相邻段合并），主轨复用 C-010 的 `groupMembers`/`dimmed` 聚焦当前合并段，新增一条辅助数组轨 `AuxView` 表达 `temp` 的逐格填充与拷回，呈现归并「借 O(n) 额外空间合并两段有序」动画；纯加法 + 一处外壳条件渲染，前四个算法零回归。

**Architecture:** 归并排序实现一个 `AlgorithmModule<MergeExecPoint>`（插桩 `buildSteps` 产胖步骤，每步带 `aux` 辅助轨快照 + 四语言源码与行映射）。主轨可视化 `BarsView` 零改动（合并段聚焦/淡化复用 `groupMembers`→`dimmed`）；辅助轨是唯一新可视化：`Step` 加可选 `aux?: AuxTrack`，`AlgorithmPlayer` 在主轨下 `v-if="current.aux"` 渲染新组件 `AuxView`。`writeBack` 时主轨段元素（稳定 id）FLIP 平移重排。归并稳定，但本计划以「各趟 width 后各段有序」与 oracle 交叉校验为核心不变量。

**Tech Stack:** Vue 3 `<script setup>` + TypeScript + Pinia + Less；语法高亮复用现有 Shiki（`useHighlighter`）；测试 Vitest + @vue/test-utils（L3/L4）+ Playwright（L5）。

## Global Constraints

- 包管理器 **pnpm**（corepack，版本锁 `packageManager`）；禁用 npm/yarn。
- 路径别名 `@` → `src/`；优先 `@/...`。
- Less 全局混入（`.neumorphism-*`、`.row()`、`.center()`、颜色变量如 `@font-color`）已由 `vite.config.ts` 的 `additionalData` 注入，**组件内无需 import**。
- 多语言代码仅展示；动画唯一真相源是内置 TS 步骤流。单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，**不依赖异步 `delay`**。
- 语言集固定四门：**TypeScript / Python / Go / Rust**；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：`types.ts` 加 `MergeExecPoint` + `AuxTrack` + `Step.aux?`、`Bar` 加 `empty` 态、`AlgorithmPlayer` 加 `v-if` 渲染 `AuxView` 后，冒泡 / 选择 / 插入 / 希尔四侧**零行为变化**，全量现有 Case 保持绿，且四者页面**不渲染** `AuxView`。
- 柱态优先级（主轨，**不变**）：`key > sorted > swapped > min > comparing > dimmed > idle`；`empty` 仅用于辅助轨，不进主轨 `stateOf`。
- **分治策略固定自底向上**：`width = 1` 逐次 `*= 2`，`width < n` 时继续；残段 `mid >= hi` 跳过。初始数据沿用 `[7,6,5,10,9,8,4,3,2,1]`。
- 指针：主轨 id `'0'`=i(红，左段游标)/`'1'`=j(蓝，右段游标)，取 `colors[0/1]`；辅助轨 k 用 id `'2'`（黄，`colors[2]`）。`temp` 已填槽 `sorted` 绿、未填槽 `empty` 虚框。
- 门禁：`pnpm lint:check` + `pnpm format:check` + `pnpm type-check` 必须绿；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）。提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

---

### Task 1: 数据契约加法（`types`）+ `Bar` empty 态（L4）

`types.ts` 加 `MergeExecPoint` union + `AuxTrack` 接口 + `Step.aux?`（纯加法）；`Bar` 加 `empty` 态（虚框空槽 + empty 时不显示数值）。冒泡 / 选择 / 插入 / 希尔路径不受影响——它们 `Step` 不设 `aux`、`stateOf` 不返回 `empty`。

**Files:**

- Modify: `src/components/player/types.ts`
- Modify: `src/components/Bar.vue`
- Test: `src/components/Bar.spec.ts`（追加 1 case）

**Interfaces:**

- Produces（后续 Task 依赖）：
  - `MergeExecPoint = 'widthChange'|'mergeStart'|'compare'|'takeLeft'|'takeRight'|'drainLeft'|'drainRight'|'writeBack'|'done'`
  - `AuxTrack = { array: [string,number][]; filled: number[]; pointer?: number; activeRange?: [number,number] }`
  - `Step.aux?: AuxTrack`
  - `Bar` 的 `state` 扩为 `'idle'|'comparing'|'swapped'|'sorted'|'min'|'key'|'dimmed'|'empty'`

- [ ] **Step 1: 追加 Bar 失败测试 `src/components/Bar.spec.ts`**

在 `describe('Bar', () => { ... })` 末尾、闭合 `});` 之前追加：

```ts
it('TC-VIZ-BAR-07 state=empty 时柱体加 empty class 且不显示数值', () => {
  const w = mount(Bar, { props: { value: 7, percent: 0, state: 'empty' } });
  expect(w.find('.bar').classes()).toContain('empty');
  expect(w.find('.val').text()).toBe(''); // 空槽不显示数值
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: FAIL（`state: 'empty'` 不被类型接受 / 无 `.bar.empty` 类 / `.val` 仍显示 7）

- [ ] **Step 3: 改 `src/components/Bar.vue`**

`defineProps` 的 `state` 类型加 `'empty'`：

```ts
defineProps<{
  value: number;
  percent: number;
  state: 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' | 'dimmed' | 'empty';
}>();
```

模板里 `.val` 改为 empty 时显示空格（保留占位高度）：

```vue
<span class="val">{{ state === 'empty' ? ' ' : value }}</span>
```

`<style>` 的 `.bar.dimmed { ... }` 之后追加：

```less
.bar.empty {
  background-color: transparent;
  border: 2px dashed fade(@font-color, 35%);
  box-shadow: none;
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: PASS（7 个 case）

- [ ] **Step 5: 给 `types.ts` 加 `MergeExecPoint` + `AuxTrack` + `Step.aux?`**

在 `ShellExecPoint` 定义之后追加：

```ts
/** 归并排序的执行点（自底向上：width 倍增 → 逐对合并 → 比较取小写 temp → 收尾 drain → 拷回） */
export type MergeExecPoint =
  | 'widthChange'
  | 'mergeStart'
  | 'compare'
  | 'takeLeft'
  | 'takeRight'
  | 'drainLeft'
  | 'drainRight'
  | 'writeBack'
  | 'done';
```

在 `Step` 接口定义**之前**追加 `AuxTrack`：

```ts
/** 辅助数组轨（temp）快照——归并排序专用，与主轨等长、上下对齐 */
export interface AuxTrack {
  array: [string, number][]; // 定长 = 主轨长度；位置 id 't0'..'t{n-1}'（稳定渲染）
  filled: number[]; // 已写入的下标集；不在其中 → empty 空槽
  pointer?: number; // k 写入位（ArrowTrack 取 colors[2]=yellow）
  activeRange?: [number, number]; // 当前合并段 [lo, hi)
}
```

在 `Step` 接口的 `caption?: string;` 之后追加字段：

```ts
  aux?: AuxTrack; // 纯加法：归并的辅助轨；其它算法不设 → AuxView 不渲染
```

- [ ] **Step 6: type-check + 全量回归（向后兼容硬关卡）**

Run: `pnpm type-check && pnpm test:unit run`
Expected: type-check 绿；全部现有单测通过（前四算法 + `Bar`/`BarsView`/`AlgorithmPlayer`/`CodePanel` 零回归，Bar 新增 1 case）。

- [ ] **Step 7: 提交**

```bash
git add src/components/player/types.ts src/components/Bar.vue src/components/Bar.spec.ts
git commit -m "feat(viz): types 加 MergeExecPoint/AuxTrack/Step.aux + Bar empty 空槽态（L4）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `AuxView` 辅助数组轨组件（L4）

新增 `AuxView.vue`：渲染 `temp` 轨——一排槽（已填 `sorted` 绿 / 未填 `empty` 虚框）+ `k` 写入指针（`colors[2]` 黄）。percent 以主数组 min/max 为基准（两轨同尺度）。内部复用 `Bar` 与 `ArrowTrack`。

**Files:**

- Create: `src/components/AuxView.vue`
- Test: `src/components/AuxView.spec.ts`（新建）

**Interfaces:**

- Consumes: `AuxTrack`（Task 1）、`Bar` 的 `empty`/`sorted` 态（Task 1）、`ArrowTrack`（既有，`data: Pointer[]` + `slotWidth`）
- Produces: `AuxView` 组件，props `{ aux: AuxTrack; mainArray: [string,number][]; slotWidth?: number }`；根元素 class `aux-view`；内部主体 class `bars`

- [ ] **Step 1: 写失败测试 `src/components/AuxView.spec.ts`**

```ts
// src/components/AuxView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AuxView from './AuxView.vue';
import type { AuxTrack } from '@/components/player/types';

const main: [string, number][] = [
  ['0', 7],
  ['1', 6],
  ['2', 5],
  ['3', 10],
];
const mountIt = (aux: AuxTrack, mainArray = main) =>
  mount(AuxView, { props: { aux, mainArray }, global: { plugins: [createPinia()] } });

describe('AuxView', () => {
  it('TC-VIZ-AUXVIEW-01 渲染与 aux.array 等长的槽', () => {
    const aux: AuxTrack = {
      array: [
        ['t0', 0],
        ['t1', 0],
        ['t2', 0],
        ['t3', 0],
      ],
      filled: [],
    };
    expect(mountIt(aux).findAll('.bar-cell')).toHaveLength(4);
  });

  it('TC-VIZ-AUXVIEW-02 filled 的槽为 sorted、其余为 empty', () => {
    const aux: AuxTrack = {
      array: [
        ['t0', 5],
        ['t1', 6],
        ['t2', 0],
        ['t3', 0],
      ],
      filled: [0, 1],
    };
    const bars = mountIt(aux).findAll('.bar');
    expect(bars[0].classes()).toContain('sorted');
    expect(bars[1].classes()).toContain('sorted');
    expect(bars[2].classes()).toContain('empty');
    expect(bars[3].classes()).toContain('empty');
  });

  it('TC-VIZ-AUXVIEW-03 pointer 定位 k 箭头到对应槽', () => {
    const aux: AuxTrack = {
      array: [
        ['t0', 5],
        ['t1', 0],
      ],
      filled: [0],
      pointer: 1,
    };
    const arrow = mountIt(aux).find('.arrow');
    expect(arrow.exists()).toBe(true);
    expect(arrow.attributes('style')).toContain('translateX(60px)'); // index 1 * slotWidth 60
  });

  it('TC-VIZ-AUXVIEW-04 无 pointer 时不渲染箭头', () => {
    const aux: AuxTrack = {
      array: [
        ['t0', 0],
        ['t1', 0],
      ],
      filled: [],
    };
    expect(mountIt(aux).find('.arrow').exists()).toBe(false);
  });

  it('TC-VIZ-AUXVIEW-05 filled 槽高度用主轨 min/max 同尺度', () => {
    // 主轨值域 5..10；temp 槽值 10（最大）→ percent=1 → height=30+1*130=160px
    const aux: AuxTrack = {
      array: [
        ['t0', 10],
        ['t1', 0],
      ],
      filled: [0],
    };
    const bar0 = mountIt(aux, [
      ['0', 5],
      ['1', 10],
    ]).findAll('.bar')[0];
    expect(bar0.attributes('style')).toContain('height: 160px');
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/AuxView.spec.ts`
Expected: FAIL（`AuxView.vue` 不存在）

- [ ] **Step 3: 新建 `src/components/AuxView.vue`**

```vue
<!-- src/components/AuxView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { AuxTrack } from '@/components/player/types';
import ArrowTrackComp from './ArrowTrack.vue';
import BarComp from './Bar.vue';

const props = withDefaults(
  defineProps<{
    aux: AuxTrack;
    mainArray: [string, number][]; // 用主轨 min/max 算 percent，两轨同尺度可比
    slotWidth?: number;
  }>(),
  { slotWidth: 60 },
);

const min = computed(() => Math.min(...props.mainArray.map((t) => t[1])));
const max = computed(() => Math.max(...props.mainArray.map((t) => t[1])));
const vizWidth = computed(() => props.aux.array.length * props.slotWidth);
const filledSet = computed(() => new Set(props.aux.filled));
const pointers = computed(() =>
  props.aux.pointer === undefined ? [] : [{ id: '2', index: props.aux.pointer }],
);

function percent(v: number): number {
  const span = max.value - min.value;
  if (span === 0) return 1;
  return 0.08 + 0.92 * ((v - min.value) / span);
}
function stateOf(index: number): 'sorted' | 'empty' {
  return filledSet.value.has(index) ? 'sorted' : 'empty';
}
</script>
<template>
  <div class="aux-view column center">
    <div class="row bars">
      <BarComp
        v-for="(item, index) in props.aux.array"
        :key="item[0]"
        :value="item[1]"
        :percent="stateOf(index) === 'empty' ? 0 : percent(item[1])"
        :state="stateOf(index)"
        :style="{ width: props.slotWidth + 'px' }"
      />
    </div>
    <ArrowTrackComp
      :data="pointers"
      :slot-width="props.slotWidth"
      :style="{ width: vizWidth + 'px' }"
    />
  </div>
</template>
<style scoped lang="less">
.bars {
  align-items: flex-end;
  min-height: 180px;
}
</style>
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/AuxView.spec.ts`
Expected: PASS（5 个 case）

- [ ] **Step 5: 提交**

```bash
git add src/components/AuxView.vue src/components/AuxView.spec.ts
git commit -m "feat(viz): 新增 AuxView 辅助数组轨（temp 槽已填/空 + k 指针，同尺度 percent）（L4）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `AlgorithmPlayer` 条件渲染 `AuxView`（外壳，L4）

`AlgorithmPlayer.vue` 在主 `BarsView` 之下加 `<AuxView v-if="current.aux" … />`——唯一外壳改动。前四个算法 `current.aux === undefined`，`v-if` 短路、不渲染。本 Task 的硬关卡是**前四算法回归绿、且不渲染 `AuxView`**。

**Files:**

- Modify: `src/components/player/AlgorithmPlayer.vue`
- Test: `src/components/player/AlgorithmPlayer.spec.ts`（追加 2 case）

**Interfaces:**

- Consumes: `AuxView`（Task 2）、`Step.aux`（Task 1）、`AlgorithmModule`/`Step`（既有）
- Produces: `AlgorithmPlayer` 在 `current.aux` 为真时渲染 `AuxView`，否则不渲染

- [ ] **Step 1: 追加失败测试 `src/components/player/AlgorithmPlayer.spec.ts`**

文件顶部 import 区追加：

```ts
import AuxView from '@/components/AuxView.vue';
import type { AlgorithmModule, Step } from './types';
```

在 `describe('AlgorithmPlayer', () => { ... })` 末尾、闭合 `});` 之前追加：

```ts
// 内联最小 module：单步带 aux，用于验证外壳条件渲染（不依赖归并模块）
const auxModule: AlgorithmModule = {
  title: 'aux-test',
  initialInput: () => [3, 1, 2],
  buildSteps: (): Step[] => [
    {
      array: [
        ['0', 3],
        ['1', 1],
        ['2', 2],
      ],
      pointers: [],
      emphasis: {},
      vars: [],
      point: 'mergeStart',
      aux: {
        array: [
          ['t0', 0],
          ['t1', 0],
          ['t2', 0],
        ],
        filled: [],
        pointer: 0,
      },
    },
  ],
  sources: [{ lang: 'ts', label: 'TS', code: 'line1', lineMap: { mergeStart: 1 } }],
};

it('TC-PLAYER-AUX-01 module 无 aux 时不渲染 AuxView（前四算法向后兼容）', async () => {
  const w = mountIt(); // bubbleSortModule，无 aux
  await flushPromises();
  expect(w.findComponent(AuxView).exists()).toBe(false);
});

it('TC-PLAYER-AUX-02 当前步带 aux 时渲染 AuxView', async () => {
  const w = mount(AlgorithmPlayer, {
    props: { module: auxModule },
    global: { plugins: [createPinia()] },
  });
  await flushPromises();
  expect(w.findComponent(AuxView).exists()).toBe(true);
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/player/AlgorithmPlayer.spec.ts`
Expected: FAIL（TC-PLAYER-AUX-02：`AuxView` 未被渲染）

- [ ] **Step 3: 改 `src/components/player/AlgorithmPlayer.vue`**

`<script setup>` import 区追加：

```ts
import AuxView from '@/components/AuxView.vue';
```

模板里 `BarsView` 那一行之后、`<p class="caption">` 之前插入：

```vue
<AuxView v-if="current.aux" :aux="current.aux" :main-array="current.array" />
```

- [ ] **Step 4: 运行测试，确认通过 + 前四算法回归**

Run: `pnpm test:unit run src/components/player/AlgorithmPlayer.spec.ts && pnpm test:unit run`
Expected: PASS；全量单测绿（冒泡 / 选择 / 插入 / 希尔视图与 module 全绿，均不渲染 `AuxView`）。

- [ ] **Step 5: 提交**

```bash
git add src/components/player/AlgorithmPlayer.vue src/components/player/AlgorithmPlayer.spec.ts
git commit -m "feat(viz): AlgorithmPlayer 主轨下条件渲染 AuxView（current.aux 为真，前四算法零回归）（L4）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: `merge-sort.ts` oracle 纯函数（L3）

自底向上归并 oracle，返回每趟 `width` 后的数组快照，作为 `buildSteps` 的正确性交叉校验基准。

**Files:**

- Create: `src/algorithms/merge-sort.ts`
- Test: `src/algorithms/merge-sort.spec.ts`（新建）

**Interfaces:**

- Produces: `mergeSortPasses(input: number[]): MergePass[]`，`MergePass = { width: number; array: number[] }`；空/单元素返回 `[]`

- [ ] **Step 1: 写失败测试 `src/algorithms/merge-sort.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mergeSortPasses } from './merge-sort';

const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
const lastArr = (input: number[]) => {
  const p = mergeSortPasses(input);
  return p.length ? p[p.length - 1].array : [...input];
};

describe('mergeSortPasses', () => {
  it('TC-MERGE-ALGO-01 空数组与单元素不产生 pass', () => {
    expect(mergeSortPasses([])).toEqual([]);
    expect(mergeSortPasses([5])).toEqual([]);
  });

  it('TC-MERGE-ALGO-02 基准数据最终升序', () => {
    expect(lastArr(BASE)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-MERGE-ALGO-03 含重复元素结果正确', () => {
    expect(lastArr([3, 1, 2, 3, 1])).toEqual([1, 1, 2, 3, 3]);
  });

  it('TC-MERGE-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    mergeSortPasses(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-MERGE-ALGO-05 width 序列为 1,2,4,…（<n）', () => {
    expect(mergeSortPasses(BASE).map((p) => p.width)).toEqual([1, 2, 4, 8]); // n=10
    expect(mergeSortPasses([5, 3, 8, 1]).map((p) => p.width)).toEqual([1, 2]); // n=4
  });

  it('TC-MERGE-ALGO-06 已升序输入幂等（最终仍升序）', () => {
    expect(lastArr([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('TC-MERGE-ALGO-07 逆序输入最终升序', () => {
    expect(lastArr([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it('TC-MERGE-ALGO-08 每趟 width 后每个 2*width 块内部有序（核心不变量）', () => {
    for (const { width, array } of mergeSortPasses(BASE)) {
      const blk = 2 * width;
      for (let lo = 0; lo < array.length; lo += blk) {
        const seg = array.slice(lo, Math.min(lo + blk, array.length));
        expect(seg).toEqual([...seg].sort((a, b) => a - b));
      }
    }
  });

  it('TC-MERGE-ALGO-09 随机用例与 Array.sort 交叉校验', () => {
    const cases = [[2], [], [9, 9, 9], [4, 1, 4, 1, 5, 9, 2, 6], [10, -3, 0, 7, 7, -3]];
    for (const c of cases) {
      expect(lastArr(c)).toEqual([...c].sort((a, b) => a - b));
    }
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/merge-sort.spec.ts`
Expected: FAIL（`merge-sort.ts` 不存在）

- [ ] **Step 3: 新建 `src/algorithms/merge-sort.ts`**

```ts
export interface MergePass {
  width: number; // 该趟步长
  array: number[]; // 该趟所有相邻段合并后的数组快照
}

/** 自底向上归并排序（width=1 逐次 ×2），返回每趟 width 后的快照（纯函数，不改入参） */
export function mergeSortPasses(input: number[]): MergePass[] {
  const arr = [...input];
  const n = arr.length;
  const passes: MergePass[] = [];
  const temp = new Array<number>(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      if (mid >= hi) continue; // 残段，无右段可合并
      let i = lo;
      let j = mid;
      let k = lo;
      while (i < mid && j < hi) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
      }
      while (i < mid) temp[k++] = arr[i++];
      while (j < hi) temp[k++] = arr[j++];
      for (let t = lo; t < hi; t++) arr[t] = temp[t];
    }
    passes.push({ width, array: [...arr] });
  }
  return passes;
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/merge-sort.spec.ts`
Expected: PASS（9 个 case）

- [ ] **Step 5: 提交**

```bash
git add src/algorithms/merge-sort.ts src/algorithms/merge-sort.spec.ts
git commit -m "feat(algo): 归并排序纯逻辑 oracle mergeSortPasses（自底向上，L3）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: `merge-sort.sources.ts` 四语言 + `merge-sort.module.ts` buildSteps（L3）

四语言自底向上源码 + `lineMap`；插桩 `buildSteps` 产胖步骤（每步带 `aux`），与 oracle 交叉校验。

**Files:**

- Create: `src/algorithms/merge-sort.sources.ts`
- Create: `src/algorithms/merge-sort.module.ts`
- Test: `src/algorithms/merge-sort.module.spec.ts`（新建）

**Interfaces:**

- Consumes: `MergeExecPoint`/`AuxTrack`/`Step`/`AlgorithmModule`/`VarRow`/`LangSource`（Task 1 + 既有）、`mergeSortPasses`（Task 4）
- Produces:
  - `mergeSortSources: LangSource<MergeExecPoint>[]`（四门，每门 `lineMap` 覆盖 9 个执行点）
  - `buildMergeSortSteps(input: number[]): Step<MergeExecPoint>[]`
  - `mergeSortModule: AlgorithmModule<MergeExecPoint>`（`initialInput: () => [7,6,5,10,9,8,4,3,2,1]`）

- [ ] **Step 1: 写失败测试 `src/algorithms/merge-sort.module.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mergeSortPasses } from './merge-sort';
import { buildMergeSortSteps, mergeSortModule } from './merge-sort.module';
import type { MergeExecPoint, Step } from '@/components/player/types';

const EXEC_POINTS: MergeExecPoint[] = [
  'widthChange',
  'mergeStart',
  'compare',
  'takeLeft',
  'takeRight',
  'drainLeft',
  'drainRight',
  'writeBack',
  'done',
];
const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
const num = (s: Step<MergeExecPoint>, name: string) =>
  Number(s.vars.find((v) => v.name === name)!.value);

describe('buildMergeSortSteps', () => {
  it('TC-MERGE-MOD-01 空/单元素也产出至少一个 done 步', () => {
    expect(buildMergeSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildMergeSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('TC-MERGE-MOD-02 末步数组与 oracle 最终结果一致（交叉校验，升序）', () => {
    const values = buildMergeSortSteps(BASE)
      .at(-1)!
      .array.map((t) => t[1]);
    expect(values).toEqual(mergeSortPasses(BASE).at(-1)!.array);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-MERGE-MOD-03 每步主轨 array 的 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildMergeSortSteps([3, 1, 2, 5]);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('TC-MERGE-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildMergeSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-MERGE-MOD-05 每步 point 合法；compare 步必带 comparing', () => {
    for (const s of buildMergeSortSteps([5, 3, 8, 1, 9, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'compare') expect(Array.isArray(s.emphasis.comparing)).toBe(true);
    }
  });

  it('TC-MERGE-MOD-06 widthChange 步的 width 依次为 1,2,4,…', () => {
    const widths = buildMergeSortSteps(BASE)
      .filter((s) => s.point === 'widthChange')
      .map((s) => num(s, 'width'));
    expect(widths).toEqual([1, 2, 4, 8]); // n=10
  });

  it('TC-MERGE-MOD-07 各 width 趟边界数组与 oracle 快照一致', () => {
    const steps = buildMergeSortSteps(BASE);
    const passes = mergeSortPasses(BASE);
    const wc = steps.filter((s) => s.point === 'widthChange');
    for (let k = 1; k < wc.length; k++) {
      expect(wc[k].array.map((t) => t[1])).toEqual(passes[k - 1].array);
    }
    expect(steps.at(-1)!.array.map((t) => t[1])).toEqual(passes.at(-1)!.array);
  });

  it('TC-MERGE-MOD-08 每个 mergeStart 的 groupMembers/activeRange = [lo,hi)', () => {
    for (const s of buildMergeSortSteps(BASE).filter((x) => x.point === 'mergeStart')) {
      const lo = num(s, 'lo');
      const hi = num(s, 'hi');
      const expected: number[] = [];
      for (let m = lo; m < hi; m++) expected.push(m);
      expect(s.emphasis.groupMembers).toEqual(expected);
      expect(s.aux!.activeRange).toEqual([lo, hi]);
    }
  });

  it('TC-MERGE-MOD-09 一对合并内 aux.filled 单调增长（temp 只填不删）', () => {
    let prevLen = -1;
    for (const s of buildMergeSortSteps(BASE)) {
      if (s.point === 'mergeStart') {
        expect(s.aux!.filled).toEqual([]);
        prevLen = 0;
        continue;
      }
      if (s.point === 'widthChange' || s.point === 'done') {
        prevLen = -1;
        continue;
      }
      if (!s.aux || prevLen < 0) continue;
      expect(s.aux.filled.length).toBeGreaterThanOrEqual(prevLen);
      prevLen = s.aux.filled.length;
    }
  });

  it('TC-MERGE-MOD-10 writeBack 后主轨 [lo,hi) 段升序', () => {
    for (const s of buildMergeSortSteps(BASE).filter((x) => x.point === 'writeBack')) {
      const lo = num(s, 'lo');
      const hi = num(s, 'hi');
      const seg = s.array.slice(lo, hi).map((t) => t[1]);
      expect(seg).toEqual([...seg].sort((a, b) => a - b));
    }
  });

  it('TC-MERGE-MOD-11 done 步标 sortedFrom=0、aux 无 filled', () => {
    const done = buildMergeSortSteps([5, 3, 8, 1]).at(-1)!;
    expect(done.point).toBe('done');
    expect(done.emphasis.sortedFrom).toBe(0);
    expect(done.aux!.filled).toEqual([]);
  });

  it('TC-MERGE-MOD-12 take 步 temp 写入位的值 = 所取元素值', () => {
    for (const s of buildMergeSortSteps(BASE)) {
      if (s.point !== 'takeLeft' && s.point !== 'takeRight') continue;
      const k = s.aux!.pointer! - 1; // pointer 是写入后的 k+1
      const written = s.aux!.array[k][1];
      const ai = num(s, 'a[i]');
      const aj = num(s, 'a[j]');
      expect(written).toBe(s.point === 'takeLeft' ? ai : aj);
    }
  });

  it('TC-MERGE-MOD-13 每步主轨指针 clamp 在 [0,n-1]、aux.pointer 在 [0,n]', () => {
    for (const s of buildMergeSortSteps(BASE)) {
      for (const p of s.pointers) {
        expect(p.index).toBeGreaterThanOrEqual(0);
        expect(p.index).toBeLessThanOrEqual(BASE.length - 1);
      }
      if (s.aux?.pointer !== undefined) {
        expect(s.aux.pointer).toBeGreaterThanOrEqual(0);
        expect(s.aux.pointer).toBeLessThanOrEqual(BASE.length);
      }
    }
  });

  it('TC-MERGE-MOD-14 每步 aux.array 长度 = 主轨长度', () => {
    for (const s of buildMergeSortSteps(BASE)) {
      expect(s.aux!.array).toHaveLength(BASE.length);
    }
  });
});

describe('mergeSortModule.sources', () => {
  it('TC-MERGE-MOD-15 四门语言齐备', () => {
    expect(mergeSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-MERGE-MOD-16 每门语言每个 MergeExecPoint 行号落在源码物理行范围内', () => {
    for (const src of mergeSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('TC-MERGE-MOD-17 实际出现的 point 都能在每门语言映射到行', () => {
    const used = new Set(buildMergeSortSteps(mergeSortModule.initialInput()).map((s) => s.point));
    for (const src of mergeSortModule.sources) {
      for (const p of used) expect(typeof src.lineMap[p]).toBe('number');
    }
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/merge-sort.module.spec.ts`
Expected: FAIL（`merge-sort.module` / `merge-sort.sources` 不存在）

- [ ] **Step 3: 新建 `src/algorithms/merge-sort.sources.ts`**（行号已逐行核对，见 design §4）

```ts
import type { LangSource, MergeExecPoint } from '@/components/player/types';

const ts = `function mergeSort(a: number[]): number[] {
  const n = a.length;
  const temp = new Array(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      let i = lo, j = mid, k = lo;
      while (i < mid && j < hi) {
        if (a[i] <= a[j]) {
          temp[k++] = a[i++];
        } else {
          temp[k++] = a[j++];
        }
      }
      while (i < mid) temp[k++] = a[i++];
      while (j < hi) temp[k++] = a[j++];
      for (let t = lo; t < hi; t++) a[t] = temp[t];
    }
  }
  return a;
}`;

const python = `def merge_sort(a):
    n = len(a)
    temp = [0] * n
    width = 1
    while width < n:
        for lo in range(0, n, 2 * width):
            mid = min(lo + width, n)
            hi = min(lo + 2 * width, n)
            i, j, k = lo, mid, lo
            while i < mid and j < hi:
                if a[i] <= a[j]:
                    temp[k] = a[i]; i += 1
                else:
                    temp[k] = a[j]; j += 1
                k += 1
            while i < mid:
                temp[k] = a[i]; i += 1; k += 1
            while j < hi:
                temp[k] = a[j]; j += 1; k += 1
            for t in range(lo, hi):
                a[t] = temp[t]
        width *= 2
    return a`;

const go = `func mergeSort(a []int) []int {
\tn := len(a)
\ttemp := make([]int, n)
\tfor width := 1; width < n; width *= 2 {
\t\tfor lo := 0; lo < n; lo += 2 * width {
\t\t\tmid := min(lo+width, n)
\t\t\thi := min(lo+2*width, n)
\t\t\ti, j, k := lo, mid, lo
\t\t\tfor i < mid && j < hi {
\t\t\t\tif a[i] <= a[j] {
\t\t\t\t\ttemp[k] = a[i]
\t\t\t\t\ti++
\t\t\t\t} else {
\t\t\t\t\ttemp[k] = a[j]
\t\t\t\t\tj++
\t\t\t\t}
\t\t\t\tk++
\t\t\t}
\t\t\tfor i < mid {
\t\t\t\ttemp[k] = a[i]
\t\t\t\ti++
\t\t\t\tk++
\t\t\t}
\t\t\tfor j < hi {
\t\t\t\ttemp[k] = a[j]
\t\t\t\tj++
\t\t\t\tk++
\t\t\t}
\t\t\tfor t := lo; t < hi; t++ {
\t\t\t\ta[t] = temp[t]
\t\t\t}
\t\t}
\t}
\treturn a
}`;

const rust = `fn merge_sort(a: &mut Vec<i32>) {
    let n = a.len();
    let mut temp = vec![0; n];
    let mut width = 1;
    while width < n {
        let mut lo = 0;
        while lo < n {
            let mid = (lo + width).min(n);
            let hi = (lo + 2 * width).min(n);
            let (mut i, mut j, mut k) = (lo, mid, lo);
            while i < mid && j < hi {
                if a[i] <= a[j] {
                    temp[k] = a[i];
                    i += 1;
                } else {
                    temp[k] = a[j];
                    j += 1;
                }
                k += 1;
            }
            while i < mid {
                temp[k] = a[i];
                i += 1;
                k += 1;
            }
            while j < hi {
                temp[k] = a[j];
                j += 1;
                k += 1;
            }
            for t in lo..hi {
                a[t] = temp[t];
            }
            lo += 2 * width;
        }
        width *= 2;
    }
}`;

export const mergeSortSources: LangSource<MergeExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      widthChange: 4,
      mergeStart: 5,
      compare: 10,
      takeLeft: 11,
      takeRight: 13,
      drainLeft: 16,
      drainRight: 17,
      writeBack: 18,
      done: 21,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      widthChange: 5,
      mergeStart: 6,
      compare: 11,
      takeLeft: 12,
      takeRight: 14,
      drainLeft: 17,
      drainRight: 19,
      writeBack: 21,
      done: 23,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: {
      widthChange: 4,
      mergeStart: 5,
      compare: 10,
      takeLeft: 11,
      takeRight: 14,
      drainLeft: 20,
      drainRight: 25,
      writeBack: 30,
      done: 34,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      widthChange: 5,
      mergeStart: 7,
      compare: 12,
      takeLeft: 13,
      takeRight: 16,
      drainLeft: 22,
      drainRight: 27,
      writeBack: 32,
      done: 38,
    },
  },
];
```

- [ ] **Step 4: 新建 `src/algorithms/merge-sort.module.ts`**

```ts
import type {
  AlgorithmModule,
  AuxTrack,
  MergeExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { mergeSortSources } from './merge-sort.sources';

const ID_I = '0'; // 红箭头：左段游标 i
const ID_J = '1'; // 蓝箭头：右段游标 j
const DASH = '-';

/** 插桩重走自底向上归并，产出逐行粒度的胖步骤（每步带 aux 辅助轨快照） */
export function buildMergeSortSteps(input: number[]): Step<MergeExecPoint>[] {
  const steps: Step<MergeExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  const tempArr: ([string, number] | undefined)[] = new Array(n).fill(undefined);
  let writeCount = 0;

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  // aux 快照：位置 id 't'+idx 稳定；value 取 tempArr 当前内容（未填记 0，靠 filled 区分空槽）
  const auxSnap = (filled: number[], range?: [number, number], pointer?: number): AuxTrack => ({
    array: Array.from(
      { length: n },
      (_, idx) => [`t${idx}`, tempArr[idx]?.[1] ?? 0] as [string, number],
    ),
    filled: [...filled],
    activeRange: range,
    pointer,
  });

  const vars = (
    width: number | string,
    lo: number | string,
    mid: number | string,
    hi: number | string,
    i: number | string,
    j: number | string,
    k: number | string,
    ai: number | string,
    aj: number | string,
  ): VarRow[] => [
    { name: 'n', value: n },
    { name: 'width', value: width },
    { name: 'lo', value: lo },
    { name: 'mid', value: mid },
    { name: 'hi', value: hi },
    { name: 'i', value: i },
    { name: 'j', value: j },
    { name: 'k', value: k },
    { name: 'a[i]', value: ai },
    { name: 'a[j]', value: aj },
    { name: 'writeCount', value: writeCount },
  ];

  const push = (
    point: MergeExecPoint,
    ptr: { i?: number; j?: number },
    v: VarRow[],
    emphasis: Step['emphasis'],
    aux: AuxTrack,
    caption?: string,
  ) => {
    const pointers = [];
    if (ptr.i !== undefined) pointers.push({ id: ID_I, index: clampIdx(ptr.i) });
    if (ptr.j !== undefined) pointers.push({ id: ID_J, index: clampIdx(ptr.j) });
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers,
      emphasis,
      vars: v,
      point,
      aux,
      caption,
    });
  };

  if (n <= 1) {
    push(
      'done',
      {},
      vars(DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH),
      { sortedFrom: 0 },
      auxSnap([]),
      '完成',
    );
    return steps;
  }

  for (let width = 1; width < n; width *= 2) {
    push(
      'widthChange',
      {},
      vars(width, DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH),
      {},
      auxSnap([]),
      `width=${width}：合并相邻 ${width} 元素段`,
    );
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      if (mid >= hi) continue; // 残段，无右段可合并，留到更大 width
      const members: number[] = [];
      for (let m = lo; m < hi; m++) members.push(m);
      for (let t = lo; t < hi; t++) tempArr[t] = undefined; // 清空该段 temp
      const filled: number[] = [];
      let i = lo;
      let j = mid;
      let k = lo;
      push(
        'mergeStart',
        { i, j },
        vars(width, lo, mid, hi, i, j, k, work[i][1], work[j][1]),
        { groupMembers: members },
        auxSnap(filled, [lo, hi], k),
        `合并 [${lo},${mid}) 与 [${mid},${hi})`,
      );
      while (i < mid && j < hi) {
        const le = work[i][1] <= work[j][1];
        push(
          'compare',
          { i, j },
          vars(width, lo, mid, hi, i, j, k, work[i][1], work[j][1]),
          { comparing: [i, j], groupMembers: members },
          auxSnap(filled, [lo, hi], k),
          `a[${i}]=${work[i][1]} ${le ? '≤' : '>'} a[${j}]=${work[j][1]}`,
        );
        if (le) {
          tempArr[k] = work[i];
          filled.push(k);
          writeCount++;
          push(
            'takeLeft',
            { i, j },
            vars(width, lo, mid, hi, i, j, k + 1, work[i][1], work[j][1]),
            { groupMembers: members },
            auxSnap(filled, [lo, hi], k + 1),
            `取左 ${work[i][1]} → temp[${k}]`,
          );
          i++;
          k++;
        } else {
          tempArr[k] = work[j];
          filled.push(k);
          writeCount++;
          push(
            'takeRight',
            { i, j },
            vars(width, lo, mid, hi, i, j, k + 1, work[i][1], work[j][1]),
            { groupMembers: members },
            auxSnap(filled, [lo, hi], k + 1),
            `取右 ${work[j][1]} → temp[${k}]`,
          );
          j++;
          k++;
        }
      }
      while (i < mid) {
        tempArr[k] = work[i];
        filled.push(k);
        writeCount++;
        push(
          'drainLeft',
          { i, j },
          vars(width, lo, mid, hi, i, j, k + 1, work[i][1], DASH),
          { groupMembers: members },
          auxSnap(filled, [lo, hi], k + 1),
          `左段剩余 ${work[i][1]} → temp[${k}]`,
        );
        i++;
        k++;
      }
      while (j < hi) {
        tempArr[k] = work[j];
        filled.push(k);
        writeCount++;
        push(
          'drainRight',
          { i, j },
          vars(width, lo, mid, hi, i, j, k + 1, DASH, work[j][1]),
          { groupMembers: members },
          auxSnap(filled, [lo, hi], k + 1),
          `右段剩余 ${work[j][1]} → temp[${k}]`,
        );
        j++;
        k++;
      }
      for (let t = lo; t < hi; t++) work[t] = tempArr[t]!; // 拷回（元素带原 id → 主轨 FLIP 重排）
      push(
        'writeBack',
        {},
        vars(width, lo, mid, hi, DASH, DASH, DASH, DASH, DASH),
        { groupMembers: members },
        auxSnap(filled, [lo, hi]),
        `temp[${lo},${hi}) 拷回原数组`,
      );
    }
  }
  push(
    'done',
    {},
    vars(DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH, DASH),
    { sortedFrom: 0 },
    auxSnap([]),
    '完成，全部有序',
  );
  return steps;
}

export const mergeSortModule: AlgorithmModule<MergeExecPoint> = {
  title: '归并排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1], // 与插入/希尔同款，便于横向对比
  buildSteps: buildMergeSortSteps,
  sources: mergeSortSources,
};
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/merge-sort.module.spec.ts`
Expected: PASS（17 个 case）

- [ ] **Step 6: type-check + 全量回归**

Run: `pnpm type-check && pnpm test:unit run`
Expected: 全绿（前四算法零回归）。

- [ ] **Step 7: 提交**

```bash
git add src/algorithms/merge-sort.sources.ts src/algorithms/merge-sort.module.ts src/algorithms/merge-sort.module.spec.ts
git commit -m "feat(algo): 归并排序 buildSteps 自底向上插桩（aux 辅助轨）+ 四语言源码/行映射（L3）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: `MergeSort.vue` + 路由 + 视图测试（L4）

薄壳视图 + 懒加载路由。视图初始渲染主轨 10 柱 + 辅助轨（双轨）。

**Files:**

- Create: `src/views/Article/SortAlgorithm/MergeSort.vue`
- Modify: `src/router/index.ts`
- Test: `src/views/Article/SortAlgorithm/MergeSort.spec.ts`（新建）

**Interfaces:**

- Consumes: `mergeSortModule`（Task 5）、`AlgorithmPlayer`（既有）、`AuxView`（Task 2）
- Produces: 路由 `name: 'merge-sort'`，path `/docs/merge-sort`

- [ ] **Step 1: 写失败测试 `src/views/Article/SortAlgorithm/MergeSort.spec.ts`**

```ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import MergeSort from './MergeSort.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import AuxView from '@/components/AuxView.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('MergeSort', () => {
  it('TC-VIEW-MERGE-01 挂载渲染 AlgorithmPlayer', () => {
    const w = mount(MergeSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-MERGE-02 初始渲染主轨 10 柱 + 辅助轨且默认停第 0 步', async () => {
    const w = mount(MergeSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findComponent(AuxView).exists()).toBe(true);
    // 主轨 10 + 辅助轨 10 = 20 个 Bar（第 0 步 widthChange，aux 为整排空槽）
    expect(w.findAllComponents(Bar)).toHaveLength(20);
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/views/Article/SortAlgorithm/MergeSort.spec.ts`
Expected: FAIL（`MergeSort.vue` 不存在）

- [ ] **Step 3: 新建 `src/views/Article/SortAlgorithm/MergeSort.vue`**

```vue
<!-- src/views/Article/SortAlgorithm/MergeSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { mergeSortModule } from '@/algorithms/merge-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="mergeSortModule" />
</template>
```

- [ ] **Step 4: 改 `src/router/index.ts`**

先 Read 确认 `shell-sort` 路由对象的精确写法与 import 路径风格，在其后追加同风格的一项（path/name/component）：

```ts
{
  path: '/docs/merge-sort',
  name: 'merge-sort',
  component: () => import('../views/Article/SortAlgorithm/MergeSort.vue'),
},
```

> 注意：`component` 的相对路径须与同文件 `shell-sort` 项保持一致（若该文件用 `@/views/...` 则照用 `@/views/Article/SortAlgorithm/MergeSort.vue`）。`name` 必须等于菜单 slug `merge-sort`（`Docs/Menu/hooks.ts` 已用它高亮）。

- [ ] **Step 5: 运行测试 + 全量回归，确认通过**

Run: `pnpm test:unit run src/views/Article/SortAlgorithm/MergeSort.spec.ts && pnpm type-check && pnpm test:unit run`
Expected: PASS（2 个 case）；全量单测绿。

- [ ] **Step 6: 提交**

```bash
git add src/views/Article/SortAlgorithm/MergeSort.vue src/views/Article/SortAlgorithm/MergeSort.spec.ts src/router/index.ts
git commit -m "feat(viz): 归并排序视图 MergeSort + 懒加载路由（修复菜单/首页 404）（L4）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: `merge-sort.e2e.ts` 端到端（L5）

真机覆盖：默认暂停、合并段聚焦（dimmed）+ temp 空槽/已填、Shiki 真机着色、拖到末步主轨升序、重置。

**Files:**

- Create: `e2e/merge-sort.e2e.ts`

**Interfaces:**

- Consumes: 路由 `/docs/merge-sort`（Task 6）、`.bars-view`/`.aux-view`/`.bar-cell`/`.bar.dimmed`/`.bar.empty`/`.bar.sorted`/`.counter`/`.scrub`/`.ctl` 选择器

- [ ] **Step 1: 新建 `e2e/merge-sort.e2e.ts`**

```ts
import { test, expect } from '@playwright/test';

test('TC-E2E-MERGE-01 归并排序播放器：默认暂停/合并聚焦+temp填入/跳末升序/重置', async ({
  page,
}) => {
  await page.goto('/docs/merge-sort');

  // 主轨 10 + 辅助轨 10 = 20 个柱格（双轨可视化）
  await expect(page.locator('.bar-cell')).toHaveCount(20);
  await expect(page.locator('.counter')).toContainText('1 / '); // 默认停第 0 步

  // 真机 Shiki 着色（单测里 useHighlighter 被 mock，这里补真机覆盖）
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  // 单步到 mergeStart：当前合并段聚焦、段外 dimmed；temp 有空槽虚框
  await page.locator('.ctl[title="下一步"]').click();
  await expect(page.locator('.counter')).toContainText('2 / ');
  await expect(page.locator('.bar.dimmed').first()).toBeVisible();
  await expect(page.locator('.aux-view .bar.empty').first()).toBeVisible();

  // 继续单步：compare → take，辅助轨出现已填 sorted 槽
  await page.locator('.ctl[title="下一步"]').click(); // compare
  await page.locator('.ctl[title="下一步"]').click(); // takeLeft/takeRight
  await expect(page.locator('.aux-view .bar.sorted').first()).toBeVisible();

  // 拖到末步 → 主轨数值升序
  const scrub = page.locator('.scrub');
  const max = await scrub.getAttribute('max');
  await scrub.evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, max!);
  const values = await page.locator('.bars-view .bar-cell .val').allInnerTexts();
  const nums = values.map((t) => parseInt(t, 10));
  expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // 重置回第 0 步
  await page.locator('.ctl[title="重置"]').click();
  await expect(page.locator('.counter')).toContainText('1 / ');
});
```

- [ ] **Step 2: 运行 e2e，确认通过**

Run: `pnpm test:e2e merge-sort.e2e.ts`（或 `pnpm test:e2e`）
Expected: PASS（含真机 dimmed 聚焦 + temp 填充视觉验证）。若 `.code .tok` 选择器与现网不符，对照 `e2e/shell-sort.e2e.ts` 调整。

- [ ] **Step 3: 提交**

```bash
git add e2e/merge-sort.e2e.ts
git commit -m "test(c011): 归并排序 L5 端到端（双轨/合并聚焦/temp填充/跳末升序/重置）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: 三索引 + roadmap + 文档状态回写

落地后把 37 个 Case 登记进全局测试索引、更新 plans 索引与 roadmap、把 C-011 四文档状态从 `draft` 推进到 `verified`。

**Files:**

- Modify: `docs/plans/index.md`、`docs/roadmap.md`
- Modify: `docs/test-cases/index.md`、`docs/test-cases/by-layer.md`、`docs/test-cases/by-module.md`
- Modify: `docs/plans/20260623-c011-merge-sort/{requirements,design,implementation,test-cases}.md`（状态块）

- [ ] **Step 1: 回写 `docs/plans/index.md`**

在 All Changes 表追加一行（紧接 C-20260622-010）：

```
| C-20260623-011 | feature | 归并排序动画 | 用算法播放器框架接入归并排序（自底向上：width 倍增、相邻段合并；首次扩展外壳为双轨——新增 AuxView 辅助数组轨表达 temp 填充/拷回；主轨复用希尔 groupMembers/dimmed 聚焦当前合并段），M3 第四个算法、首个非原地/双数组算法 | verified | 100% | 无 | 已完成 | viz-engine / article-sort / M3 | IllegalCreed | `20260623-c011-merge-sort/` | 2026-06-23 | - |
```

并在 By Type → feature、By Module → viz-engine / article-sort 两张子表各追加对应行。

- [ ] **Step 2: 回写 `docs/roadmap.md`**

- M3 行「关联计划」加 `C-20260623-011（归并排序 ✓）`；「风险/阻塞」更新为「外壳已具备**双轨**可视化（主轨 + AuxView 辅助轨），树/图/链表的通用插槽化仍待后续」。
- 当前优先级表：把 P0 更新为「C-20260623-011 归并排序：已完成；M3 后续（快排/堆/计数）待建」。

- [ ] **Step 2: 回写测试三索引**

- `docs/test-cases/index.md`：追加 37 行（L3：9 ALGO + 17 MOD；L4：1 BAR + 5 AUXVIEW + 2 PLAYER-AUX + 2 VIEW-MERGE；L5：1 E2E），module 归 `algorithms` / `viz-engine` / `article-sort` 现有组，status=active、日期 2026-06-23。
- `docs/test-cases/by-layer.md`、`by-module.md`：按相同 Case 归类追加，三处保持一致。

- [ ] **Step 3: 推进 C-011 四文档状态**

`requirements.md` / `design.md` / `implementation.md` / `test-cases.md` 的状态块：`Status: draft → verified`、`Progress: 0% → 100%`、`Next action: 已完成（37 Case 全绿，已落 main）`。

- [ ] **Step 4: 最终全量门禁**

Run: `pnpm lint:check && pnpm format:check && pnpm type-check && pnpm test:unit run && pnpm test:e2e`
Expected: 五项全绿；单测文件数 +5、Case +36（L3+L4），e2e +1；覆盖率达门槛。

- [ ] **Step 5: 提交**

```bash
git add docs/
git commit -m "test(c011): 归并排序索引/roadmap/文档状态回写（37 Case 登记，C-011 verified）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## 自审（writing-plans self-review）

**1. Spec 覆盖**：design 各节均有对应 Task——数据契约/Bar empty(§1,§5→T1)、AuxView(§5→T2)、AlgorithmPlayer 条件渲染(§5→T3)、oracle(§3→T4)、四语言源码+buildSteps(§3,§4→T5)、视图+路由(§6→T6)、e2e(验收→T7)、索引/roadmap 回写(§8 末→T8)。向后兼容硬约束落在 T1/T3 关卡。✓

**2. 占位扫描**：无 TBD/TODO；每个代码 Step 均给出完整代码；测试 Step 给出完整断言。router 项标注"执行时 Read 确认 import 风格"是必要的环境核实，非占位。✓

**3. 类型一致性**：`MergeExecPoint`（9 点）在 T1 定义、T5 sources/module/spec 一致使用；`AuxTrack`（array/filled/pointer?/activeRange?）在 T1 定义、T2 AuxView props、T5 auxSnap、T5 spec、T3 内联 module 一致；`Step.aux?` 在 T1 加、T3/T5/T6 使用；`mergeSortPasses`/`MergePass` 在 T4 定义、T5 spec 交叉校验引用；`buildMergeSortSteps`/`mergeSortModule` 在 T5 定义、T6 视图/spec 引用。四语言 lineMap 行号与 §4 行号表一致。✓

> 修正项：无（首次自审未发现 spec 缺口或命名漂移）。

## 执行方式

本计划在当前会话 **inline 执行**（superpowers:executing-plans）：实现者（同会话，已持有完整 design 上下文）按 Task 1→8 顺序逐步 TDD，每个 Task 末尾以 `type-check + 对应测试`（T1/T3/T5/T6 额外加全量回归）为关卡，逐 Task 提交。
