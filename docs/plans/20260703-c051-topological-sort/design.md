# 设计：拓扑排序（新页，DAG 依赖排序，复用 GraphView 轨）

> Status: verified
> Stable ID: C-20260703-051
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Topo.vue（新页）
   │  <Article> 正文（什么是拓扑序 / Kahn 怎么做 / 在哪里用 / 有环则无解）
   │  <AlgorithmPlayer :module="topoModule" />
   ▼
算法模块 src/algorithms/
   topo.module.ts   buildTopoSteps + topoModule
   topo.ts          图数据（TOPO_VERTICES/TOPO_EDGES）+ oracle topoTrace()→{order,inDegree}
   topo.sources.ts  4 语言 + lineMap

框架扩展（additive，唯一一处）：player/types.ts +TopoExecPoint
零改动复用（C-047）：GraphView.vue（有向图轨 + nodeBadge 入度 + doneNodes 已输出 + edgeClass）+ AlgorithmPlayer.vue
接线：router（/docs/topological-sort）+ 菜单 + 首页（新 topo.svg）
TC-HOOK：TC-HOOK-01-1/02-1 图算法 4→5、url +topological-sort
不改：GraphView/AlgorithmPlayer/Step/Dijkstra/Kruskal/Prim/Bellman-Ford/15 排序/15 结构
```

## 2. 类型扩展（additive，唯一框架改动）

```ts
// types.ts 追加（与 DijkstraExecPoint 并列）
export type TopoExecPoint =
  | 'init' // 计算各点入度
  | 'selectNode' // 取一个入度为 0（且下标最小）的点（activeNode 环）
  | 'removeNode' // 输出该点（doneNodes 绿）+ 其后继入度各减 1
  | 'done'; // 所有点输出，拓扑序完成
