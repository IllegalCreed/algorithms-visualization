# 设计：Prim 最小生成树（新页，复用 GraphView 轨，与 Kruskal 配对）

> Status: verified
> Stable ID: C-20260703-049
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Prim.vue（新页）
   │  <Article> 正文（什么是 MST·Prim 视角 / Prim 怎么做 / Prim vs Kruskal / 在哪里用）
   │  <AlgorithmPlayer :module="primModule" />
   ▼
算法模块 src/algorithms/
   prim.module.ts   buildPrimSteps + primModule（复用 useKruskal 图，从 A 生长）
   prim.ts          oracle primTrace()→{order,mstEdges,totalWeight}（自算 Prim；与 kruskalTrace MST 集互验）
   prim.sources.ts  4 语言 + lineMap

框架扩展（additive，唯一一处）：player/types.ts +PrimExecPoint
零改动复用（C-047/048）：GraphView.vue（无向图轨）+ AlgorithmPlayer.vue
接线：router（/docs/prim）+ Docs/Menu/hooks（图算法 +Prim）+ Home/Main/hooks（网格 +Prim）+ 新 prim.svg
TC-HOOK：TC-HOOK-01-1（Home）+ TC-HOOK-02-1（Menu）图算法 2→3、url +prim
不改：GraphView/AlgorithmPlayer/Step/Dijkstra/Kruskal 逻辑/useKruskal 图/15 排序/15 结构
```

## 2. 类型扩展（additive，唯一框架改动）

```ts
// types.ts 追加（与 DijkstraExecPoint / KruskalExecPoint 并列）
export type PrimExecPoint =
  | 'init' // 树 = {起点 A}
  | 'selectEdge' // 在横切边（一端在树、一端在树外）里选权最小（current 黄）
  | 'addVertex' // 把该边 + 树外端点并入树（mst 绿 + 新点变绿）
  | 'done'; // V-1 条边选齐，MST 完成
```

`GraphTrack` / `Step.graph?` **零改动**（通用字段覆盖 Prim）。

## 3. GraphView 复用（零改动，第 3 消费者）

| Prim 需求          | GraphTrack 字段            | GraphView 现有支持            |
| ------------------ | -------------------------- | ----------------------------- |
| 无向图（不画箭头） | `directed: false`          | `marker-end` 仅 directed 挂 ✓ |
| 当前横切边（黄）   | `edgeClass[key]='current'` | `.graph-edge.current` 黄 ✓    |
| 树边（绿）         | `edgeClass[key]='mst'`     | `.graph-edge.mst` 绿 ✓        |
| 树内点（绿）       | `doneNodes: number[]`      | `.graph-node.done` 深绿 ✓     |
| 无 dist 徽标       | `nodeBadge` 省略           | `v-if badge!==null` 不渲染 ✓  |

→ GraphView.vue/spec 不改；仅在 prim.module 里填 GraphTrack。

## 4. 算法模块 `prim.module.ts`

- 从 `useKruskal()` 取 `vertices/edges`（6 点 9 边无向图）。起点 A(0)。
- **从 A 生长**（朴素选最小横切边）：
  - `init`：inTree={A}；graph doneNodes=[0]、edgeClass 空、weight 0。
  - 循环 V-1（5）轮：
    - `selectEdge`：扫所有边找「一端在树、一端在树外」的权最小者 best（edgeClass={已选树边:'mst', best.id:'current'}）。
    - `addVertex`：把 best 的树外端点并入 inTree，treeEdges.push(best.id)，weight+=best.w（edgeClass 全树边 'mst'、doneNodes+=新点）。
  - `done`：inTree 全满；edgeClass 5 条树边 'mst'；caption 含总权 18 + 序。
- **edgeClass helper**：`treeEdges.forEach(id=>cls[id]='mst'); if(currentId) cls[currentId]='current'`。
- **每步**：`array:[]`、`pointers:[]`、`emphasis:{}`、`graph:GraphTrack`、`vars`（树内点 / 已选边 x/5 / MST 权重）、`point`、`caption`。
- 手算终态：order=[AC,BC,BD,DE,DF]，weight=1+2+5+3+7=18，doneNodes 全 6 点。步数 = init 1 + 5×(selectEdge+addVertex) + done 1 = **12 步**。**与 Kruskal 同集（{AC,BC,BD,DE,DF}）不同序**。

## 5. oracle + sources

```ts
// prim.ts —— 自算 Prim（复用 useKruskal 图），与 kruskalTrace MST 集互验
export interface PrimTrace { order: string[]; mstEdges: string[]; totalWeight: number; }
export function primTrace(): PrimTrace { ... 从 A 生长扫最小横切边 ... }
```

sources 4 语言：朴素 Prim（inTree 布尔数组 + 扫边选最小横切边）。TS lineMap：`{ init, selectEdge, addVertex, done }`；python/go/rust 逐行核对。

## 6. 新页面 Prim.vue

```vue
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { primModule } from '@/algorithms/prim.module';
</script>
<template>
  <Article>
    <h1>Prim 最小生成树</h1>
    …什么是 MST（Prim 视角：从一个点生长）/ Prim 怎么做（横切边 + 切分定理）/ Prim vs
    Kruskal（同图两策略：Kruskal 按权全局选边 + 并查集判环；Prim 从点集生长选横切边）/ 在哪里用…
    <AlgorithmPlayer :module="primModule" />
  </Article>
