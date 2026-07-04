# 需求：强连通分量 Tarjan（C-20260704-069，图算法第 7 页 · 有向图连通性）

> Status: verified
> Stable ID: C-20260704-069
> Owner: IllegalCreed
> Created: 2026-07-04
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

图算法大类已有 6 页：最短路（Dijkstra/Bellman-Ford 单源 + Floyd 全源）、MST（Kruskal/Prim）、拓扑排序，覆盖「最短路 / 生成树 / 依赖排序」三大范式，共用 GraphView 图轨。但**有向图的连通性**这一重要主题还没有——**强连通分量（SCC）**：有向图里能两两互相到达的极大节点集。

**Tarjan 算法**用**一趟 DFS**求所有 SCC，是图论的经典技巧：给每个节点记发现序 `dfn` 和「经若干条边能回溯到的最小 dfn」`low`；DFS 时把节点压栈，当某节点 `low == dfn`（回不到更早的祖先）时，它就是一个 SCC 的「根」，栈里它上面的节点连同它自己弹出、构成一个 SCC。`low` 的维护（子节点回传 + 指向栈中节点的回边）是算法的灵魂。

## 目标

在图算法大类新增第 7 页「强连通分量」，接入算法播放器（`AlgorithmPlayer`）：

1. **扩展 GraphView**（additive）：以 `nodeBadge` 显示每节点 `dfn/low`；新增 `nodeGroup?`（SCC 分组着色，一组一色）+ `stackNodes?`（当前在 Tarjan 栈上的节点·虚线环）；复用 `activeNode`（当前 DFS 节点）+ `edgeClass`（DFS 树边绿 / 当前回边黄）。栈内容另在 vars 文本呈现。其它图算法不设新字段 → 零回归。
2. **Tarjan 一趟 DFS 逐步重走**：`enter`（访问新节点，dfn=low=时间戳、入栈）→ `tree`（子节点递归返回，`low=min(low,子low)`）/`back`（指向栈中节点的回边，`low=min(low,dfn[邻])`）→ `scc`（`low==dfn`，弹栈到本节点、形成一个 SCC 并着色）→ `done`（共 N 个 SCC）。
3. 固定输入：6 节点有向图，SCC = **{0,1,2}、{3,4}、{5}** 共 **3 个**；`dfn=[0,1,2,3,4,5]`、`low=[0,0,0,3,3,5]`。

## 验收标准

- `/docs/scc` 新页：介绍正文（讲清 dfn/low + 栈 + `low==dfn` 判根）+ 播放器同屏，右侧四语言代码随步高亮。
- 动画：节点 dfn/low 徽标随步更新、栈节点虚线环、当前节点琥珀环、树边绿/回边黄；`scc` 步弹栈的一组节点着上同色；末步 3 个 SCC 三色分明。
- 菜单 + 首页「图算法」新增第 7 项（紧接 Floyd），新图标 `scc.svg`。
- 全门禁绿（format/lint/type-check/单测覆盖率/e2e）；真机自检确认 dfn/low、3 个 SCC 着色、栈弹出；**既有图算法零回归**。

## 非目标

- 不做 Kosaraju（两趟 DFS + 转置图）——Tarjan 一趟更优雅、且无需展示转置图。
- 不做缩点 / 2-SAT 等 SCC 应用——本页聚焦「求 SCC」本身。
- 不改 AlgorithmPlayer；GraphView 仅 additive 扩展（既有图算法零回归）。

## 变更历史

- 2026-07-04：创建（draft → approved）。图算法第 7 页，Tarjan 强连通分量，扩展 GraphView（+nodeGroup/stackNodes），补有向图连通性维度。
- 2026-07-04：交付验收（approved → verified）。18 Case 全绿（GraphView 扩展 2 + module 12 + 视图 3 + e2e 1）+ 改 TC-HOOK 2；真机自检确认 dfn/low=[0..5]/[0,0,0,3,3,5]、3 个 SCC 三色分明（{0,1,2}绿/{3,4}橙/{5}蓝）、栈空；既有图算法零回归。
