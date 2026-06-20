# 设计：选择排序动画（接入算法播放器框架）

> Status: draft
> Stable ID: C-20260620-007
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-20
> Last reviewed: 2026-06-20
> Progress: 0%
> Blocked by: none
> Next action: 用户审 spec → writing-plans
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006
> Related tests: 见 §7「对现有测试的影响」
> Related requirement: requirements.md

## 总体方案

**复用 C-006 的播放器框架，只为选择排序的语义做向后兼容的小扩展。** 框架与算法的契约仍是预计算的「胖步骤」`Step[]`：选择排序实现一个 `AlgorithmModule`，外壳按 `index` 回放，单步 / 暂停 / 后退 / 拖动全是「移动下标」——这套交互模型一字不改。

复用矩阵：

| 件                                                               | 角色                         | 选择排序如何对待                                                    |
| ---------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| `usePlayer.ts` / `TransportControls.vue` / `AlgorithmPlayer.vue` | 传输状态机 + 控制条 + 装配壳 | **零改动**，原样复用                                                |
| `VariablePanel.vue`                                              | 变量面板（自动 diff 高亮）   | **零改动**，喂不同 `vars` 即可                                      |
| `CodePanel.vue`                                                  | 多语言 Shiki 高亮 + 当前行   | 仅 `point: ExecPoint → string` 一行放宽                             |
| `ArrowTrack.vue` / `Arrow.vue`                                   | 雪佛龙指针                   | **零改动**，第三指针只是 `pointers` 多一项（取 `colors[2]=yellow`） |
| `Bar.vue` / `BarsView.vue`                                       | 柱状可视化                   | 各加一个状态分支（`min` 态、`sortedUpTo`、`minIndex`）              |
| `types.ts`                                                       | 数据契约                     | 泛型化执行点 + `StepEmphasis` 加 2 个可选字段                       |

选择排序新增的，只有 `src/algorithms/selection-sort.*` 三件 + `SelectionSort.vue` 薄壳 + 一条路由。

## 1. 数据契约扩展（`src/components/player/types.ts`）

执行点从「写死的冒泡 union」改为「每算法自带、用类型参数 `P` 串起来」。**保留 `ExecPoint` 原名给冒泡**，故冒泡侧只需补一处泛型标注、运行时与测试断言零变化。

```ts
export type Lang = 'ts' | 'python' | 'go' | 'rust';

/** 冒泡的执行点（保留原名，向后兼容） */
export type ExecPoint = 'outerLoop' | 'innerLoop' | 'compare' | 'swap' | 'noSwap' | 'done';

/** 选择排序的执行点（多了 newMin：发现更小值、更新 minIdx） */
export type SelectionExecPoint =
  | 'outerLoop'
  | 'innerLoop'
  | 'compare'
  | 'newMin'
  | 'swap'
  | 'noSwap'
  | 'done';

export interface VarRow {
  name: string;
  value: string | number | boolean;
}

export interface StepEmphasis {
  comparing?: [number, number]; // 正在比较的两个下标
  swapped?: boolean; // 本步是否交换
  sortedFrom?: number; // 冒泡：右侧 [sortedFrom, n) 已就位
  minIndex?: number; // 选择：当前已知最小值下标 → min 态 + min 柱高亮
  sortedUpTo?: number; // 选择：左侧 [0, sortedUpTo) 已就位
}

import type { Pointer } from '@/types/types';
export type { Pointer } from '@/types/types';

/** 胖步骤：自带渲染所需的一切。P = 该算法的执行点集合 */
export interface Step<P extends string = string> {
  array: [string, number][];
  pointers: Pointer[];
  emphasis: StepEmphasis;
  vars: VarRow[];
  point: P;
  caption?: string;
}

export interface LangSource<P extends string = string> {
  lang: Lang;
  label: string;
  code: string;
  lineMap: Record<P, number>; // 执行点 → 1-based 行号
}

export interface AlgorithmModule<P extends string = string> {
  title: string;
  initialInput(): number[];
  buildSteps(input: number[]): Step<P>[];
  sources: LangSource<P>[];
}
```

