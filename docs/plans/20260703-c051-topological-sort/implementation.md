# 实现记录：拓扑排序（C-20260703-051，M6 图算法 G5）

> Status: verified
> Stable ID: C-20260703-051
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 类型扩展**：types.ts +TopoExecPoint（唯一框架改动，纯追加）。
2. **T1 module + oracle + sources**（L3）：先 topo.module.spec（TC-TOPO-MOD-01..12）跑红 → topo.{ts〈图数据+oracle〉,sources.ts,module.ts}（Kahn 重走）跑绿。
3. **T2 新页 + 接线**：Topo.vue（Article + AlgorithmPlayer）；路由 /docs/topological-sort；菜单 + 首页 +拓扑排序（新 topo.svg）；改 TC-HOOK-01-1/02-1（图算法 4→5）；Topo.spec + topological-sort.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap M6 G5）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 框架改动（additive）**：types.ts +`TopoExecPoint`（init/selectNode/removeNode/done 4 点）；**并将 `GraphTrack.edges` 的 `w` 放宽为可选 `w?: number`**——拓扑排序无权，是首个无权消费者。**GraphView.vue 零改动**：其 `{{ e.w }}` 遇 undefined 渲染空文本（真机确认无 "0"/undefined 伪影）。既有加权图仍传 w，向后兼容。
- **T1 module + 图数据 + oracle**：`topo.ts`（新建非平凡 DAG 6 点 7 边 + Kahn oracle `topoTrace`；图数据 export 共用）+ `topo.sources.ts`（4 语言 Kahn）+ `topo.module.ts`（init 算入度 → 6×(selectNode 取入度 0 最小下标 + removeNode 输出并后继减度) → done，14 步）。拓扑序 C→A→E→B→D→F=[2,0,4,1,3,5]（非平凡，含并列取最小下标 tiebreak）。
  - **nodeBadge=当前入度**（随减度下降）、**doneNodes=已输出点**（绿）、activeNode=当前点（琥珀环）、edgeClass=当前点出边 'current'（黄）。
- **T2 新页 + 接线**：Topo.vue（Article 正文：什么是拓扑序/Kahn 怎么做/应用〈课程·构建·电子表格〉/有环无解 + 队列·图互链 + AlgorithmPlayer）；路由 `/docs/topological-sort`；菜单 + 首页 +拓扑排序（新 `topo.svg`：左→右分层 DAG + 箭头体现顺序）；改 TC-HOOK-01-1/02-1（图算法 4→5）。Topo.spec + topological-sort.e2e。

### 坑点

- **无权图与 GraphTrack.w**：见上——`w?: number` 放宽 + GraphView 空文本渲染，零改 GraphView.vue 支持无权图。是本变更唯一"框架侧"调整（纯类型放宽，向后兼容）。
- **GraphView 通用轨五验成立**：有向正权（Dijkstra）、有向负权（Bellman-Ford）、无向（Kruskal/Prim）、**有向无权（拓扑排序）**——五消费者，GraphView.vue 始终零改动（仅类型渐进放宽）。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：140 文件 **1000 passed**（+15：topo.module 12 + Topo 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 93.78% / Branch 92.32% / Func 94.24% / Line 94.65%**。GraphView.vue/AlgorithmPlayer 零改动。
- **e2e**：Playwright **43 passed**（+1 TC-E2E-TOPO-01）。
- **真机自检**（Playwright 脚本，`/docs/topological-sort`）：
  - 首步——6 节点 7 边、**有箭头（有向 ✓）**、counter `1/14`、无 `.bars-view`、Shiki **152 token**、**入度徽标 [1,2,0,1,0,3]**、**边标签全空（无权干净、无伪影 ✓）**。
  - 末步（scrub→max=13）——counter `14/14`、入度徽标全 '0'、**6 点全 `.done`（绿）**、字幕「全部输出，拓扑序：C → A → E → B → D → F」。
- **零回归**：既有 15 排序 + 7 轨 + 15 结构 + 4 图算法 + 播放器各轨 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 types +TopoExecPoint + GraphTrack.w 放宽为可选（首个无权消费者，GraphView.vue 零改动）+ T1 topo.module（Kahn 14 步）+ T2 新页 Topo.vue + 路由/菜单/首页接线 + TC-HOOK（图算法 4→5）。**复用 C-047 GraphView 有向轨（第 5 消费者）**：nodeBadge=入度、doneNodes=输出序。门禁全绿（单测 1000 / e2e 43 / 覆盖率 93.78%）；真机拓扑序 C→A→E→B→D→F 无误。**M6 图算法 G5 达成——补齐最短路/MST/拓扑三大范式。**
