# 测试用例：编辑距离（C-20260703-053，DP 大类首发）

> Status: verified
> Stable ID: C-20260703-053
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（editdist.module）/ L4（MatrixView 扩展 + Edit 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-EDIT-MOD-*`、`TC-VIEW-EDIT-*`、`TC-E2E-EDIT-01`、`TC-VIZ-MATRIXVIEW-05/06`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— MatrixView 扩展（`src/components/MatrixView.spec.ts`，追加）

| 用例 ID              | 场景           | 期望                                                                        |
| -------------------- | -------------- | --------------------------------------------------------------------------- |
| TC-VIZ-MATRIXVIEW-05 | 行列异标签     | rowLabels=['∅','S','A','T']、colLabels=['∅','S','U','N'] → 行头列头各自渲染 |
| TC-VIZ-MATRIXVIEW-06 | emptyText 空白 | emptyText='' → null 单元显示空（不再 '∞'）                                  |

## L3 —— `editdist.module`（`src/algorithms/editdist.module.spec.ts`）

固定 SOURCE="SAT"、TARGET="SUN"；oracle `editDistTrace`。

| 用例 ID        | 场景              | 期望                                                                                     |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| TC-EDIT-MOD-01 | 末步 = oracle     | 末步 `done`，`matrix.cells` = `editDistTrace()`，`cells[3][3]===2`                       |
| TC-EDIT-MOD-02 | 步合法 + 带矩阵轨 | 每步 `point ∈ {init,cellMatch,cellDiff,done}` 且带 `matrix`、`array===[]`                |
| TC-EDIT-MOD-03 | 填格统计          | `#cellMatch==1`（仅 S==S）、`#cellDiff==8`（共 9 内部格）                                |
| TC-EDIT-MOD-04 | init 边界         | init `cells[0]`=[0,1,2,3]、第 0 列=[0,1,2,3]；内部格 null                                |
| TC-EDIT-MOD-05 | match 步          | (1,1) `cellMatch`：`cells[1][1]===0`、`sources`=[[0,0]]（单个左上）                      |
| TC-EDIT-MOD-06 | diff 步依赖       | 每个 `cellDiff` 步 `sources` 长度 3（左上/上/左）                                        |
| TC-EDIT-MOD-07 | 行列标签          | 每步 `matrix.rowLabels`=['∅','S','A','T']、`colLabels`=['∅','S','U','N']、`emptyText`='' |
| TC-EDIT-MOD-08 | 编辑距离答案      | done `cells[3][3]` = 2（= SAT→SUN 两次替换）                                             |
| TC-EDIT-MOD-09 | 单元写入一次      | 每个单元一旦非 null 后不再改变（DP 写一次不变量）                                        |
| TC-EDIT-MOD-10 | 填格 active       | 每个 cellMatch/cellDiff 步 `active` 为当前格 (i,j)                                       |
| TC-EDIT-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                            |
| TC-EDIT-MOD-12 | module 元信息     | `title` 含「编辑距离」；`initialInput()` = `[]`                                          |

## L4 —— `Edit` 视图（`src/views/Article/Algorithm/Edit.spec.ts`，新增）

| 用例 ID         | 场景          | 期望                                                                     |
| --------------- | ------------- | ------------------------------------------------------------------------ |
| TC-VIEW-EDIT-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                       |
| TC-VIEW-EDIT-02 | 矩阵轨 + 单元 | h1 含「编辑距离」；渲染 `MatrixView`；16 `.matrix-cell`；无 `.bars-view` |
| TC-VIEW-EDIT-03 | 全模板同屏    | Article 含「编辑距离」+ MatrixView 同屏                                  |

## L4 —— TC-HOOK（顶层分类 3→4，新增「动态规划」）

| 用例 ID      | 改动                                                                      |
| ------------ | ------------------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：`data` 4 分类，第 4 = 「动态规划」含 edit-distance（图算法仍 6 项） |
| TC-HOOK-02-1 | Menu：`data` 4 分类，第 4 = 「动态规划」含 edit-distance                  |

## L5 —— 编辑距离页 e2e（`e2e/edit-distance.e2e.ts`，新增）

| 用例 ID        | 场景          | 操作                                        | 期望                                                                                                                                |
| -------------- | ------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-EDIT-01 | 全模板 + 互动 | 访问 `/docs/edit-distance`；`.scrub` 拖末步 | 正文 `.article h1` 含「编辑距离」；`.matrix-view` 可见；16 `.matrix-cell`；无 `.bars-view`；拖末步 caption 含「2」；真机 Shiki 着色 |

## 回归

- Floyd（floyd.module 不设新字段）+ 既有 8 轨（含 MatrixView 方阵用法）+ 6 图算法 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **TC-VIZ-MATRIXVIEW-01..04 + TC-FLOYD-MOD-\* 零改动**（Floyd 行为不变）。
- TC-HOOK 其余（数据结构 15、排序 15、图算法 6）不变；仅 -01-1/-02-1 分类数 3→4。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 145 文件 1038 passed** / **e2e 45 passed**。
  - 新增 Case 全绿：MatrixView 扩展 2（VIZ-MATRIXVIEW-05/06 异标签 + emptyText）、editdist.module 12（EDIT-MOD-01..12，含写一次不变量 MOD-09）、Edit 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（分类 3→4）。
  - **一次通过**：MatrixView 扩展后 TC-VIZ-MATRIXVIEW-01..04 + Floyd 零回归；editdist.module 12 首跑即绿（DP 表逐格手算与 oracle 一致）；无坑。
- 覆盖率：**Stmt 93.98% / Branch 92.69% / Func 94.27% / Line 94.79%**（聚合，超门槛 70/60）。
- 真机自检（Playwright 脚本 `/docs/edit-distance`）：首步 16 单元 + `1/11` + **行列异标签（列 ∅SUN / 行 ∅SAT）** + **9 空白未填格（emptyText='' 非 ∞）** + 无 `.bars-view` + Shiki 177 token；步 6 = (A,U) → **当前格琥珀环变绿 = 1 + 三依赖邻居黄（左上 0/上 1/左 1）**、字幕「A≠U：1+min(0,1,1)=1」；末步 `11/11` + DP 表 **[0,1,2,3/1,0,1,2/2,1,1,2/3,2,2,2]（= oracle）** + **右下角 = 2**。
- 结论：**通过**。三件套齐全；「动态规划」大类开张；零回归（MatrixView 扩展纯 additive、Floyd 不变）；**MatrixView 经 Floyd（方阵∞）+ 编辑距离（异标签空白）双验通用**，后续 LCS/背包可复用。
