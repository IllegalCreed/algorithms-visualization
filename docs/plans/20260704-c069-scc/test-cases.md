# 测试用例：强连通分量 Tarjan（C-20260704-069，扩展 GraphView）

> Status: verified
> Stable ID: C-20260704-069
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（scc.module）/ L4（GraphView 扩展 + Scc 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-GRAPHVIEW-SCC-*`、`TC-SCC-MOD-*`、`TC-VIEW-SCC-*`、`TC-E2E-SCC-01`；**改** `TC-HOOK`（图算法 6→7）

## L4 —— GraphView SCC 扩展（`src/components/GraphView.spec.ts`，追加）

| 用例 ID                 | 场景       | 期望                                                                                        |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| TC-VIZ-GRAPHVIEW-SCC-01 | 分组着色   | `nodeGroup=[0,0,1]`（3 点）→ 节点 circle 依组取不同 inline fill（组 0 两点同色、组 1 异色） |
| TC-VIZ-GRAPHVIEW-SCC-02 | 在栈虚线环 | `stackNodes=[1]` → 恰 1 个 `.on-stack` 节点                                                 |

## L3 —— `scc.module`（`src/algorithms/scc.module.spec.ts`）

固定 6 点有向图；oracle `tarjanSCCs()`=`[[5],[4,3],[2,1,0]]`、`tarjanDfnLow()`=`{dfn:[0,1,2,3,4,5], low:[0,0,0,3,3,5]}`。

| 用例 ID       | 场景                  | 期望                                                                               |
| ------------- | --------------------- | ---------------------------------------------------------------------------------- |
| TC-SCC-MOD-01 | 末步 done + SCC 数    | 末步 `done`；`tarjanSCCs()` 长度 3；末步 `nodeGroup` 恰 3 个不同组号（每点都有组） |
| TC-SCC-MOD-02 | 步合法 + 带图轨       | 每步 `point ∈ {enter,tree,back,scc,done}` 且带 `graph`、`array===[]`               |
| TC-SCC-MOD-03 | enter 恰 6 次         | `enter` 步数 === 6（每节点访问一次）                                               |
| TC-SCC-MOD-04 | 末步 dfn/low = oracle | 末步各节点 `nodeBadge` 解析出的 dfn/low === `tarjanDfnLow()`                       |
| TC-SCC-MOD-05 | scc 恰 3 次           | `scc` 步数 === 3                                                                   |
| TC-SCC-MOD-06 | scc 步是根 low==dfn   | 每个 `scc` 步当前 activeNode 的 low === dfn（SCC 根）                              |
| TC-SCC-MOD-07 | 同 SCC 同组           | 末步 `nodeGroup`：{0,1,2} 同组、{3,4} 同组、{5} 单独一组（三组两两不同）           |
| TC-SCC-MOD-08 | badge 格式 dfn/low    | 已访问节点 `nodeBadge` 形如 `d/l`（两数）；未访问为 null                           |
| TC-SCC-MOD-09 | 栈随 scc 收缩         | `scc` 步后 `stackNodes` 长度较该 SCC 弹出前减少（弹出该组节点）                    |
| TC-SCC-MOD-10 | 有向图                | 每步 `graph.directed` === true                                                     |
| TC-SCC-MOD-11 | 四语言 + 行号         | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                      |
| TC-SCC-MOD-12 | module 元信息         | `title` 含「强连通」或「Tarjan」或「SCC」；`initialInput()` = `[]`                 |

## L4 —— `Scc` 视图（`src/views/Article/Algorithm/Scc.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                               |
| -------------- | ------------- | -------------------------------------------------- |
| TC-VIEW-SCC-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                 |
| TC-VIEW-SCC-02 | 图轨          | h1 含「强连通」；渲染 `GraphView`；无 `.bars-view` |
| TC-VIEW-SCC-03 | 全模板同屏    | 正文含「Tarjan」+ GraphView 同屏                   |

## L4 —— TC-HOOK（图算法第 7 项）

| 用例 ID | 改动                                                                 |
| ------- | -------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[2]`（图算法）length 6→7，children url 末尾 +`scc` |

## L5 —— SCC 页 e2e（`e2e/scc.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                | 期望                                                                                                                                                            |
| ------------- | ------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-SCC-01 | 全模板 + 互动 | 访问 `/docs/scc`；`.scrub` 拖到末步 | 正文 `.article h1` 含「强连通」；`.graph-view` 可见；6 `.graph-node`；无 `.bars-view`；拖末步 caption 含「3」（个 SCC）+ 0 `.on-stack`（栈空）；真机 Shiki 着色 |

## 回归

- 既有 13 轨 + 6 图算法 + 5 DP + 回溯 7 页 + 字符串 4 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **GraphView 仅 additive 扩展**（nodeGroup/stackNodes）：Dijkstra/Kruskal/Prim/Bellman-Ford/Topo/Floyd 不传新字段 → 既有 `TC-VIZ-GRAPHVIEW-*`/图算法 module/页/e2e 不变全绿；AlgorithmPlayer 零改动。
- TC-HOOK 其余不变；仅图算法 children +scc（6→7）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage`（Vitest 4，jsdom）→ **1316 用例全绿**；`pnpm exec playwright test scc dijkstra` → **2/2 绿**。
- **本单新增 18 Case 全绿**：`TC-VIZ-GRAPHVIEW-SCC-01/02`（L4，GraphView 扩展）2 + `TC-SCC-MOD-01..12`（L3，module）12 + `TC-VIEW-SCC-01..03`（L4，页）3 + `TC-E2E-SCC-01`（L5，e2e）1；**改** `TC-HOOK`（图算法 6→7）menu+home 各 1。
- **关键断言实测**：末步 3 个 SCC + nodeGroup 每点有组（TC-SCC-MOD-01）；enter 恰 6 次（TC-03）；末步 dfn/low=oracle（TC-04）；scc 恰 3 次（TC-05）；scc 步 low==dfn 根（TC-06）；同 SCC 同组三组互异（TC-07）；scc 步弹栈后栈变短（TC-09）。
- **真机自检**：3 色 SCC、dfn/low 徽标、栈随弹出收缩，与设计一致。
- **覆盖**：聚合 statements 95.16% / branches 94.58%，全部超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；18 Case + 改 2 HOOK 全绿。
