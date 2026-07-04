# 设计：最大流 Ford-Fulkerson（C-20260704-076，残量网络 · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-076
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

复用 GraphView（图轨），**不新建轨**。最大流在原有向图上跑，边显示「流量/容量」，逐轮找增广路 + 增流，反向边反悔用高亮 + 标签变化表达。产出 `Step<MaxFlowExecPoint>`（复用 `Step.graph`）。

## 固定实例（Python 已核验）

- 节点 `s(0), a(1), b(2), t(3)`；边 `s→a:3, s→b:3, a→b:1, a→t:3, b→t:3`。
- Ford-Fulkerson（DFS，邻接序故意「从 a 先探 b」制造贪心陷阱）4 轮增广：
  1. `s→a→b→t` 瓶颈 1（误走中间边 a→b）
  2. `s→a→t` 瓶颈 2
  3. `s→b→t` 瓶颈 2
  4. `s→b→a→t` 瓶颈 1 —— **反向边 `b→a`**：把第 1 轮误走的 1 单位退回、改道
- **最大流 6**；最小割 `{s}|{a,b,t}`，割边 `s→a(3)+s→b(3)=6`（最大流=最小割）。

## T0：类型 + GraphView（edgeLabel + .reverse）

`types.ts`：

```ts
export type MaxFlowExecPoint =
  | 'init' // 展示网络，全部 0/cap，标源汇
  | 'find' // 找到一条增广路（高亮路径 + 瓶颈；反向段红色）
  | 'augment' // 沿路增流，更新流量标签（反向边流量减少）
  | 'done'; // 无增广路：最大流 = 最小割
```

`GraphTrack` 补 1 个可选字段（其它图算法不设 → 行为不变）：

```ts
edgeLabel?: Record<string, string>; // 边 key → 标签（如 '1/3' 流量/容量）；缺省回退到 w
```

`GraphView.vue`：边标签渲染优先 `edgeLabel[key]`，否则 `w`；additive 加 `.graph-edge.reverse` CSS（红虚线，反向退流边），区别于 `current`（琥珀，正向增广）/ `fail`（紫，AC）。源/汇用现成 `nodeBadge` 标「源/汇」。**GraphTrack 仅加 edgeLabel、AlgorithmPlayer 零改动**。

## T1：oracle + module + sources

`maxflow.ts`（自包含固定实例）：

```ts
export const MF_VERTS = [...];         // s/a/b/t 菱形坐标
export const MF_EDGES = [...];         // {from,to,cap}
export interface Augment { path:number[]; bottleneck:number; reverse:[number,number][] }
export function maxFlow(): { value:number; rounds:Augment[]; minCutS:number[]; cutEdges:[number,number][] };
// value=6，rounds=4 轮（末轮含反向边 b→a），minCutS=[s]，cutEdges=[s→a,s→b]
```

`maxflow.module.ts`：`buildMaxFlowSteps(): Step<MaxFlowExecPoint>[]`

- `init`：全边 `0/cap`，s/t 标源汇。
- 每轮 2 步 ×4：`find`（edgeClass 把增广路正向边标 `current`、反向边标 `reverse`，caption 给路径 + 瓶颈）+ `augment`（更新各边流量，edgeLabel 显示新 `flow/cap`，反向边流量减少，caption 说明退流）。
- `done`：无增广路，caption 给最大流 6；edgeClass 把最小割边（`s→a`/`s→b` 饱和）标 `current`，caption 说明最大流=最小割。

约 **10 步**。`vars`：源汇、当前流量值、本轮增广路 + 瓶颈、已增广轮数。

`maxflow.sources.ts`：TS/Python/Go/Rust 四语言 Ford-Fulkerson（残量图 DFS 找增广路 + 增流），`lineMap` 覆盖 init/find/augment/done。

## T2：页面 + 接线

`MaxFlow.vue`：`Article` 正文（标题「最大流（Ford-Fulkerson）」+ 副标「图算法 · 网络流 · 残量网络 · 最大流=最小割」）：讲清容量/流量、残量网络与反向边、增广路、贪心陷阱与反悔、最大流最小割定理、Edmonds-Karp（BFS）复杂度；`<AlgorithmPlayer :module="maxFlowModule" />`；结语与最短路/割互链。

接线：路由 `/docs/max-flow`；菜单 + 首页「图算法」children **第 9 项**（紧接 two-sat）；新 `max-flow.svg`；改 `TC-HOOK`（图算法 children +max-flow）。

## 复用与零回归

- GraphView `edgeLabel` additive（缺省回退 w）+ `.reverse` CSS，其它 8 图算法 + AC 自动机不设 → 渲染不变，`TC-VIZ-GRAPHVIEW-*` 全绿。
- 无新轨、无新 Step 字段（复用 `Step.graph` + `edgeClass`/`nodeBadge`）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。最大流 Ford-Fulkerson，残量网络 + 反向边反悔 + 最大流最小割，复用 GraphView（additive edgeLabel + .reverse）；固定 4 节点 5 边，4 轮增广、最大流 6。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：GraphView additive edgeLabel（缺省回退 w）+ .reverse 红虚线 CSS；maxflow oracle Ford-Fulkerson DFS 固定邻居序复现陷阱（value=6、rounds 瓶颈[1,2,2,1] 末轮反向边[1,2]、cutEdges s→a/s→b），module init+find×4+augment×4+done 10 步与 oracle 对拍；4 语言 sources lineMap 对齐 init/find/augment/done；复用 Step.graph、AlgorithmPlayer 零改动。
