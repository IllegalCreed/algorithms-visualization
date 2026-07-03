# 测试用例：Prim 最小生成树（C-20260703-049，M6 图算法 G7）

> Status: verified
> Stable ID: C-20260703-049
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（prim.module）/ L4（Prim 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-PRIM-MOD-*`、`TC-VIEW-PRIM-*`、`TC-E2E-PRIM-01`；**改** `TC-HOOK-01-1`、`TC-HOOK-02-1`；复用 C-047 的 `TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*`（零改动）

## L3 —— `prim.module`（`src/algorithms/prim.module.spec.ts`）

复用 useKruskal 固定图；从 A 生长；oracle `primTrace`；与 `kruskalTrace` MST 集互验。

| 用例 ID        | 场景              | 期望                                                                                           |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| TC-PRIM-MOD-01 | 末步 = oracle     | 末步 `done`，mst 边（edgeClass==='mst' 的 key）= `primTrace().mstEdges`（{AC,BC,BD,DE,DF}）    |
| TC-PRIM-MOD-02 | 与 Kruskal 同 MST | prim mst 集 === `kruskalTrace().mstEdges` 集（同图同 MST，序可不同）                           |
| TC-PRIM-MOD-03 | 步合法 + 带图轨   | 每步 `point ∈ {init,selectEdge,addVertex,done}` 且带 `graph`、`array===[]`、`directed===false` |
| TC-PRIM-MOD-04 | 生长 5 边         | `#selectEdge == 5`、`#addVertex == 5`                                                          |
| TC-PRIM-MOD-05 | init 步           | init 步 doneNodes=[0]（仅起点 A）、edgeClass 无 'mst'                                          |
| TC-PRIM-MOD-06 | selectEdge 横切   | 每个 selectEdge 步有且仅 1 条 'current' 边，且该边恰一端在 doneNodes 内（横切）                |
| TC-PRIM-MOD-07 | 首轮加入 C        | 首个 addVertex 后 doneNodes 含 C(2)、edgeClass['AC']='mst'、MST 权重 vars=1                    |
| TC-PRIM-MOD-08 | 生长顺序          | addVertex 步的新增点序列 = [C,B,D,E,F]（[2,1,3,4,5]）                                          |
| TC-PRIM-MOD-09 | done 边分类       | done 步 edgeClass 'mst' 恰 5                                                                   |
| TC-PRIM-MOD-10 | done 权重         | done 步 vars 总权 18；doneNodes 含全 6 点                                                      |
| TC-PRIM-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                  |
| TC-PRIM-MOD-12 | module 元信息     | `title` 含「Prim」；`initialInput()` = `[]`                                                    |

## L4 —— `Prim` 视图（`src/views/Article/Algorithm/Prim.spec.ts`，新增）

| 用例 ID         | 场景          | 期望                                                              |
| --------------- | ------------- | ----------------------------------------------------------------- |
| TC-VIEW-PRIM-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                |
| TC-VIEW-PRIM-02 | 图轨 + 6 节点 | h1 含「Prim」；渲染 `GraphView`；6 `.graph-node`；无 `.bars-view` |
| TC-VIEW-PRIM-03 | 全模板同屏    | Article 含「最小生成树」+ 图轨 ≥9 `.graph-edge` 同屏              |

## L4 —— TC-HOOK（图算法 2→3）

| 用例 ID      | 改动                                                          |
| ------------ | ------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：图算法 children 3 项、url=['dijkstra','kruskal','prim'] |
| TC-HOOK-02-1 | Menu：图算法 children 3 项、url=['dijkstra','kruskal','prim'] |

## L5 —— Prim 页 e2e（`e2e/prim.e2e.ts`，新增）

| 用例 ID        | 场景          | 操作                                 | 期望                                                                                                                                               |
| -------------- | ------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-PRIM-01 | 全模板 + 互动 | 访问 `/docs/prim`；`.scrub` 拖到末步 | 正文 `.article h1` 含「Prim」；`.graph-view` 可见；6 `.graph-node`；9 `.graph-edge`；拖末步 5 `.graph-edge.mst`；caption 含「18」；真机 Shiki 着色 |

## 回归

- 既有 15 排序 + 7 轨（含 GraphView）+ 15 结构 + Dijkstra + Kruskal + 播放器各轨现有 Case **零改动**全绿。
- **GraphView.vue/spec + AlgorithmPlayer.vue/spec 零改动**——`TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*` 不动全绿。
- useKruskal.ts + spec 零改动（Prim 只读复用其图）；Kruskal 页 + `TC-KRUSKAL-*` 零影响。
- TC-HOOK 其余（分类数 3、数据结构 15、排序 15）不变；仅 -01-1/-02-1 图算法项数改。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 136 文件 970 passed** / **e2e 41 passed**。
  - 新增 Case 全绿：prim.module 12（PRIM-MOD-01..12，含与 kruskalTrace 同 MST 集互验 MOD-02）、Prim 视图 3（VIEW-PRIM-01..03）、e2e 1（E2E-PRIM-01）；改 TC-HOOK-01-1/02-1（图算法 2→3、url +prim）。
  - **一次通过**：prim.module 12 首跑即绿（lineMap 逐行核对无误）；无坑。
- 覆盖率：**Stmt 93.63% / Branch 92.07% / Func 94.17% / Line 94.51%**（聚合，超门槛 70/60）。GraphView/AlgorithmPlayer/useKruskal **零改动**（Prim 只读复用）。
- 真机自检（Playwright 脚本 `/docs/prim`；本会话 chrome-devtools MCP 断连改用 Playwright）：首步 6 点 9 边 + **无箭头（无向 ✓）** + `1/12` + doneNodes=1（仅起点 A）+ 无 `.bars-view` + Shiki 157 token；末步 `12/12` + **5 `.graph-edge.mst` 绿边**（AC/BC/BD/DE/DF）+ **6 点全 `.done`** + 字幕「最小生成树完成，总权 18」。截图确认与 Kruskal 同图同 MST。
- 结论：**通过**。三件套齐全；零回归（GraphView 第 3 消费者零改动）；与 Kruskal 同图配对「同集不同序」成立。
