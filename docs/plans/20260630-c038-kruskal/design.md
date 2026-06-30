# 设计：Kruskal 最小生成树（固定无向带权图 + 并查集判环 + 单步演示）

> Status: verified
> Stable ID: C-20260630-038
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/Algorithm/Kruskal.vue   ← 复用 C-037 建的 Algorithm 目录
   │  正文 + <Playground><KruskalViz/></Playground> + 思想/复杂度/用途正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增；不改 C-037 DijkstraViz / C-029 useUnionFind）
     KruskalViz.vue  ── 用 ── useKruskal.ts（固定无向带权图 + 内置并查集 + 纯 run/steps，可单测）

图算法分类追加第 2 项 + 4 处接线（不新建分类）：
  Docs/Menu/hooks.ts   图算法分类 children 追加 {title:'Kruskal 最小生成树', url:'kruskal'}
  Home/Main/hooks.ts   图算法分类 children 追加 {title:'Kruskal 最小生成树', desc, icon:KruskalIcon, url:'kruskal'}
  router/index.ts      +/docs/kruskal  name 'kruskal'（懒加载 Article/Algorithm/Kruskal.vue）
  assets/kruskal.svg   1024 viewBox 黑剪影图标
改 TC-HOOK-01-1（Home + Menu 两处）：图算法分类 children 1→2、含 kruskal
```

## 2. Kruskal 逻辑 `useKruskal.ts`（固定无向带权图 + 内置并查集 + 纯 run/steps）

```ts
export interface KVertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface KEdge {
  id: string;
  u: number;
  v: number;
  w: number;
} // id = 端点 label 对，如 'AC'
export interface KruskalStep {
  consideredIdx: number; // 本步考虑的边在排序表中的下标（step0 为 -1）
  current: KEdge | null; // 本步考虑的边（step0 为 null）
  accepted: boolean | null; // 加入(true) / 成环跳过(false) / step0(null)
  mst: string[]; // 到本步为止已加入 MST 的边 id（升序考虑序）
  rejected: string[]; // 到本步为止因成环被跳过的边 id
  weight: number; // 当前 MST 权重和
}
export interface UseKruskal {
  vertices: KVertex[]; // 6 个 A–F，固定坐标
  edges: KEdge[]; // 9 条无向带权边，已按权升序
  run: () => { steps: KruskalStep[]; mstEdges: string[]; totalWeight: number };
}
```

固定无向带权图（权重两两不同 → 排序唯一、过程确定）：

```
顶点：A0 B1 C2 D3 E4 F5
边(已按权升序)：A-C 1 | B-C 2 | D-E 3 | A-B 4 | B-D 5 | C-E 6 | D-F 7 | E-F 8 | C-D 9
布局坐标：A(60,150) B(180,60) C(180,240) D(320,60) E(320,240) F(440,150)
```

- **run()**（标准 Kruskal）：边已按权升序；内置并查集（parent 数组，find + union）。逐条边：`if find(u)≠find(v): 加入 MST + union(u,v)；else: 成环跳过`。每条边产出一个 step 快照（step0 为初始）。
- **手算结果**（本固定图，并查集逐条判环）：

| step | 考虑边  | find 两端 | 判定           | MST（累计）      | 权重 |
| ---- | ------- | --------- | -------------- | ---------------- | ---- |
| 0    | —       | —         | 初始           | []               | 0    |
| 1    | A-C (1) | 不同      | **加入**       | [AC]             | 1    |
| 2    | B-C (2) | 不同      | **加入**       | [AC,BC]          | 3    |
| 3    | D-E (3) | 不同      | **加入**       | [AC,BC,DE]       | 6    |
| 4    | A-B (4) | **同**    | 成环跳过       | [AC,BC,DE]       | 6    |
| 5    | B-D (5) | 不同      | **加入**       | [AC,BC,DE,BD]    | 11   |
| 6    | C-E (6) | **同**    | 成环跳过       | [AC,BC,DE,BD]    | 11   |
| 7    | D-F (7) | 不同      | **加入**（满） | [AC,BC,DE,BD,DF] | 18   |
| 8    | E-F (8) | **同**    | 成环跳过       | [AC,BC,DE,BD,DF] | 18   |
| 9    | C-D (9) | **同**    | 成环跳过       | [AC,BC,DE,BD,DF] | 18   |

- 结果：**mstEdges = [AC,BC,DE,BD,DF]（5 条 = V−1），totalWeight = 18**；跳过（成环）= [AB,CE,EF,CD]。
- steps 长度 **10**（step0 初始 + 9 条边）。

> **教学亮点**：边按权从小到大贪心取，靠并查集一眼判出「两端是否已连通」——已连通就会成环、必须跳过（A-B/C-E/E-F/C-D 4 次）。这正是并查集（C-029）的经典应用。

## 3. Kruskal 互动组件 `KruskalViz.vue`

### 3.1 结构与布局

```
.kruskal-viz (column, center)
 ├─ .toolbar     下一步 / 重置 + 步数 (k/9) + 已选 N 条·权重 W
 ├─ .lane-wrap   居中：SVG 无向带权图
 │   └─ <svg> <g.edges> .kedge × 9（line + 权重 text；.current 本步考虑 / .mst 已加入 / .cycle 成环）
 │            <g.verts> .kvert × 6（circle + label）
 ├─ .edge-list   9 行 .ke-row（按权升序）：每行「端–端  权」；.current / .mst / .cycle 同步高亮
 └─ .status      状态解说行（考虑哪条边 + 加入/成环 + 已选 N 条权重和 W）
