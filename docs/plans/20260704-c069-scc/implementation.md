# 实现记录：强连通分量 Tarjan（C-20260704-069，扩展 GraphView）

> Status: verified
> Stable ID: C-20260704-069
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 GraphView 扩展**（L4）：types.ts `GraphTrack` +`nodeGroup?`/`stackNodes?`、+`TarjanExecPoint`；先 GraphView.spec 追加 TC-VIZ-GRAPHVIEW-SCC-01/02 跑红 → GraphView.vue（nodeGroup 调色板 inline fill + stackNodes .on-stack 虚线环）跑绿。既有 GRAPHVIEW 用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 scc.module.spec（TC-SCC-MOD-01..12）跑红 → scc.{ts,sources.ts,module.ts}（Tarjan 一趟 DFS dfn/low/栈）跑绿。
3. **T2 新页 + 接线**：Scc.vue（Article + AlgorithmPlayer）；路由 /docs/scc；菜单 + 首页「图算法」第 7 项（新 scc.svg）；改 TC-HOOK（图算法 6→7）；Scc.spec + scc.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 图算法第 7 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **GraphView 扩成支持 SCC 着色（第 6 消费者，全 additive）**：`GraphTrack` +`nodeGroup?`（组号 → GROUP_PALETTE inline fill，null→中性灰）+`stackNodes?`（`.on-stack` 虚线琥珀环，与 active 实线环区分）。复用 `nodeBadge` 显 `dfn/low`、`activeNode` 当前节点、`edgeClass`（树边绿 tree / 当前回边黄 current）。既有图算法不传新字段 → 渲染不变，`TC-VIZ-GRAPHVIEW-01..04` + 6 图算法零回归。
- **复用 Step.graph，无新 Step 字段**：scc.module 产出 `Step<TarjanExecPoint>`，AlgorithmPlayer 已按 `current.graph` 渲染 GraphView，零改动。栈内容另在 vars 文本呈现（`[0, 1, 2, …]`）。
- **Tarjan 一趟 DFS 逐事件重走**：`enter u`（dfn=low=idx++、入栈、树边高亮）→ 邻 v 未访问递归后 `tree`（low=min(low,子low)）/ v 在栈 `back`（low=min(low,dfn[v])、回边黄）→ `low[u]==dfn[u]` 弹栈成 SCC（`scc`，nodeGroup 着色）→ `done`。固定 6 点有向图（0→1→2→0 环 + 2→3 + 3→4→3 环 + 4→5）→ 3 个 SCC {0,1,2}/{3,4}/{5}，17 步。oracle `tarjanSCCs()`/`tarjanDfnLow()` 独立 Tarjan 对拍。
- **四语言 sources**：TS/Python/Go/Rust 标准 Tarjan（dfn/low + 栈 + onStack），lineMap 对齐 enter/tree/back/scc/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓（0 warning）/ `type-check`（vue-tsc）✓ / `test:unit run --coverage` **1316/1316 全绿**、聚合 statements 95.16% · branches 94.58%（远超门槛）；`scc.*` 满覆盖（v8 text 隐藏）。
- **e2e（真机 Playwright/Chromium）**：`scc` + 回归 `dijkstra` **2/2 通过**——6 节点图、无柱数组、Shiki 着色、拖末步 caption 含 3 + 栈空（0 .on-stack）。
- **真机视觉自检（1 图眼验）**：末步 17/17——3 个 SCC 三色分明（{0,1,2} 绿 / {3,4} 橙 / {5} 蓝）、dfn/low 徽标 `0/0 1/0 2/0 3/3 4/3 5/5`（= oracle）、绿 DFS 树边、栈空、字幕「共 3 个强连通分量」。
- **回归**：GraphView 仅 additive（6 图算法零回归）；Dijkstra/Kruskal/Prim/Bellman-Ford/Topo/Floyd 现有 Case 不变全绿；仅 `TC-HOOK`（图算法 6→7）追加 `scc`。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；18 Case + 改 2 HOOK 全绿、双轨部署。
