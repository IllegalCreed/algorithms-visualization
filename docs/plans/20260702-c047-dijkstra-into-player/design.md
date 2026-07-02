# 设计：Dijkstra 接入算法播放器（GraphView 轨，M8②-1）

> Status: verified
> Stable ID: C-20260702-047
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Dijkstra.vue
   │  <Article> 正文（保留原 C-037 讲解）
   │  <AlgorithmPlayer :module="dijkstraModule" />   ← 替换 <Playground><DijkstraViz/></Playground>
   ▼
算法模块 src/algorithms/
   dijkstra.module.ts   buildDijkstraSteps + dijkstraModule（复用 useDijkstra 图数据、细粒度重走）
   dijkstra.ts          oracle dijkstraTrace()→{dist,order}（薄封装 useDijkstra().run()）
   dijkstra.sources.ts  4 语言 + lineMap

框架扩展（additive）：
   player/types.ts   +GraphTrack +Step.graph? +DijkstraExecPoint
   AlgorithmPlayer.vue  <BarsView v-if="current.array.length">（图算法空数组不显）+ <GraphView v-if="current.graph">
   GraphView.vue（新第 7 轨，改造自 DijkstraViz 的 SVG）

删除（superseded）：DijkstraViz.vue + DijkstraViz.spec.ts（Cases 标 superseded）
保留：useDijkstra.ts（+spec）——被 module 复用为图数据 + oracle

不改：路由/菜单/首页/图标/TC-HOOK（Dijkstra 早在菜单）；既有 6 轨/15 排序/15 结构/Kruskal
```

## 2. 类型与框架扩展（additive）

```ts
// types.ts 追加
export type DijkstraExecPoint =
  | 'init' // dist[source]=0，其余 ∞
  | 'selectMin' // 未确定点里取 dist 最小的 u
  | 'settle' // done[u]=true（确定 u）
  | 'relaxEdge' // 考虑出边 u→v（比较 dist[u]+w 与 dist[v]）
  | 'relaxUpdate' // 更松：dist[v]=dist[u]+w，prev[v]=u
  | 'relaxSkip' // 不更松：跳过
  | 'done';

/** 图轨快照（通用：Dijkstra 有向 + dist 徽标；Kruskal 无向 + 边分类，C-048 复用） */
export interface GraphTrack {
  vertices: { id: number; label: string; x: number; y: number }[];
  edges: { key: string; from: number; to: number; w: number }[];
  directed: boolean;
  nodeBadge?: (string | null)[]; // 每节点徽标（Dijkstra=dist；∞ 记 '∞'；null=无）
  activeNode?: number | null; // 当前点高亮环（selectMin/settle 的 u）
  doneNodes?: number[]; // 已确定/已并入（绿填充）
  edgeClass?: Record<string, string>; // 边 key → 'relaxed'|'tree'（Dijkstra）/'current'|'mst'|'rejected'（Kruskal）
}
// Step 追加：graph?: GraphTrack
```

`AlgorithmPlayer.vue`：`<BarsView v-if="current.array.length" ... />` + 末尾加 `<GraphView v-if="current.graph" :graph="current.graph" />`。既有排序 `array` 恒非空 → BarsView 照常渲染，零回归。

## 3. GraphView.vue（新第 7 轨）

props `{ graph: GraphTrack }`。SVG（沿用 DijkstraViz 的坐标/箭头/权重中点算法）：

- `<svg>` 460×300；`viewBox` 自适应。
- **边** `.graph-edge`（`:class="edgeClass[key]"`）：`<line>` 起→止缩短露箭头（有向才 `marker-end`）+ 权重 `<text>`。
- **节点** `.graph-node`（`:class="{ done: doneNodes.includes(id), active: activeNode===id }"`）：`<circle r=18>` + label `<text>` +（有 nodeBadge 则）节点旁 dist 徽标 `.node-badge`。
- 样式复用 DijkstraViz 的新拟物 + 配色（done 绿、active 琥珀环、relaxed 黄边、tree 绿边）。

## 4. 算法模块 `dijkstra.module.ts`

```ts
import { useDijkstra } from '@/components/structures/useDijkstra';
export const dijkstraModule: AlgorithmModule<DijkstraExecPoint> = {
  title: 'Dijkstra 最短路',
  initialInput: () => [], // 图算法无数组输入；buildSteps 用固定图
  buildSteps: buildDijkstraSteps,
  sources: dijkstraSources,
};
```

- 从 `useDijkstra()` 取 `vertices/edges/adj/source`（固定 6 点 9 边有向图，源 A=0）。
- **细粒度重走**（数组式取最小，同 useDijkstra 逻辑但每条边一步）：
  - `init`：dist=[0,∞,∞,∞,∞,∞]；graph nodeBadge=dist、无 done。
  - 外层 k=0..n-1：`selectMin`（扫未确定取 dist 最小 u，graph activeNode=u）→ `settle`（done[u]=true，doneNodes+=u，绿）→ 每条出边 e：`relaxEdge`（edgeClass[e.key]='relaxed'，比较 dist[u]+w vs dist[e.to]）→ 更松 `relaxUpdate`（dist[e.to] 更新、nodeBadge 更新）/ 否则 `relaxSkip`。
  - `done`：全确定；edgeClass 置最短路树边（由 prev）为 'tree'（绿）；caption 含 A→F 最短路 + 长度 9。
- **每步**：`array:[]`、`pointers:[]`、`emphasis:{}`、`graph:GraphTrack`、`vars`（dist A..F 各一行 + u + k + 已确定数）、`point`、`caption`。
- 手算终态：dist=[0,3,1,4,7,9]，order=[A,C,B,D,E,F]。步数 = init 1 + Σ(selectMin+settle+出边×2) + done 1 ≈ init1 + (2×6) + (9 边×2) + done1 = **32 步**。

## 5. oracle + sources

```ts
// dijkstra.ts —— 薄封装，复用 useDijkstra 逻辑作正确性参照
export interface DijkstraTrace {
  dist: number[];
  order: number[];
}
export function dijkstraTrace(): DijkstraTrace {
  const r = useDijkstra().run();
  return { dist: r.dist, order: r.order };
}
```

sources 4 语言：数组式 Dijkstra（dist/done/selectMin/relax）。TS 骨架 lineMap：`{ init:3, selectMin:8, settle:10, relaxEdge:12, relaxUpdate:13, relaxSkip:12, done:17 }`；python/go/rust 逐行核对。

## 6. 视图返工 `Dijkstra.vue`

```vue
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { dijkstraModule } from '@/algorithms/dijkstra.module';
</script>
<template>
  <Article>
    …保留原正文（什么是最短路 / Dijkstra 怎么做 /
    在哪里用），把「点下一步」的引导句轻微调整指向播放器…
    <AlgorithmPlayer :module="dijkstraModule" />
    <!-- 替换 <Playground><DijkstraViz/></Playground> -->
    …
  </Article>
