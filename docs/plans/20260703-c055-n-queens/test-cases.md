# 测试用例：N 皇后（C-20260703-055，回溯大类首发）

> Status: verified
> Stable ID: C-20260703-055
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（queens.module）/ L4（BoardView 新轨 + 播放器接轨 + Queens 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-BOARDVIEW-*`、`TC-PLAYER-BOARD-*`、`TC-QUEENS-MOD-*`、`TC-VIEW-QUEENS-*`、`TC-E2E-QUEENS-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `BoardView` 新棋盘轨（`src/components/BoardView.spec.ts`）

mock BoardTrack 渲染断言。

| 用例 ID             | 场景       | 期望                                                                |
| ------------------- | ---------- | ------------------------------------------------------------------- |
| TC-VIZ-BOARDVIEW-01 | 棋格与皇后 | n=4 → 16 `.board-cell`；queens=[1,3,0,2] → 4 个 `.board-queen`（♛） |
| TC-VIZ-BOARDVIEW-02 | 交错着色   | 深格 `.dark` 数 = 8（4×4 一半）                                     |
| TC-VIZ-BOARDVIEW-03 | 尝试格高亮 | tryCell=[2,1] → 对应格带 `.bc-try`                                  |
| TC-VIZ-BOARDVIEW-04 | 冲突高亮   | conflictCells=[[0,0]] → 对应格带 `.bc-conflict`                     |

## L4 —— 播放器接棋盘轨（`src/components/player/AlgorithmPlayer.spec.ts`）

| 用例 ID            | 场景            | 期望                                        |
| ------------------ | --------------- | ------------------------------------------- |
| TC-PLAYER-BOARD-01 | board → 渲染    | step 带 board → 渲染 `BoardView`            |
| TC-PLAYER-BOARD-02 | 无 board 不渲染 | 既有排序 step（无 board）→ 不渲染 BoardView |

## L3 —— `queens.module`（`src/algorithms/queens.module.spec.ts`）

固定 N=4；oracle `queensTrace`。

| 用例 ID          | 场景              | 期望                                                                                |
| ---------------- | ----------------- | ----------------------------------------------------------------------------------- | ------- | --- | --- | --- |
| TC-QUEENS-MOD-01 | 末步 = oracle     | 末步 `solved`，`board.queens` = `queensTrace()` = `[1,3,0,2]`                       |
| TC-QUEENS-MOD-02 | 步合法 + 带棋盘轨 | 每步 `point ∈ {init,tryConflict,place,backtrack,solved}` 且带 `board`、`array===[]` |
| TC-QUEENS-MOD-03 | 解合法            | 末步 4 皇后两两不同行、不同对角线（`                                                | r_i-r_j | !=  | i-j | `） |
| TC-QUEENS-MOD-04 | init 空盘         | init `board.queens` 全 null                                                         |
| TC-QUEENS-MOD-05 | 首个 place        | 首个 `place` 步 tryCell=[0,0]、放后 queens[0]=0                                     |
| TC-QUEENS-MOD-06 | tryConflict 冲突  | 每个 `tryConflict` 步 `conflictCells` 非空                                          |
| TC-QUEENS-MOD-07 | backtrack 减子    | 有 `#backtrack >= 1`；backtrack 步后已放皇后数比前一步少（退列挪子）                |
| TC-QUEENS-MOD-08 | 恰一解            | `#solved == 1`；末步满盘 4 皇后                                                     |
| TC-QUEENS-MOD-09 | 皇后数单调合法    | 每步已放皇后数 ∈ [0,4]（不越界）                                                    |
| TC-QUEENS-MOD-10 | tryCell 有效      | 每个 tryConflict/place 步 `tryCell` 在 [0,3]×[0,3] 内                               |
| TC-QUEENS-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                       |
| TC-QUEENS-MOD-12 | module 元信息     | `title` 含「皇后」；`initialInput()` = `[]`                                         |

## L4 —— `Queens` 视图（`src/views/Article/Algorithm/Queens.spec.ts`，新增）

| 用例 ID           | 场景          | 期望                                                               |
| ----------------- | ------------- | ------------------------------------------------------------------ |
| TC-VIEW-QUEENS-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                 |
| TC-VIEW-QUEENS-02 | 棋盘轨 + 格   | h1 含「皇后」；渲染 `BoardView`；16 `.board-cell`；无 `.bars-view` |
| TC-VIEW-QUEENS-03 | 全模板同屏    | Article 含「皇后」+ BoardView 同屏                                 |

## L4 —— TC-HOOK（顶层分类 4→5，新增「回溯与搜索」）

| 用例 ID      | 改动                                                  |
| ------------ | ----------------------------------------------------- |
| TC-HOOK-01-1 | Home：`data` 5 分类，第 5 = 「回溯与搜索」含 n-queens |
| TC-HOOK-02-1 | Menu：`data` 5 分类，第 5 = 「回溯与搜索」含 n-queens |

## L5 —— N 皇后页 e2e（`e2e/n-queens.e2e.ts`，新增）

| 用例 ID          | 场景          | 操作                                   | 期望                                                                                                                                     |
| ---------------- | ------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-QUEENS-01 | 全模板 + 互动 | 访问 `/docs/n-queens`；`.scrub` 拖末步 | 正文 `.article h1` 含「皇后」；`.board-view` 可见；16 `.board-cell`；无 `.bars-view`；拖末步 4 `.board-queen` + caption；真机 Shiki 着色 |

## 回归

- 既有 8 轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix）+ 6 图算法 + 2 DP + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **既有 8 轨组件零改动**；AlgorithmPlayer 仅 additive 加 `<BoardView v-if>` + import。
- TC-HOOK 其余（数据结构 15、排序 15、图算法 6、动态规划 2）不变；仅 -01-1/-02-1 顶层分类 4→5。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 150 文件 1074 passed** / **e2e 47 passed**。
  - 新增 Case 全绿：BoardView 4（VIZ-BOARDVIEW-01..04）、播放器接棋盘轨 2（PLAYER-BOARD-01/02）、queens.module 12（QUEENS-MOD-01..12，含解合法 MOD-03、皇后数不越界 MOD-09）、Queens 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（顶层分类 4→5）。
  - **一次通过**：BoardView 4 + queens.module 12 均首跑即绿（回溯逐步与 oracle 一致，首解 [1,3,0,2]）；无坑。
- 覆盖率：**Stmt 94.15% / Branch 93.02% / Func 94.29% / Line 94.92%**（聚合，超门槛 70/60）。既有 8 轨零改动。
- 真机自检（Playwright 脚本 `/docs/n-queens`）：首步 16 格 + **8 深格（交错棋盘）** + `1/32` + 无 `.bars-view` + 0 皇后 + Shiki 178 token；步 4 = B 列试第 2 行冲突 → **tryCell 琥珀 1 + conflictCell 红 1**、字幕「第 B 列试第 2 行：与已放皇后冲突（红），换下一行」；末步 `32/32` + **4 个 ♛（解 [1,3,0,2]：col0→行1、col1→行3、col2→行0、col3→行2，两两不攻击）** + 字幕「找到一个解」。
- 结论：**通过**。三件套齐全；「回溯与搜索」大类开张；零回归（新建 BoardView 第 9 轨 additive 可插拔）；回溯试探-剪枝-回溯过程清晰；BoardView 为后续回溯题铺路。
