# 设计：桶排序 Bucket Sort（全模板 = 正文 + BucketView 桶轨 + 代码播放器）

> Status: verified
> Stable ID: C-20260630-040
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览（M8 全模板首例）

```
新页 src/views/Article/SortAlgorithm/BucketSort.vue
   │  <Article> 介绍正文（什么是桶排序/分桶+桶内排序+合并/复杂度/适用） </Article>
   │  <AlgorithmPlayer :module="bucketSortModule" />   ← 可视化(BucketView 轨) + 多语言代码播放器
   ▼
算法模块 src/algorithms/
   bucket-sort.module.ts   buildBucketSortSteps + bucketSortModule
   bucket-sort.ts          oracle bucketSortTrace(input)→{result}
   bucket-sort.sources.ts  4 语言 + lineMap

新增第 6 条 additive 轨：
   src/components/player/types.ts   +BucketExecPoint +BucketTrack +Step.bucket?
   src/components/BucketView.vue     桶轨：N 桶（值域标签 + 桶内元素格子 + 活跃桶高亮）
   src/components/player/AlgorithmPlayer.vue   +<BucketView v-if="current.bucket">

4 处接线（排序分类追加第 10 项）：
   router +/docs/bucket-sort name 'bucket-sort'；Menu/Home 排序 children 追加「桶排序」（基数后）；assets/bucket.svg ✅已存在
改 TC-HOOK-02-4：排序 9→10
```

**全模板**：页面 = `<Article>` 正文（720 阅读宽）+ `<AlgorithmPlayer>`（全宽，自带 BucketView 可视化 + 4 语言代码 + 单步/播放 + 变量面板）。这是 M8「算法 = 正文 + 可视化 + 代码播放器」的第一个落地样板（排序侧）。

## 2. 新轨：BucketTrack + BucketView（additive，第 6 条轨）

```ts
// types.ts 追加（与 aux/stack/tree/count 同模式）
export type BucketExecPoint = 'distribute' | 'sortBucket' | 'concat' | 'done';
export interface BucketTrack {
  buckets: number[][]; // 每桶当前元素值列表
  ranges: [number, number][]; // 每桶值域 [lo,hi]（标签）
  activeBucket?: number; // 当前操作的桶
}
// Step 追加：bucket?: BucketTrack
```

- `BucketView.vue` props `{ bucket: BucketTrack }`：横排 N 桶 `.bucket-col`（活跃 `.active`）；每桶竖排元素 `.bucket-cell`（数值）+ 值域标签 `.bucket-range`（如 `0-9`）。空桶渲染 0 格。
- `AlgorithmPlayer.vue` 加 `<BucketView v-if="current.bucket" :bucket="current.bucket" />`（紧跟既有 CountView 之后；既有算法不设 bucket → 不渲染，零回归）。

## 3. 算法模块 `bucket-sort.module.ts`

```ts
const BUCKET_COUNT = 5,
  BUCKET_WIDTH = 10;
const RANGES: [number, number][] = [
  [0, 9],
  [10, 19],
  [20, 29],
  [30, 39],
  [40, 49],
];
const bucketOf = (v) => Math.min(Math.floor(v / BUCKET_WIDTH), BUCKET_COUNT - 1);
export const bucketSortModule: AlgorithmModule<BucketExecPoint> = {
  title: '桶排序',
  initialInput: () => [29, 25, 3, 49, 9, 37, 21, 43],
  buildSteps: buildBucketSortSteps,
  sources: bucketSortSources,
};
```

- **work**：`[String(i),v]` 位置键（同计数/基数，柱原位、值覆盖、不 FLIP）；不改入参。
- **三阶段**：
  1. `distribute`（8 步）：遍历 work，`b=bucketOf(v)`，`buckets[b].push(v)`；每元素一步——读游标 `id '1' index i`、bucket 轨桶填充、activeBucket b。
  2. `sortBucket`（5 步，每桶一步）：`buckets[b].sort((x,y)=>x-y)`（桶内插入排序结果）；activeBucket b；空桶步显示「空桶跳过」。
  3. `concat`（8 步）：`w=0`；按桶 0→4、桶内顺序 `work[w][1]=buckets[b].shift()` 回写；每元素一步——写游标 `id '3' index w`、`emphasis.sortedUpTo=w+1`、bucket 轨该桶递减。
  - 末 `done`：`array` 有序、`sortedUpTo=n`、桶清空。

**手算（固定 `[29,25,3,49,9,37,21,43]`）**：

| 阶段       | 关键状态                                                                |
| ---------- | ----------------------------------------------------------------------- |
| 分配后     | 桶0`[3,9]` 桶1`[]` 桶2`[29,25,21]` 桶3`[37]` 桶4`[49,43]`               |
| 桶内排序后 | 桶2`[29,25,21]→[21,25,29]`、桶4`[49,43]→[43,49]`（其余不变）            |
| 合并       | `[3,9] + [21,25,29] + [37] + [43,49]` = `[3,9,21,25,29,37,43,49]` ✓有序 |

- 步数：distribute 8 + sortBucket 5 + concat 8 + done 1 = **22 步**。
- 最终 `[3,9,21,25,29,37,43,49]` = `bucketSortTrace(input).result`。

## 4. oracle `bucket-sort.ts` + sources

```ts
export interface BucketTrace {
  result: number[];
}
export function bucketSortTrace(input: number[]): BucketTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
```

sources（4 语言）TS 骨架（行号 1-based）：