**为什么外壳几乎不受影响**（关键的类型可行性论证）：

- `AlgorithmModule` 默认 `P = string`，故 `AlgorithmPlayer` 的 `defineProps<{ module: AlgorithmModule }>()` 不变。`selectionSortModule: AlgorithmModule<SelectionExecPoint>` 赋给 `AlgorithmModule<string>` 成立（`SelectionExecPoint ⊆ string`，`Step`/`LangSource` 沿 `P` 协变）。
- `CodePanel` 的 `sources: LangSource[]`（即 `LangSource<string>[]`）能接收 `LangSource<ExecPoint>[]` 与 `LangSource<SelectionExecPoint>[]`：`Record<ExecPoint, number>`（具名 key）可赋给 `Record<string, number>`（index signature）。故 `CodePanel` 仅需 `point: ExecPoint → string`，`sources` 类型不动。
- 冒泡侧补丁：`bubble-sort.module.ts` 的 `buildBubbleSortSteps(): Step<ExecPoint>[]`、`bubbleSortModule: AlgorithmModule<ExecPoint>`；`bubble-sort.sources.ts` 的 `bubbleSortSources: LangSource<ExecPoint>[]`。**`bubble-sort.module.spec.ts` 的 `EXEC_POINTS: ExecPoint[]` 等断言零改动**（`ExecPoint` 名保留）。

## 2. 目录与文件

```
src/algorithms/
  selection-sort.ts            ← 新增：纯算法 oracle（对标 bubble-sort.ts）
  selection-sort.module.ts     ← 新增：插桩重走 + buildSteps + selectionSortModule
  selection-sort.sources.ts    ← 新增：四语言源码 + lineMap
  bubble-sort.*                ← 仅补泛型标注，行为不变

src/components/
  Bar.vue                      ← 改：state 加 'min' + .bar.min 配色
  BarsView.vue                 ← 改：stateOf 支持 minIndex / sortedUpTo + 优先级
  player/types.ts              ← 改：泛型化 + StepEmphasis 加 2 字段
  player/CodePanel.vue         ← 改：point: ExecPoint → string

src/views/Article/SortAlgorithm/
  SelectionSort.vue            ← 新增：<AlgorithmPlayer :module="selectionSortModule" />

src/router/index.ts            ← 改：新增 selection-sort 懒加载路由
```

菜单（`Docs/Menu/hooks.ts`）与首页网格（`Home/Main/hooks.ts`）已含 `selection-sort` 条目与 `selection.svg` 图标，**无需改动**。

## 3. 选择排序算法模块

### 执行点语义与行映射目标

| ExecPoint   | 含义                                 | 指针 / 强调                        |
| ----------- | ------------------------------------ | ---------------------------------- |
| `outerLoop` | 进入第 `i` 轮，`minIdx ← i`          | i=i, min=i                         |
| `innerLoop` | 扫描指针 `j` 步进                    | j 前进                             |
| `compare`   | 比较 `a[j]` 与 `a[minIdx]`           | `comparing:[j, minIdx]`            |
| `newMin`    | `a[j]` 更小，`minIdx ← j`            | min 跳到 j                         |
| `swap`      | 内层结束，交换 `a[i]` 与 `a[minIdx]` | `comparing:[i, minIdx]`, `swapped` |
| `noSwap`    | `minIdx == i`，免交换                | —                                  |
| `done`      | 排序完成                             | 全部 `sorted`                      |

### `buildSteps` 骨架（插桩重走，逐行粒度）

