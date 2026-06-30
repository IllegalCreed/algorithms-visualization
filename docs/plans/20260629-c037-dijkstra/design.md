# 设计：Dijkstra 最短路（固定带权有向图 + 单步松弛演示 + 新「图算法」顶层分类）

> Status: verified
> Stable ID: C-20260629-037
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/Algorithm/Dijkstra.vue   ← 新建 Algorithm 目录（图算法等放这）
   │  正文 + <Playground><DijkstraViz/></Playground> + 思想/复杂度/用途正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增；不改 C-022 的 useGraph/GraphViz）
     DijkstraViz.vue  ── 用 ── useDijkstra.ts（固定带权有向图 + 纯 run/steps，可单测）

新增「图算法」顶层分类 + 4 处接线：
  Docs/Menu/hooks.ts   useCategoryData 追加第 3 个分类 {title:'图算法', children:[{title:'Dijkstra 最短路', url:'dijkstra'}]}
  Home/Main/hooks.ts   首页追加「图算法」分类组 + {title:'Dijkstra 最短路', desc, icon:DijkstraIcon, url:'dijkstra'}
  router/index.ts      +/docs/dijkstra  name 'dijkstra'（懒加载 Article/Algorithm/Dijkstra.vue）
  assets/dijkstra.svg  1024 viewBox 黑剪影图标
改 TC-HOOK-01-1（Home + Menu 两处）：顶层分类 2→3、data[2].title='图算法'
```

## 2. Dijkstra 逻辑 `useDijkstra.ts`（固定带权有向图 + 纯 run/steps）

```ts
export interface DVertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface DEdge {
  from: number;
  to: number;
  w: number;
}
export interface DijkstraStep {
  justSettled: number | null; // 本步确定的点（step0 为 null）
  settled: number[]; // 到本步为止已确定的点（按确定顺序）
  dist: number[]; // 距离表快照（Infinity 表示不可达）
  relaxed: DEdge[]; // 本步成功松弛（降低 dist）的边
}
export interface UseDijkstra {
  vertices: DVertex[]; // 6 个 A–F，固定坐标
  edges: DEdge[]; // 9 条有向带权边
  adj: DEdge[][]; // 出边邻接表
  source: number; // 源 = 0 (A)
  run: () => { order: number[]; dist: number[]; prev: (number | null)[]; steps: DijkstraStep[] };
  pathTo: (v: number) => number[]; // 沿 prev 还原 源→v 最短路
}
```

固定带权有向图（源 A=0）：

```
顶点：A0 B1 C2 D3 E4 F5
边(起→止,权)：A→B 4 | A→C 1 | C→B 2 | C→D 5 | B→D 1 | B→E 7 | D→E 3 | D→F 6 | E→F 2
出边邻接 adj：
  0: A→B(4), A→C(1)
  1: B→D(1), B→E(7)
  2: C→B(2), C→D(5)
  3: D→E(3), D→F(6)
  4: E→F(2)
  5: （无出边）