```

`GraphTrack` / `Step.graph?` **零改动**（通用字段覆盖拓扑排序）。

## 3. GraphView 复用（零改动，第 5 消费者）

| 拓扑排序需求         | GraphTrack 字段               | GraphView 现有支持         |
| -------------------- | ----------------------------- | -------------------------- |
| 有向图（画箭头）     | `directed: true`              | `marker-end` 挂 ✓          |
| 入度徽标             | `nodeBadge: (string\|null)[]` | `.node-badge` 数字 ✓       |
| 已输出点（绿）       | `doneNodes: number[]`         | `.graph-node.done` 深绿 ✓  |
| 当前取出点（琥珀环） | `activeNode: number`          | `.graph-node.active` 环 ✓  |
| 当前点出边（黄）     | `edgeClass[key]='current'`    | `.graph-edge.current` 黄 ✓ |

→ GraphView.vue/spec 不改；仅在 topo.module 里填 GraphTrack。

## 4. 图数据（`topo.ts`，非平凡 DAG）

```
顶点：A(0) B(1) C(2) D(3) E(4) F(5)。位置见实现（左=源 C/E，右=汇 F）。
边（有向，无环）：C→A, C→B, E→B, E→D, A→F, B→F, D→F
初始入度：A=1, B=2, C=0, D=1, E=0, F=3   →  [1,2,0,1,0,3]
```

**Kahn 重走（最小下标 tiebreak）**：

| 步  | 取出（入度 0 最小下标） | 输出序      | 后继减度 |
| --- | ----------------------- | ----------- | -------- |
| 1   | C(2)（并列 C,E 取 C）   | C           | A→0, B→1 |
| 2   | A(0)（并列 A,E 取 A）   | C,A         | F→2      |
| 3   | E(4)                    | C,A,E       | B→0, D→0 |
| 4   | B(1)（并列 B,D 取 B）   | C,A,E,B     | F→1      |
| 5   | D(3)                    | C,A,E,B,D   | F→0      |
| 6   | F(5)                    | C,A,E,B,D,F | —        |

拓扑序 = **C→A→E→B→D→F** = `[2,0,4,1,3,5]`（非平凡）。

## 5. 算法模块 `topo.module.ts`

- init：算各点入度；nodeBadge=入度；doneNodes=[]；无 active。caption「先数每个点的入度」。
- 循环 6 次：
  - `selectNode`：扫未输出点找入度 0 且最小下标的 u；activeNode=u；caption「u 入度为 0，可以输出」。
  - `removeNode`：output.push(u)、doneNodes+=u；对 u 的每条出边 (u,v) 令 indeg[v]--（nodeBadge 更新）；activeNode=u、edgeClass={u 出边:'current'}；caption「输出 u；后继入度各减 1」。
- done：拓扑序完成；nodeBadge 定格（全 0）；doneNodes=全 6 点；caption 含拓扑序。
- **每步**：`array:[]`、`vars`（已输出序列 / 当前点 / 剩余点数）、`graph`、`point`、`caption`。
- 步数：init 1 + 6×(selectNode + removeNode) + done 1 = **14 步**。#selectNode=6、#removeNode=6。

## 6. oracle + sources

```ts
// topo.ts —— 图数据 + 纯逻辑 oracle（Kahn，最小下标）
export const TOPO_VERTICES = [...]; export const TOPO_EDGES = [...];
export interface TopoTrace { order: number[]; inDegree: number[]; }
export function topoTrace(): TopoTrace { ... }   // order=[2,0,4,1,3,5], inDegree=[1,2,0,1,0,3]
```

sources 4 语言：Kahn 拓扑排序（入度数组 + 反复取入度 0 点）。TS lineMap `{ init, selectNode, removeNode, done }`；python/go/rust 逐行核对。

## 7. 接线与改动面

| 文件                                       | 类型     | 改动                                            |
| ------------------------------------------ | -------- | ----------------------------------------------- |
| `src/components/player/types.ts`           | 改       | +TopoExecPoint（唯一框架改动）                  |
| `src/algorithms/topo.module.ts`            | **新增** | buildTopoSteps + module                         |
| `src/algorithms/topo.ts`                   | **新增** | 图数据 + oracle                                 |
| `src/algorithms/topo.sources.ts`           | **新增** | 4 语言 + lineMap                                |
| `src/algorithms/topo.module.spec.ts`       | **新增** | TC-TOPO-MOD-\*                                  |
| `src/views/Article/Algorithm/Topo.vue`     | **新增** | 新页（Article + AlgorithmPlayer）               |
| `src/views/Article/Algorithm/Topo.spec.ts` | **新增** | TC-VIEW-TOPO-01/02/03                           |
| `e2e/topological-sort.e2e.ts`              | **新增** | TC-E2E-TOPO-01                                  |
| `src/assets/topo.svg`                      | **新增** | 首页图标                                        |
| `src/router/index.ts`                      | 改       | +路由 /docs/topological-sort                    |
| `src/views/Docs/Menu/hooks.ts`             | 改       | 图算法 +拓扑排序                                |
| `src/views/Home/Main/hooks.ts`             | 改       | 首页网格 +拓扑排序（+TopoIcon）                 |
| `src/views/Docs/Menu/hooks.spec.ts`        | 改       | TC-HOOK-02-1：图算法 4→5、url +topological-sort |
| `src/views/Home/Main/hooks.spec.ts`        | 改       | TC-HOOK-01-1：图算法 4→5、url +topological-sort |

**零改动**：GraphView.vue（+spec）/ AlgorithmPlayer.vue（+spec）/ Step / 4 图算法 / usePlayer / 15 排序 / 15 结构。

## 8. 向后兼容论证

- `TopoExecPoint` 追加；不动 Step / GraphTrack / GraphView / AlgorithmPlayer。
- 新页 + 新路由 + 菜单/首页加项 → 仅影响 TC-HOOK-01-1 / 02-1（图算法 5 项）；其余 TC-HOOK 不变。
- GraphView 第 5 消费者（最短路有向正/负权 + MST 无向 + 拓扑有向无权）——零改动佐证通用轨设计；入度用 nodeBadge、输出序用 doneNodes 复用。

## 9. 测试策略（详见 test-cases.md）

- **L3 module**：末步 doneNodes 输出序 = oracle order = [2,0,4,1,3,5]；每步带 graph+array:[]、directed=true；#selectNode=6、#removeNode=6；init nodeBadge=入度 [1,2,0,1,0,3]；首 selectNode 取 C(activeNode=2)；首 removeNode 后 doneNodes=[2] 且 A 入度→0；order 是合法拓扑序（每边 u→v，u 在 order 中先于 v）；入度徽标单调不增；done doneNodes 全 6；4 语言行号；元信息。
- **L4 视图**：TC-VIEW-TOPO-01 Article+Player；-02 h1「拓扑」+GraphView+6 节点+无 .bars-view；-03 全模板同屏（Article 含「拓扑」+ ≥7 .graph-edge）。
- **L4 TC-HOOK**：01-1/02-1 图算法 5 项、url 末位 'topological-sort'。
- **L5 e2e**：TC-E2E-TOPO-01 /docs/topological-sort → .graph-view + 6 .graph-node + 7 .graph-edge；拖末步 6 .graph-node.done + caption 含拓扑序；Shiki。
- **复用**：TC-VIZ-GRAPHVIEW-\* / TC-PLAYER-GRAPH-\* / 4 图算法 Case 零改动全绿。