```
work = input.map((v, i) => [String(i), v]);  n = work.length
swapCount = 0;  sortedUpTo = 0          // [0, sortedUpTo) 已就位
三指针 id：'0'=i(红) '1'=j(蓝) '2'=min(黄)
每个 push 带 { sortedUpTo, ...emphasis }，vars = [n, i, j, minIdx, a[j], a[minIdx], swapCount, sortedUpTo]

if n <= 1: sortedUpTo = n; push('done'); return

for i in 0..n-2:
  minIdx = i
  push('outerLoop', {minIndex: minIdx}, `第 ${i+1} 轮：先假定 ${i} 最小`)
  for j in i+1..n-1:
    push('innerLoop', {minIndex: minIdx}, `看位置 ${j}`)
    push('compare', {comparing:[j, minIdx], minIndex: minIdx}, `${a[j]} ${a[j]<a[minIdx]?'<':'≥'} ${a[minIdx]}`)
    if a[j] < a[minIdx]:
      minIdx = j
      push('newMin', {minIndex: minIdx}, `更小，min ← ${j}`)
  if minIdx != i:
    swap(work[i], work[minIdx]); swapCount++
    push('swap', {comparing:[i, minIdx], swapped:true}, `交换 ${i} 与 ${minIdx}`)
  else:
    push('noSwap', {minIndex: i}, `${i} 已是最小，不交换`)
  sortedUpTo = i + 1
sortedUpTo = n
push('done')
```

- 指针下标越界一律 `clampIdx`（沿用冒泡 module 的做法）。
- `swap` 帧靠稳定 key + `<TransitionGroup>` 产生 FLIP（两根柱子滑动互换）；按柱态优先级，该帧两根橙（`swapped`），`minIndex` 被 `swapped` 压过，不必再给。
- **防漂移**：`selection-sort.ts`（oracle）与 `buildSteps`（插桩）是同一标准选择排序的两份实现；L3 用 oracle 末态**交叉校验** `buildSteps` 末步。

## 4. 四语言源码 + `lineMap`（`selection-sort.sources.ts`）

四份等价的标准选择排序（TS/Python/Go/Rust），每份配一张 `lineMap: Record<SelectionExecPoint, number>`。示意（TS）：

```ts
const ts = `function selectionSort(a: number[]): number[] {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}`;
// lineMap(TS): outerLoop:3, innerLoop:5, compare:6, newMin:7, swap:11, noSwap:10, done:14
```

`noSwap` 落在 `if (minIdx !== i)` 行（条件不成立）；`swap` 落在交换行。Python/Go/Rust 同构，各自 `lineMap`。行号正确性由 L3 兜底（每个 `SelectionExecPoint` 行号 ∈ `[1, 行数]`）。

## 5. 可视化扩展

### `Bar.vue`

```ts
state: 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min'; // 加 'min'
```

```less
.bar.min {
  background-color: #9d8df0;
} /* 柔紫，区分 comparing 黄 / swapped 橙 / sorted 绿 */
```

现有 `TC-VIZ-BAR-03`（state 决定 class）不受影响——只是多一个合法取值。

### `BarsView.vue` — `stateOf` 优先级

一根柱子可能同时满足多个条件，**按 `sorted > swapped > min > comparing > idle` 取最高优先**：

```ts
function stateOf(index: number): 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' {
  const e = props.emphasis;
  // 已就位：右侧 sortedFrom（冒泡）或左侧 sortedUpTo（选择）
  const sortedRight = e.sortedFrom !== undefined && index >= e.sortedFrom;
  const sortedLeft = e.sortedUpTo !== undefined && index < e.sortedUpTo;
  if (sortedRight || sortedLeft) return 'sorted';
  const inCompare = !!e.comparing && (index === e.comparing[0] || index === e.comparing[1]);
  if (inCompare && e.swapped) return 'swapped';
  if (e.minIndex === index) return 'min'; // min 压过 comparing：比较帧 min 柱保持紫
  if (inCompare) return 'comparing'; // 另一根（j）才是 comparing 黄
  return 'idle';
}
```

冒泡路径完全不变（`minIndex` / `sortedUpTo` 恒 `undefined`，新分支不触发），`TC-VIZ-BARSVIEW-03/04` 保持绿。

### 三指针

