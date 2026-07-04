# 需求：岛屿数量（C-20260704-066，回溯与搜索 · 网格搜索第 2 页 · Flood Fill）

> Status: verified
> Stable ID: C-20260704-066
> Owner: IllegalCreed
> Created: 2026-07-04
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

回溯与搜索大类已有 5 页：N 皇后（C-055，棋盘约束）、子集/排列/组合总和（C-056/057/058，决策树枚举 + 剪枝）、迷宫寻路（C-059，网格 DFS + 回溯找一条路径）。其中迷宫首建了 **MazeView 网格轨**，当时即注明「为岛屿/单词搜索/BFS 铺路」。

**岛屿数量**（LeetCode 200）是网格搜索的另一经典形态：给一张 `0`（水）/`1`（陆地）网格，数出**四连通的陆地块**有几个。它与迷宫同为网格 DFS，但目标不同——迷宫「找一条从起点到终点的路径」，岛屿「**扫描整张网格、对每片未访问陆地做 Flood Fill 铺满、数连通块个数**」，是理解 **Flood Fill / 连通分量**的入门题（图像连通域标记、油漆桶填充的基础）。

## 目标

在回溯与搜索大类新增第 6 页「岛屿数量」，接入算法播放器（`AlgorithmPlayer`）：

1. **扩展 MazeView 为通用网格搜索轨**（第 2 消费者）：以 additive 字段让它同时服务迷宫（找路）与岛屿（Flood Fill），**零迷宫回归**：
   - `filled?: [number,number][]`——已确认属于某个岛屿的陆地格（绿）；
   - `mark?: string`——当前格图标（缺省 `🐭`，岛屿用扫描图标）；
   - `start?`/`goal?`——转为可选（岛屿无起点/终点，不渲染 S/🚩）。
2. **逐格扫描 + DFS Flood Fill**：外层按行列扫描每个格子；遇到未访问的陆地 → 岛屿计数 +1、从该格 DFS 把整片连通陆地标绿（`filled`）；水格 / 已数过的陆地 → 跳过。
3. 固定输入：4×4 网格含 **3 个岛屿**（一个 3 格 L 形、一个 2 格竖条、一个单格），走完 `done` 时答案 = 3；水为深色墙、已数陆地为绿、当前格琥珀。

## 验收标准

- `/docs/number-of-islands` 新页：介绍正文（点明与迷宫的「找路 vs 数块」对照 + Flood Fill 概念）+ 播放器同屏，右侧四语言代码随步高亮。
- 动画：扫描指针逐格移动（`scan`）→ 命中新陆地（`found`，计数 +1）→ Flood Fill 逐格铺绿（`flood`）→ `done`（共 3 个岛屿）。
- 菜单 + 首页「回溯与搜索」新增第 6 项（紧接迷宫），新图标 `islands.svg`。
- 全门禁绿（format/lint/type-check/单测覆盖率/e2e）；真机自检确认扫描 + 3 片绿岛 + 计数 3；**迷宫页零回归**。

## 非目标

- 不做 BFS 版（队列）Flood Fill——DFS 与迷宫同构、利于对照；BFS 留待后续（如单词接龙/最短网格路）。
- 不做「岛屿最大面积/周长」等衍生题——本页聚焦「数连通块」。
- 不改 AlgorithmPlayer；MazeView 仅 additive 扩展（迷宫零回归）。

## 变更历史

- 2026-07-04：创建（draft → approved）。回溯与搜索网格搜索第 2 页，岛屿数量 Flood Fill，扩展 MazeView（第 2 消费者，additive filled/mark + start/goal 可选），与迷宫寻路对照。
- 2026-07-04：交付验收（approved → verified）。17 Case 全绿（MazeView 扩展 1 + module 12 + 视图 3 + e2e 1）+ 改 TC-HOOK 2；真机自检确认扫描 🔎、水深墙、3 片互不相连绿岛、计数 3、无 🐭/🚩/S；迷宫页零回归；AlgorithmPlayer 零改动。