```
1  function bucketSort(a: number[]): number[] {
2    const buckets: number[][] = Array.from({ length: 5 }, () => []);
3    for (const x of a) buckets[Math.min((x / 10) | 0, 4)].push(x);   ← distribute
4    for (const b of buckets) b.sort((x, y) => x - y);                ← sortBucket
5    let w = 0;
6    for (const b of buckets)
7      for (const x of b) a[w++] = x;                                 ← concat
8    return a;                                                         ← done
9  }
```

`lineMap(ts) = { distribute:3, sortBucket:4, concat:7, done:8 }`；python/go/rust 各自源码 + 行号（覆盖产出 point）。

## 5. 视图 `BucketSort.vue`（全模板）

```vue
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bucketSortModule } from '@/algorithms/bucket-sort.module';
</script>
<template>
  <Article>
    <h1>桶排序 Bucket Sort</h1>
    <p class="sub">经典排序 · 非比较 · 分桶</p>
    <h2>什么是桶排序</h2>
    <p>…按值域撒进若干桶 → 桶内各自排序 → 按桶序拼接…</p>
    <h2>怎么做 / 复杂度 / 适用</h2>
    <p>…均匀分布平均 O(n+k)，最坏退化…对照计数/基数…</p>
  </Article>
  <AlgorithmPlayer :module="bucketSortModule" />
</template>
```

（与既有排序的「裸播放器」不同——本页是 M8 全模板首例：正文 + 播放器。后续给其余排序补正文时同此结构。）

## 6. 组件清单与改动面

| 文件                                             | 类型         | 改动                                            |
| ------------------------------------------------ | ------------ | ----------------------------------------------- |
| `src/components/player/types.ts`                 | 改（加类型） | +BucketExecPoint +BucketTrack +Step.bucket?     |
| `src/components/BucketView.vue`                  | **新增**     | 桶轨可视化（N 桶 + 元素 + 活跃高亮）            |
| `src/components/player/AlgorithmPlayer.vue`      | 改（加轨）   | +`<BucketView v-if="current.bucket">`           |
| `src/algorithms/bucket-sort.module.ts`           | **新增**     | buildBucketSortSteps + bucketSortModule         |
| `src/algorithms/bucket-sort.ts`                  | **新增**     | oracle bucketSortTrace                          |
| `src/algorithms/bucket-sort.sources.ts`          | **新增**     | 4 语言 + lineMap                                |
| `src/views/Article/SortAlgorithm/BucketSort.vue` | **新增**     | 全模板：Article 正文 + AlgorithmPlayer          |
| `src/router/index.ts`                            | 改（接线）   | +`/docs/bucket-sort` name `bucket-sort`         |
| `src/views/Docs/Menu/hooks.ts`                   | 改（接线）   | 排序 children 追加「桶排序」                    |
| `src/views/Home/Main/hooks.ts`                   | 改（接线）   | 排序 children 追加「桶排序」+ BucketIcon import |
| `src/views/Docs/Menu/hooks.spec.ts`              | 改（计数）   | TC-HOOK-02-4 排序 9→10                          |

**零改动**：既有 5 轨（BarsView/AuxView/StackView/TreeView/CountView）/ usePlayer / 既有 9 排序模块 / 15 结构 / 图算法。`assets/bucket.svg` 已存在。

## 7. 向后兼容论证

- `BucketTrack`/`BucketExecPoint`/`Step.bucket?` 均**追加**；`<BucketView v-if="current.bucket">` 与既有 4 个可选轨同模式——既有算法步骤不含 bucket → 不渲染 → 9 排序 + 播放器各轨 Case 零回归。
- 排序分类追加第 10 项 + 4 处接线为追加；改动仅 TC-HOOK-02-4（排序 9→10）。
- 新页 name `bucket-sort` = 菜单 url；SPA 404 通用。
- 新增 `TC-VIZ-BUCKETVIEW-*` / `TC-PLAYER-BUCKET-*` / `TC-BUCKET-MOD-*` / `TC-VIEW-BUCKET-*` / `TC-E2E-BUCKET-01`。

## 8. 测试策略（详见 test-cases.md）

- **L4 新轨** `BucketView.spec`：给定 track 渲染 N `.bucket-col`、桶内 `.bucket-cell` 显值、活跃桶 `.active`、空桶 0 格。
- **L4 播放器** `TC-PLAYER-BUCKET-01/02`：当前步带 bucket → 渲染 BucketView；不带 → 不渲染（向后兼容）。
- **L3 模块** `bucket-sort.module.spec`：末步有序 = oracle；不改入参；位置键稳定；步数 distribute8/sortBucket5/concat8/done1；分配末 桶2`[29,25,21]`/桶1`[]`；首 distribute activeBucket 2 + 读游标；sortBucket 桶2`[21,25,29]`；concat 末有序 + 写游标；ranges；done sortedUpTo=n；4 语言 + lineMap。
- **L4 视图** `TC-VIEW-BUCKET-01/02`：含 Article（h1「桶排序」）+ AlgorithmPlayer + BucketView；主轨 8 柱、`.counter` 含 `1 / `。
- **L5 e2e** `TC-E2E-BUCKET-01`：`/docs/bucket-sort`：正文 h1「桶排序」、`.bucket-view` 可见、主轨 8 `.bar-cell`、`.scrub` 拖末步主轨有序 `[3,9,21,25,29,37,43,49]`。
- **改** `TC-HOOK-02-4`：排序 10 项含 bucket-sort。
