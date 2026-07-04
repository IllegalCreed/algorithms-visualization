# 需求：A\* 寻路（C-20260705-096，回溯与搜索第 9 页 · 纯复用 MazeView）

> Status: verified
> Stable ID: C-20260705-096
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

网格搜索线（迷宫 DFS → 岛屿 Flood Fill → 单词搜索）之后补上**最著名的寻路算法**：BFS 不撞南墙不回头地「洪泛」，Dijkstra 只看已走代价 g——**A\*** 给搜索装上方向感：每格估价 `f = g + h`（g=起点到此实际步数，h=到终点的曼哈顿估计），**每次扩展 f 最小的格子**。h 不高估（可采纳）时保证最优路径，且扩展远少于 BFS。

## 目标

回溯与搜索第 9 页「A\* 寻路」，接入播放器，**纯复用 MazeView（第 4 消费者，零改动）**：

1. **网格叙事**：`letters` 每格显示 f 值（open/closed 才有）、`visited`=closed 集（浅蓝）、`current`=本步扩展格（🧭 + 琥珀环）、终局 `path`+`solved` 整条绿。
2. 固定实例（Python 已核验）：4×6 网格、L 墙 `(1,2),(2,2)`、S=(1,0)、G=(2,5)；扩展序确定（tie-break `(f,h,r,c)`）：先沿 f=6 直奔、撞墙后 f 升到 8 绕下侧，**共扩展 10 格**（BFS 可达 22 格）、路径 8 步 = BFS 最短（对拍）。**13 步** = init + expand×9 + goal + trace + done。
3. 正文：BFS/Dijkstra/A\* 三兄弟对比 → f=g+h 与可采纳启发式 → 扩展次序与省在哪 → 应用（游戏寻路/导航/规划）；链接迷宫页（同一张网格的两种走法）。

## 验收标准

- `/docs/astar` 新页：正文 + 播放器同屏，四语言随步高亮；f 值逐格点亮、closed 变蓝、终局路径绿；done 给 10 vs 22 对比。
- 菜单 + 首页「回溯与搜索」第 9 项，新图标；改 TC-HOOK（回溯 children +astar）。
- 全门禁 + 真机自检；MazeView 纯复用零改动（迷宫/岛屿/单词搜索 3 既有消费者零回归）。

## 非目标

- 不做对角移动/加权地形；不做 IDA\*/JPS 变体（正文点到）。
- 不改 AlgorithmPlayer / MazeView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。A\* 寻路纯复用 MazeView；10 扩展 vs BFS 22，13 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK；真机 f 值逐格点亮 + closed 蓝 + 当前格琥珀圈 + 末步 9 格路径绿；MazeView 3 既有消费者零回归（e2e 4/4）。
