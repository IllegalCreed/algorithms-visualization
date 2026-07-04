# 实现记录：2-SAT（C-20260704-074，蕴含图 + Tarjan SCC · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-074
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 GraphView checkPair**（L4）：types.ts `GraphTrack` +`checkPair?` + `TwoSatExecPoint`；先 GraphView.spec 追加 TC-VIZ-GRAPHVIEW-CHECK-01/02 跑红 → GraphView.vue（`checkPair` 命中节点加 `.checking` 蓝环）跑绿。C-069 及其它图算法用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 twosat.module.spec（TC-2SAT-MOD-01..12）跑红 → twosat.{ts,sources.ts,module.ts}（蕴含图 + Tarjan + 判定 + 赋值）跑绿。
3. **T2 新页 + 接线**：TwoSat.vue；路由 /docs/two-sat；菜单 + 首页「图算法」第 8 项（新 two-sat.svg）；改 TC-HOOK（图算法 children +two-sat）；TwoSat.spec + two-sat.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 图算法第 8 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **GraphView additive 扩 `checkPair`（零回归）**：+`checkPair?: [number,number]|null`；命中节点加 `.checking` 类（蓝实线环 #4a90d9 stroke-width 4，区别于 active 琥珀实线 / on-stack 琥珀虚线）。其它 7 图算法不设 → 渲染不变。复用 `Step.graph`，AlgorithmPlayer 零改动。
- **蕴含图归约**：文字节点编码 `x=2v / ¬x=2v+1`、取反 `^1`；子句 `(a∨b)` ⟹ `¬a→b`、`¬b→a`（每子句 2 边）。固定 4 子句 → 8 边。节点布局 3 列（变量 A/B/C）× 2 行（上正 / 下负）。
- **Tarjan 复用（第 7 页同一套）**：`twoSatTarjan()` 得 dfn/low/comp/sccs（comp 为逆拓扑序）。本例 comp=[0,2,2,0,1,3]、SCC 发现序 [{¬B,A},{C},{B,¬A},{¬C}]。
- **判定 + 赋值**：`x/¬x` 同 SCC ⟺ 无解；否则 `x 真 ⟺ comp[x]<comp[¬x]`。本例可满足，解 [T,F,T]。
- **module 16 步**：init（列节点）→ clause×4（逐条加 2 边 + edgeClass 高亮）→ scc×4（按发现序渐进 nodeGroup 着色）→ check×3（checkPair 逐对高亮 + 确认不同组）→ assign×3（正文字节点 nodeBadge 真/假）→ done（解 A=真/B=假/C=真）。oracle 对拍末步。
- **四语言 sources**：TS/Python/Go/Rust 2-SAT 驱动（Tarjan 作 helper 引用第 7 页），lineMap 对齐 init/clause/scc/check/assign/done。
- **双向链接**：Scc.vue Callout 的「2-SAT」改成 router-link 指向本页；本页 3 处 router-link 回指 `/docs/scc`（实际 slug 是 scc，非 strongly-connected-components）。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1406/1406 全绿**、聚合 statements 95.42% · branches 95.01%。
- **e2e（真机 Playwright/Chromium）**：`two-sat` + 回归 `scc`/`dijkstra` **3/3 通过**——6 文字节点 + 8 蕴含边、无柱数组、Shiki、拖末步字幕含「可满足」。
- **真机视觉自检（2 图眼验）**：第 11/16 步（判定 B）——B/¬B 蓝环、8 边全出、6 节点按 comp 着色（{A,¬B} 蓝、{B,¬A} 绿、C 橙、¬C 粉）、字幕「B∈SCC2、¬B∈SCC0 不同组」；末步 16/16——badge 真/假/真、字幕「2-SAT 可满足！解 A=真、B=假、C=真」。
- **回归**：GraphView 仅 additive；C-069 SCC 及其它 6 图算法不设 checkPair → 渲染不变（TC-VIZ-GRAPHVIEW-\*/各图算法 e2e 全绿）；仅 TC-HOOK（图算法 children）追加 two-sat。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；18 Case + 改 2 HOOK 全绿、双轨部署。
