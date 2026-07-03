# 测试用例：迷宫寻路（C-20260703-059，MazeView 新轨）

> Status: verified
> Stable ID: C-20260703-059
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（maze.module）/ L4（MazeView 新轨 + 播放器接轨 + Maze 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-MAZEVIEW-*`、`TC-PLAYER-MAZE-*`、`TC-MAZE-MOD-*`、`TC-VIEW-MAZE-*`、`TC-E2E-MAZE-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `MazeView` 新迷宫轨（`src/components/MazeView.spec.ts`）

mock MazeTrack 渲染断言。

| 用例 ID            | 场景          | 期望                                                          |
| ------------------ | ------------- | ------------------------------------------------------------- |
| TC-VIZ-MAZEVIEW-01 | 网格与墙      | 5×5 → 25 `.maze-cell`；walls → 对应数量 `.mz-wall`            |
| TC-VIZ-MAZEVIEW-02 | 起点/终点     | start/goal 格分别带 `.mz-start`/`.mz-goal`（各 1）            |
| TC-VIZ-MAZEVIEW-03 | 当前格 + 路径 | current → 恰 1 `.mz-current`；path=N → N `.mz-path`           |
| TC-VIZ-MAZEVIEW-04 | 已访问 + 解   | visited → `.mz-visited`；solved=true → path 带 `.mz-solution` |

## L4 —— 播放器接迷宫轨（`src/components/player/AlgorithmPlayer.spec.ts`）

| 用例 ID           | 场景           | 期望                                                |
| ----------------- | -------------- | --------------------------------------------------- |
| TC-PLAYER-MAZE-01 | maze → 渲染    | step 带 maze → 渲染 `MazeView`                      |
| TC-PLAYER-MAZE-02 | 无 maze 不渲染 | 既有排序 step（无 maze）→ 不渲染 MazeView（零回归） |

## L3 —— `maze.module`（`src/algorithms/maze.module.spec.ts`）

固定 5×5 迷宫；oracle `mazeSolve`。

| 用例 ID        | 场景              | 期望                                                                              |
| -------------- | ----------------- | --------------------------------------------------------------------------------- |
| TC-MAZE-MOD-01 | 末步 done + 解绿  | 末步 `done`、`maze.solved===true`；`path` = `mazeSolve()`                         |
| TC-MAZE-MOD-02 | 步合法 + 带迷宫轨 | 每步 `point ∈ {start,move,deadend,backtrack,goal,done}` 且带 `maze`、`array===[]` |
| TC-MAZE-MOD-03 | 解路径有效        | 解 `path` 首=起点、尾=终点、相邻格四连通、无一穿墙                                |
| TC-MAZE-MOD-04 | start 起点        | 首步 `start`，`maze.current` = 起点、`path=[起点]`                                |
| TC-MAZE-MOD-05 | goal 到终点       | 恰一 `goal` 步；该步 `maze.current` = 终点                                        |
| TC-MAZE-MOD-06 | 存在死路 + 回溯   | `#deadend >= 1` 且 `#backtrack >= 1`                                              |
| TC-MAZE-MOD-07 | deadend 无出路    | 每个 `deadend` 步的 current 四邻居皆（墙/越界/已访问）                            |
| TC-MAZE-MOD-08 | path 连续         | 每步 `path` 相邻格四连通（DFS 栈路径合法）                                        |
| TC-MAZE-MOD-09 | visited 单调不减  | `maze.visited` 数量随步不减；含起点                                               |
| TC-MAZE-MOD-10 | current 在路径尾  | 每步（除 done）`maze.current` = `path` 末元素                                     |
| TC-MAZE-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                     |
| TC-MAZE-MOD-12 | module 元信息     | `title` 含「迷宫」；`initialInput()` = `[]`                                       |

## L4 —— `Maze` 视图（`src/views/Article/Algorithm/Maze.spec.ts`，新增）

| 用例 ID         | 场景          | 期望                                                             |
| --------------- | ------------- | ---------------------------------------------------------------- |
| TC-VIEW-MAZE-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                               |
| TC-VIEW-MAZE-02 | 迷宫轨 + 格   | h1 含「迷宫」；渲染 `MazeView`；25 `.maze-cell`；无 `.bars-view` |
| TC-VIEW-MAZE-03 | 全模板同屏    | Article 含「迷宫」+ MazeView 同屏                                |

## L4 —— TC-HOOK（回溯与搜索第 5 项）

| 用例 ID      | 改动                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：`data` 5 分类，第 5「回溯与搜索」children url = `['n-queens','subsets','permutations','combination-sum','maze']` |
| TC-HOOK-02-1 | Menu：同上                                                                                                             |

## L5 —— 迷宫页 e2e（`e2e/maze.e2e.ts`，新增）

| 用例 ID        | 场景          | 操作                                 | 期望                                                                                                                                    |
| -------------- | ------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-MAZE-01 | 全模板 + 互动 | 访问 `/docs/maze`；`.scrub` 拖到末步 | 正文 `.article h1` 含「迷宫」；`.maze-view` 可见；25 `.maze-cell`；无 `.bars-view`；拖末步 ≥2 `.mz-solution`（解路径）；真机 Shiki 着色 |

## 回归

- 既有 10 轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board/DecisionTree）+ 6 图算法 + 2 DP + N 皇后 + 子集 + 排列 + 组合总和 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **既有 10 轨组件零改动**；AlgorithmPlayer 仅 additive 加 `<MazeView v-if>` + import。
- TC-HOOK 其余不变；仅 -01-1/-02-1 回溯 children 追加 `maze`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 160 文件 1147 passed** / **e2e 51 passed**。
  - 新增 Case 全绿：MazeView 4（VIZ-MAZEVIEW-01..04）、播放器接迷宫轨 2（PLAYER-MAZE-01/02）、maze.module 12（MAZE-MOD-01..12，含解路径有效 MOD-03、deadend 四邻皆阻 MOD-07、current=path 末 MOD-10）、Maze 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（回溯 children +maze）。
  - **一次通过**：MazeView 4 + maze.module 12 首跑即绿（DFS 与 oracle mazeSolve 一致，解路径 11 格）；无坑。
- 覆盖率：**Stmt 94.6% / Branch 93.71% / Func 94.63% / Line 95.3%**（聚合，超门槛 70/60）。既有 10 轨零改动。
- 真机自检（Playwright 脚本 `/docs/maze`）：首步 25 格 + 6 墙 + 无 `.bars-view` + 🐭 起点 + `1 / 19` + Shiki 219 token + 字幕「从起点 (0,0) 出发，找终点 (4,4)」；死路步（第 2 步）字幕「(1,0) 四周都走不通：死路，需要回溯」；末步 `19` + **解路径 11 格绿** + 6 墙 + 2 已访问（死路 (1,0)/(2,3)）+ 字幕「找到路径：起点 → 终点，共 11 格」。
- 结论：**通过**。三件套齐全；**补齐回溯网格搜索视角**（新建 MazeView 第 11 轨 additive 可插拔）；DFS 深入-撞死路-回退清晰；回溯三形态（棋盘/决策树/网格）齐；迷宫轨为后续网格搜索题铺路。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-03：交付完成，翻 verified。21 Case 全绿（MazeView 4 + 接轨 2 + module 12 + 视图 3 + e2e 1，改 TC-HOOK 2）；真机 19 步、2 死路回溯、解路径 11 格绿。
