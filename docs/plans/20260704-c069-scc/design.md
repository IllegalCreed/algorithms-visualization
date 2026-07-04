# 设计：强连通分量 Tarjan（C-20260704-069，扩展 GraphView）

> Status: verified
> Stable ID: C-20260704-069
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

复用 GraphView 图轨（第 6 消费者），additive 加 SCC 着色 + 栈标记。Tarjan 一趟 DFS 逐事件重走，产出 `Step<TarjanExecPoint>` 胖步骤（复用 `Step.graph`）。

## T0：GraphView additive 扩展（既有图算法零回归）

`types.ts`：`GraphTrack` +`nodeGroup?: (number | null)[]`（SCC 组号 → 调色板填充；null=未归组，中性灰）、+`stackNodes?: number[]`（在栈节点，虚线琥珀环）。+`TarjanExecPoint`。

`GraphView.vue`：节点 `circle` 当 `nodeGroup` 存在时按组号取调色板色（inline `fill`，覆盖默认绿；null→灰）；`stackNodes` 内节点加 `on-stack` 类（虚线环）。既有算法不传 → 渲染不变，`TC-VIZ-GRAPHVIEW-*` 全绿。

## T1：oracle + module + sources

`scc.ts`（固定 6 点有向图）：

```ts
export const SCC_N = 6;
export const SCC_EDGES: [number, number][] = [[0,1],[1,2],[2,0],[2,3],[3,4],[4,3],[4,5]];
export const SCC_VERTS = [ /* 固定坐标：{0,1,2} 左三角、{3,4} 中、{5} 右 */ ];
export function tarjanSCCs(): number[][] { … } // → [[5],[4,3],[2,1,0]]（发现序）
export function tarjanDfnLow(): { dfn: number[]; low: number[] } { … } // dfn=[0..5], low=[0,0,0,3,3,5]
```

`scc.module.ts`：`buildSccSteps(): Step<TarjanExecPoint>[]`

- 递归 DFS，维护 `dfn/low/onStack/stack/comp`：
  - `enter u`：`dfn[u]=low[u]=idx++`，入栈；emit（activeNode=u、badge 更新、stackNodes、栈 vars）。
  - 邻 v：`dfn[v]<0` → 递归后 `low[u]=min(low[u],low[v])`，emit `tree`（边 u→v 绿、low 更新）；`onStack[v]` → `low[u]=min(low[u],dfn[v])`，emit `back`（边 u→v 黄、low 更新）。
  - `low[u]==dfn[u]` → 弹栈到 u，成一个 SCC（`nodeGroup` 着色），emit `scc`。
- `done`：全部 SCC 着色定色，caption 给「共 3 个 SCC」。约 **18 步**。`vars`：节点数、边、当前节点 dfn/low、栈、已找 SCC 数。
- `nodeBadge[id]` = `dfn>=0 ? \`${dfn}/${low}\` : null`；`nodeGroup[id]` = SCC 组号（着色后固定）；`stackNodes` = 当前栈；`edgeClass` 累积树边绿、当前回边黄。

`scc.sources.ts`：TS/Python/Go/Rust 四语言标准 Tarjan，`lineMap` 覆盖 enter/tree/back/scc/done。

## T2：页面 + 接线

`Scc.vue`：`Article` 正文（标题「强连通分量（Tarjan）」+ 副标「图算法 · 有向图连通性 · O(V+E)」）：

- 讲清 SCC 定义（互相可达的极大集）；朴素做法对每点 DFS 太慢；Tarjan 用 dfn/low + 栈一趟求解——`low[u]` = u 及其子树经至多一条回边能到的最小 dfn，`low[u]==dfn[u]` 说明 u 是 SCC 根。
- `<AlgorithmPlayer :module="sccModule" />`。
- 结语点出 SCC 应用（缩点、2-SAT、依赖环检测），对照拓扑排序（DAG 无环 vs SCC 找环）。

接线：路由 `/docs/scc`（name=`scc`）；菜单 + 首页「图算法」children **第 7 项**（紧接 `floyd-warshall`）：`[...,'floyd-warshall','scc']`；新图标 `scc.svg`；改 `TC-HOOK`（图算法 6→7，menu+home length + list）。

## 复用与零回归

- GraphView：`nodeGroup`/`stackNodes` additive，既有算法不传即不影响 → Dijkstra/Kruskal/Prim/Bellman-Ford/Topo/Floyd 零回归。
- 无新轨、无新 Step 字段（复用 `Step.graph`）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。扩展 GraphView（+nodeGroup/stackNodes，第 6 消费者）；Tarjan 一趟 DFS 求 SCC，6 点图 3 个 SCC，补图算法有向图连通性。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：GraphView nodeGroup 调色板 inline fill + stackNodes .on-stack 虚线环；scc.module Tarjan DFS 逐事件 17 步，oracle tarjanSCCs()=[[5],[4,3],[2,1,0]]/dfn=[0..5]/low=[0,0,0,3,3,5]；4 语言 sources lineMap 对齐 enter/tree/back/scc/done。