```

- 坐标用 `vertices[i].x/y`；无向边 line 两端；边权 text 放中点偏移。
- `stepIndex`（0..9）指向 `run().steps`；当前 step 决定图与列表的所有高亮。

### 3.2 交互与动画

- **下一步**：`stepIndex = min(stepIndex+1, 9)`（同步）→ 当前 step 重算高亮 + status：
  - 初始：`边已按权重从小到大排好，点「下一步」依次考虑——不成环就加入。｜已选 0 条，权重和 0`
  - 加入：`考虑 ${edge}（权 ${w}）：两端不连通 → 加入生成树。｜已选 ${n} 条，权重和 ${W}`（MST 满 5 时附「✓ 最小生成树完成」）
  - 成环：`考虑 ${edge}（权 ${w}）：两端已连通 → 加入会成环，跳过。｜已选 ${n} 条，权重和 ${W}`
  - 到 9 后「下一步」禁用。
- **重置**：`stepIndex=0`、status 复位。始终可点。
- 高亮全部由 `steps[stepIndex]` 推导（mst / rejected / current）。同步置态，L4 直接断言。

### 3.3 视觉映射

| 元素        | 态      | 颜色 / 处理                   |
| ----------- | ------- | ----------------------------- |
| 顶点        | —       | 圆形浅绿 `#8bd3a0`            |
| 边 / 列表行 | 普通    | 半透明灰                      |
| 边 / 列表行 | current | 橙描边 `#f0a000`（本步考虑）  |
| 边 / 列表行 | mst     | 绿 `#2e7d32` 加粗（已加入）   |
| 边 / 列表行 | cycle   | 红 `#e0631b` 虚线（成环跳过） |

## 4. Kruskal 页 `Kruskal.vue` 正文大纲

```
<h1>Kruskal 最小生成树</h1><p class="sub">图算法 · 最小生成树（MST）</p>
<h2>什么是最小生成树</h2><p>无向带权连通图里，选若干边把所有点连起来、不成环、总权重最小，就是最小生成树。</p>
<h2>Kruskal 怎么做</h2>
<p>把所有边按权重从小到大排序，依次考虑：用并查集判这条边两端是否已连通——没连通就加入（并合并两端），已连通就跳过（加它会成环）。选够 V-1 条边即完成。</p>
<p>下面固定一张 6 点无向带权图。点「下一步」按权从小到大逐条考虑，看哪些边加入、哪些因成环被跳过，最后得到总权重最小的生成树。</p>
<Playground><KruskalViz/></Playground>
<p>为什么贪心取最小成立？因为每次取的是「不成环的最小边」，由「切分定理」保证它一定属于某棵最小生成树。判环用并查集，O(α) 近似常数。整体复杂度由排序主导 O(E log E)。判环正是并查集的经典应用。</p>
<h2>Kruskal 在哪里用</h2>
<Callout>电网 / 网络 / 道路的最省布线；聚类（最大边切断）；近似算法基础。另一种 MST 算法是 Prim（从点集生长）。</Callout>
<p>它把「贪心 + 并查集」用得很漂亮——想复习并查集怎么合并/找根，可回看 数据结构 · 并查集。</p>
```

