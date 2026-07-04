# 实现记录：A\* 寻路（C-20260705-096，纯复用 MazeView）

> Status: verified
> Stable ID: C-20260705-096
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：astar.module.spec（TC-AS-MOD-01..12）红 → astar.{ts,sources,module} 绿（types 仅 +AstarExecPoint）。
2. T2：Astar.vue + 路由 + 菜单/首页回溯第 9 项 + svg + TC-HOOK + 页 spec + e2e；Maze 页双向链接。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **MazeView 第 4 消费者纯复用零改动**：letters 复用为 f 值标注（open/closed 填 String(f)、其余 ''）、visited=closed（浅蓝）、current=弹出格（琥珀环）、终局 path+solved 绿、mark='🧭'。types 仅 +AstarExecPoint。
- oracle astar.ts：astarTrace 优先队列 tie-break (f,h,r,c) 全确定（expansions 含 opened 明细）；bfsInfo 独立真值双对拍——最优性（路径长=BFS 最短）与「省」（扩展数<可达数）。
- module 13 步：init（三兄弟对比）→ expand×9（弹出+开邻居 caption，第 4 步嵌「撞墙 f 抬 8」转折叙事）→ goal（终点出队即最优）→ trace（parent 回溯 8 步绿）→ done（10 vs 22 + 可采纳性 + 应用）。
- 双向链接：Maze 页 Callout 加「想让搜索认路 → A\*」；本页回链迷宫。

## 自测报告

- 门禁全绿 1775/96.01%/95.69%；e2e 4/4 首跑全过；真机 f 值/closed/路径全对。
- 回归：MazeView/AlgorithmPlayer 零改动，迷宫/岛屿/单词搜索零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
