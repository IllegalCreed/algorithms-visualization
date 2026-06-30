# 设计：三路快排 3-way Quicksort（全模板 = 正文 + 三指针 BarsView + 区间栈 + 代码播放器）

> Status: verified
> Stable ID: C-20260630-041
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览（复用快排范式 + M8 全模板）

```
新页 src/views/Article/SortAlgorithm/ThreeWayQuickSort.vue
   │  <Article> 介绍正文（什么是三路快排 / 荷兰国旗三段 / 对照普通快排 / 复杂度）</Article>
   │  <AlgorithmPlayer :module="threeWayQuickSortModule" />   ← BarsView 三指针 + StackView 区间栈 + 代码播放器
   ▼
算法模块 src/algorithms/
   three-way-quick.module.ts   buildThreeWayQuickSortSteps + threeWayQuickSortModule
   three-way-quick.ts          oracle threeWayQuickSortTrace(input)→{result}
   three-way-quick.sources.ts  4 语言 + lineMap

类型（additive，不新建轨）：
   src/components/player/types.ts   +ThreeWayExecPoint（8 执行点）

复用既有轨（零改动）：BarsView（主轨 + lt/gt/i 三指针 + groupMembers/sortedIndices）、StackView（区间栈，同快排 C-012）

4 处接线（排序分类追加第 11 项，置快排后）：
   router +/docs/three-way-quick-sort name 'three-way-quick-sort'
   Menu/Home 排序 children 在「快速排序」后插入「三路快排」
   src/assets/three-way-quick.svg（新建：三段柱剪影）
改 TC-HOOK-02-4：排序 10→11
```

## 2. 类型：ThreeWayExecPoint（additive）

```ts
// types.ts 追加（与 QuickExecPoint 并列）
export type ThreeWayExecPoint =
  | 'pop' // 弹出区间
  | 'pivotSelect' // 选 pivot = a[lo]
  | 'compare' // 比较 a[i] 与 pivot（三路决策）
  | 'less' // a[i] < pivot：swap(lt,i)，lt++，i++
  | 'greater' // a[i] > pivot：swap(i,gt)，gt--
  | 'equal' // a[i] == pivot：i++
  | 'push' // 压入子区间 [lo,lt-1] / [gt+1,hi]
  | 'done';
```

**不新增轨**：复用 `Step.stack`（StackTrack，快排已有）做区间栈；三指针走 `Step.pointers`；三段高亮走 `Step.emphasis`（groupMembers 当前区间 + sortedIndices 已钉死段）。

## 3. 算法模块 `three-way-quick.module.ts`

```ts
const ID_LT = '3'; // 绿：小于区右边界 lt（== 区左界）
const ID_I = '1'; // 蓝：扫描游标 i
const ID_GT = '0'; // 红：大于区左边界 gt
export const threeWayQuickSortModule: AlgorithmModule<ThreeWayExecPoint> = {
  title: '三路快排',
  initialInput: () => [5, 3, 8, 3, 5, 8, 3, 5],
  buildSteps: buildThreeWayQuickSortSteps,
  sources: threeWayQuickSortSources,
};
```

- **work**：`[String(i),v]` 稳定位置键（柱子 FLIP 交换动画）。
- **显式区间栈** `stack: {lo,hi}[]`，初始 `[{0,n-1}]`；「先右后左入栈 → pop 先取左」（同快排 C-012）。只压**多元素**子区间（lo<hi）。
- **每个 pop 的区间**：`pivotSelect`（pivot=a[lo]）→ `lt=lo,i=lo,gt=hi`，`while(i<=gt)`：
  - `compare`（announce a[i] vs pivot）
  - `a[i]<pivot` → `less`：swap(work[lt],work[i])，lt++，i++
  - `a[i]>pivot` → `greater`：swap(work[i],work[gt])，gt--（i 不动）
  - `a[i]==pivot` → `equal`：i++
  - 循环结束：`[lt,gt]` 段全 == pivot、**钉死**（入 `placed` → sortedIndices）；`push`（压 [lo,lt-1] 与 [gt+1,hi] 中多元素者；单元素直接钉死）
