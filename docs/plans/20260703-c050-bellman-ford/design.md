# 设计：Bellman-Ford 最短路（新页，含负权，复用 GraphView 轨，与 Dijkstra 配对）

> Status: verified
> Stable ID: C-20260703-050
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Bellman.vue（新页）
   │  <Article> 正文（负权最短路 / Bellman-Ford 怎么做 / 为何 V−1 轮 / Dijkstra vs Bellman-Ford）
   │  <AlgorithmPlayer :module="bellmanFordModule" />
   ▼
算法模块 src/algorithms/
   bellman-ford.module.ts   buildBellmanFordSteps + bellmanFordModule
   bellman-ford.ts          图数据（BF_VERTICES/BF_EDGES/BF_SOURCE）+ oracle bellmanFordTrace()→{dist,prev}
   bellman-ford.sources.ts  4 语言 + lineMap

框架扩展（additive，唯一一处）：player/types.ts +BellmanFordExecPoint
零改动复用（C-047）：GraphView.vue（有向图轨 + nodeBadge dist + edgeClass current/tree）+ AlgorithmPlayer.vue
接线：router（/docs/bellman-ford）+ 菜单 + 首页（新 bellman.svg）
TC-HOOK：TC-HOOK-01-1/02-1 图算法 3→4、url +bellman-ford
不改：GraphView/AlgorithmPlayer/Step/Dijkstra/Kruskal/Prim/15 排序/15 结构
```

## 2. 类型扩展（additive，唯一框架改动）

```ts
// types.ts 追加（与 DijkstraExecPoint 并列）
export type BellmanFordExecPoint =
  | 'init' // dist[源]=0，其余 ∞
  | 'roundStart' // 开始第 k 轮：松弛所有边
  | 'relaxUpdate' // 当前边 (u,v,w)：dist[u]+w < dist[v] → 更新 dist[v]
  | 'relaxSkip' // 当前边：不更短，跳过
  | 'done'; // V−1 轮完成，最短路确定
```

`GraphTrack` / `Step.graph?` **零改动**（通用字段覆盖 Bellman-Ford）。

## 3. GraphView 复用（零改动，第 4 消费者）

| Bellman-Ford 需求   | GraphTrack 字段               | GraphView 现有支持             |
| ------------------- | ----------------------------- | ------------------------------ |
| 有向图（画箭头）    | `directed: true`              | `marker-end` 挂 ✓              |
| dist 徽标（含负数） | `nodeBadge: (string\|null)[]` | `.node-badge`，'∞'/数字/负数 ✓ |
| 当前松弛边（黄）    | `edgeClass[key]='current'`    | `.graph-edge.current` 黄 ✓     |
| 末步最短路树（绿）  | `edgeClass[key]='tree'`       | `.graph-edge.tree` 绿 ✓        |
| 末步全部确定（绿）  | `doneNodes: number[]`         | `.graph-node.done` 深绿 ✓      |

→ GraphView.vue/spec 不改；负权边权重标签直接显示负数（如 −3），无需新样式。

## 4. 图数据（`bellman-ford.ts`，含负权无负环）

```
顶点：A(0) B(1) C(2) D(3) E(4)，源 A。位置见实现（GraphView viewBox 460×300）。
边（刻意"逆序"排列，使松弛逐轮向外传播）：
  D→E(-2), C→D(2), C→E(4), B→C(-3), B→D(6), A→B(4), A→C(5)   // 含负权 B→C=-3、D→E=-2，无负环
