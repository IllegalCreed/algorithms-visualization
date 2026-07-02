# 设计：Kruskal 接入算法播放器（复用 GraphView 轨，M8②-2 · 收官 M8）

> Status: verified
> Stable ID: C-20260702-048
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Kruskal.vue
   │  <Article> 正文（保留原 C-038 讲解）
   │  <AlgorithmPlayer :module="kruskalModule" />   ← 替换 <Playground><KruskalViz/></Playground>
   ▼
算法模块 src/algorithms/
   kruskal.module.ts   buildKruskalSteps + kruskalModule（复用 useKruskal 图、细粒度重走）
   kruskal.ts          oracle kruskalTrace()→{mstEdges,totalWeight,rejected}（薄封装 useKruskal().run()）
   kruskal.sources.ts  4 语言 + lineMap

框架扩展（additive，唯一一处）：
   player/types.ts   +KruskalExecPoint

零改动复用（C-047 建）：
   GraphView.vue     —— 已支持 directed:false（无箭头）+ .current/.mst/.rejected 边样式
   AlgorithmPlayer.vue —— <GraphView v-if="current.graph"> + BarsView v-if（array:[] 不显）

删除（superseded）：KruskalViz.vue + KruskalViz.spec.ts（Cases 标 superseded）
保留：useKruskal.ts（+spec）——被 module 复用为图数据 + oracle

不改：GraphView/AlgorithmPlayer/Step/Dijkstra/路由/菜单/首页/图标/TC-HOOK；既有 7 轨/15 排序/15 结构
```

## 2. 类型扩展（additive，唯一框架改动）

```ts
// types.ts 追加（与 DijkstraExecPoint 并列）
export type KruskalExecPoint =
  | 'init' // 边按权升序排好，MST 空、并查集各自为组
  | 'consider' // 取下一条最短边，查两端是否已连通（current 黄）
  | 'accept' // 两端不连通 → 加入 MST（mst 绿）+ union
  | 'reject' // 两端已连通 → 成环跳过（rejected 虚线）
  | 'done'; // V-1 条边选齐，MST 完成
```

`GraphTrack` / `Step.graph?` **零改动**（C-047 已定，字段通用覆盖 Kruskal）。

## 3. GraphView 复用（零改动验证）

Kruskal 用到的 GraphView 能力**全部已就位**（C-047）：

| Kruskal 需求         | GraphTrack 字段             | GraphView 现有支持                   |
| -------------------- | --------------------------- | ------------------------------------ |
| 无向图（不画箭头）   | `directed: false`           | `marker-end` 仅 `directed` 时挂 ✓    |
| 当前考虑边（黄高亮） | `edgeClass[key]='current'`  | `.graph-edge.current line` 黄粗 ✓    |
| 已选 MST 边（绿）    | `edgeClass[key]='mst'`      | `.graph-edge.mst line` 绿粗 ✓        |
| 成环跳过边（虚线灰） | `edgeClass[key]='rejected'` | `.graph-edge.rejected line` 虚线 ✓   |
| 已并入森林的点（绿） | `doneNodes: number[]`       | `.graph-node.done circle` 深绿 ✓     |
| 无 dist 徽标         | `nodeBadge` 省略            | `v-if="badgeOf(id)!==null"` 不渲染 ✓ |

→ **GraphView.vue / GraphView.spec.ts 不改**；仅在 kruskal.module 里正确填 GraphTrack。

## 4. 算法模块 `kruskal.module.ts`

```ts
import { useKruskal } from '@/components/structures/useKruskal';
export const kruskalModule: AlgorithmModule<KruskalExecPoint> = {
  title: 'Kruskal 最小生成树',
  initialInput: () => [], // 图算法无数组输入；buildSteps 用固定图
  buildSteps: buildKruskalSteps,
  sources: kruskalSources,
};
```

- 从 `useKruskal()` 取 `vertices/edges`（固定 6 点 9 边无向图，边已按权升序）。
- **并查集自持**（module 内重走，同 useKruskal 逻辑）：`parent[]` + `find`。
- **细粒度重走**：
  - `init`：MST 空、rejected 空、weight 0；graph edgeClass 全空、doneNodes 空。
  - 遍历 9 条边 e：`consider`（edgeClass[e.id]='current'，查 find(u)/find(v)）→ 不连通 `accept`（union、mst.push、weight+=w、edgeClass[e.id]='mst'、doneNodes 并入 u/v）/ 连通 `reject`（rejected.push、edgeClass[e.id]='rejected'）。
  - `done`：全部考虑完；edgeClass 定格（mst 绿 5 条 + rejected 虚线 4 条）；caption 含总权 18。
- **edgeClass 累积**：已 accept 的边保持 'mst'、已 reject 的保持 'rejected'、当前边 'current'（consider 步）。helper 每步重算：`mst.forEach(id=>cls[id]='mst'); rejected.forEach(id=>cls[id]='rejected'); if(considering) cls[cur]='current'`。
- **每步**：`array:[]`、`pointers:[]`、`emphasis:{}`、`graph:GraphTrack`、`vars`（当前边 / 已选边数 x/5 / MST 权重 / 成环数）、`point`、`caption`。
- 手算终态：MST=[AC,BC,DE,BD,DF]，weight=1+2+3+5+7=18，rejected=[AB,CE,EF,CD]。步数 = init 1 + 9 边 ×（consider + accept/reject = 2）+ done 1 = **20 步**。

## 5. oracle + sources

```ts
// kruskal.ts —— 薄封装，复用 useKruskal 逻辑作正确性参照
export interface KruskalTrace {
  mstEdges: string[]; // ['AC','BC','DE','BD','DF']
  totalWeight: number; // 18
  rejected: string[]; // ['AB','CE','EF','CD']（末步）
}
export function kruskalTrace(): KruskalTrace { ... useKruskal().run() ... }
```

sources 4 语言：排序边 + 并查集 Kruskal（find/union/accept/reject）。TS 骨架 lineMap：`{ init, consider, accept, reject, done }`；python/go/rust 逐行核对。

## 6. 视图返工 `Kruskal.vue`

```vue
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { kruskalModule } from '@/algorithms/kruskal.module';
</script>
<template>
  <Article>
    …保留原正文（什么是 MST / Kruskal 怎么做 / 在哪里用 + 切分定理 Callout），
    把「点下一步」引导句轻微调整指向播放器…
    <AlgorithmPlayer :module="kruskalModule" />
    <!-- 替换 <Playground><KruskalViz/></Playground> -->
    …
  </Article>
