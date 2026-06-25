# 测试用例：图 Graph 知识页（无向图 + BFS/DFS）

> Status: verified
> Stable ID: C-20260625-022
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级             | 文件                                            | 编号区间                 | 数量 |
| ---------------- | ----------------------------------------------- | ------------------------ | ---- |
| L3 图逻辑        | `src/components/structures/useGraph.spec.ts`    | `TC-GRAPH-LOGIC-01..10`  | 10   |
| L4 GraphViz 互动 | `src/components/structures/GraphViz.spec.ts`    | `TC-VIZ-GRAPHVIZ-01..10` | 10   |
| L4 图页          | `src/views/Article/DataStructure/Graph.spec.ts` | `TC-VIEW-GRAPH-01..02`   | 2    |
| L5 e2e           | `e2e/graph.e2e.ts`                              | `TC-E2E-GRAPH-01`        | 1    |

**合计新增 23 个 Case。** 无现存 `GRAPH` Case，命名空间干净。

**回归（不新增、必须仍绿）**：8 排序 + 栈 + 队列 + 数组 + 链表 + 树 + 堆 + 哈希（含骨架与各 `use*`/`*Viz`）+ 播放器 全部现有 Case —— 由全门禁 `pnpm test:unit run` 证明零改动、零回归。

## L3 — useGraph（`TC-GRAPH-LOGIC-*`）

| TC                | 描述                           | 预期                         |
| ----------------- | ------------------------------ | ---------------------------- |
| TC-GRAPH-LOGIC-01 | 图结构：6 顶点、7 边、adj      | adj[0]=[1,2]、adj[3]=[1,4,5] |
| TC-GRAPH-LOGIC-02 | labelOf + 顶点坐标             | 0→A、5→F、vertices[0] 有 x   |
| TC-GRAPH-LOGIC-03 | bfs(0) 顺序 A B C D E F        | [0,1,2,3,4,5]                |
| TC-GRAPH-LOGIC-04 | dfs(0) 顺序 A B D E F C        | [0,1,3,4,5,2]                |
| TC-GRAPH-LOGIC-05 | bfs 与 dfs 顺序不同            | 不相等                       |
| TC-GRAPH-LOGIC-06 | bfs 访问全部 6、不重不漏       | len 6、Set 6                 |
| TC-GRAPH-LOGIC-07 | dfs 访问全部 6、不重不漏       | len 6、Set 6                 |
| TC-GRAPH-LOGIC-08 | bfs 首步 frontier = 队列 [1,2] | [1,2]                        |
| TC-GRAPH-LOGIC-09 | dfs 首步 frontier = 栈 [2,1]   | [2,1]                        |
| TC-GRAPH-LOGIC-10 | 换起点 bfs(3) 也访问全部       | 首=3、Set 6                  |

## L4 — GraphViz 互动（`TC-VIZ-GRAPHVIZ-*`）

| TC                 | 描述                                       | 预期                          |
| ------------------ | ------------------------------------------ | ----------------------------- |
| TC-VIZ-GRAPHVIZ-01 | 初始 6 顶点 + 7 边 + 3 按钮 + 默认起点高亮 | 6 vertex/7 edge/3 btn/1 start |
| TC-VIZ-GRAPHVIZ-02 | 顶点标签 A–F                               | ['A'..'F']                    |
| TC-VIZ-GRAPHVIZ-03 | 点顶点换起点（唯一 is-start）              | vertex2 is-start、唯一        |
| TC-VIZ-GRAPHVIZ-04 | BFS status 含「队列」+ A B C D E F         | status 含两者                 |
| TC-VIZ-GRAPHVIZ-05 | DFS status 含「栈」+ A B D E F C           | status 含两者                 |
| TC-VIZ-GRAPHVIZ-06 | BFS helper-label 含「队列」                | helper-label 含「队列」       |
| TC-VIZ-GRAPHVIZ-07 | DFS helper-label 含「栈」                  | helper-label 含「栈」         |
| TC-VIZ-GRAPHVIZ-08 | 重置复位（无 current、status 含起点）      | 0 current、status 含起点      |
| TC-VIZ-GRAPHVIZ-09 | 换起点后 BFS 从该点出发                    | status 含「从 F」             |
| TC-VIZ-GRAPHVIZ-10 | BFS 与 DFS 顺序不同                        | 两 status 不同                |

## L4 — 图页（`TC-VIEW-GRAPH-*`）

| TC               | 描述                        | 预期                     |
| ---------------- | --------------------------- | ------------------------ |
| TC-VIEW-GRAPH-01 | 挂载渲染 Article + GraphViz | 两组件存在               |
| TC-VIEW-GRAPH-02 | 含「图」标题与 Playground   | 标题文本 + `.playground` |

## L5 — e2e（`TC-E2E-GRAPH-01`）

| TC              | 描述                                                                                 | 预期       |
| --------------- | ------------------------------------------------------------------------------------ | ---------- |
| TC-E2E-GRAPH-01 | 导航 / 正文 + Playground / 初始 6 顶点+7 边 / 点 BFS status 含队列+顺序 / 重置含起点 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useGraph` 纯逻辑（bfs/dfs/结构）L3 全覆盖；GraphViz 同步分支（onPick/onRun BFS·DFS/onReset/helperLabel）L4 覆盖（遍历点亮 setTimeout 分步分支由 e2e/肉眼复核）。

## 变更历史

- 2026-06-25：创建并落地。实际新增 23 个 Case（useGraph 10 + GraphViz 10 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.60%/89.83%/92.72%/93.54%（stmts/branch/funcs/lines，聚合均过门槛）；GraphViz 96.82% 行（未覆盖仅遍历 setTimeout 动画循环体，e2e 覆盖）；单测 528 passed（81 文件）+ e2e 18 passed，骨架零改动、8 排序 + 栈 + 队列 + 数组 + 链表 + 树 + 堆 + 哈希零回归。**M3 数据结构 8/8 收官**。
