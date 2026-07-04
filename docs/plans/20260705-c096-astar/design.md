# 设计：A\* 寻路（C-20260705-096，纯复用 MazeView）

> Status: verified
> Stable ID: C-20260705-096
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

4×6、墙 `(1,2),(2,2)`、S=(1,0)、G=(2,5)、曼哈顿 h。优先队列 tie-break `(f, h, r, c)`，扩展序全确定：
`(1,0)f6 → (1,1)f6 → (2,1)f6 → (2,0)f6 → (3,1)f8 → (3,2)f8 → (3,3)f8 → (2,3)f8 → (2,4)f8 → (2,5)f8=GOAL`——沿 f=6 直奔、撞墙后 f 升 8 绕下侧。**扩展 10 格**；路径 `(1,0)→(1,1)→(2,1)→(3,1)→(3,2)→(3,3)→(2,3)→(2,4)→(2,5)` 共 8 步 = BFS 最短（对拍）；BFS 可达 22 格。

## 复用（无 T0）

MazeView 第 4 消费者零改动：`walls/start/goal/current/visited/path/solved` 全语义直配；**`letters` 复用为 f 值标注**（open/closed 格填 `String(f)`，其余 `''` 不显示）；`mark: '🧭'`（方向感图标）。`AstarExecPoint = 'init'|'expand'|'goal'|'trace'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`astar.ts`：`AS_ROWS/COLS/WALLS/START/GOAL`；`manhattan`；`astarTrace()` 返回 `{expansions:[{cell,g,h,f,opened:[{cell,g,h,f}]}],path,parent}`；`bfsInfo()` 返回 `{shortest, reachable}`（独立真值：A\* 路径长 = BFS 最短、扩展数 < 可达数）。
`astar.module.ts`：init（三兄弟对比 + f=g+h）→ expand×9（current=弹出格、letters 累积 f、caption「弹出 f 最小 (r,c)：g+h=f；开邻居 …」）→ goal（弹出即终点）→ trace（parent 回溯 path+solved 绿）→ done（10 vs 22 + 可采纳性 + 应用）。**13 步**。vars：open 大小、当前 g/h/f、已扩展。
`astar.sources.ts`：四语言 A\*（优先队列 + f=g+h + 松弛），lineMap init/expand/goal/trace/done。

## T2：页面 + 接线

`Astar.vue`（Algorithm 目录）；路由 `/docs/astar`；菜单/首页「回溯与搜索」第 9 项（数独后）；新 svg（网格 + 🧭 + f 数字）；改 TC-HOOK（回溯 children +astar）；Maze 页尾双向链接。

## 复用与零回归

MazeView 零改动（迷宫/岛屿/单词搜索 3 消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：letters 复用为 f 值标注、visited=closed、tie-break (f,h,r,c) 全确定；oracle astarTrace 与 bfsInfo 对拍（路径 8=最短、扩展 10<22）；module 13 步。
