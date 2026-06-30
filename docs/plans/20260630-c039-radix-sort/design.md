# 设计：基数排序 Radix Sort（LSD + 10 桶分配收集，复用算法播放器 + CountView 桶轨）

> Status: verified
> Stable ID: C-20260630-039
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览（复用算法播放器，与既有 8 排序同范式）

```
新页 src/views/Article/SortAlgorithm/RadixSort.vue
   │  <AlgorithmPlayer :module="radixSortModule" />   ← 极简一行（同 CountingSort.vue）
   ▼
算法模块 src/algorithms/
   radix-sort.module.ts   导出 buildRadixSortSteps(input) + radixSortModule（title/initialInput/buildSteps/sources）
   radix-sort.ts          oracle radixSortTrace(input)→{result, maxDigits}（测试交叉校验）
   radix-sort.sources.ts  4 语言源码 + lineMap（ts/python/go/rust）

播放器自动：调 buildSteps → 单步/播放 + 代码行高亮（lineMap[point]）+ 变量面板 + 主轨 BarsView + 桶轨 CountView（v-if="current.count"）

4 处接线（排序分类追加第 9 项，不新建分类）：
  router/index.ts      +/docs/radix-sort  name 'radix-sort'（counting-sort 之后）
  Docs/Menu/hooks.ts   排序分类 children 追加 {title:'基数排序', url:'radix-sort'}（计数排序之后）
  Home/Main/hooks.ts   排序分类 children 追加 {title:'基数排序', desc, icon:RadixIcon, url:'radix-sort'} + import
  assets/radix.svg     ✅ 已存在（无需新建）
改 TC-HOOK-02-4（Menu）：排序 children 8→9（Home spec 不查排序数，无需改）
```

**关键复用决策（零框架改动）**：基数排序每轮 10 桶（数字 0–9），**直接复用计数排序的 `count?: CountTrack` 桶轨字段**（`{min:0, buckets:[10 个计数], activeBucket}`）——AlgorithmPlayer 见 `current.count` 即渲染 CountView，桶底标签 = `min+i` = 0–9（恰为数字位）。**主轨 BarsView 显示数字逐轮重排、桶轨 CountView 显示当前位分布**。不碰 `player/types.ts` 的 Step/CountTrack、不碰 AlgorithmPlayer、不新建 RadixView → 既有 8 排序 + 计数排序 Case 零回归。执行点用本地联合类型 `RadixExecPoint`（`Step<P>`/`LangSource<P>` 本就泛型，无需改 types.ts；与既有惯例一致也可加到 types.ts，本设计加一行 `RadixExecPoint` 到 types.ts 沿用惯例）。

## 2. 算法模块 `radix-sort.module.ts`

```ts
export type RadixExecPoint = 'passStart' | 'distribute' | 'collect' | 'done'; // 或置于 types.ts 沿惯例
export function buildRadixSortSteps(input: number[]): Step<RadixExecPoint>[];
export const radixSortModule: AlgorithmModule<RadixExecPoint> = {
  title: '基数排序',
  initialInput: () => [42, 7, 25, 63, 18, 31, 56, 9],
  buildSteps: buildRadixSortSteps,
  sources: radixSortSources,
};
```

- **work**：`[string,number][]`，**位置键**（`String(i)`，与计数排序一致——柱在原位、值被覆盖，不做 FLIP 飞行）；不修改入参（从 input 拷贝）。
- **轮数** `passes = String(max(values)).length`（本数据 max=63 → **2 轮**）。
- **每轮 d**（d=0 个位、d=1 十位；`div = 10**d`）：
  1. `passStart`：宣布本轮，`count` 桶清零，caption「第 d+1 轮：按${个位/十位}分配到 10 个桶」。
  2. `distribute`：遍历 work，`digit = ⌊val/div⌋ % 10`，`buckets[digit].push(val)`；每个元素一步——`count {min:0, buckets: 各桶计数, activeBucket: digit}`、读游标 `pointer id '1' index i`、caption「a[i]=val 的${位}=digit → 入桶 digit」。
  3. `collect`：`w=0`；按桶 0→9、桶内顺序，`work[w][1]=val`（回写）；每个元素一步——`count` 桶递减、写游标 `pointer id '3' index w-1`、caption「桶 digit 倒出 val → a[w-1]」。
- 末 `done`：`array` 有序快照、`emphasis.sortedUpTo=n`、caption「2 轮分配收集完毕，全部有序」。

**手算（固定数据 `[42,7,25,63,18,31,56,9]`）**：

| 轮  | 位   | 分桶（0..9 各桶值）                                   | 收集结果（work 值）         |
| --- | ---- | ----------------------------------------------------- | --------------------------- |
| 1   | 个位 | 1:[31] 2:[42] 3:[63] 5:[25] 6:[56] 7:[7] 8:[18] 9:[9] | `[31,42,63,25,56,7,18,9]`   |
| 2   | 十位 | 0:[7,9] 1:[18] 2:[25] 3:[31] 4:[42] 5:[56] 6:[63]     | `[7,9,18,25,31,42,56,63]` ✓ |

- 第 1 轮 distribute 末桶计数（按数字 0–9）：`[0,1,1,1,0,1,1,1,1,1]`（和 8）。
- 最终有序 = `[7,9,18,25,31,42,56,63]` = `radixSortTrace(input).result`。
- 步数：每轮 passStart 1 + distribute 8 + collect 8 = 17；2 轮 + done = **35 步**。

