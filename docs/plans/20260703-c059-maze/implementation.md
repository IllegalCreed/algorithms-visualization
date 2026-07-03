# 实现记录：迷宫寻路（C-20260703-059，MazeView 新轨）

> Status: verified
> Stable ID: C-20260703-059
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新轨 MazeView**：types.ts +MazeTrack/Step.maze?/MazeExecPoint；AlgorithmPlayer +`<MazeView v-if>`；先 MazeView.spec（TC-VIZ-MAZEVIEW-01..04）+ AlgorithmPlayer.spec（TC-PLAYER-MAZE-01/02）跑红 → MazeView.vue 跑绿。
2. **T1 module + oracle + sources**（L3）：先 maze.module.spec（TC-MAZE-MOD-01..12）跑红 → maze.{ts,sources.ts,module.ts}（网格 DFS 回溯重走）跑绿。
3. **T2 新页 + 接线**：Maze.vue（Article + AlgorithmPlayer）；路由 /docs/maze；菜单 + 首页「回溯与搜索」第 5 项（新 maze.svg）；改 TC-HOOK-01-1/02-1（回溯 children +maze）；Maze.spec + maze.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap 回溯第 5 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 新建第 11 条 MazeView 迷宫轨**：types.ts +`MazeTrack`（rows/cols/walls/start/goal/current/path/visited/solved）+ `Step.maze?` + `MazeExecPoint`；AlgorithmPlayer +import + `<MazeView v-if="current.maze">`（同既有 10 轨可插拔模式，既有轨零改动）。`MazeView.vue` 借鉴 BoardView 的 CSS grid（`--cols` 列数）渲染逐格状态：墙(暗)/通路(浅)/已访问 `.mz-visited`(浅蓝)/当前路径 `.mz-path`(琥珀)/解 `.mz-solution`(绿)/当前格 `.mz-current`(琥珀环 + 🐭)/终点 🚩/起点 S。TC-VIZ-MAZEVIEW 4 + TC-PLAYER-MAZE 2。
- **T1 module + oracle + sources**：`maze.ts`（固定 5×5 `MAZE_GRID`〈2 处死路〉+ `MAZE_START/GOAL/DIRS` + `mazeSolve` 纯 DFS oracle 返回解路径）+ `maze.sources.ts`（4 语言迷宫 DFS 回溯 + lineMap）+ `maze.module.ts`（同构 DFS 重走：入格 start/move、到 G goal、无未访问通路 deadend、出栈 backtrack、末 done〈solved〉）。**19 步**（start 1 + move 12〈10 路径格 + 2 死路格〉+ deadend 2 + backtrack 2 + goal 1 + done 1）；找到 G 后带 true 上卷不再回溯，path 保持为解路径。
- **T2 新页 + 接线**：Maze.vue（Article 正文：走迷宫 DFS + 撞死路回退、visited 防绕圈、与棋盘/决策树并列的网格搜索视角、BFS 找最短带过 + AlgorithmPlayer）；路由 `/docs/maze`；菜单 + 首页「回溯与搜索」第 5 项（新 `maze.svg`：迷宫 + 蛇形路径图标）；改 TC-HOOK-01-1/02-1（回溯 children +maze）。

### 坑点

- 无坑。MazeView 4 + maze.module 12 首跑即绿。DFS 方向固定 下/右/上/左 + visited 防重入，`deadend` 仅在入格时四邻皆墙/越界/已访问才 emit；解路径 `path` 与 `mazeSolve()` 同构 DFS 天然一致。`current` 恒等于 `path` 末元素（含 backtrack 出栈后）。
- **播放器可插拔轨达 11 条**：Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board/DecisionTree/**Maze**。AlgorithmPlayer 仅 additive 加一行 v-if，既有 10 轨 + 12 算法页（6 图 + 2 DP + 回溯 4）+ 15 排序 + 15 结构零改动全绿。回溯大类三形态（棋盘/决策树/网格）齐；迷宫轨为后续网格搜索题（岛屿/单词搜索/BFS）铺路。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：160 文件 **1147 passed**（+21：MazeView 4 + 播放器接迷宫轨 2 + maze.module 12 + Maze 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.6% / Branch 93.71% / Func 94.63% / Line 95.3%**。既有 10 轨零改动。
- **e2e**：Playwright **51 passed**（+1 TC-E2E-MAZE-01）。
- **真机自检**（Playwright 脚本，`/docs/maze`）：
  - 首步——25 格、6 墙、无 `.bars-view`、🐭 在起点、counter `1 / 19`、Shiki **219 token**、字幕「从起点 (0,0) 出发，找终点 (4,4)」。
  - 死路步（第 2 步）——字幕「(1,0) 四周都走不通：死路，需要回溯」。
  - 末步——counter `19`、**解路径 11 格绿**、6 墙、**2 已访问**（死路 (1,0)/(2,3)）、字幕「找到路径：起点 → 终点，共 11 格（绿色为解路径）」。
- **零回归**：既有 10 轨 + 6 图算法 + 2 DP + 回溯 4 页 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 新建第 11 条 MazeView 迷宫轨（types +MazeTrack/Step.maze?/MazeExecPoint + AlgorithmPlayer +v-if；MazeView.vue + 6 Case）+ T1 maze.module（5×5 网格 DFS 回溯 19 步 2 死路）+ T2 新页 Maze.vue + 「回溯与搜索」第 5 项 + 路由/菜单/首页接线 + TC-HOOK（回溯 children +maze）。**新迷宫轨补齐回溯网格搜索视角（棋盘/决策树/网格三形态齐）·可插拔轨达 11 条。**门禁全绿（单测 1147 / e2e 51 / 覆盖率 94.6%）；真机 19 步、首个死路 (1,0)、解路径 11 格绿。**M6 回溯与搜索第 5 页达成。**