</template>
```

## 7. 接线与改动面

| 文件                                       | 类型     | 改动                                 |
| ------------------------------------------ | -------- | ------------------------------------ |
| `src/components/player/types.ts`           | 改       | +PrimExecPoint（唯一框架改动）       |
| `src/algorithms/prim.module.ts`            | **新增** | buildPrimSteps + module              |
| `src/algorithms/prim.ts`                   | **新增** | oracle（自算 Prim + kruskal 集互验） |
| `src/algorithms/prim.sources.ts`           | **新增** | 4 语言 + lineMap                     |
| `src/algorithms/prim.module.spec.ts`       | **新增** | TC-PRIM-MOD-\*                       |
| `src/views/Article/Algorithm/Prim.vue`     | **新增** | 新页（Article + AlgorithmPlayer）    |
| `src/views/Article/Algorithm/Prim.spec.ts` | **新增** | TC-VIEW-PRIM-01/02/03                |
| `e2e/prim.e2e.ts`                          | **新增** | TC-E2E-PRIM-01                       |
| `src/assets/prim.svg`                      | **新增** | 首页图标                             |
| `src/router/index.ts`                      | 改       | +路由 /docs/prim（name='prim'）      |
| `src/views/Docs/Menu/hooks.ts`             | 改       | 图算法 +Prim                         |
| `src/views/Home/Main/hooks.ts`             | 改       | 首页网格 +Prim（+PrimIcon）          |
| `src/views/Docs/Menu/hooks.spec.ts`        | 改       | TC-HOOK-02-1：图算法 2→3、url +prim  |
| `src/views/Home/Main/hooks.spec.ts`        | 改       | TC-HOOK-01-1：图算法 2→3、url +prim  |

**零改动**：GraphView.vue（+spec）/ AlgorithmPlayer.vue（+spec）/ Step / Dijkstra / Kruskal 逻辑 / useKruskal 图 / usePlayer / 15 排序 / 15 结构。

## 8. 向后兼容论证

- `PrimExecPoint` 追加；不动 Step / GraphTrack / GraphView / AlgorithmPlayer。
- 新页面 + 新路由 + 菜单/首页加项 → 仅影响 TC-HOOK-01-1 / 02-1（图算法 3 项）；其余 TC-HOOK（分类数 3、数据结构 15、排序 15）不变。
- 复用 useKruskal 图（只读，不改）→ Kruskal 页 + TC-KRUSKAL-\* 零影响。
- GraphView 第 3 消费者（有向 Dijkstra + 无向 Kruskal + 无向 Prim），零改动佐证通用轨设计。

## 9. 测试策略（详见 test-cases.md）

- **L3 prim.module**：末步 mst 边 = {AC,BC,BD,DE,DF}、weight=18；**与 kruskalTrace().mstEdges 同集**（同图同 MST）；order=[AC,BC,BD,DE,DF]；每步带 graph+array:[]；#selectEdge=5、#addVertex=5；init 步 doneNodes=[0]；每 selectEdge 步有且仅 1 条 'current' 边且为横切边；done 步 5 'mst'、doneNodes 全 6；首 addVertex 后 doneNodes 含 C(2)、weight=1；4 语言行号；元信息。
- **L4 视图**：TC-VIEW-PRIM-01 Article+AlgorithmPlayer；-02 h1「Prim」+GraphView+6 节点+无 .bars-view；-03 全模板同屏（Article 含「最小生成树」+ ≥9 .graph-edge）。
- **L4 TC-HOOK**：TC-HOOK-01-1/02-1 图算法 3 项、url=['dijkstra','kruskal','prim']。
- **L5 e2e**：TC-E2E-PRIM-01 /docs/prim → .graph-view + 6 .graph-node + 9 .graph-edge；拖末步 5 .graph-edge.mst + caption 含「18」；Shiki。
- **复用**：TC-VIZ-GRAPHVIEW-\* / TC-PLAYER-GRAPH-\* / TC-KRUSKAL-\* 零改动全绿。
