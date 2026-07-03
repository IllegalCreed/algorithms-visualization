# 测试用例：Bellman-Ford 最短路（C-20260703-050，M6 图算法 G3）

> Status: verified
> Stable ID: C-20260703-050
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（bellman-ford.module）/ L4（Bellman 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-BELLMAN-MOD-*`、`TC-VIEW-BELLMAN-*`、`TC-E2E-BELLMAN-01`；**改** `TC-HOOK-01-1`、`TC-HOOK-02-1`；复用 C-047 的 `TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*`（零改动）

## L3 —— `bellman-ford.module`（`src/algorithms/bellman-ford.module.spec.ts`）

固定含负权有向图（源 A）；oracle `bellmanFordTrace`。

| 用例 ID           | 场景             | 期望                                                                                                                       |
| ----------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| TC-BELLMAN-MOD-01 | 末步 = oracle    | 末步 `done`，`nodeBadge.map(Number)` = `bellmanFordTrace().dist` = `[0,4,1,3,1]`                                           |
| TC-BELLMAN-MOD-02 | 步合法 + 带图轨  | 每步 `point ∈ {init,roundStart,relaxUpdate,relaxSkip,done}` 且带 `graph`、`array===[]`、`directed===true`                  |
| TC-BELLMAN-MOD-03 | V−1 轮           | `#roundStart == 4`（5 点 → V−1=4 轮）                                                                                      |
| TC-BELLMAN-MOD-04 | 松弛统计         | `#relaxUpdate == 8`、`#relaxSkip == 20`、`#relaxUpdate + #relaxSkip == 28`（4×7）                                          |
| TC-BELLMAN-MOD-05 | init 步          | init `nodeBadge[0]='0'`、`slice(1)` 全 `'∞'`                                                                               |
| TC-BELLMAN-MOD-06 | 逐轮 dist        | 4 个 roundStart 步的 `nodeBadge` = 进入各轮时 dist：R1 `[0,∞,∞,∞,∞]`、R2 `[0,4,5,∞,∞]`、R3 `[0,4,1,7,9]`、R4 `[0,4,1,3,5]` |
| TC-BELLMAN-MOD-07 | 首个 relaxUpdate | 首个 `relaxUpdate` 后 `nodeBadge[1]='4'`（B←A）                                                                            |
| TC-BELLMAN-MOD-08 | dist 单调不增    | 对每个顶点，其 `nodeBadge` 数值（∞ 视为 +∞）沿步序**从不增大**（松弛不变量）                                               |
| TC-BELLMAN-MOD-09 | done 最短路树    | done 步 edgeClass 'tree' 恰 4，keys sorted = `['0-1','1-2','2-3','3-4']`                                                   |
| TC-BELLMAN-MOD-10 | 含负权边         | `BF_EDGES` 含 B→C(w=-3) 与 D→E(w=-2)；done doneNodes 含全 5 点                                                             |
| TC-BELLMAN-MOD-11 | 四语言 + 行号    | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                                              |
| TC-BELLMAN-MOD-12 | module 元信息    | `title` 含「Bellman」；`initialInput()` = `[]`                                                                             |

## L4 —— `Bellman` 视图（`src/views/Article/Algorithm/Bellman.spec.ts`，新增）

| 用例 ID            | 场景          | 期望                                                                 |
| ------------------ | ------------- | -------------------------------------------------------------------- |
| TC-VIEW-BELLMAN-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                   |
| TC-VIEW-BELLMAN-02 | 图轨 + 5 节点 | h1 含「Bellman」；渲染 `GraphView`；5 `.graph-node`；无 `.bars-view` |
| TC-VIEW-BELLMAN-03 | 全模板同屏    | Article 含「最短」+ 图轨 ≥7 `.graph-edge` 同屏                       |

## L4 —— TC-HOOK（图算法 3→4）

| 用例 ID      | 改动                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：图算法 children 4 项、url=['dijkstra','kruskal','prim','bellman-ford'] |
| TC-HOOK-02-1 | Menu：图算法 children 4 项、url=['dijkstra','kruskal','prim','bellman-ford'] |

## L5 —— Bellman-Ford 页 e2e（`e2e/bellman-ford.e2e.ts`，新增）

| 用例 ID           | 场景          | 操作                                         | 期望                                                                                                                                               |
| ----------------- | ------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-BELLMAN-01 | 全模板 + 互动 | 访问 `/docs/bellman-ford`；`.scrub` 拖到末步 | 正文 `.article h1` 含「Bellman」；`.graph-view` 可见；5 `.graph-node`；7 `.graph-edge`；拖末步 4 `.graph-edge.tree`；caption 非空；真机 Shiki 着色 |

## 回归

- 既有 15 排序 + 7 轨（含 GraphView）+ 15 结构 + Dijkstra + Kruskal + Prim + 播放器各轨现有 Case **零改动**全绿。
- **GraphView.vue/spec + AlgorithmPlayer.vue/spec 零改动**——`TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*` 不动全绿。
- TC-HOOK 其余（分类数 3、数据结构 15、排序 15）不变；仅 -01-1/-02-1 图算法项数改（3→4）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 138 文件 985 passed** / **e2e 42 passed**。
  - 新增 Case 全绿：bellman-ford.module 12（BELLMAN-MOD-01..12，含逐轮 dist MOD-06、单调不增 MOD-08）、Bellman 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（图算法 3→4、url +bellman-ford）。
  - **一坑（type-check）**：spec 的 `numBadge` 参数初写 `string`，但 `GraphTrack.nodeBadge` 类型是 `(string|null)[]`——`.map(numBadge)` 类型不符。改 `numBadge: (b: string|null)`（null 视为 ∞）后过。逻辑本身 module.spec 12 首跑即绿。
- 覆盖率：**Stmt 93.72% / Branch 92.23% / Func 94.21% / Line 94.58%**（聚合，超门槛 70/60）。GraphView/AlgorithmPlayer 零改动。
- 真机自检（Playwright 脚本 `/docs/bellman-ford`）：首步 5 点 7 边 + **有箭头（有向 ✓）** + `1/34` + 无 `.bars-view` + Shiki 94 token + **权重含负数 -2/-3**；末步 `34/34` + 徽标 **[0,4,1,3,1]**（= oracle）+ **4 `.graph-edge.tree` 绿边**（A→B,B→C,C→D,D→E）+ 5 点全 `.done` + 字幕「4 轮完成…dist=[0,4,1,3,1]」。截图确认最短路经负权边（A→E=1）。
- 结论：**通过**。三件套齐全；零回归（GraphView 第 4 消费者零改动）；含负权 + V−1 轮收敛演示成立，与 Dijkstra 配对。
