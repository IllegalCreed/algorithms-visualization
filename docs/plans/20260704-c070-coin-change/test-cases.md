# 测试用例：硬币找零方案数（C-20260704-070，计数 DP · 复用 MatrixView）

> Status: verified
> Stable ID: C-20260704-070
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（coinchange.module）/ L4（CoinChange 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-CC-MOD-*`、`TC-VIEW-CC-*`、`TC-E2E-CC-01`；**改** `TC-HOOK`（DP children）

## L3 —— `coinchange.module`（`src/algorithms/coinchange.module.spec.ts`）

固定硬币 [1,2,5]、金额 5；oracle `coinChangeTrace()`，右下角 4。

| 用例 ID      | 场景                      | 期望                                                                             |
| ------------ | ------------------------- | -------------------------------------------------------------------------------- |
| TC-CC-MOD-01 | 末步 done + 方案数        | 末步 `done`；末步 `matrix.cells[3][5]` = `coinChangeTrace()[3][5]` = `4`         |
| TC-CC-MOD-02 | 步合法 + 带矩阵轨         | 每步 `point ∈ {init,skip,add,done}` 且带 `matrix`、`array===[]`                  |
| TC-CC-MOD-03 | 终态表 = oracle           | 末步 `matrix.cells` 深等 `coinChangeTrace()`                                     |
| TC-CC-MOD-04 | init 边界 dp[0][0]=1      | `init` 步 `cells[0][0]`===1，且第 0 行其余为 0                                   |
| TC-CC-MOD-05 | 「用一枚」来源在本行      | 每个 `add` 步 `sources` 含与 `active` 同行的格 `[i, a-coin]`（计数 DP 无限次取） |
| TC-CC-MOD-06 | 「不用」来源在上一行      | 每个填格步（skip/add）`sources` 含 `[i-1, a]`（上一行）                          |
| TC-CC-MOD-07 | add 恰 2 源，值为两源之和 | 每个 `add` 步 `sources.length===2` 且 `cells[i][a]` = 两源之和                   |
| TC-CC-MOD-08 | 计数单调不减              | 同一金额列，随硬币增多方案数不减（`cells[i][a] >= cells[i-1][a]`）               |
| TC-CC-MOD-09 | vars 展示硬币/金额        | 某步 vars 文本含 `1,2,5`（硬币）与目标金额 `5`                                   |
| TC-CC-MOD-10 | 四语言 + 行号             | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                    |
| TC-CC-MOD-11 | module 元信息             | `title` 含「硬币」或「找零」；`initialInput()` = `[]`                            |
| TC-CC-MOD-12 | done 方案数 4             | done 步 caption 含 `4`                                                           |

## L4 —— `CoinChange` 视图（`src/views/Article/Algorithm/CoinChange.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                                         |
| ------------- | ------------- | ------------------------------------------------------------ |
| TC-VIEW-CC-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                           |
| TC-VIEW-CC-02 | 矩阵轨        | h1 含「硬币」；渲染 `MatrixView`（24 单元）；无 `.bars-view` |
| TC-VIEW-CC-03 | 全模板同屏    | 正文含「计数」+ MatrixView 同屏                              |

## L4 —— TC-HOOK（动态规划第 6 项）

| 用例 ID | 改动                                                                                                                          |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[3]`（动态规划）children url = `['edit-distance','knapsack','complete-knapsack','lcs','lis','coin-change']` |

## L5 —— 硬币找零页 e2e（`e2e/coin-change.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                        | 期望                                                                                                                                |
| ------------ | ------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-CC-01 | 全模板 + 互动 | 访问 `/docs/coin-change`；`.scrub` 拖到末步 | 正文 `.article h1` 含「硬币」；`.matrix-view` 可见；24 `.matrix-cell`；无 `.bars-view`；末格 = `4`；caption 含 `4`；真机 Shiki 着色 |

## 回归

- 既有 13 轨 + 7 图算法 + 5 DP + 回溯 7 页 + 字符串 4 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **MatrixView、AlgorithmPlayer 均零改动**：完全背包/编辑距离/LCS/LIS/Floyd 的 `TC-KNAP-*`/`TC-CK-*`/`TC-VIZ-MATRIXVIEW-*` 不变全绿。
- TC-HOOK 其余不变；仅 DP children 追加 `coin-change`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1331 用例全绿**；`pnpm exec playwright test coin-change complete-knapsack` → **2/2 绿**。
- **本单新增 16 Case 全绿**：`TC-CC-MOD-01..12`（L3）12 + `TC-VIEW-CC-01..03`（L4）3 + `TC-E2E-CC-01`（L5）1；**改** `TC-HOOK`（DP children +coin-change）menu+home 各 1。
- **关键断言实测**：末步右下角=coinChangeTrace()[3][5]=4（TC-CC-MOD-01）；终态深等 oracle（TC-03）；init dp[0][0]=1（TC-04）；add 源含本行 [i,a-coin]（TC-05）+ 恰 2 源且为两源之和（TC-07）。
- **真机自检**：计数表 dp[0][0]=1 种子、右下角 4，与设计一致。
- **覆盖**：statements 95.49% / branches 94.92%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；16 Case + 改 2 HOOK 全绿。