布局坐标：A(50,150) B(160,70) C(160,230) D(290,70) E(290,230) F(410,150)
```

- **run()**（标准 Dijkstra，非负权）：dist[源]=0 其余 ∞；反复**取未确定中 dist 最小的点 u 定下来**，松弛 u 的每条出边 `if dist[u]+w < dist[v]: dist[v]=dist[u]+w; prev[v]=u`。返回确定顺序 order、最终 dist、prev、以及**逐步快照 steps**。
- **手算结果**（本固定图）：
  - `order = [0,2,1,3,4,5]`（A→C→B→D→E→F）
  - `dist  = [0,3,1,4,7,9]`（A0 B3 C1 D4 E7 F9）
  - `prev  = [null,2,0,1,3,4]`（B←C, C←A, D←B, E←D, F←E）
  - `pathTo(5) = [0,2,1,3,4,5]`（A→C→B→D→E→F = 9）；`pathTo(4) = [0,2,1,3,4]`
- **steps（7 个：step0 初始 + 6 次确定）**——每步快照供单步演示：

| step | justSettled | settled       | dist                   | relaxed(本步降距的边) |
| ---- | ----------- | ------------- | ---------------------- | --------------------- |
| 0    | null        | []            | [0,∞,∞,∞,∞,∞]          | []                    |
| 1    | 0 (A)       | [0]           | [0,**4**,**1**,∞,∞,∞]  | A→B, A→C              |
| 2    | 2 (C)       | [0,2]         | [0,**3**,1,**6**,∞,∞]  | C→B(4→3), C→D         |
| 3    | 1 (B)       | [0,2,1]       | [0,3,1,**4**,**10**,∞] | B→D(6→4), B→E         |
| 4    | 3 (D)       | [0,2,1,3]     | [0,3,1,4,**7**,**10**] | D→E(10→7), D→F        |
| 5    | 4 (E)       | [0,2,1,3,4]   | [0,3,1,4,7,**9**]      | E→F(10→9)             |
| 6    | 5 (F)       | [0,2,1,3,4,5] | [0,3,1,4,7,9]          | （无）                |

> **教学亮点（松弛更新）**：B 先经 A 得 4，后经 C 降到 3；D 先 6 后 4；E 先 10 后 7；F 先 10 后 9——「先到的不一定最短，会被更短路径反复更新」一目了然。

## 3. Dijkstra 互动组件 `DijkstraViz.vue`

### 3.1 结构与布局

```
.dijkstra-viz (column, center)
 ├─ .toolbar     下一步 / 重置 + 「源 = A」提示 + 步数 (k/6)
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽高
 │        <svg> <defs marker 箭头>
 │              <g.edges> <g.dedge × 9>（line + 权重 text；.relaxed 本步松弛 / .tree 最短路树）
 │              <g.verts> <g.dvert × 6>（circle + label；.settled 已确定 / .just 本步确定）
 ├─ .dist-table  6 格：每格 顶点 label + 当前 dist（∞ 或数字；.upd 本步更新）
 └─ .status      状态解说行
```

- 坐标用 `vertices[i].x/y`；有向边 line 起→止 + `marker-end` 箭头；边权 text 放中点偏移。
- `stepIndex`（0..6）指向 `run().steps`；当前 step 决定所有高亮。

### 3.2 交互与动画

- **下一步**：`stepIndex = min(stepIndex+1, 6)`（同步）→ 当前 step 重算高亮 + status：`确定 ${label}（当前最近，dist=${d}）；松弛 ${relaxed 描述}` ；step6 时 `全部确定：A→F 最短路 = A→C→B→D→E→F，长度 9`。到 6 后「下一步」禁用。
- **重置**：`stepIndex=0`、status 复位。始终可点。
- 高亮全部由 `steps[stepIndex]` 推导（settled / justSettled / relaxed），step6 额外点亮**最短路树**（prev 边）。同步置态，L4 直接断言。

### 3.3 视觉映射

| 元素   | 态         | 颜色 / 处理           |
| ------ | ---------- | --------------------- |
| 顶点   | 未确定     | 浅绿 `#8bd3a0`        |
| 顶点   | settled    | 深绿 `#4caf50` + 白字 |
| 顶点   | just(本步) | 橙描边 `#f0a000`      |
| 边     | 普通       | 半透明灰 + 箭头       |
| 边     | relaxed    | 黄 `#ffcf5c` 加粗     |
| 边     | tree(末)   | 绿 `#2e7d32` 加粗     |
| 距离格 | upd(本步)  | 黄底强调              |

## 4. Dijkstra 页 `Dijkstra.vue` 正文大纲

```
<h1>Dijkstra 最短路</h1><p class="sub">图算法 · 单源最短路径</p>
<h2>什么是最短路</h2><p>带权图里从一个起点到各点的「最短总距离」。逐条试不现实，Dijkstra 给了高效解法（边权非负时）。</p>
<h2>Dijkstra 怎么做</h2>
<p>维护一张「源到各点的当前最短距离」表（源 0、其余 ∞）。反复：取出还没定下来、当前距离最小的点，把它定下来；再用它松弛邻边——经它中转更短就更新邻居距离。每个点定下来时的距离即最终最短距离。</p>
<p>下面固定一张 6 点带权有向图（源 A）。点「下一步」逐步看它怎么取最近点、松弛邻边，注意 B/D/E/F 的距离会被更短路径反复降低。</p>
<Playground><DijkstraViz/></Playground>
<p>为什么「贪心取当前最近」对？因为边权非负，已定点的距离不可能再被更小——后面的路只会更长。复杂度用二叉堆优先队列约 O((V+E)logV)。不能处理负权（那要 Bellman-Ford）。</p>
<h2>Dijkstra 在哪里用</h2>
<Callout>地图 / 导航最短路线；网络路由（OSPF）；任何「非负权图上单源最短路」。</Callout>
<p>它是图算法这条线的开篇——后面还有 Bellman-Ford（负权）、Floyd（多源）、最小生成树、拓扑排序等。</p>
```

