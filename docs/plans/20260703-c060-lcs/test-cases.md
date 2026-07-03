# 测试用例：最长公共子序列 LCS（C-20260703-060，填表 + 回溯）

> Status: verified
> Stable ID: C-20260703-060
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（lcs.module）/ L4（MatrixView 扩展 + Lcs 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-MATRIXVIEW-07`、`TC-LCS-MOD-*`、`TC-VIEW-LCS-*`、`TC-E2E-LCS-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `MatrixView` 回溯路径扩展（`src/components/MatrixView.spec.ts`，追加）

| 用例 ID              | 场景     | 期望                                                            |
| -------------------- | -------- | --------------------------------------------------------------- |
| TC-VIZ-MATRIXVIEW-07 | 回溯路径 | pathCells=[[1,1],[2,2]] → 对应格带 `.mx-path`（2 个）；不设时 0 |

## L3 —— `lcs.module`（`src/algorithms/lcs.module.spec.ts`）

固定 X=`ABCD`、Y=`ACDF`；oracle `lcsLength`/`lcsString`/`lcsPath`。

| 用例 ID       | 场景                | 期望                                                                                 |
| ------------- | ------------------- | ------------------------------------------------------------------------------------ |
| TC-LCS-MOD-01 | fillDone = 长度     | `fillDone` 步右下角 `cells[m][n]` = `lcsLength()` = 3                                |
| TC-LCS-MOD-02 | 步合法 + 带矩阵轨   | 每步 `point ∈ {init,match,mismatch,fillDone,trace,done}` 且带 `matrix`、`array===[]` |
| TC-LCS-MOD-03 | 表维度              | DP 表 `(m+1)×(n+1)` = 5×5；行/列标签含 ∅ + 字符                                      |
| TC-LCS-MOD-04 | init 边界           | `init` 步第 0 行、第 0 列全 0                                                        |
| TC-LCS-MOD-05 | match 取左上 +1     | 每个 `match` 步 X[i-1]===Y[j-1]，且 `cells[i][j]` = `cells[i-1][j-1]+1`              |
| TC-LCS-MOD-06 | mismatch 取上左最大 | 每个 `mismatch` 步 X[i-1]≠Y[j-1]，且 `cells[i][j]` = `max(上,左)`                    |
| TC-LCS-MOD-07 | done 恢复 LCS       | 末步 `done`；vars/caption 含 `lcsString()` = `ACD`                                   |
| TC-LCS-MOD-08 | 回溯路径有效        | `trace`/`done` 步 `pathCells` = `lcsPath()`；首含 (m,n)、终邻 (0/1 边界)             |
| TC-LCS-MOD-09 | pathCells 单调增    | `trace` 步 `pathCells` 数量随步不减                                                  |
| TC-LCS-MOD-10 | 存在填表 + 回溯     | `#match >= 1` 且 `#mismatch >= 1` 且 `#trace >= 1`                                   |
| TC-LCS-MOD-11 | 四语言 + 行号       | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                        |
| TC-LCS-MOD-12 | module 元信息       | `title` 含「公共子序列」或「LCS」；`initialInput()` = `[]`                           |

## L4 —— `Lcs` 视图（`src/views/Article/Algorithm/Lcs.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                                |
| -------------- | ------------- | --------------------------------------------------- |
| TC-VIEW-LCS-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                  |
| TC-VIEW-LCS-02 | 矩阵轨        | h1 含「子序列」；渲染 `MatrixView`；无 `.bars-view` |
| TC-VIEW-LCS-03 | 全模板同屏    | Article 含「子序列」+ MatrixView 同屏               |

## L4 —— TC-HOOK（动态规划第 3 项）

| 用例 ID      | 改动                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| TC-HOOK-01-1 | Home：`data[3]`「动态规划」children url = `['edit-distance','knapsack','lcs']` |
| TC-HOOK-02-1 | Menu：同上                                                                     |

## L5 —— LCS 页 e2e（`e2e/lcs.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                | 期望                                                                                                                                                           |
| ------------- | ------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-LCS-01 | 全模板 + 互动 | 访问 `/docs/lcs`；`.scrub` 拖到末步 | 正文 `.article h1` 含「子序列」；`.matrix-view` 可见；25 `.matrix-cell`；无 `.bars-view`；拖末步 ≥3 `.mx-path`（回溯路径）+ caption 含「ACD」；真机 Shiki 着色 |

## 回归

- 既有 11 轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board/DecisionTree/Maze）+ 6 图算法 + 编辑距离 + 背包 + 回溯 5 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **MatrixView 仅 additive 扩展 `pathCells`**：编辑距离/背包/Floyd 不设 → 无 `.mx-path`，其 `TC-VIZ-MATRIXVIEW-01..06` 不变全绿；AlgorithmPlayer.vue 零改动。
- TC-HOOK 其余不变；仅 -01-1/-02-1 动态规划 children 追加 `lcs`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 162 文件 1163 passed** / **e2e 52 passed**。
  - 新增 Case 全绿：MatrixView 回溯路径 1（TC-VIZ-MATRIXVIEW-07）、lcs.module 12（LCS-MOD-01..12，含 match 取左上+1 MOD-05、mismatch 取上左最大 MOD-06、pathCells=lcsPath MOD-08）、Lcs 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（动态规划 children +lcs）。
  - **一次通过**：MatrixView 1 + lcs.module 12 首跑即绿（填表 + 回溯与 oracle 一致，LCS=ACD）；无坑。
- 覆盖率：**Stmt 94.71% / Branch 93.9% / Func 94.64% / Line 95.39%**（聚合，超门槛 70/60）。既有轨/页零回归（MatrixView additive 扩展）。
- 真机自检（Playwright 脚本 `/docs/lcs`）：首步 25 单元 + 无 `.bars-view` + `1 / 24` + Shiki 212 token + 字幕「边界：空串…LCS 长度为 0」；填满步（第 17 步）右下角 = `3`（LCS 长度）+ 字幕「填完！右下角 = LCS 长度 = 3…」；末步 `24` + **mx-path=5**（回溯路径 5 格绿环）+ 字幕「回溯完成：最长公共子序列 LCS = ACD（长度 3）」。
- 结论：**通过**。三件套齐全；**MatrixView 第 4 消费者·DP 从填表求值延伸到填表 + 回溯求解**（additive 扩展 pathCells）；填表 + 回溯恢复解清晰；编辑距离/背包零回归。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-03：交付完成，翻 verified。17 Case 全绿（MatrixView 回溯 1 + module 12 + 视图 3 + e2e 1，改 TC-HOOK 2）；真机 24 步、填满 dp=3、回溯恢复 LCS=ACD（路径 5 格绿）。
