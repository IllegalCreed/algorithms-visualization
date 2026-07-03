# 设计：最长递增子序列 LIS（C-20260703-061，一维 DP）

> Status: verified
> Stable ID: C-20260703-061
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

**复用 MatrixView 矩阵轨**（第 5 消费者，零改动 —— `pathCells` 于 [[C-20260703-060]] 已加）：把一维 dp 数组画成一张「值 + dp」两行小表。仅在 types.ts 加 `LisExecPoint`（无新轨、无新 Step 字段、AlgorithmPlayer 零改动）。前三页 DP 都是二维表，本页用两行表呈现一维 DP，与它们形态对照。

## 复用点：MatrixView 两行表（零改动）

`(2)×(n)` 矩阵：行 0 = 输入值（静态）、行 1 = dp（逐格填，未填 null）。`rowLabels=['值','dp']`、`colLabels` = 位置序号。复用现有高亮：

- `active`：当前计算的 `dp[i]`（行 1 第 i 列，琥珀环）。
- `sources`：本步比较/参考的单元——输入值 `[0,i]`/`[0,j]`（黄）+ dp 源 `[1,j]`。
- `updatedCell`：`dp[i]` 刚被增大（绿闪）。
- `pathCells`：构成 LIS 的元素位置（行 0，绿环）——复用 C-060 扩展。

types.ts 仅加执行点：

```ts
export type LisExecPoint =
  | 'init' // dp[i] 全部初始化为 1（每个元素自身是长度 1 的子序列）
  | 'scan' // 回看某个 j<i：比较 a[j] 与 a[i]（不更新）
  | 'extend' // a[j]<a[i] 且 dp[j]+1>dp[i] → dp[i]=dp[j]+1（接在 a[j] 的 LIS 后）
  | 'fillDone' // dp 填完：max(dp) = LIS 长度
  | 'result'; // 回溯 pred 恢复出 LIS，高亮构成元素
```

## 算法：LIS（固定输入 `[1,3,2,4,3,5]`）

### 递推与恢复

`dp[i]` = 以 `a[i]` 结尾的最长递增子序列长度，初值 1。对每个 `i`，回看所有 `j<i`：若 `a[j]<a[i]` 且 `dp[j]+1>dp[i]`，则 `dp[i]=dp[j]+1`、记 `pred[i]=j`。

输入 `[1,3,2,4,3,5]` → `dp=[1,2,2,3,3,4]`、`pred=[-1,0,0,1,2,3]`。`max(dp)=4`（在 i=5）。从 i=5 沿 pred 回溯：5→3→1→0，得 LIS 位置 `[0,1,3,5]`、值 `[1,3,4,5]`（长度 4）。

### 固定数据（`src/algorithms/lis.ts`）

`LIS_INPUT=[1,3,2,4,3,5]` + `lisDp()`（返回 `{dp,pred}`）+ `lisLength()`（=4）+ `lisIndices()`（=`[0,1,3,5]`）+ `lisValues()`（=`[1,3,4,5]`），供 module 断言。

### 细粒度重走（`src/algorithms/lis.module.ts`）

`buildLisSteps()`：

1. `init`：dp 行全填 1，字幕「每个元素自身是长度 1 的递增子序列」。
2. 双重循环 `i=1..n-1` × `j=0..i-1`：每对 emit 一步——`a[j]<a[i]` 且能变长 → `extend`（更新 dp[i]、绿闪）；否则 `scan`（跳过）。`active=[1,i]`、`sources=[[0,i],[0,j],[1,j]]`。
3. `fillDone`：高亮 max(dp) 所在列，字幕「dp 填完，最大 dp = LIS 长度 = 4」。
4. `result`：`pathCells=`LIS 位置的值行单元，字幕「LIS = 1→3→4→5（长度 4）」。

步数 ≈ 18（init 1 + 15 对 scan/extend + fillDone 1 + result 1）。`vars`：`输入/当前 i/回看 j/dp 数组/LIS 长度`。

### 四语言源码（`src/algorithms/lis.sources.ts`）

ts/python/go/rust 各一段 LIS O(n²) DP（`dp` 全 1；`for i` `for j<i`：`a[j]<a[i]` 时 `dp[i]=max(dp[i],dp[j]+1)`；答案 `max(dp)`）。`lineMap` 映射 `init/scan/extend/fillDone/result`。

## 页面与接线

- `Lis.vue`：Article 正文（LIS/递增子序列、一维 DP `dp[i]` 依赖前面 dp[j]、回看取最大 +1、max(dp)=答案 + 回溯恢复 LIS、与 LCS（二维）对照、O(n log n) 更快解法带过 + AlgorithmPlayer）。`array:[]` → BarsView 隐藏。
- 路由 `/docs/lis` name=`lis` 懒加载。
- 菜单 `Docs/Menu/hooks.ts`「动态规划」+「最长递增子序列」（第 4 项）；首页 `Home/Main/hooks.ts` 同类 + 新 `lis.svg`（递增柱/上升折线图标）。
- 改 `TC-HOOK-01-1/02-1`：`data[3].children` → `['edit-distance','knapsack','lcs','lis']`。

## 关键决策

1. **复用 MatrixView 两行表而非新轨/复用 Bars+Aux**：AuxView 按柱高渲染，dp 小整数会被输入值域压扁不清晰；MatrixView 两行表把值与 dp 并排、逐格填 + 高亮 + pathCells 恢复解，最清晰且零新轨（第 5 消费者）。
2. **一维 DP**：前三页均二维表，LIS 补一维形态；与 LCS 同「子序列」配对。
3. **固定 `[1,3,2,4,3,5]`**：2×6 表清晰，LIS=`[1,3,4,5]` 长 4，回看/更新/恢复三类过程完整。

## 影响面

- 改：`types.ts`（+`LisExecPoint`，**无新轨/新字段**）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`lis.ts`、`lis.sources.ts`、`lis.module.ts`(+spec)、`Lis.vue`(+spec)、`e2e/lis.e2e.ts`、`src/assets/lis.svg`。
- MatrixView.vue / AlgorithmPlayer.vue 零改动；既有轨 + 全部算法页零改动。

## 变更历史

- 2026-07-03：创建（draft → approved）。复用 MatrixView 两行表（第 5 消费者）+ LIS 页设计。
- 2026-07-03：交付完成，翻 verified。设计如实落地（MatrixView 2×n 两行表复用 active/sources/updatedCell/pathCells、lis.module 一维 DP 18 步、`array:[]` 隐 BarsView、零新轨零改动）；真机首步 12 单元、填满 dp=4、末步 LIS 4 格绿恢复 1→3→4→5 验证。