</template>
```

## 7. 组件清单与改动面

| 文件                                           | 类型       | 改动                                          |
| ---------------------------------------------- | ---------- | --------------------------------------------- |
| `src/components/player/types.ts`               | 改（追加） | +KruskalExecPoint（唯一框架改动）             |
| `src/algorithms/kruskal.module.ts`             | **新增**   | buildKruskalSteps + module                    |
| `src/algorithms/kruskal.ts`                    | **新增**   | oracle（封装 useKruskal）                     |
| `src/algorithms/kruskal.sources.ts`            | **新增**   | 4 语言 + lineMap                              |
| `src/algorithms/kruskal.module.spec.ts`        | **新增**   | TC-KRUSKAL-MOD-\*                             |
| `src/views/Article/Algorithm/Kruskal.vue`      | 改（返工） | 自建 viz → AlgorithmPlayer（正文保留）        |
| `src/views/Article/Algorithm/Kruskal.spec.ts`  | 改（改写） | TC-VIEW-KRUSKAL-01/02（Article+Player+Graph） |
| `e2e/kruskal.e2e.ts`                           | 改（改写） | 播放器交互（.graph-view/.scrub/末步）         |
| `src/components/structures/KruskalViz.vue`     | **删除**   | superseded（git 存档）                        |
| `src/components/structures/KruskalViz.spec.ts` | **删除**   | superseded（TC-VIZ-KRUSKALVIZ-\* 标废）       |

**零改动**：GraphView.vue（+spec）/ AlgorithmPlayer.vue（+spec）/ Step / DijkstraExecPoint / usePlayer / 15 排序 / 15 结构 / useKruskal（保留复用）/ 路由 / 菜单 / 首页 / 图标 / TC-HOOK。

## 8. 向后兼容论证

- `KruskalExecPoint` 追加，与 `DijkstraExecPoint` 并列；不动 Step / GraphTrack。
- GraphView 已通用（C-047 验证有向 Dijkstra；本变更验证无向 Kruskal）——`directed:false` 分支 + current/mst/rejected 类此前已写好样式，本变更是其**首个无向消费者**（`TC-VIZ-GRAPHVIEW-*` 已覆盖 relaxed/tree，mst/rejected 样式由 Kruskal e2e + 真机验证）。
- KruskalViz 删除：仅其自身 Case（TC-VIZ-KRUSKALVIZ-\*，标 superseded）+ Kruskal 页 Case（改写）受影响；useKruskal 保留、其 Case 不动。
- 无路由/菜单变化 → TC-HOOK 不动。

## 9. 测试策略（详见 test-cases.md）

- **L3 kruskal.module**：末步 mstEdges=oracle=[AC,BC,DE,BD,DF]、weight=18、rejected=[AB,CE,EF,CD]；每步带 graph + array:[]；#consider=9；#accept=5、#reject=4；init 步 MST 空；accept 步 edgeClass 该边 'mst'；reject 步该边 'rejected'；consider 步该边 'current'；done 步 mst 边 5 条绿、rejected 4 条；4 语言行号；元信息 title 含 Kruskal、initialInput()=[]。
- **L4 视图**：TC-VIEW-KRUSKAL-01 Article + AlgorithmPlayer；-02 h1「Kruskal」+ GraphView + 6 节点 + 无 .bars-view；-03 全模板同屏（Article 含「最小生成树」+ ≥9 .graph-edge）。
- **L5 e2e**：TC-E2E-KRUSKAL-01 访问 /docs/kruskal → .graph-view 可见 + 6 .graph-node + 9 .graph-edge；.scrub 拖末步 → 5 .graph-edge.mst + 4 .graph-edge.rejected + caption 含「18」；真机 Shiki 着色。
- **复用**：C-047 的 TC-VIZ-GRAPHVIEW-\* / TC-PLAYER-GRAPH-\* 零改动全绿（GraphView/AlgorithmPlayer 不动）。