## 5. 组件清单与改动面

| 文件                                        | 类型       | 改动                                              |
| ------------------------------------------- | ---------- | ------------------------------------------------- |
| `src/components/structures/useDijkstra.ts`  | **新增**   | 固定带权有向图 + 纯 run/steps/pathTo              |
| `src/components/structures/DijkstraViz.vue` | **新增**   | SVG 带权图 + 距离表 + 单步松弛演示                |
| `src/views/Article/Algorithm/Dijkstra.vue`  | **新增**   | Dijkstra 知识页（新建 Algorithm 目录）            |
| `src/router/index.ts`                       | 改（接线） | +`/docs/dijkstra` name `dijkstra`                 |
| `src/views/Docs/Menu/hooks.ts`              | 改（接线） | useCategoryData 追加第 3 分类「图算法」+ Dijkstra |
| `src/views/Home/Main/hooks.ts`              | 改（接线） | 首页追加「图算法」分类组 + DijkstraIcon           |
| `src/assets/dijkstra.svg`                   | **新增**   | 1024 viewBox 黑剪影图标                           |
| `src/views/Home/Main/hooks.spec.ts`         | 改（计数） | TC-HOOK-01-1 顶层分类 2→3 + 图算法                |
| `src/views/Docs/Menu/hooks.spec.ts`         | 改（计数） | TC-HOOK-01-1（Menu 版）顶层分类 2→3 + 图算法      |

**零改动**：C-022 `useGraph`/`GraphViz`；既有 15 结构页 / 8 排序 / 骨架 / 播放器 / store。

## 6. 向后兼容论证

- 全新文件 + 新增顶层分类 + 4 处接线为**追加**（既有两分类顺序不变、url 唯一）。
- 改动仅 TC-HOOK-01-1 两处（顶层分类 2→3）——新增大类的合理行为变化，非回归；其余既有 Case 零改动通过。
- 新建 `views/Article/Algorithm/` 目录（与既有 `Article/DataStructure`、`Article/SortAlgorithm` 并列），不影响既有路由。
- 新页 name `dijkstra` = 菜单 url；SPA 404 通用、无需改 404.html。
- 新增 `TC-DIJKSTRA-*` / `TC-VIZ-DIJKSTRAVIZ-*` / `TC-VIEW-DIJKSTRA-01/02` / `TC-E2E-DIJKSTRA-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useDijkstra`：6 顶点 + 9 边 + 出边 adj；run().order=[0,2,1,3,4,5]、dist=[0,3,1,4,7,9]、prev=[null,2,0,1,3,4]；pathTo(5)=[0,2,1,3,4,5]、pathTo(4)=[0,2,1,3,4]；steps 长 7、steps[0] 初始 ∞、steps[2] dist=[0,3,1,6,∞,∞] justSettled=2、steps[3] 把 dist[3] 6→4、steps[6] dist=[0,3,1,4,7,9] settled 6。
- **L4 互动** `TC-VIZ-DIJKSTRAVIZ-*`：6 .dvert + 9 .dedge + 距离表 6 格 + 下一步/重置；初始 A=0 余 ∞、settled 0；下一步 1 次 settle A、settled 1、dist 现 4 与 1；下一步 2 次 B 由 4→3（dist 含 3）；走到底 settled 6、dist 含 9、status 含「最短」、出现 .dedge.tree；重置回初始。
- **L4 视图** `TC-VIEW-DIJKSTRA-01/02`：含 Article + DijkstraViz + Playground；「Dijkstra」标题。
- **L5 e2e** `TC-E2E-DIJKSTRA-01`：`/docs/dijkstra` 限定 `.dijkstra-viz`：6 顶点、连点下一步到底 status 含「最短」/「9」、重置。
- **改** `TC-HOOK-01-1`（Home + Menu）：顶层 3 分类、第 3 个「图算法」含 Dijkstra。
