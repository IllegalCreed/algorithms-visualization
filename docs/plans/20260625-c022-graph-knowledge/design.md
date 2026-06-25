# 设计：图 Graph 知识页（无向图 + SVG 二维 + BFS/DFS 遍历，复用知识页骨架）

> Status: verified
> Stable ID: C-20260625-022
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Graph.vue   （页面：手写正文 + 内嵌互动组件）
   │  <Article> … <Playground><GraphViz/></Playground> …
   ▼
┌─ 排版骨架（复用 C-015，零改动）：Article / Callout / Playground
└─ 互动组件（src/components/structures/，新增）
     GraphViz.vue  ── 用 ── useGraph.ts（固定无向图 + 纯 BFS/DFS，可单测）
```

`use{Stack,Queue,Array,Link,Tree,Heap,Hash,Graph}` 八组互动逻辑并列在 `structures/` 下，互不依赖。骨架零改动。**M3 数据结构系列收官（8/8）**。

## 2. 图逻辑 `useGraph.ts`（固定无向图 + 纯 BFS/DFS，可单测）

```ts
export interface Vertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface TraverseStep {
  visit: number; // 本步访问的顶点
  frontier: number[]; // 访问后队列/栈的当前内容
}
export interface UseGraph {
  vertices: Vertex[]; // 6 个，固定坐标
  edges: [number, number][]; // 7 条无向边（顶点 id 对）
  adj: number[][]; // 邻接表（每个顶点的邻居 id，升序）
  labelOf: (i: number) => string;
  bfs: (start: number) => TraverseStep[]; // 队列：FIFO
  dfs: (start: number) => TraverseStep[]; // 栈：邻居逆序入栈
}
export function useGraph(): UseGraph;
```

固定图（0=A..5=F）：

```
ADJ   = [[1,2],[0,3],[0,4],[1,4,5],[2,3,5],[3,4]]
EDGES = [[0,1],[0,2],[1,3],[2,4],[3,4],[3,5],[4,5]]   // 7 条
布局   A 顶、B/C 上、D/E 下、F 底（六边形，无交叉）；D-E-F 三角环 + A 经 B-D / C-E 两臂下接
```

- `bfs(s)`：`visited={s}; q=[s]`；`while q`: `u=q.shift()`；邻居未访问者入队并标记；`steps.push({visit:u, frontier:[...q]})`。→ 顺序 `0,1,2,3,4,5`（A B C D E F）。
- `dfs(s)`：`visited={s}; st=[s]`；`while st`: `u=st.pop()`；邻居**逆序**未访问者入栈并标记；`steps.push({visit:u, frontier:[...st]})`。→ 顺序 `0,1,3,4,5,2`（A B D E F C）。
- 两者均「入栈/队即标记」→ frontier 无重复；均访问全部连通顶点、不重不漏。
- **关键不变量**：BFS 用队列（FIFO，一层层）、DFS 用栈（LIFO，一条道到底）→ 同图不同顺序，正是栈/队列的收官回扣。

> 注：图固定不变（无 reactive 状态），useGraph 返回静态数据 + 纯函数；遍历的点亮/前沿动画由 GraphViz 用 setTimeout 逐步驱动。

## 3. 图互动组件 `GraphViz.vue`

### 3.1 结构与布局（SVG 二维 + 辅助面板）

```
.graph-viz (column, center)
 ├─ .toolbar   BFS 广度优先 / DFS 深度优先 / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽
 │        <svg> <g.edges> <line.edge × 7>      ← 边
 │              <g.verts> <g.vertex × 6>        ← 顶点（circle + text，可点换起点）
 │                  .vertex.is-start / .visited / .current
 ├─ .helper   辅助结构面板
 │     .helper-label「队列 →」/「栈 ↑」 + .slots（.slot × frontier）
 └─ .status   状态解说行（含访问顺序）
