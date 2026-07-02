# 测试用例：Kruskal 接入算法播放器（C-20260702-048，M8②-2 · 收官 M8）

> Status: verified
> Stable ID: C-20260702-048
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（kruskal.module）/ L4（Kruskal 页）/ L5（e2e）
> 命名空间：新增 `TC-KRUSKAL-MOD-*`；**改** `TC-VIEW-KRUSKAL-01/02` + 增 `-03`、`TC-E2E-KRUSKAL-01`；**superseded** `TC-VIZ-KRUSKALVIZ-*`；复用 C-047 的 `TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*`（零改动）

## L3 —— `kruskal.module`（`src/algorithms/kruskal.module.spec.ts`）

复用 useKruskal 固定图（边按权升序）；oracle `kruskalTrace`。

| 用例 ID           | 场景            | 期望                                                                                            |
| ----------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| TC-KRUSKAL-MOD-01 | 末步 = oracle   | 末步 `done`，mst 边（edgeClass==='mst' 的 key）= `kruskalTrace().mstEdges` = `[AC,BC,DE,BD,DF]` |
| TC-KRUSKAL-MOD-02 | 步合法 + 带图轨 | 每步 `point ∈ {init,consider,accept,reject,done}` 且带 `graph`、`array===[]`                    |
| TC-KRUSKAL-MOD-03 | 考虑 9 边       | `#consider == 9`                                                                                |
| TC-KRUSKAL-MOD-04 | 接受/拒绝守恒   | `#accept == 5`、`#reject == 4`、`#accept + #reject == 9`                                        |
| TC-KRUSKAL-MOD-05 | init 步         | init 步 edgeClass 全空（无 mst/rejected/current）、doneNodes 空                                 |
| TC-KRUSKAL-MOD-06 | 首边 accept     | 首个 accept（AC，权 1）后 edgeClass['AC']==='mst'、weight vars=1                                |
| TC-KRUSKAL-MOD-07 | 成环 reject     | 首个 reject（AB，权 4）后 edgeClass['AB']==='rejected'                                          |
| TC-KRUSKAL-MOD-08 | consider 高亮   | 每个 consider 步当前边 edgeClass 为 'current'                                                   |
| TC-KRUSKAL-MOD-09 | done 边分类     | done 步 edgeClass：'mst' 恰 5、'rejected' 恰 4                                                  |
| TC-KRUSKAL-MOD-10 | done 权重       | done 步 vars 含总权 18；doneNodes 含全 6 点（MST 连通所有点）                                   |
| TC-KRUSKAL-MOD-11 | 四语言 + 行号   | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                   |
| TC-KRUSKAL-MOD-12 | module 元信息   | `title` 含「Kruskal」；`initialInput()` = `[]`                                                  |

## L4 —— `Kruskal` 视图（`src/views/Article/Algorithm/Kruskal.spec.ts`，**改写**）

| 用例 ID            | 场景          | 期望                                                                 |
| ------------------ | ------------- | -------------------------------------------------------------------- |
| TC-VIEW-KRUSKAL-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`（不再含 KruskalViz）              |
| TC-VIEW-KRUSKAL-02 | 图轨 + 6 节点 | h1 含「Kruskal」；渲染 `GraphView`；6 `.graph-node`；无 `.bars-view` |
| TC-VIEW-KRUSKAL-03 | 全模板同屏    | Article 含「最小生成树」+ 图轨 ≥9 `.graph-edge` 同屏                 |

## L5 —— Kruskal 页 e2e（`e2e/kruskal.e2e.ts`，**改写**）

| 用例 ID           | 场景          | 操作                                    | 期望                                                                                                                                                                             |
| ----------------- | ------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-KRUSKAL-01 | 全模板 + 互动 | 访问 `/docs/kruskal`；`.scrub` 拖到末步 | 正文 `.article h1` 含「Kruskal」；`.graph-view` 可见；6 `.graph-node`；9 `.graph-edge`；拖末步 5 `.graph-edge.mst` + 4 `.graph-edge.rejected`；caption 含「18」；真机 Shiki 着色 |

## superseded（KruskalViz 删除）

| 用例 ID              | 处理                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| TC-VIZ-KRUSKALVIZ-\* | **标 superseded**（KruskalViz.vue/spec 删除，功能由 GraphView + 播放器承接；三索引标废，双向链接本变更） |

## 回归

- 既有 15 排序 + 7 轨（含 GraphView）+ 15 结构 + Dijkstra + 播放器各轨现有 Case **零改动**全绿。
- **GraphView.vue/spec + AlgorithmPlayer.vue/spec 零改动**（Kruskal 仅新增 module 消费图轨）——`TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*` 不动全绿。
- useKruskal.ts + spec 零改动（保留复用）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 134 文件 955 passed** / **e2e 40 passed**。
  - 新增/改写 Case 全绿：kruskal.module 12（KRUSKAL-MOD-01..12）、Kruskal 视图 3（VIEW-KRUSKAL-01..03）、e2e 1（E2E-KRUSKAL-01 改写）。
  - **MOD-06/07 修正**：初稿 accept/reject 步误传 currentId 把边覆盖成 'current'（应为 mst/rejected）——改 emit 传 undefined 后绿。教训：'current' 仅属 consider 步，边归类后不再 current。
- 覆盖率：**Stmt 93.59% / Branch 91.98% / Func 94.19% / Line 94.44%**（聚合，超门槛 70/60）。algorithms 目录 98.15%；GraphView/AlgorithmPlayer **零改动**（复用 C-047）。
- 真机自检（chrome-devtools `/docs/kruskal`）：首步 6 点 9 边 + **无箭头（无向 ✓）** + `1/20` + 无 `.bars-view` + Shiki 134 token + 4 语言 tab；末步 `20/20` + **5 `.mst` 绿边**（AC/BC/DE/BD/DF）+ **4 `.rejected` 虚线**（AB/CE/EF/CD）+ 6 点全 `.done` + 字幕「最小生成树完成，总权 18」。
- 结论：**通过**。三件套齐全；零回归（GraphView 零改动首个无向消费者）；**M8 算法页模板统一全部收官**。
