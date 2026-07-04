# 实现记录：最大流 Ford-Fulkerson（C-20260704-076，残量网络 · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-076
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 GraphView edgeLabel + .reverse**（L4）：types.ts `GraphTrack` +`edgeLabel?` + `MaxFlowExecPoint`；先 GraphView.spec 追加 TC-VIZ-GRAPHVIEW-LABEL-01/02 跑红 → GraphView.vue（边标签优先 edgeLabel + `.reverse` 红虚线 CSS）跑绿。8 图算法 + AC 用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 maxflow.module.spec（TC-MF-MOD-01..12）跑红 → maxflow.{ts,sources.ts,module.ts}（Ford-Fulkerson 残量图 + 增广 + 最小割）跑绿。
3. **T2 新页 + 接线**：MaxFlow.vue；路由 /docs/max-flow；菜单 + 首页「图算法」第 9 项（新 max-flow.svg）；改 TC-HOOK（图算法 children +max-flow）；MaxFlow.spec + max-flow.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 图算法第 9 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **GraphView additive 两处（零回归）**：① `edgeLabel?: Record<string,string>`（边标签，边渲染优先 edgeLabel[key] 否则回退 w，故 8 图算法 + AC 不设即仍显示权重 w）；② `.graph-edge.reverse` 红虚线 CSS（stroke #e03131 dasharray 6 4），区别于 current 琥珀（正向增广）/ fail 紫（AC）。GraphTrack 仅加 edgeLabel、AlgorithmPlayer 零改动。
- **oracle `maxflow.ts`**：Ford-Fulkerson DFS 残量图，固定邻居序 NBR（故意让 a 先探 b 制造贪心陷阱）复现 4 轮增广。value=6、rounds=[s→a→b→t(1)、s→a→t(2)、s→b→t(2)、s→b→a→t(1，reverse=[[1,2]])]、minCutS=[s]、cutEdges=[s→a,s→b]。最小割用残量图 S 可达集算。
- **module 10 步**：init（全 0/cap + 源汇 badge）→ 每轮 2 步 ×4：find（edgeClass 正向边 current 琥珀、反向边 reverse 红；caption 给路径 + 瓶颈）+ augment（沿路更新 flow：原边 +bottleneck、反向段原边 -bottleneck 退流；edgeLabel 显示新 flow/cap）→ done（最小割边 current 高亮 + caption 最大流=最小割）。
- **反向边可视化**：不单独画残量反向边，第 4 轮 find 把原边 a→b（1-2）标 reverse 红虚线、augment 把 a→b 流量从 1 退到 0，表达「退流改道」。末步各边流量守恒（s 出 6 = t 入 6）。
- **四语言 sources**：TS/Python/Go/Rust Ford-Fulkerson（残量矩阵 DFS + 增流 + 反向边），lineMap 逐行核对（ts 22/py 19/go 26/rust 22 行）对齐 init/find/augment/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1440/1440 全绿**、聚合 statements 95.53% · branches 95.16%。
- **e2e（真机 Playwright/Chromium）**：`max-flow` + 回归 `aho-corasick`/`two-sat`/`dijkstra` **4/4 通过**——图轨 4 节点、无柱数组、Shiki、拖末步字幕含 6。
- **真机视觉自检（2 图眼验）**：第 8/10 步（第 4 轮 find）——菱形网络、源汇 badge、边标签流量/容量、增广路 s→b→a→t（s→b/a→t 琥珀、a→b 红虚线反向退流）、字幕「反向经过 a→b 退流」；末步 10/10——a→b 退到 0/1、最小割 s→a/s→b 高亮、字幕「最大流=6=最小割」。
- **回归**：GraphView edgeLabel 缺省回退 w；8 图算法 + AC 不设 edgeLabel → 边仍显示权重、渲染不变（各图算法 e2e 全绿）；仅 TC-HOOK（图算法 children）追加 max-flow。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；18 Case + 改 2 HOOK 全绿、双轨部署。