```

**逐轮 dist（源 A）**：

| 轮  | 松弛后 dist（A,B,C,D,E） | 本轮更新               |
| --- | ------------------------ | ---------------------- |
| 初  | 0, ∞, ∞, ∞, ∞            | —                      |
| 1   | 0, 4, 5, ∞, ∞            | B←A(4)、C←A(5)         |
| 2   | 0, 4, 1, 7, 9            | D←C(7)、E←C(9)、C←B(1) |
| 3   | 0, 4, 1, 3, 5            | E←D(5)、D←C(3)         |
| 4   | 0, 4, 1, 3, 1            | E←D(1)                 |

终态 dist=[0,4,1,3,1]，**V−1=4 轮收敛**（最长最短路 A→B→C→D→E 恰 4 条边）。最短路树 prev：B←A、C←B、D←C、E←D → 树边 {A→B,B→C,C→D,D→E}。

## 5. 算法模块 `bellman-ford.module.ts`

- init：dist[A]=0 余 ∞；nodeBadge=dist（'∞' 或数字）；edgeClass 空。
- for k=1..V−1（4 轮）：
  - `roundStart`：caption「第 k 轮：松弛所有边」；nodeBadge 为进入本轮时的 dist（= 上轮末态）。
  - for 每条边 e=(u,v,w)（固定顺序）：当前边 edgeClass[key]='current'；若 `dist[u]+w < dist[v]` → 更新 dist[v]、prev[v]=u，emit `relaxUpdate`（activeNode=v）；否则 emit `relaxSkip`。
- done：nodeBadge=终态 dist；edgeClass = 最短路树 4 条边 'tree'；doneNodes=全 5 点；caption 含 dist 终值 + A→E 最短路长。
- **edgeClass helper**：仅当前边 'current'（松弛过程）；done 步换成 tree 树边集。
- **每步**：`array:[]`、`vars`（轮次 k / 当前边 / 本轮已更新数 / dist 表）、`graph`、`point`、`caption`。
- 步数：init 1 + 4×(roundStart 1 + 7 边×1) + done 1 = **34 步**。#roundStart=4、#relaxUpdate=8、#relaxSkip=20。

## 6. oracle + sources

```ts
// bellman-ford.ts —— 图数据 + 纯逻辑 oracle
export const BF_VERTICES = [...]; export const BF_EDGES = [...]; export const BF_SOURCE = 0;
export interface BellmanFordTrace { dist: number[]; prev: (number|null)[]; }
export function bellmanFordTrace(): BellmanFordTrace { ... V−1 轮松弛 ... }
```

sources 4 语言：标准 Bellman-Ford（V−1 轮 × 遍历所有边松弛）。TS lineMap `{ init, roundStart, relaxUpdate, relaxSkip, done }`；python/go/rust 逐行核对。

## 7. 接线与改动面

| 文件                                          | 类型     | 改动                                        |
| --------------------------------------------- | -------- | ------------------------------------------- |
| `src/components/player/types.ts`              | 改       | +BellmanFordExecPoint（唯一框架改动）       |
| `src/algorithms/bellman-ford.module.ts`       | **新增** | buildBellmanFordSteps + module              |
| `src/algorithms/bellman-ford.ts`              | **新增** | 图数据 + oracle                             |
| `src/algorithms/bellman-ford.sources.ts`      | **新增** | 4 语言 + lineMap                            |
| `src/algorithms/bellman-ford.module.spec.ts`  | **新增** | TC-BELLMAN-MOD-\*                           |
| `src/views/Article/Algorithm/Bellman.vue`     | **新增** | 新页（Article + AlgorithmPlayer）           |
| `src/views/Article/Algorithm/Bellman.spec.ts` | **新增** | TC-VIEW-BELLMAN-01/02/03                    |
| `e2e/bellman-ford.e2e.ts`                     | **新增** | TC-E2E-BELLMAN-01                           |
| `src/assets/bellman.svg`                      | **新增** | 首页图标                                    |
| `src/router/index.ts`                         | 改       | +路由 /docs/bellman-ford                    |
| `src/views/Docs/Menu/hooks.ts`                | 改       | 图算法 +Bellman-Ford                        |
| `src/views/Home/Main/hooks.ts`                | 改       | 首页网格 +Bellman-Ford（+BellmanIcon）      |
| `src/views/Docs/Menu/hooks.spec.ts`           | 改       | TC-HOOK-02-1：图算法 3→4、url +bellman-ford |
| `src/views/Home/Main/hooks.spec.ts`           | 改       | TC-HOOK-01-1：图算法 3→4、url +bellman-ford |

**零改动**：GraphView.vue（+spec）/ AlgorithmPlayer.vue（+spec）/ Step / Dijkstra / Kruskal / Prim / useDijkstra / useKruskal / usePlayer / 15 排序 / 15 结构。

## 8. 向后兼容论证

- `BellmanFordExecPoint` 追加；不动 Step / GraphTrack / GraphView / AlgorithmPlayer。
- 新页 + 新路由 + 菜单/首页加项 → 仅影响 TC-HOOK-01-1 / 02-1（图算法 4 项）；其余 TC-HOOK（分类数 3、数据结构 15、排序 15）不变。
- GraphView 第 4 消费者（有向 Dijkstra + 无向 Kruskal + 无向 Prim + 有向含负权 Bellman-Ford）——零改动佐证通用轨设计；负权由权重标签直接呈现。

## 9. 测试策略（详见 test-cases.md）

- **L3 module**：末步 nodeBadge=dist=[0,4,1,3,1]（= oracle）；每步带 graph+array:[]；#roundStart=4（V−1）；#relaxUpdate=8；init nodeBadge[0]='0' 余 '∞'；roundStart 各轮 nodeBadge 序列 = 逐轮 dist（[0,4,5,∞,∞]…）；首 relaxUpdate 后 B=4；dist 每点单调不增（松弛不变量）；done tree 边 4 条 = {0-1,1-2,2-3,3-4}；负权边 B→C=-3、D→E=-2 存在；4 语言行号；元信息。
- **L4 视图**：TC-VIEW-BELLMAN-01 Article+Player；-02 h1「Bellman」+GraphView+5 节点+无 .bars-view；-03 全模板同屏（Article 含「最短」+ ≥7 .graph-edge）。
- **L4 TC-HOOK**：01-1/02-1 图算法 4 项、url 末位 'bellman-ford'。
- **L5 e2e**：TC-E2E-BELLMAN-01 /docs/bellman-ford → .graph-view + 5 .graph-node + 7 .graph-edge；拖末步 4 .graph-edge.tree + caption 含 dist；Shiki。
- **复用**：TC-VIZ-GRAPHVIEW-\* / TC-PLAYER-GRAPH-\* / TC-DIJKSTRA-\* 零改动全绿。
