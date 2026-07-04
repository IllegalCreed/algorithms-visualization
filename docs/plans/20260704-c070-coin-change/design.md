# 设计：硬币找零方案数（C-20260704-070，计数 DP · 复用 MatrixView）

> Status: verified
> Stable ID: C-20260704-070
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

照搬完全背包（C-065）的骨架，把 max 改成加、边界改成 `dp[0][0]=1`。MatrixView 第 7 消费者，**零改动复用**。

## 类型（`types.ts`）

+`CoinChangeExecPoint = 'init' | 'skip' | 'add' | 'done'`。无新轨、无新 Step 字段（复用 `Step.matrix`）。

## oracle（`src/algorithms/coinchange.ts`）

```ts
export const COINS = [1, 2, 5];
export const COIN_AMOUNT = 5;
export function coinChangeTrace(): number[][] { … } // dp[0][0]=1；dp[i][a]=dp[i-1][a]+(a>=c?dp[i][a-c]:0)
```

终态表（4 行 × 6 列，行 ∅/1/2/5、列 0..5）：

```
∅: 1 0 0 0 0 0
1: 1 1 1 1 1 1
2: 1 1 2 2 3 3
5: 1 1 2 2 3 4
```

右下角 `dp[3][5]=4`（4 种：1×5 / 1×3+2 / 1+2×2 / 5）。

## module（`src/algorithms/coinchange.module.ts`）

`buildCoinChangeSteps(): Step<CoinChangeExecPoint>[]`，与完全背包同构：

- `init`：`cells[0][0]=1`、第 0 行其余 = 0；caption 点出「凑 0 元有 1 种：什么都不选」。
- 内层 `for a`：
  - `coin > a`（面额太大）→ `skip`：`dp[i][a]=dp[i-1][a]`，`sources=[[i-1,a]]`。
  - 否则 `add`：`dp[i][a]=dp[i-1][a] + dp[i][a-coin]`，`sources=[[i-1,a], [i, a-coin]]`（不用上一行 + 用一枚本行左偏移格，两数**相加**）。
- `done`：`active=[m,W]`，caption 给出 4 种方案。约 **20 步**（init 1 + 3 硬币 × 5 金额... 实为逐格填 4×6 含边界，约 20 步）。`vars`：硬币、金额、当前格、方案算式。

`coinchange.sources.ts`：TS/Python/Go/Rust 四语言标准计数 DP，`lineMap` 覆盖 init/skip/add/done。

## 页面（`src/views/Article/Algorithm/CoinChange.vue`）

`Article` 正文（标题「硬币找零方案数」+ 副标「动态规划 · 计数」）：讲清计数 DP（方案数相加）与最优 DP（min/max）的差异、`dp[0][0]=1` 的含义、与完全背包的「本行来源」一致；`<AlgorithmPlayer :module="coinChangeModule" />`；结语对照完全背包（同表异算子）。

接线：路由 `/docs/coin-change`；菜单 + 首页「动态规划」children **第 6 项**（末尾）：`[...,'lis','coin-change']`；新 `coin-change.svg`；改 `TC-HOOK`（DP children +coin-change）。

## 复用与零回归

- MatrixView / AlgorithmPlayer 零改动；编辑距离/背包/完全背包/LCS/LIS/Floyd 现有 Case 不受影响。

## 变更历史

- 2026-07-04：创建（draft → approved）。照搬完全背包骨架、max→加、边界 dp[0][0]=1；复用 MatrixView 第 7 消费者，补 DP 计数维度。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：coinChangeTrace() 右下角 4，module add 步 sources=[[i-1,a],[i,a-coin]]（本行）值为两源之和、边界 dp[0][0]=1，约 20 步；4 语言 sources lineMap 对齐 init/skip/add/done。
