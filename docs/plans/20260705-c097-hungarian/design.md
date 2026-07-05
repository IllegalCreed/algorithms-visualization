# 设计：二分图匹配·匈牙利算法（C-20260705-097，纯复用 GraphView）

> Status: verified
> Stable ID: C-20260705-097
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

邻接 `L1:{R1,R2}、L2:{R1}、L3:{R2,R3}`。事件流（邻接序确定）：
`round L1: try(L1,R1) free → match`；`round L2: try(L2,R1) 被 L1 占 → try(L1,R2) free → 增广翻转（L1→R2、L2→R1 两条 match 合一步）`；`round L3: try(L3,R2) 被 L1 占 → try(L1,R1) 被 L2 占 → L2 无候选 fail（死路整链回退）→ try(L3,R3) free → match`。终局 matchR=[L2,L1,L3]、**匹配数 3 = 暴力枚举**。

## 复用（无 T0）

GraphView 纯复用：顶点 6 个两列布局（L 列 x=120、R 列 x=340，y=60/150/240，id 0-2 左 3-5 右）、无向边 5 条；`edgeClass`：试探 `current`（琥珀）/ 匹配 `mst`（绿粗）/ 死路链 `rejected`（灰虚，仅 fail 步）；`nodeBadge` 右点显示配对（`←L1`）；`activeNode` 当前求偶者；`doneNodes` 已匹配点。`HungarianExecPoint = 'init'|'try'|'match'|'fail'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`hungarian.ts`：`HG_ADJ=[[0,1],[0],[1,2]]`；`hungarianTrace()` 返回事件流 `{type:'round'|'try'|'match'|'fail', u, v?, note?, matchR}`（DFS+seen，全确定）；`bruteMaxMatching()` 枚举全部指派（独立真值）。
`hungarian.module.ts`：事件流重放——round 融入首个 try 的 caption；**连续 match 合并为一步**（增广翻转整条变绿）；fail 步死路链 rejected；badge/doneNodes 随 matchR 快照。**12 步**。vars：当前求偶者、匹配数、matchR 表。
`hungarian.sources.ts`：四语言 hungarian（外层 for + dfs 增广：空闲或能让路则定亲），lineMap init/try/match/fail/done。

## T2：页面 + 接线

`Hungarian.vue`（Algorithm 目录）；路由 `/docs/hungarian`；菜单/首页「图算法」第 10 项（max-flow 后）；新 svg（两列点 + 交叉配对线）；改 TC-HOOK（9→10 两 spec）；MaxFlow 页尾双向链接（匹配 = 单位容量最大流）。

## 复用与零回归

GraphView 零改动（Dijkstra/Kruskal/Prim/Bellman-Ford/Topo/SCC/2-SAT/AC/最大流等 10 消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：事件流重放（round 融入 try、连续 match/fail 各合并一步）；oracle hungarianTrace 与 bruteMaxMatching 对拍；module 12 步。
