# 测试用例：完全背包（C-20260704-065，背包问题族补全）

> Status: verified
> Stable ID: C-20260704-065
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（completeknapsack.module）/ L4（CompleteKnapsack 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-CK-MOD-*`、`TC-VIEW-CK-*`、`TC-E2E-CK-01`；**改** `TC-HOOK`（DP children）

## L3 —— `completeknapsack.module`（`src/algorithms/completeknapsack.module.spec.ts`）

固定物品 A(重2,值5)/B(重3,值6)/C(重4,值7)、容量 6；oracle `completeKnapsackTrace()`，右下角 15。

| 用例 ID      | 场景                 | 期望                                                                                          |
| ------------ | -------------------- | --------------------------------------------------------------------------------------------- |
| TC-CK-MOD-01 | 末步 done + 最优值   | 末步 `done`；末步 `matrix.cells[3][6]` = `completeKnapsackTrace()[3][6]` = `15`               |
| TC-CK-MOD-02 | 步合法 + 带矩阵轨    | 每步 `point ∈ {init,cellSkip,cellChoose,done}` 且带 `matrix`、`array===[]`                    |
| TC-CK-MOD-03 | 终态表 = oracle      | 末步 `matrix.cells` 深等 `completeKnapsackTrace()`                                            |
| TC-CK-MOD-04 | init 边界            | `init` 步第 0 行、第 0 列全部为 `0`                                                           |
| TC-CK-MOD-05 | 「取」来源在本行     | 每个 `cellChoose` 步 `sources` 含一个与 `active` **同行**的格 `[i, w-wt]`（完全背包关键差异） |
| TC-CK-MOD-06 | 「不取」来源在上一行 | 每个 `cellChoose`/`cellSkip` 步 `sources` 含 `[i-1, w]`（上一行）                             |
| TC-CK-MOD-07 | cellChoose 恰 2 源   | 每个 `cellChoose` 步 `sources.length === 2`（不取上一行 + 取本行）                            |
| TC-CK-MOD-08 | active=updatedCell   | 每个填格步 `active` === `updatedCell` === `[i,w]`                                             |
| TC-CK-MOD-09 | 可重复取（A×3）      | 第 1 行（只有物品 A）末格 `cells[1][6] === 15`（同一物品取 3 次，完全背包独有）               |
| TC-CK-MOD-10 | vars 展示物品        | 某步 vars 文本含 `A(重2,值5)`、`B(重3,值6)`、`C(重4,值7)`                                     |
| TC-CK-MOD-11 | 四语言 + 行号        | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                 |
| TC-CK-MOD-12 | module 元信息        | `title` 含「完全背包」或「背包」；`initialInput()` = `[]`                                     |

## L4 —— `CompleteKnapsack` 视图（`src/views/Article/Algorithm/CompleteKnapsack.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                                  |
| ------------- | ------------- | ----------------------------------------------------- |
| TC-VIEW-CK-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                    |
| TC-VIEW-CK-02 | 矩阵轨        | h1 含「完全背包」；渲染 `MatrixView`；无 `.bars-view` |
| TC-VIEW-CK-03 | 全模板同屏    | 正文含「本行」（对照 0-1 递推来源）+ MatrixView 同屏  |

## L4 —— TC-HOOK（动态规划第 3 项）

| 用例 ID | 改动                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[3]`（动态规划）children url = `['edit-distance','knapsack','complete-knapsack','lcs','lis']` |

## L5 —— 完全背包页 e2e（`e2e/complete-knapsack.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                              | 期望                                                                                                                                      |
| ------------ | ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-CK-01 | 全模板 + 互动 | 访问 `/docs/complete-knapsack`；`.scrub` 拖到末步 | 正文 `.article h1` 含「完全背包」；`.matrix-view` 可见；28 `.matrix-cell`；无 `.bars-view`；末格 = `15`；caption 含 `15`；真机 Shiki 着色 |

## 回归

- 既有 12 轨 + 6 图算法 + 4 DP + 回溯 5 页 + 字符串 3 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **MatrixView、AlgorithmPlayer、KnapsackExecPoint 均零改动**：0-1 背包/编辑距离/LCS/LIS/Floyd 的 `TC-KNAP-*`/`TC-VIZ-MATRIXVIEW-*`/`TC-PLAYER-MATRIX-*` 不变全绿。
- TC-HOOK 其余不变；仅 DP children 追加 `complete-knapsack`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage`（Vitest 4，jsdom）→ **1246 用例全绿**；`pnpm exec playwright test complete-knapsack knapsack` → **2/2 绿**。
- **本单新增 16 Case 全绿**：`TC-CK-MOD-01..12`（L3，module）12 + `TC-VIEW-CK-01..03`（L4，页）3 + `TC-E2E-CK-01`（L5，e2e）1；**改** `TC-HOOK`（DP children `['edit-distance','knapsack','complete-knapsack','lcs','lis']`）menu+home 各 1。
- **关键断言实测**：末步右下角 = `completeKnapsackTrace()[3][6]` = 15（TC-CK-MOD-01）；终态表深等 oracle（TC-03）；每个 `cellChoose` 的 sources 含**同行**格 `[i,w-wt]`（TC-05，完全背包关键差异）+ 恰 2 源（TC-07）；第 1 行末格 `cells[1][6]===15`（TC-09，A×3）。
- **真机自检**：第 7/20 步 dp[1][6] 的「取」源 dp[1][4] 与当前格同行高亮、字幕「取本行 15」，A×3 链 0→5→10→15，右下角 15，与设计一致。
- **覆盖**：聚合 statements 94.91% / branches 94.22% / functions 94.65% / lines 95.51%，全部超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；16 Case + 改 2 HOOK 全绿。
