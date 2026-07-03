# 实现记录：完全背包（C-20260704-065，背包问题族补全）

> Status: verified
> Stable ID: C-20260704-065
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T1 module + oracle + sources**（L3）：先 completeknapsack.module.spec（TC-CK-MOD-01..12）跑红 → completeknapsack.{ts,sources.ts,module.ts}（照搬 0-1、仅「取」来源改本行）跑绿。无 T0（MatrixView/类型零改动）。
2. **T2 新页 + 接线**：CompleteKnapsack.vue（Article + AlgorithmPlayer）；路由 /docs/complete-knapsack；菜单 + 首页「动态规划」第 3 项（新 complete-knapsack.svg）；改 TC-HOOK（DP children +complete-knapsack）；CompleteKnapsack.spec + complete-knapsack.e2e。
3. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap DP 第 5 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **照搬 0-1 骨架，仅改一处递推**：`completeknapsack.module.ts` 与 `knapsack.module.ts` 逐块同构，唯一差别在 `cellChoose` 的「取」——`take = cells[i][w-wt] + val`（0-1 是 `cells[i-1][w-wt]`），`sources = [[i-1,w], [i,w-wt]]`（第二个源从上一行挪到**本行**）。因此 MatrixView 的 `sources` 高亮天然把「取」的来源格画在同一行左侧，无需任何组件改动。
- **零 types 改动**：复用 `KnapsackExecPoint`（init/cellSkip/cellChoose/done）——完全背包的执行点集合与 0-1 完全相同，语义（装不下沿用 / 装得下取舍）也成立，故不新增执行点类型。
- **oracle 分离对拍**：`completeknapsack.ts`（A重2值5/B重3值6/C重4值7、容量 6，`completeKnapsackTrace()` 右下角 15）作真值，module spec 末步深等 oracle。
- **demo 选材凸显差异**：物品选成「小件高性价比」（A 重2值5），容量 6 恰好能装 3 个 A（值 15），而同批物品按 0-1 只能拿 12——把「可重复取」的收益差直接摆出来；且 A×3 链全部落在 DP 表第 1 行（`0→5→10→15`），每格的「取」源都在本行，视觉上一目了然。
- **四语言 sources**：TS/Python/Go/Rust，仅 `else` 分支下标 `dp[i-1][…]`→`dp[i][…]`，结构不变故 `lineMap` 与 0-1 完全一致。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓（0 warning）/ `type-check`（vue-tsc）✓ / `test:unit run --coverage` **1246/1246 全绿**、聚合 statements 94.91% · branches 94.22% · functions 94.65% · lines 95.51%（远超门槛）；`completeknapsack.*` 满覆盖（v8 text 隐藏）。
- **e2e（真机 Playwright/Chromium）**：`complete-knapsack` + 回归 `knapsack` **2/2 通过**——4×7=28 单元、无柱数组、Shiki 着色、拖末步右下角 = 15 + 字幕含 15。
- **真机视觉自检（1 图眼验）**：第 7/20 步（dp[1][6]）——当前格 15 琥珀环 + 绿，两黄源分列：`dp[0][6]=0`（∅ 行，不取来自正上方）+ **`dp[1][4]=10`（A 行，取来自同一行左侧）**，字幕「max(不取 0, 取本行 15) = 15（取完可再取 A）」；第 1 行 `0 0 5 5 10 10 15` 展示 A×3。与 0-1 的「取源在上一行」形成清晰对照。
- **回归**：MatrixView/AlgorithmPlayer/KnapsackExecPoint 零改动；编辑距离/0-1 背包/LCS/LIS/Floyd 现有 Case 不变全绿；仅 `TC-HOOK`（DP children）追加 `complete-knapsack`。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；16 Case + 改 2 HOOK 全绿、双轨部署。