```

### 3.2 交互与动画

- **点顶点设起点**：点 `.vertex` → `start=i`（非 busy 时）；清除上次遍历高亮；起点 `.is-start`。
- **BFS / DFS**：`steps = useGraph.bfs(start) / dfs(start)`（同步）→ **同步**置 status（含「队列/栈」+ 完整访问顺序，可测）+ helper 标签 → 逐步动画：依次给访问顶点加 `.current`（强调）→ `.visited`（深绿），并把 `frontier` 渲染进 helper 槽位，间隔 ~800ms。
- **重置**：清高亮 + 复位起点 A；**可中断**进行中遍历（清计时器 + 解锁 busy）。
- 分步用 `setTimeout`（卸载清理、`busy` 防重入）；顺序结果同步、L4 可断言。

### 3.3 视觉映射

| 元素    | 态       | 颜色 / 处理                 |
| ------- | -------- | --------------------------- |
| 顶点    | idle     | 圆形浅绿 `#8bd3a0` + 深绿字 |
| 已访问  | visited  | 深绿 `#4caf50` + 白字       |
| 当前    | current  | 更深绿 `#2e7d32` + 白环     |
| 起点    | is-start | 主题绿 `#42b883` 描边       |
| 边      | edge     | 半透明灰线（SVG）           |
| 队列/栈 | slot     | 浅绿小格（frontier 内容）   |

## 4. 图页 `Graph.vue` 正文大纲（以原型文案为基础）

```
<Article>
  <h1>图 Graph</h1>
  <p class="sub">数据结构 · 顶点和边的任意连接（最一般的结构）</p>
  <h2>什么是图</h2>
  <p>顶点 + 边、任意连接、可成环/多对多；地图/社交/网页本质都是图…</p>
  <p>遍历两条路线，正好用上队列和栈——选起点点 BFS/DFS…</p>
  <Playground><GraphViz/></Playground>
  <p>BFS 水波（队列、一层层、找最短路）；DFS 走迷宫（栈、一条道到底、探路）…</p>
  <h2>图怎么存 · 在哪里用</h2>
  <p>邻接表（省空间、稀疏图）vs 邻接矩阵（matrix[i][j]=1、查相邻 O(1)）…</p>
  <Callout>路网/导航 · 社交网络 · 依赖/调度</Callout>
  <p>线性到非线性、数据结构这一程走完——都是「怎么组织数据让该快的快起来」。</p>
</Article>
```

关键术语 `<strong>` 高亮，`O(1)`/`matrix[i][j]=1` 类用 `<code>`。

## 5. 组件清单与改动面

| 文件                                        | 类型         | 改动                                                        |
| ------------------------------------------- | ------------ | ----------------------------------------------------------- |
| `src/components/structures/useGraph.ts`     | **新增**     | 固定无向图 + 纯 BFS/DFS（返回步序）                         |
| `src/components/structures/GraphViz.vue`    | **新增**     | 图互动组件（SVG 二维 + 遍历点亮 + 队列/栈辅助面板）         |
| `src/views/Article/DataStructure/Graph.vue` | 改（填空壳） | `<Article>` + 正文 + `<Playground><GraphViz/></Playground>` |

**零改动**：`article/` 骨架 / `structures/use{Stack,Queue,Array,Link,Tree,Heap,Hash}*` / 路由 / 菜单 / 首页 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useGraph`/`GraphViz` 是全新文件，除图页外无人 import → 对其余结构与排序零影响。
- `article/` 骨架原样复用、零改动 → C-015 骨架 Case 逐字不变。
- `Graph.vue` 由空壳变为有内容：此前无指向它的测试；新增 `TC-VIEW-GRAPH-*`。
- 无现存 `GRAPH` Case ID，命名空间干净。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useGraph`（`TC-GRAPH-LOGIC-*`）：图结构（6 顶点/7 边/adj/labels/坐标）；`bfs(0)` 顺序 `[0,1,2,3,4,5]`；`dfs(0)` 顺序 `[0,1,3,4,5,2]`；两者不同；均访问全部 6；BFS 首步 frontier `[1,2]`（队列）、DFS 首步 `[2,1]`（栈）；换起点也遍历全部。
- **L4 互动** `TC-VIZ-GRAPHVIZ-*`：初始 6 顶点 + 7 边 + 3 按钮 + 默认起点高亮；顶点标签 A–F；点顶点换起点（唯一 is-start）；BFS status 含「队列」+ 顺序「A B C D E F」；DFS status 含「栈」+「A B D E F C」；helper 标签队列/栈；重置复位；BFS≠DFS 顺序。
- **L4 视图** `TC-VIEW-GRAPH-*`：图页挂载渲染 `Article` + `GraphViz`、含「图」标题、含 `Playground`。
- **L5 e2e** `TC-E2E-GRAPH-*`：导航 `/docs/graph`、见正文 + Playground；限定 `.graph-viz`：初始 6 顶点 + 7 边、点 BFS status 含「队列」+ 顺序、重置复位。
