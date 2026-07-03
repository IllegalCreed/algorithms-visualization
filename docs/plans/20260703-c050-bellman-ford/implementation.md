# 实现记录：Bellman-Ford 最短路（C-20260703-050，M6 图算法 G3）

> Status: verified
> Stable ID: C-20260703-050
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 类型扩展**：types.ts +BellmanFordExecPoint（唯一框架改动，纯追加）。
2. **T1 module + oracle + sources**（L3）：先 bellman-ford.module.spec（TC-BELLMAN-MOD-01..12）跑红 → bellman-ford.{ts〈图数据+oracle〉,sources.ts,module.ts}（V−1 轮松弛）跑绿。
3. **T2 新页 + 接线**：Bellman.vue（Article + AlgorithmPlayer）；路由 /docs/bellman-ford；菜单 + 首页 +Bellman-Ford（新 bellman.svg）；改 TC-HOOK-01-1/02-1（图算法 3→4）；Bellman.spec + bellman-ford.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap M6 G3）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 唯一框架改动**：types.ts +`BellmanFordExecPoint`（init/roundStart/relaxUpdate/relaxSkip/done 5 点）。**GraphView.vue / AlgorithmPlayer.vue / Step / GraphTrack 零改动**——GraphView 第 4 消费者（有向 Dijkstra + 无向 Kruskal + 无向 Prim + 有向含负权 Bellman-Ford）。
- **T1 module + 图数据 + oracle**：`bellman-ford.ts`（含负权固定有向图 5 点 7 边 + oracle `bellmanFordTrace`；图数据 export 供 module/oracle/spec 共用）+ `bellman-ford.sources.ts`（4 语言标准 Bellman-Ford）+ `bellman-ford.module.ts`（V−1=4 轮逐边松弛，每边一步 relaxUpdate/relaxSkip，当前边 current 黄）。终态 dist=[0,4,1,3,1]、最短路树 {A→B,B→C,C→D,D→E}。
  - **边序逆序设计**：edges 排 `D→E,C→D,C→E,B→C,B→D,A→B,A→C`（远端在前），迫使松弛按轮次向外传播——需走满 V−1=4 轮才收敛，直观演示"为什么要 V−1 轮"（逐轮 dist：R1[0,4,5,∞,∞]→R2[0,4,1,7,9]→R3[0,4,1,3,5]→R4[0,4,1,3,1]）。
  - **nodeBadge**：dist（'∞'/数字），负权路径使 dist 逐轮下降；doneNodes 仅 done 步全亮；activeNode=松弛终点。
- **T2 新页 + 接线**：Bellman.vue（Article 正文含「Dijkstra vs Bellman-Ford」对照 + 负环检测一句 + AlgorithmPlayer）；路由 `/docs/bellman-ford`；菜单 + 首页 +Bellman-Ford（新 `bellman.svg`：最短路图 + 负权「−」徽标区别于 Dijkstra）；改 TC-HOOK-01-1/02-1（图算法 3→4）。Bellman.spec + bellman-ford.e2e。

### 坑点

- **type-check：spec numBadge 参数类型**：`GraphTrack.nodeBadge` 是 `(string|null)[]`，spec 里 `nodeBadge!.map(numBadge)` 传入 `string|null`，而 `numBadge:(b:string)` 只收 string → TS2345。改 `numBadge:(b:string|null)`（null 与 '∞' 同视 Infinity）后过。module 逻辑本身 12 用例首跑即绿。
- **GraphView 通用轨四验成立**：有向正权（Dijkstra）、无向（Kruskal/Prim）、有向含负权（Bellman-Ford）——四消费者零改动。负权由权重标签直接显示负数（如 −3），无需新样式。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：138 文件 **985 passed**（+15：bellman.module 12 + Bellman 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 93.72% / Branch 92.23% / Func 94.21% / Line 94.58%**。GraphView/AlgorithmPlayer 零改动。
- **e2e**：Playwright **42 passed**（+1 TC-E2E-BELLMAN-01）。
- **真机自检**（Playwright 脚本，`/docs/bellman-ford`）：
  - 首步——5 节点 7 边、**有箭头（有向 ✓）**、counter `1/34`、无 `.bars-view`、Shiki **94 token**、**边权含负数 -2/-3**。
  - 末步（scrub→max=33）——counter `34/34`、徽标 **[0,4,1,3,1]（= oracle）**、**4 `.graph-edge.tree`（绿边 A→B,B→C,C→D,D→E）**、**5 点全 `.done`**、字幕「4 轮完成…dist=[0,4,1,3,1]，最短路树已定」。截图确认最短路经负权边 A→B→C→D→E=1。
- **零回归**：既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + Kruskal + Prim + 播放器各轨 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 types +BellmanFordExecPoint + T1 bellman-ford.module（V−1 轮松弛 34 步含负权）+ T2 新页 Bellman.vue + 路由/菜单/首页接线 + TC-HOOK（图算法 3→4）。**零框架改动复用 C-047 GraphView 有向轨（第 4 消费者）+ 新建含负权固定图与 Dijkstra 配对**。门禁全绿（单测 985 / e2e 42 / 覆盖率 93.72%）；真机首末步核对 dist=[0,4,1,3,1]、负权边可见、V−1 轮收敛无误。M6 图算法 G3 达成。