## 5. 组件清单与改动面

| 文件                                       | 类型       | 改动                                           |
| ------------------------------------------ | ---------- | ---------------------------------------------- |
| `src/components/structures/useKruskal.ts`  | **新增**   | 固定无向带权图 + 内置并查集 + 纯 run/steps     |
| `src/components/structures/KruskalViz.vue` | **新增**   | SVG 图 + 边排序列表 + 单步判环演示             |
| `src/views/Article/Algorithm/Kruskal.vue`  | **新增**   | Kruskal 知识页                                 |
| `src/router/index.ts`                      | 改（接线） | +`/docs/kruskal` name `kruskal`                |
| `src/views/Docs/Menu/hooks.ts`             | 改（接线） | 图算法分类 children 追加 Kruskal               |
| `src/views/Home/Main/hooks.ts`             | 改（接线） | 图算法分类 children 追加 Kruskal + KruskalIcon |
| `src/assets/kruskal.svg`                   | **新增**   | 1024 viewBox 黑剪影图标                        |
| `src/views/Home/Main/hooks.spec.ts`        | 改（计数） | TC-HOOK-01-1 图算法 children 1→2 + kruskal     |
| `src/views/Docs/Menu/hooks.spec.ts`        | 改（计数） | TC-HOOK-01-1（Menu 版）同上                    |

**零改动**：C-037 `useDijkstra`/`DijkstraViz`；C-029 `useUnionFind`；既有 15 结构页 / 8 排序 / 骨架 / 播放器 / store。

## 6. 向后兼容论证

- 全新文件 + 图算法分类追加第 2 项 + 4 处接线为**追加**（既有顺序不变、url 唯一）。
- 改动仅 TC-HOOK-01-1 两处（图算法 children 1→2）——分类加算法的合理变化，非回归；其余既有 Case 零改动通过。
- 新页 name `kruskal` = 菜单 url；放入既有 Algorithm 目录、不影响既有路由；SPA 404 通用。
- 新增 `TC-KRUSKAL-*` / `TC-VIZ-KRUSKALVIZ-*` / `TC-VIEW-KRUSKAL-01/02` / `TC-E2E-KRUSKAL-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useKruskal`：6 顶点 + 9 边 + 边按权升序；run().mstEdges=[AC,BC,DE,BD,DF]、totalWeight=18；steps 长 10；steps[0] mst 空；steps[4]（考虑 A-B）accepted=false reason cycle；steps[5]（B-D）accepted=true mst 含 BD；steps[7]（D-F）mst 5 条；跳过边集=[AB,CE,EF,CD]。
- **L4 互动** `TC-VIZ-KRUSKALVIZ-*`：6 .kvert + 9 .kedge + 9 .ke-row + 下一步/重置；初始 .kedge.mst 0；下一步 1 次 mst 1 + status 含「加入」；下一步 4 次考虑 A-B 成环 status 含「成环」+ .kedge.cycle ≥1；走到底 mst 5 + status 含 18 + .kedge.cycle 4；当前考虑边 .kedge.current ≥1；重置回初始。
- **L4 视图** `TC-VIEW-KRUSKAL-01/02`：含 Article + KruskalViz + Playground；「Kruskal」标题。
- **L5 e2e** `TC-E2E-KRUSKAL-01`：`/docs/kruskal` 限定 `.kruskal-viz`：6 顶点、连点下一步到底 status 含「18」、重置。
- **改** `TC-HOOK-01-1`（Home + Menu）：图算法分类含 dijkstra + kruskal（2 项）。
