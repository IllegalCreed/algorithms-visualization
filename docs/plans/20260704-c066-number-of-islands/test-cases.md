# 测试用例：岛屿数量（C-20260704-066，Flood Fill · 扩展 MazeView）

> Status: verified
> Stable ID: C-20260704-066
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（islands.module）/ L4（MazeView 扩展 + Islands 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-MAZEVIEW-05`、`TC-ISL-MOD-*`、`TC-VIEW-ISL-*`、`TC-E2E-ISL-01`；**改** `TC-HOOK`（回溯 children）

## L4 —— MazeView 网格搜索扩展（`src/components/MazeView.spec.ts`，追加）

| 用例 ID            | 场景                 | 期望                                                                                                                         |
| ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| TC-VIZ-MAZEVIEW-05 | filled/mark/无起终点 | `filled=[[0,0],[0,1]]` → 2 格 `.mz-solution`；`mark='🔎'` → 当前格文本含 `🔎`；省略 start/goal → 0 `.mz-start`、0 `.mz-goal` |

## L3 —— `islands.module`（`src/algorithms/islands.module.spec.ts`）

固定 4×4 网格（3 个岛，6 陆地格）；oracle `islandCount()` = 3。

| 用例 ID       | 场景                 | 期望                                                                        |
| ------------- | -------------------- | --------------------------------------------------------------------------- |
| TC-ISL-MOD-01 | 末步 done + 岛屿数   | 末步 `done`；vars/caption 含 `3`；末步 `maze.filled.length` = 6（全部陆地） |
| TC-ISL-MOD-02 | 步合法 + 带网格轨    | 每步 `point ∈ {scan,found,flood,done}` 且带 `maze`、`array===[]`            |
| TC-ISL-MOD-03 | found 恰 3 次        | `found` 步数 === `islandCount()` === 3                                      |
| TC-ISL-MOD-04 | found 命中新陆地     | 每个 `found` 步当前格是陆地（grid=1）且该步之前不在 `filled`                |
| TC-ISL-MOD-05 | 水为墙               | 每步 `maze.walls[r][c]` === (grid[r][c]===0)                                |
| TC-ISL-MOD-06 | filled 单调不减      | 相邻两步 `filled.length` 后 ≥ 前                                            |
| TC-ISL-MOD-07 | 末步 filled = 全陆地 | 末步 `filled` 的每个格都是陆地（grid=1），共 6 格、无重复                   |
| TC-ISL-MOD-08 | flood 四连通         | 每个 `flood` 步当前格是陆地且四连通于同岛已 filled 格                       |
| TC-ISL-MOD-09 | 岛屿无起终点         | 每步 `maze.start` 与 `maze.goal` 均为 `null`/未设                           |
| TC-ISL-MOD-10 | 当前格图标非鼠       | 每个非 done 步 `maze.mark` 存在且 !== `🐭`                                  |
| TC-ISL-MOD-11 | 四语言 + 行号        | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内               |
| TC-ISL-MOD-12 | module 元信息        | `title` 含「岛屿」；`initialInput()` = `[]`                                 |

## L4 —— `Islands` 视图（`src/views/Article/Algorithm/Islands.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                            |
| -------------- | ------------- | ----------------------------------------------- |
| TC-VIEW-ISL-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`              |
| TC-VIEW-ISL-02 | 网格轨        | h1 含「岛屿」；渲染 `MazeView`；无 `.bars-view` |
| TC-VIEW-ISL-03 | 全模板同屏    | 正文含「连通」+ MazeView 同屏                   |

## L4 —— TC-HOOK（回溯与搜索第 6 项）

| 用例 ID | 改动                                                                                                                                    |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[4]`（回溯与搜索）children url = `['n-queens','subsets','permutations','combination-sum','maze','number-of-islands']` |

## L5 —— 岛屿数量页 e2e（`e2e/number-of-islands.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                              | 期望                                                                                                                                                   |
| ------------- | ------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-E2E-ISL-01 | 全模板 + 互动 | 访问 `/docs/number-of-islands`；`.scrub` 拖到末步 | 正文 `.article h1` 含「岛屿」；`.maze-view` 可见；16 `.maze-cell`；无 `.bars-view`；拖末步 6 `.mz-solution`（绿陆地）+ caption 含 `3`；真机 Shiki 着色 |

## 回归

- 既有 12 轨 + 6 图算法 + 5 DP + 回溯 5 页 + 字符串 3 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **MazeView 仅 additive 扩展**（filled/mark + start/goal 可选）：迷宫始终传 start/goal、不传 filled/mark → `TC-VIZ-MAZEVIEW-01..04`/迷宫 module/页/e2e 不变全绿；AlgorithmPlayer 零改动。
- TC-HOOK 其余不变；仅回溯 children 追加 `number-of-islands`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage`（Vitest 4，jsdom）→ **1262 用例全绿**；`pnpm exec playwright test number-of-islands maze` → **2/2 绿**。
- **本单新增 17 Case 全绿**：`TC-VIZ-MAZEVIEW-05`（L4，MazeView 扩展）1 + `TC-ISL-MOD-01..12`（L3，module）12 + `TC-VIEW-ISL-01..03`（L4，页）3 + `TC-E2E-ISL-01`（L5，e2e）1；**改** `TC-HOOK`（回溯 children `['n-queens','subsets','permutations','combination-sum','maze','number-of-islands']`）menu+home 各 1。
- **关键断言实测**：末步 filled=6（全陆地）+ caption 含 3（TC-ISL-MOD-01）；found 恰 3 次 = islandCount()（TC-03）；每步 walls===grid水（TC-05）；filled 单调不减（TC-06）；flood 步四连通于已 filled（TC-08）；无 start/goal（TC-09）；mark 非 🐭（TC-10）。
- **真机自检**：末步 3 片互不相连绿岛 + 计数 3、无迷宫装饰；中间步 🔎 扫描标记 + 部分铺绿，与设计一致。
- **覆盖**：聚合 statements 94.97% / branches 94.37% / functions 94.66% / lines 95.56%，全部超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；17 Case + 改 2 HOOK 全绿。