- 末 `done`：sortedIndices = 全部 n、无指针。
- **emphasis**：`groupMembers`=当前区间 [lo,hi]（dim 其余）；`sortedIndices`=累积已钉死段。pivot 为**值**（非下标），不占 pivotIndex，靠 vars + caption。
- **stackSnap**：frames 取真实栈深拷贝；pop 步额外带 popped 区间（同快排）。

### 手算（固定 `[5,3,8,3,5,8,3,5]`，pivot=a[lo]）

**划分 [0,7]**（pivot=a[0]=**5**），lt=0,i=0,gt=7：

| i   | a[i] | 对比 5 | 动作               | 数组                | lt,gt |
| --- | ---- | ------ | ------------------ | ------------------- | ----- |
| 0   | 5    | ==     | i→1                | 5,3,8,3,5,8,3,5     | 0,7   |
| 1   | 3    | <      | swap(0,1) lt→1 i→2 | **3**,5,8,3,5,8,3,5 | 1,7   |
| 2   | 8    | >      | swap(2,7) gt→6     | 3,5,5,3,5,8,3,**8** | 1,6   |
| 2   | 5    | ==     | i→3                | 3,5,5,3,5,8,3,8     | 1,6   |
| 3   | 3    | <      | swap(1,3) lt→2 i→4 | 3,**3**,5,5,5,8,3,8 | 2,6   |
| 4   | 5    | ==     | i→5                | 3,3,5,5,5,8,3,8     | 2,6   |
| 5   | 8    | >      | swap(5,6) gt→5     | 3,3,5,5,5,3,**8**,8 | 2,5   |
| 5   | 3    | <      | swap(2,5) lt→3 i→6 | 3,3,**3**,5,5,5,8,8 | 3,5   |
| 6   | —    | i>gt   | 停                 | 3,3,3,5,5,5,8,8     | 3,5   |

→ 一趟得 `[3,3,3 | 5,5,5 | 8,8]`，**中段 [3,5]（值 5）钉死**。压子区间：先右 [6,7]、后左 [0,2] → pop 先取左 [0,2]。

**划分 [0,2]**（pivot=a[0]=3）：全 ==3 → i 走到 3，[0,2] 钉死，无子区间。
**划分 [6,7]**（pivot=a[6]=8）：全 ==8 → [6,7] 钉死，无子区间。
栈空 → `done`，全部有序 `[3,3,3,5,5,5,8,8]` ✓。

- 步数：不强测精确值（递归依赖数据），改测**结构不变量**：`#compare == #less+#greater+#equal`、`#pop==#pivotSelect==#push`、首划分后数组 = `[3,3,3,5,5,5,8,8]` 且 [3,4,5] 已钉死、三分支 less/greater/equal 各至少出现一次、done 段 sortedIndices.length==n。

## 4. oracle `three-way-quick.ts` + sources

```ts
export interface ThreeWayQuickTrace {
  result: number[];
}
export function threeWayQuickSortTrace(input: number[]): ThreeWayQuickTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
```

sources（4 语言）TS 骨架（行号 1-based）：

```
1  function quickSort3way(a: number[]): number[] {
2    const stack: [number, number][] = [[0, a.length - 1]];
3    while (stack.length > 0) {
4      const [lo, hi] = stack.pop()!;            ← pop
5      const pivot = a[lo];                       ← pivotSelect
6      let lt = lo, i = lo, gt = hi;
7      while (i <= gt) {
8        if (a[i] < pivot) {                      ← compare
9          [a[lt], a[i]] = [a[i], a[lt]];         ← less
10         lt++; i++;
11       } else if (a[i] > pivot) {
12         [a[i], a[gt]] = [a[gt], a[i]];         ← greater
13         gt--;
14       } else {
15         i++;                                    ← equal
16       }
17     }
18     if (lt - 1 > lo) stack.push([lo, lt - 1]);  ← push
19     if (gt + 1 < hi) stack.push([gt + 1, hi]);
20   }
21   return a;                                     ← done
22 }
```

`lineMap(ts) = { pop:4, pivotSelect:5, compare:8, less:9, greater:12, equal:15, push:18, done:21 }`；python/go/rust 各自源码 + 行号。

