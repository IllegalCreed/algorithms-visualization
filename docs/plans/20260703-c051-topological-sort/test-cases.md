# 测试用例：拓扑排序（C-20260703-051，M6 图算法 G5）

> Status: verified
> Stable ID: C-20260703-051
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（topo.module）/ L4（Topo 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-TOPO-MOD-*`、`TC-VIEW-TOPO-*`、`TC-E2E-TOPO-01`；**改** `TC-HOOK-01-1`、`TC-HOOK-02-1`；复用 C-047 的 `TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*`（零改动）

## L3 —— `topo.module`（`src/algorithms/topo.module.spec.ts`）

固定非平凡 DAG（6 点 7 边）；oracle `topoTrace`。

| 用例 ID        | 场景               | 期望                                                                                           |
| -------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| TC-TOPO-MOD-01 | 末步 = oracle      | 末步 `done`，doneNodes 输出序 = `topoTrace().order` = `[2,0,4,1,3,5]`（C→A→E→B→D→F）           |
| TC-TOPO-MOD-02 | 步合法 + 带图轨    | 每步 `point ∈ {init,selectNode,removeNode,done}` 且带 `graph`、`array===[]`、`directed===true` |
| TC-TOPO-MOD-03 | 取/输出 6 点       | `#selectNode == 6`、`#removeNode == 6`                                                         |
| TC-TOPO-MOD-04 | init 入度          | init 步 `nodeBadge.map(Number)` = 初始入度 `[1,2,0,1,0,3]`                                     |
| TC-TOPO-MOD-05 | 首取 C             | 首个 selectNode 步 `activeNode === 2`（入度 0 最小下标 = C）                                   |
| TC-TOPO-MOD-06 | 首输出后减度       | 首个 removeNode 后 doneNodes=[2]（C），且 A 入度 `nodeBadge[0]='0'`                            |
| TC-TOPO-MOD-07 | 合法拓扑序         | 输出序对每条边 `u→v` 满足 index(u) < index(v)（拓扑序不变量）                                  |
| TC-TOPO-MOD-08 | 入度单调不增       | 每个点入度徽标（数字）沿步序**从不增大**（减度不变量）                                         |
| TC-TOPO-MOD-09 | 输出序即 doneNodes | removeNode 步的新增 doneNodes 序列 = `[2,0,4,1,3,5]`                                           |
| TC-TOPO-MOD-10 | done 全输出        | done 步 doneNodes 含全 6 点；nodeBadge 全 '0'                                                  |
| TC-TOPO-MOD-11 | 四语言 + 行号      | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                  |
| TC-TOPO-MOD-12 | module 元信息      | `title` 含「拓扑」；`initialInput()` = `[]`                                                    |

## L4 —— `Topo` 视图（`src/views/Article/Algorithm/Topo.spec.ts`，新增）

| 用例 ID         | 场景          | 期望                                                              |
| --------------- | ------------- | ----------------------------------------------------------------- |
| TC-VIEW-TOPO-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                |
| TC-VIEW-TOPO-02 | 图轨 + 6 节点 | h1 含「拓扑」；渲染 `GraphView`；6 `.graph-node`；无 `.bars-view` |
| TC-VIEW-TOPO-03 | 全模板同屏    | Article 含「拓扑」+ 图轨 ≥7 `.graph-edge` 同屏                    |

## L4 —— TC-HOOK（图算法 4→5）

| 用例 ID      | 改动                                                    |
| ------------ | ------------------------------------------------------- |
| TC-HOOK-01-1 | Home：图算法 children 5 项、url 末位 'topological-sort' |
| TC-HOOK-02-1 | Menu：图算法 children 5 项、url 末位 'topological-sort' |

## L5 —— 拓扑排序页 e2e（`e2e/topological-sort.e2e.ts`，新增）

| 用例 ID        | 场景          | 操作                                             | 期望                                                                                                                                            |
| -------------- | ------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-TOPO-01 | 全模板 + 互动 | 访问 `/docs/topological-sort`；`.scrub` 拖到末步 | 正文 `.article h1` 含「拓扑」；`.graph-view` 可见；6 `.graph-node`；7 `.graph-edge`；拖末步 6 `.graph-node.done`；caption 非空；真机 Shiki 着色 |

## 回归

- 既有 15 排序 + 7 轨（含 GraphView）+ 15 结构 + 4 图算法（Dijkstra/Kruskal/Prim/Bellman-Ford）+ 播放器各轨现有 Case **零改动**全绿。
- **GraphView.vue/spec + AlgorithmPlayer.vue/spec 零改动**——`TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*` 不动全绿。
- TC-HOOK 其余（分类数 3、数据结构 15、排序 15）不变；仅 -01-1/-02-1 图算法项数改（4→5）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 140 文件 1000 passed** / **e2e 43 passed**。
  - 新增 Case 全绿：topo.module 12（TOPO-MOD-01..12，含合法拓扑序 MOD-07、入度单调不增 MOD-08）、Topo 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（图算法 4→5、url +topological-sort）。
  - **一坑（type-check）**：拓扑排序**无权**，但 `GraphTrack.edges` 原类型要求 `w: number`。将 `w` 放宽为 `w?: number`（types.ts，属本变更 additive 改动）——**GraphView.vue 零改动**，其 `{{ e.w }}` 遇 undefined 渲染空文本（真机确认边无 "0"/undefined 伪影）。topo 是首个无权消费者。module.spec 12 首跑即绿。
- 覆盖率：**Stmt 93.78% / Branch 92.32% / Func 94.24% / Line 94.65%**（聚合，超门槛 70/60）。GraphView.vue/AlgorithmPlayer 零改动。
- 真机自检（Playwright 脚本 `/docs/topological-sort`）：首步 6 点 7 边 + **有箭头（有向 ✓）** + `1/14` + 无 `.bars-view` + Shiki 152 token + **入度徽标 [1,2,0,1,0,3]** + **边标签全空（无权干净）**；末步 `14/14` + 徽标全 '0' + **6 点全 `.done`** + 字幕「全部输出，拓扑序：C → A → E → B → D → F」。
- 结论：**通过**。三件套齐全；零回归（GraphView.vue 零改动，仅类型放宽向后兼容）；补齐图算法三大范式（最短路/MST/拓扑）。
