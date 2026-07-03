# 测试用例：0-1 背包（C-20260703-054，DP 大类 DP2）

> Status: verified
> Stable ID: C-20260703-054
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（knapsack.module）/ L4（Knapsack 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-KNAP-MOD-*`、`TC-VIEW-KNAP-*`、`TC-E2E-KNAP-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`；复用 C-052/053 的 `TC-VIZ-MATRIXVIEW-*`（零改动）

## L3 —— `knapsack.module`（`src/algorithms/knapsack.module.spec.ts`）

固定 4 物品 A(2,3)B(3,4)C(4,5)D(5,6) + 容量 5；oracle `knapsackTrace`。

| 用例 ID        | 场景              | 期望                                                                                    |
| -------------- | ----------------- | --------------------------------------------------------------------------------------- |
| TC-KNAP-MOD-01 | 末步 = oracle     | 末步 `done`，`matrix.cells` = `knapsackTrace()`，`cells[4][5]===7`                      |
| TC-KNAP-MOD-02 | 步合法 + 带矩阵轨 | 每步 `point ∈ {init,cellSkip,cellChoose,done}` 且带 `matrix`、`array===[]`              |
| TC-KNAP-MOD-03 | 取舍统计          | `#cellSkip==10`、`#cellChoose==10`（共 20 内部格）                                      |
| TC-KNAP-MOD-04 | init 边界         | init 第 0 行全 0、第 0 列全 0；内部格 null                                              |
| TC-KNAP-MOD-05 | cellSkip 沿用     | 首个 cellSkip（A 容量 1，重 2>1）：`cells[1][1]===0`、sources=[[0,1]]（上格）           |
| TC-KNAP-MOD-06 | cellChoose 取舍   | 每个 cellChoose 步 sources 长度 2（上格 + 左上偏移格）                                  |
| TC-KNAP-MOD-07 | 行列标签          | 每步 rowLabels=['∅','A','B','C','D']、colLabels=['0','1','2','3','4','5']、emptyText='' |
| TC-KNAP-MOD-08 | 最优值            | done `cells[4][5]` = 7（选 A+B）                                                        |
| TC-KNAP-MOD-09 | 单元写入一次      | 每个单元一旦非 null 后不再改变（DP 写一次不变量）                                       |
| TC-KNAP-MOD-10 | 填格 active       | 每个 cellSkip/cellChoose 步 `active` 为当前格 (i,w)                                     |
| TC-KNAP-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                           |
| TC-KNAP-MOD-12 | module 元信息     | `title` 含「背包」；`initialInput()` = `[]`                                             |

## L4 —— `Knapsack` 视图（`src/views/Article/Algorithm/Knapsack.spec.ts`，新增）

| 用例 ID         | 场景          | 期望                                                                 |
| --------------- | ------------- | -------------------------------------------------------------------- |
| TC-VIEW-KNAP-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                   |
| TC-VIEW-KNAP-02 | 矩阵轨 + 单元 | h1 含「背包」；渲染 `MatrixView`；30 `.matrix-cell`；无 `.bars-view` |
| TC-VIEW-KNAP-03 | 全模板同屏    | Article 含「背包」+ MatrixView 同屏                                  |

## L4 —— TC-HOOK（动态规划 1→2）

| 用例 ID      | 改动                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：动态规划 children 2 项、url=['edit-distance','knapsack']（顶层仍 4 分类） |
| TC-HOOK-02-1 | Menu：动态规划 children 2 项、url=['edit-distance','knapsack']                  |

## L5 —— 0-1 背包页 e2e（`e2e/knapsack.e2e.ts`，新增）

| 用例 ID        | 场景          | 操作                                   | 期望                                                                                                                            |
| -------------- | ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-KNAP-01 | 全模板 + 互动 | 访问 `/docs/knapsack`；`.scrub` 拖末步 | 正文 `.article h1` 含「背包」；`.matrix-view` 可见；30 `.matrix-cell`；无 `.bars-view`；拖末步 caption 含「7」；真机 Shiki 着色 |

## 回归

- MatrixView（方阵 Floyd + 字符串 编辑距离用法）+ 编辑距离 + Floyd + 既有 8 轨 + 6 图算法 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **TC-VIZ-MATRIXVIEW-01..06 + TC-EDIT-MOD-\* + TC-FLOYD-MOD-\* 零改动**（MatrixView 不动）。
- TC-HOOK 其余（顶层分类 4、数据结构 15、排序 15、图算法 6）不变；仅 -01-1/-02-1 动态规划项数 1→2。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 147 文件 1053 passed** / **e2e 46 passed**。
  - 新增 Case 全绿：knapsack.module 12（KNAP-MOD-01..12，含写一次不变量 MOD-09、取舍统计 MOD-03）、Knapsack 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（动态规划 1→2）。
  - **一次通过**：knapsack.module 12 首跑即绿（DP 表逐格手算与 oracle 一致）；MatrixView 零改动 → TC-VIZ-MATRIXVIEW-\* + 编辑距离 + Floyd 零回归；无坑。
- 覆盖率：**Stmt 94.05% / Branch 92.81% / Func 94.27% / Line 94.84%**（聚合，超门槛 70/60）。
- 真机自检（Playwright 脚本 `/docs/knapsack`）：首步 30 单元（5×6）+ `1/22` + **行列异标签（列 0-5 容量 / 行 ∅ABCD 物品）** + **20 空白未填格（emptyText='' 复用）** + 无 `.bars-view` + Shiki 141 token；步 17 = D 容量 1（cellSkip）→ **当前格琥珀环 + 单个上格源（沿用上行）**、字幕「D 重 5 装不下容量 1：沿用上一行 = 0」；末步 `22/22` + DP 表 **[∅:0×6/A:0,0,3,3,3,3/B:0,0,3,4,4,7/C:0,0,3,4,5,7/D:0,0,3,4,5,7]（= oracle）** + **右下角 = 7**。
- 结论：**通过**。三件套齐全；DP 大类第 2 页；零回归（MatrixView 零改动）；**MatrixView 经 Floyd（方阵）+ 编辑距离（字符轴）+ 0-1 背包（数值轴）三验通用**。
