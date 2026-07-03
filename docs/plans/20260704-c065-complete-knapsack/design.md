# 设计：完全背包（C-20260704-065，背包问题族补全）

> Status: verified
> Stable ID: C-20260704-065
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

完整照搬 0-1 背包（C-054）的实现骨架，**只改「取」的递推来源**。因此这是 MatrixView 的第 6 个消费者（继 Floyd 方阵 / 编辑距离字符轴 / 0-1 背包数值轴 / LCS 回溯 / LIS 两行表之后），且**零改动复用** MatrixView 与 `KnapsackExecPoint` 类型。

## oracle（`src/algorithms/completeknapsack.ts`）

```ts
export const ITEM_LABELS = ['A', 'B', 'C'];
export const WEIGHTS = [2, 3, 4];
export const VALUES = [5, 6, 7];
export const CAPACITY = 6;

// 二维 DP：完全背包——「取」来自本行 dp[i][w-wt]（区别于 0-1 的 dp[i-1][w-wt]）
export function completeKnapsackTrace(): number[][] { … }
```

终态表（4 行 × 7 列，行 ∅/A/B/C、列 0..6）：

```
∅: 0 0 0 0  0  0  0
A: 0 0 5 5 10 10 15
B: 0 0 5 6 10 11 15
C: 0 0 5 6 10 11 15
```

右下角 `dp[3][6] = 15`（最优 = A 拿 3 次：重 2×3=6、值 5×3=15）。

## module（`src/algorithms/completeknapsack.module.ts`）

`buildCompleteKnapsackSteps(): Step<KnapsackExecPoint>[]`，与 `buildKnapsackSteps` 同构，逐格重走：

- `init`：边界第 0 行/列 = 0。
- 内层 `for w`：
  - `wt > w`（装不下）→ `cellSkip`：`dp[i][w]=dp[i-1][w]`，`sources=[[i-1,w]]`（上一行，与 0-1 相同）。
  - 否则 `cellChoose`：`skip=dp[i-1][w]`、`take=dp[i][w-wt]+val`、`dp[i][w]=max(skip,take)`；
    **`sources=[[i-1,w], [i, w-wt]]`**——第一个是「不取」（上一行），第二个是「取」（**本行**左侧偏移格）。这是与 0-1 的唯一可视化差异（0-1 第二个源是 `[i-1,w-wt]`）。
- `done`：`active=[m,W]`，字幕点出 15 = A×3、并对照 0-1 只能拿 12。

约 **20 步**（init 1 + 3 物品 × 6 容量 18 + done 1）。`vars` 展示容量、物品清单、当前格、取舍算式。

## sources（`src/algorithms/completeknapsack.sources.ts`）

TS/Python/Go/Rust 四语言，与 0-1 逐字节相同，**仅 `else` 分支下标** `dp[i-1][c-w[i-1]]` → `dp[i][c-w[i-1]]`。`lineMap` 与 0-1 完全一致（结构未变）：`{ init:3, cellSkip:7, cellChoose:9, done:… }`。

## 页面（`src/views/Article/Algorithm/CompleteKnapsack.vue`）

`Article` 正文（标题「完全背包」+ 副标「动态规划 · 无限次取」）：

- 讲清与 0-1 的**唯一**差别：内层循环里「取」的来源从 `dp[i-1][…]` 变 `dp[i][…]`（一次遍历里就能反复利用同一物品）。
- `<AlgorithmPlayer :module="completeKnapsackModule" />`。
- 结语点出「一维优化版把二维压成一行、正序遍历容量」为进阶方向，链接回 0-1 背包页。

## 接线

- 路由：`/docs/complete-knapsack`（name=`complete-knapsack`），懒加载。
- 菜单 `Docs/Menu/hooks.ts` + 首页 `Home/Main/hooks.ts`「动态规划」children **第 3 项**（紧接 `knapsack`）：`['edit-distance','knapsack','complete-knapsack','lcs','lis']`。
- 新图标 `src/assets/complete-knapsack.svg`（背包 + 循环箭头，示意「可重复取」）。
- 改 `TC-HOOK`（DP children 断言，menu+home 各 1 处）。

## 复用与零回归

- MatrixView：`sources` 支持任意坐标，本行来源格自然渲染 `.mx-source`，**零改动**。
- `KnapsackExecPoint`（init/cellSkip/cellChoose/done）语义对完全背包同样成立 → **复用、零 types 改动**。
- 编辑距离/0-1 背包/LCS/LIS/Floyd 现有 Case 不受影响。

## 变更历史

- 2026-07-04：创建（draft → approved）。照搬 0-1 骨架、仅改「取」来源为本行；复用 MatrixView + KnapsackExecPoint。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：oracle `completeKnapsackTrace()` 右下角 15，module `cellChoose` take=`cells[i][w-wt]+val`、sources=`[[i-1,w],[i,w-wt]]`（本行源），20 步；四语言 sources 仅 `else` 分支下标 `i-1→i`、lineMap 与 0-1 一致。