</template>
```

## 7. 组件清单与改动面

| 文件                                            | 类型            | 改动                                           |
| ----------------------------------------------- | --------------- | ---------------------------------------------- |
| `src/components/player/types.ts`                | 改（追加）      | +GraphTrack +Step.graph? +DijkstraExecPoint    |
| `src/components/player/AlgorithmPlayer.vue`     | 改（一处+一轨） | BarsView v-if + `<GraphView v-if>`             |
| `src/components/player/AlgorithmPlayer.spec.ts` | 改（加 Case）   | +TC-PLAYER-GRAPH-01/02                         |
| `src/components/GraphView.vue`                  | **新增**        | 图轨（改造自 DijkstraViz SVG）                 |
| `src/components/GraphView.spec.ts`              | **新增**        | TC-VIZ-GRAPHVIEW-\*                            |
| `src/algorithms/dijkstra.module.ts`             | **新增**        | buildDijkstraSteps + module                    |
| `src/algorithms/dijkstra.ts`                    | **新增**        | oracle（封装 useDijkstra）                     |
| `src/algorithms/dijkstra.sources.ts`            | **新增**        | 4 语言 + lineMap                               |
| `src/algorithms/dijkstra.module.spec.ts`        | **新增**        | TC-DIJKSTRA-MOD-\*                             |
| `src/views/Article/Algorithm/Dijkstra.vue`      | 改（返工）      | 自建 viz → AlgorithmPlayer（正文保留）         |
| `src/views/Article/Algorithm/Dijkstra.spec.ts`  | 改（改写）      | TC-VIEW-DIJKSTRA-01/02（Article+Player+Graph） |
| `e2e/dijkstra.e2e.ts`                           | 改（改写）      | 播放器交互（.graph-view/.scrub/末步）          |
| `src/components/structures/DijkstraViz.vue`     | **删除**        | superseded（git 存档）                         |
| `src/components/structures/DijkstraViz.spec.ts` | **删除**        | superseded（TC-VIZ-DIJKSTRAVIZ-\* 标废）       |

**零改动**：既有 6 轨组件 / usePlayer / 15 排序 / 15 结构 / Kruskal / useDijkstra（保留复用）/ 路由 / 菜单 / 首页 / 图标 / TC-HOOK。

## 8. 向后兼容论证

- `GraphTrack`/`Step.graph?`/`DijkstraExecPoint` 追加；`<GraphView v-if="current.graph">` 与既有 6 轨同模式。
- `BarsView v-if="current.array.length"`：既有 15 排序每步 array 恒非空（≥8）→ BarsView 照常渲染，**排序视图 Case（Bar 数/counter）零改动通过**；仅图算法 array:[] 时隐藏。
- DijkstraViz 删除：仅其自身 Case（TC-VIZ-DIJKSTRAVIZ-\*，标 superseded）+ Dijkstra 页 Case（改写）受影响；useDijkstra 保留、其 Case 不动。
- 无路由/菜单变化 → TC-HOOK 不动。

## 9. 测试策略（详见 test-cases.md）

- **L4 GraphView**：TC-VIZ-GRAPHVIEW-01 渲染 N 节点 + M 边；-02 doneNodes 绿 / activeNode 环 / edgeClass 高亮 / nodeBadge 徽标。
- **L4 播放器**：TC-PLAYER-GRAPH-01 当前步带 graph → 渲染 GraphView；-02 array 空 → 不渲染 BarsView（既有排序 array 非空 → 仍渲染，零回归）。
- **L3 dijkstra.module**：末步 dist=oracle=[0,3,1,4,7,9]、order=[A,C,B,D,E,F]；每步带 graph；#selectMin=#settle=6；relax 分支守恒；init 步 dist[A]=0 其余 ∞；settle 顺序 A,C,B,D,E,F；done 步 tree 边 = 最短路树；4 语言行号；元信息。
- **L4 视图**：TC-VIEW-DIJKSTRA-01 Article + AlgorithmPlayer；-02 h1「Dijkstra」+ GraphView + 6 节点。
- **L5 e2e**：`/docs/dijkstra` 正文 h1 + `.graph-view` + 6 `.graph-node` + `.scrub` 拖末步 → 6 节点 done + 最短路树可见。
- **superseded**：TC-VIZ-DIJKSTRAVIZ-\* 标 superseded（组件删除）。
