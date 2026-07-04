# 实现记录：硬币找零方案数（C-20260704-070，计数 DP · 复用 MatrixView）

> Status: verified
> Stable ID: C-20260704-070
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T1 module + oracle + sources**（L3）：types.ts +`CoinChangeExecPoint`；先 coinchange.module.spec（TC-CC-MOD-01..12）跑红 → coinchange.{ts,sources.ts,module.ts}（照搬完全背包、max→加、边界 dp[0][0]=1）跑绿。无 T0（MatrixView 零改动）。
2. **T2 新页 + 接线**：CoinChange.vue（Article + AlgorithmPlayer）；路由 /docs/coin-change；菜单 + 首页「动态规划」第 6 项（新 coin-change.svg）；改 TC-HOOK（DP children +coin-change）；CoinChange.spec + coin-change.e2e。
3. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap DP 第 6 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **照搬完全背包骨架，仅改算子 + 边界**：`coinchange.module.ts` 与 `completeknapsack.module.ts` 逐块同构；`add` 步 `dp[i][a]=dp[i-1][a] + dp[i][a-coin]`（完全背包是 `max`），`sources=[[i-1,a],[i,a-coin]]`（第二个源在**本行**，同完全背包）；边界 `dp[0][0]=1`（凑 0 元 1 种），第 0 行其余 0。
- **新增 CoinChangeExecPoint（init/skip/add/done），零轨改动**：纯复用 MatrixView（第 7 消费者）+ Step.matrix，AlgorithmPlayer 零改动。
- **oracle 分离对拍**：`coinchange.ts`（硬币 [1,2,5]/金额 5，`coinChangeTrace()` 右下角 4）作真值，module spec 末步深等 oracle。
- **四语言 sources**：TS/Python/Go/Rust 标准计数 DP，lineMap 对齐 init/skip/add/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1331/1331 全绿**、聚合 statements 95.49% · branches 94.92%；`coinchange.*` 满覆盖（v8 text 隐藏）。
- **e2e（真机 Playwright/Chromium）**：`coin-change` + 回归 `complete-knapsack` **2/2 通过**——4×6=24 单元、无柱数组、Shiki、拖末步右下角=4 + 字幕含 4。
- **真机视觉自检**：末步 20/20——DP 表 [[1,0,0,0,0,0],[1,1,1,1,1,1],[1,1,2,2,3,3],[1,1,2,2,3,4]]（= oracle，dp[0][0]=1 种子）、右下角 4、字幕列出四种凑法（1×5、1×3+2、1+2×2、5）。
- **回归**：MatrixView/AlgorithmPlayer 零改动；完全背包/编辑距离/LCS/LIS/Floyd 现有 Case 不变全绿；仅 TC-HOOK（DP children）追加 coin-change。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；16 Case + 改 2 HOOK 全绿、双轨部署。