`pointers = [{id:'0',index:i}, {id:'1',index:j}, {id:'2',index:minIdx}]`，经 `ArrowTrack` 自动取 `colors[0]=red` / `colors[1]=blue` / `colors[2]=yellow`。`Arrow.vue` 已有 `yellow → #e0b34a` 软色映射，**零改动**。

> 配色语义分层：**箭头标「位置」（红 i / 蓝 j / 黄 min），柱子标「状态」（紫 min / 黄 comparing / 橙 swapped / 绿 sorted）**。沿用冒泡既定的「箭头色 ≠ 柱色」双系统，用户已接受。

## 6. 接入

`SelectionSort.vue`：

```vue
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { selectionSortModule } from '@/algorithms/selection-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="selectionSortModule" />
</template>
```

`src/router/index.ts` 在 `bubble-sort` 之后加：

```ts
{
  path: '/docs/selection-sort',
  name: 'selection-sort',
  component: () => import('../views/Article/SortAlgorithm/SelectionSort.vue'),
},
```

## 7. 对现有测试的影响

**本变更不 supersede 任何现有 Case**——全是新增 + 向后兼容扩展。

| 现有件                                            | 改动                                  | 影响             |
| ------------------------------------------------- | ------------------------------------- | ---------------- |
| `bubble-sort.module.spec.ts`（`TC-BUBBLE-MOD-*`） | 仅源文件补泛型标注，行为不变          | **零影响**，全绿 |
| `Bar.spec.ts`（`TC-VIZ-BAR-*`）                   | `state` 多一个合法值 `'min'`          | **零影响**，全绿 |
| `BarsView.spec.ts`（`TC-VIZ-BARSVIEW-*`）         | `stateOf` 加分支，冒泡路径不触发      | **零影响**，全绿 |
| `CodePanel.spec.ts`（`TC-CODEPANEL-*`）           | `point: ExecPoint → string`，行为不变 | **零影响**，全绿 |

新增 Case 详单见 `test-cases.md`（L3 选择 oracle + 选择 module；L4 Bar/BarsView 的 min/sortedUpTo 扩展 + 选择视图；L5 端到端）。

## 8. 推进顺序（建议）

① `types.ts` 泛型化 + 冒泡补标注（先跑全量回归，证明向后兼容）→ ② `selection-sort.ts` oracle（L3）→ ③ `selection-sort.sources.ts` 四语言 + `lineMap` → ④ `selection-sort.module.ts` `buildSteps`（L3，交叉校验 + 选择不变量）→ ⑤ `Bar`/`BarsView` 扩展（L4）→ ⑥ `CodePanel` 放宽 `point` → ⑦ `SelectionSort.vue` + 路由 + 视图 L4 → ⑧ L5 端到端 → ⑨ 三索引 + roadmap 回写。每步以 `type-check` + 对应测试绿为关卡。

## 9. 风险与回滚

- **泛型化误伤冒泡**：最大风险点。缓解——保留 `ExecPoint` 原名、`P` 默认 `string`、外壳零类型改动；推进顺序第①步先跑冒泡全量回归再继续，不绿则停。回滚仅需还原 `types.ts` + 冒泡两处标注。
- **`lineMap` 与源码漂移**：选择排序源码一改、行号即错。L3 校验「每个 `SelectionExecPoint` 行号合法」兜底；`lineMap` 与 `code` 同文件相邻。
- **柱态优先级歧义**：比较帧若 `min` 与 `comparing` 撞同一根柱，已用优先级（`min > comparing`）显式定义；L4 专测「`minIndex` 那根取 min 态、另一根取 comparing 态」。
- **min 配色辨识度**：`#9d8df0` 暂定，与四个既有柱态拉开；实现期在明 / 暗主题下肉眼复核，必要时微调（不影响逻辑与测试）。
- **改动隔离**：算法三件 + `SelectionSort.vue` + 路由是纯新增，可独立回滚；`Bar`/`BarsView`/`types`/`CodePanel` 的扩展均为加法，冒泡路径不变。