## 3. oracle `radix-sort.ts`

```ts
export interface RadixTrace {
  result: number[];
  maxDigits: number;
}
export function radixSortTrace(input: number[]): RadixTrace {
  const result = [...input].sort((a, b) => a - b);
  const maxDigits = input.length ? String(Math.max(...input)).length : 0;
  return { result, maxDigits };
}
```

## 4. sources `radix-sort.sources.ts`（4 语言 + lineMap，参照计数排序）

TS 源码骨架（行号 1-based）：

```
1  function radixSort(a: number[]): number[] {
2    const maxVal = Math.max(...a);
3    const passes = String(maxVal).length;
4    for (let d = 0; d < passes; d++) {                 ← passStart
5      const buckets: number[][] = Array.from({length:10}, () => []);
6      const div = 10 ** d;
7      for (const x of a) buckets[Math.floor(x/div)%10].push(x);   ← distribute
8      let w = 0;
9      for (const bucket of buckets)
10       for (const x of bucket) a[w++] = x;             ← collect
11   }
12   return a;                                            ← done
13 }
```

`lineMap(ts) = { passStart:4, distribute:7, collect:10, done:12 }`；python/go/rust 各自源码 + 对应行号（lineMap 必须覆盖产出的全部 point）。

## 5. 视图 `RadixSort.vue`（极简，同 CountingSort.vue）

```vue
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { radixSortModule } from '@/algorithms/radix-sort.module';
</script>
<template><AlgorithmPlayer :module="radixSortModule" /></template>
```

正文：基数排序页本体（`Article` 包裹）放在 RadixSort.vue 还是 AlgorithmPlayer 自带？——既有排序页（CountingSort.vue）就是极简一行、正文由播放器/页面骨架承载。**沿用既有排序页结构**（与 CountingSort.vue 完全一致，仅换 module）；正文知识点经播放器的 caption/变量面板 + 菜单进入即可，不额外加 Article（与 8 个排序一致，保持一致性）。

## 6. 组件清单与改动面

| 文件                                            | 类型         | 改动                                             |
| ----------------------------------------------- | ------------ | ------------------------------------------------ |
| `src/algorithms/radix-sort.module.ts`           | **新增**     | buildRadixSortSteps + radixSortModule            |
| `src/algorithms/radix-sort.ts`                  | **新增**     | oracle radixSortTrace                            |
| `src/algorithms/radix-sort.sources.ts`          | **新增**     | 4 语言源码 + lineMap                             |
| `src/views/Article/SortAlgorithm/RadixSort.vue` | **新增**     | 极简一行接 AlgorithmPlayer                       |
| `src/components/player/types.ts`                | 改（加类型） | +`RadixExecPoint`（additive，沿既有惯例）        |
| `src/router/index.ts`                           | 改（接线）   | +`/docs/radix-sort` name `radix-sort`            |
| `src/views/Docs/Menu/hooks.ts`                  | 改（接线）   | 排序 children 追加「基数排序」                   |
| `src/views/Home/Main/hooks.ts`                  | 改（接线）   | 排序 children 追加「基数排序」+ RadixIcon import |
| `src/views/Docs/Menu/hooks.spec.ts`             | 改（计数）   | TC-HOOK-02-4 排序 8→9                            |

**零改动**：CountView / AlgorithmPlayer / usePlayer / 既有 8 排序模块 / 15 结构 / 图算法。`assets/radix.svg` 已存在。

## 7. 向后兼容论证

- 全新算法模块 + 新页 + 排序分类追加 + 4 处接线为**追加**（既有排序顺序不变、url 唯一）。
- `RadixExecPoint` 为新增类型（additive）；复用 `count` 桶轨字段不改 CountTrack/CountView/AlgorithmPlayer → 计数排序 + 8 排序 Case 零回归。
- 改动仅 TC-HOOK-02-4（排序 8→9）——加排序的合理变化，非回归。
- 新页 name `radix-sort` = 菜单 url；SPA 404 通用。
- 新增 `TC-RADIX-MOD-*` / `TC-VIEW-RADIX-01` / `TC-E2E-RADIX-01`。

## 8. 测试策略（详见 test-cases.md）

- **L3** `radix-sort.module.spec`（参照 counting-sort.module.spec 风格）：末步 done 值序列 = oracle.result `[7,9,18,25,31,42,56,63]`；不改入参；passes=2、distribute 步 16、passStart 步 2、done 1；某 distribute 步 activeBucket = 元素当前位；第 1 轮 distribute 末桶计数 `[0,1,1,1,0,1,1,1,1,1]`；第 1 轮 collect 末 work 值 = `[31,42,63,25,56,7,18,9]`；每步 point 合法且带 count；id 集合恒 = {0..7}（位置键稳定）；4 语言齐备、lineMap 覆盖产出 point、行号在源码行数内。
- **L4** `RadixSort.spec`：mount 页含 `AlgorithmPlayer`；播放器渲染（代码面板 + 主轨 + 桶轨 `.count-view`/`.count-bucket`）。
- **L5 e2e** `radix-sort.e2e.ts`：访问 `/docs/radix-sort`；播放器存在、可单步/播放到末态；主轨末态有序、桶轨 `.count-view` 出现。
- **改** `TC-HOOK-02-4`（Menu）：排序 children 9 项含 radix-sort。