## 5. 视图 `ThreeWayQuickSort.vue`（全模板）

```vue
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { threeWayQuickSortModule } from '@/algorithms/three-way-quick.module';
</script>
<template>
  <Article>
    <h1>三路快排 3-way Quicksort</h1>
    <p class="sub">交换排序 · 快排变体 · 荷兰国旗划分</p>
    <h2>什么是三路快排</h2>
    <p>…普通快排遇大量重复退化 → 三段划分 < / == / > …</p>
    <h2>荷兰国旗划分 / 对照 / 复杂度</h2>
    <p>…lt/i/gt 三指针…== 一次归位…平均 O(n log n)、重复多趋近 O(n)…</p>
  </Article>
  <AlgorithmPlayer :module="threeWayQuickSortModule" />
</template>
```

## 6. 组件清单与改动面

| 文件                                                    | 类型         | 改动                                      |
| ------------------------------------------------------- | ------------ | ----------------------------------------- |
| `src/components/player/types.ts`                        | 改（加类型） | +ThreeWayExecPoint（additive）            |
| `src/algorithms/three-way-quick.module.ts`              | **新增**     | buildThreeWayQuickSortSteps + module      |
| `src/algorithms/three-way-quick.ts`                     | **新增**     | oracle threeWayQuickSortTrace             |
| `src/algorithms/three-way-quick.sources.ts`             | **新增**     | 4 语言 + lineMap                          |
| `src/views/Article/SortAlgorithm/ThreeWayQuickSort.vue` | **新增**     | 全模板：Article 正文 + AlgorithmPlayer    |
| `src/assets/three-way-quick.svg`                        | **新增**     | 三段柱剪影图标                            |
| `src/router/index.ts`                                   | 改（接线）   | +`/docs/three-way-quick-sort`             |
| `src/views/Docs/Menu/hooks.ts`                          | 改（接线）   | 排序 children「快速排序」后插「三路快排」 |
| `src/views/Home/Main/hooks.ts`                          | 改（接线）   | 同上 + import ThreeWayQuickIcon           |
| `src/views/Docs/Menu/hooks.spec.ts`                     | 改（计数）   | TC-HOOK-02-4 排序 10→11                   |

**零改动**：既有 6 轨（BarsView/AuxView/StackView/TreeView/CountView/BucketView）/ usePlayer / AlgorithmPlayer / 既有 10 排序模块 / 15 结构 / 图算法。复用 StackView + BarsView。

## 7. 向后兼容论证

- `ThreeWayExecPoint` 仅**追加类型**；模块复用既有 `Step.stack`/`Step.pointers`/`Step.emphasis`，不碰 AlgorithmPlayer/任何轨组件 → 既有算法零回归。
- 排序分类追加第 11 项 + 4 处接线为追加；改动仅 TC-HOOK-02-4（排序 10→11）。
- 新页 name `three-way-quick-sort` = 菜单 url；SPA 404 通用。
- 新增 `TC-3WQUICK-MOD-*` / `TC-VIEW-3WQUICK-*` / `TC-E2E-3WQUICK-01`。

## 8. 测试策略（详见 test-cases.md）

- **L3 模块** `three-way-quick.module.spec`：末步有序=oracle；不改入参；位置键稳定；执行点合法 + 带 stack；`#compare==#less+#greater+#equal`；`#pop==#pivotSelect==#push`；首划分 pivot=5；首划分后数组 `[3,3,3,5,5,5,8,8]` 且 [3,4,5] 钉死；三分支各≥1 次；done sortedIndices=n、无指针；4 语言 + lineMap；module 元信息。
- **L4 视图** `TC-VIEW-3WQUICK-01/02`：含 Article（h1「三路快排」）+ AlgorithmPlayer + StackView；主轨 8 柱、`.counter` 含 `1 / `。
- **L5 e2e** `TC-E2E-3WQUICK-01`：`/docs/three-way-quick-sort`：正文 h1「三路快排」、`.stack-view` 可见、主轨 8 `.bar-cell`、`.scrub` 拖末步主轨有序 `[3,3,3,5,5,5,8,8]`。
- **改** `TC-HOOK-02-4`：排序 11 项含 three-way-quick-sort。
