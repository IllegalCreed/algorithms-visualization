# 测试用例：Floyd-Warshall 多源最短路（C-20260703-052，M6 图算法 G4）

> Status: verified
> Stable ID: C-20260703-052
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（floyd.module）/ L4（MatrixView 新轨 + 播放器接轨 + Floyd 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-MATRIXVIEW-*`、`TC-PLAYER-MATRIX-*`、`TC-FLOYD-MOD-*`、`TC-VIEW-FLOYD-*`、`TC-E2E-FLOYD-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `MatrixView` 新矩阵轨（`src/components/MatrixView.spec.ts`）

mock MatrixTrack 渲染断言。

| 用例 ID              | 场景          | 期望                                                            |
| -------------------- | ------------- | --------------------------------------------------------------- |
| TC-VIZ-MATRIXVIEW-01 | 表格与标签    | 渲染 4×4 数据单元（`.matrix-cell`）+ 行列标签含 A/B/C/D         |
| TC-VIZ-MATRIXVIEW-02 | ∞ 渲染        | cells 中 null 单元显示「∞」                                     |
| TC-VIZ-MATRIXVIEW-03 | 中转行列高亮  | pivot=1 → 第 1 行与第 1 列单元带 `.mx-pivot`                    |
| TC-VIZ-MATRIXVIEW-04 | active/源高亮 | active=(0,2) 单元带 `.mx-active`；sources 两单元带 `.mx-source` |

## L4 —— 播放器接矩阵轨（`src/components/player/AlgorithmPlayer.spec.ts`）

| 用例 ID             | 场景             | 期望                                                                  |
| ------------------- | ---------------- | --------------------------------------------------------------------- |
| TC-PLAYER-MATRIX-01 | matrix → 渲染    | step 带 matrix → 渲染 `MatrixView`                                    |
| TC-PLAYER-MATRIX-02 | 无 matrix 不渲染 | 既有排序 step（无 matrix）→ 不渲染 MatrixView；array:[] 不渲 BarsView |

## L3 —— `floyd.module`（`src/algorithms/floyd.module.spec.ts`）

固定 4 点 6 边有向图；oracle `floydTrace`。

| 用例 ID         | 场景              | 期望                                                                                    |
| --------------- | ----------------- | --------------------------------------------------------------------------------------- |
| TC-FLOYD-MOD-01 | 末步 = oracle     | 末步 `done`，`matrix.cells` = `floydTrace()` = 终态全源最短距离矩阵                     |
| TC-FLOYD-MOD-02 | 步合法 + 带矩阵轨 | 每步 `point ∈ {init,pivotStart,relaxUpdate,relaxSkip,done}` 且带 `matrix`、`array===[]` |
| TC-FLOYD-MOD-03 | 4 个中转点        | `#pivotStart == 4`                                                                      |
| TC-FLOYD-MOD-04 | 松弛统计          | `#relaxUpdate == 10`、`#relaxSkip == 3`                                                 |
| TC-FLOYD-MOD-05 | init 邻接矩阵     | init `cells` = 邻接（对角 0、A→B=3…、不可达为 null；如 cells[0][3]=null）               |
| TC-FLOYD-MOD-06 | 末步无 ∞          | done `cells` 无 null（含环 → 全点对可达）                                               |
| TC-FLOYD-MOD-07 | 关键最短距离      | done `cells[1][0]=8`（B→A）、`cells[0][3]=6`（A→D）、`cells[2][1]=9`（C→B）             |
| TC-FLOYD-MOD-08 | pivotStart 高亮   | 第 k 个 pivotStart 步 `matrix.pivot === k`                                              |
| TC-FLOYD-MOD-09 | 单元单调不增      | 每个单元值（∞ 视为 +∞）沿步序**从不增大**（松弛不变量）                                 |
| TC-FLOYD-MOD-10 | relax 步带源      | 每个 relaxUpdate/relaxSkip 步 `active` 非空、`sources` 长度 2                           |
| TC-FLOYD-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                           |
| TC-FLOYD-MOD-12 | module 元信息     | `title` 含「Floyd」；`initialInput()` = `[]`                                            |

## L4 —— `Floyd` 视图（`src/views/Article/Algorithm/Floyd.spec.ts`，新增）

| 用例 ID          | 场景          | 期望                                                                  |
| ---------------- | ------------- | --------------------------------------------------------------------- |
| TC-VIEW-FLOYD-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                    |
| TC-VIEW-FLOYD-02 | 矩阵轨 + 单元 | h1 含「Floyd」；渲染 `MatrixView`；16 `.matrix-cell`；无 `.bars-view` |
| TC-VIEW-FLOYD-03 | 全模板同屏    | Article 含「最短」+ MatrixView 同屏                                   |

## L4 —— TC-HOOK（图算法 5→6）

| 用例 ID      | 改动                                                  |
| ------------ | ----------------------------------------------------- |
| TC-HOOK-01-1 | Home：图算法 children 6 项、url 末位 'floyd-warshall' |
| TC-HOOK-02-1 | Menu：图算法 children 6 项、url 末位 'floyd-warshall' |

## L5 —— Floyd 页 e2e（`e2e/floyd-warshall.e2e.ts`，新增）

| 用例 ID         | 场景          | 操作                                         | 期望                                                                                                                          |
| --------------- | ------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-FLOYD-01 | 全模板 + 互动 | 访问 `/docs/floyd-warshall`；`.scrub` 拖末步 | 正文 `.article h1` 含「Floyd」；`.matrix-view` 可见；16 `.matrix-cell`；无 `.bars-view`；拖末步 caption 非空；真机 Shiki 着色 |

## 回归

- 既有 15 排序 + 7 轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph）+ 15 结构 + 5 图算法 + 播放器各轨现有 Case **零改动**全绿。
- **既有 7 轨组件零改动**；AlgorithmPlayer 仅 additive 加 `<MatrixView v-if>` + import。
- TC-HOOK 其余（分类数 3、数据结构 15、排序 15）不变；仅 -01-1/-02-1 图算法项数改（5→6）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 143 文件 1021 passed** / **e2e 44 passed**。
  - 新增 Case 全绿：MatrixView 4（VIZ-MATRIXVIEW-01..04）、播放器接矩阵轨 2（PLAYER-MATRIX-01/02）、floyd.module 12（FLOYD-MOD-01..12，含单元单调不增 MOD-09、关键距离 MOD-07）、Floyd 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（图算法 5→6、url +floyd-warshall）。
  - **一次通过**：MatrixView 4 + floyd.module 12 均首跑即绿（三重循环候选单元重走、矩阵值逐 k 手算核对无误）；无坑。
- 覆盖率：**Stmt 93.89% / Branch 92.59% / Func 94.26% / Line 94.73%**（聚合，超门槛 70/60）。既有 7 轨组件零改动。
- 真机自检（Playwright 脚本 `/docs/floyd-warshall`）：首步 16 单元（4×4）+ `1/19` + **6 个 ∞** + 无 `.bars-view` + Shiki 92 token；步 7 = 中转 B → **pivot 7 单元（B 行+B 列）高亮 + 2 源单元黄（A→B=3、B→D=4）+ active 单元 A→D 琥珀环变绿 = 7**、字幕「更短！A→D 更新为 7（经 B 中转）」；末步 `19/19` + 矩阵 **[0,3,5,6/8,0,2,3/6,9,0,1/5,8,10,0]（= oracle）** + **无 ∞**（全点对可达）。
- 结论：**通过**。三件套齐全；零回归（新建 MatrixView 第 8 轨 additive 可插拔）；矩阵 DP 可视化清晰；MatrixView 为 DP 大类铺路。
