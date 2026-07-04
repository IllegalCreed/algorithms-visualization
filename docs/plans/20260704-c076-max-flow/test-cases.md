# 测试用例：最大流 Ford-Fulkerson（C-20260704-076，残量网络 · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-076
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（maxflow.module）/ L4（GraphView edgeLabel + MaxFlow 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-GRAPHVIEW-LABEL-*`、`TC-MF-MOD-*`、`TC-VIEW-MF-*`、`TC-E2E-MF-01`；**改** `TC-HOOK`（图算法 children）

## L4 —— GraphView edgeLabel（`src/components/GraphView.spec.ts`，追加）

| 用例 ID                   | 场景            | 期望                                                       |
| ------------------------- | --------------- | ---------------------------------------------------------- |
| TC-VIZ-GRAPHVIEW-LABEL-01 | 边标签流量/容量 | `edgeLabel={'0-1':'1/3'}` → 该边文本显示 `1/3`（优先于 w） |
| TC-VIZ-GRAPHVIEW-LABEL-02 | 不设即回退 w    | 不传 `edgeLabel` → 边文本回退到 `w`（其它图算法零回归）    |

## L3 —— `maxflow.module`（`src/algorithms/maxflow.module.spec.ts`）

固定 `s→a:3,s→b:3,a→b:1,a→t:3,b→t:3`；oracle `maxFlow().value`=`6`，`rounds` 瓶颈 `[1,2,2,1]`，末轮反向边 `b→a`。

| 用例 ID      | 场景                 | 期望                                                                               |
| ------------ | -------------------- | ---------------------------------------------------------------------------------- |
| TC-MF-MOD-01 | 末步 done + 最大流   | 末步 `done`；最大流 = `maxFlow().value` = `6`                                      |
| TC-MF-MOD-02 | 步合法 + 带图轨      | 每步 `point ∈ {init,find,augment,done}` 且带 `graph`、`array===[]`                 |
| TC-MF-MOD-03 | 逐轮 find + augment  | `find` 步恰 4 个、`augment` 步恰 4 个（4 轮增广）                                  |
| TC-MF-MOD-04 | 增广路对拍           | 各 `find` 步路径 = `maxFlow().rounds[i].path`（s→a→b→t / s→a→t / s→b→t / s→b→a→t） |
| TC-MF-MOD-05 | 瓶颈序列             | 各轮瓶颈 = `[1,2,2,1]`；累加 = 最大流 6                                            |
| TC-MF-MOD-06 | 反向边反悔           | 第 4 轮 `rounds[3].reverse` 含 `b→a`（把误走的流退回）                             |
| TC-MF-MOD-07 | 流量守恒             | 末步 s 出边流量和 = 6 = t 入边流量和（守恒）                                       |
| TC-MF-MOD-08 | 反向边高亮           | 第 4 轮 `find` 步 edgeClass 含一条 `reverse`（b→a 段红高亮）                       |
| TC-MF-MOD-09 | 最小割高亮           | done 步 edgeClass 把最小割边 `s→a`、`s→b` 标高亮                                   |
| TC-MF-MOD-10 | 最大流最小割 caption | done 步 caption 含 `6` 与「最小割」/「割」                                         |
| TC-MF-MOD-11 | 四语言 + 行号        | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                      |
| TC-MF-MOD-12 | module 元信息        | `title` 含「最大流」或「Ford」；`initialInput()` = `[]`                            |

## L4 —— `MaxFlow` 视图（`src/views/Article/Algorithm/MaxFlow.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                               |
| ------------- | ------------- | -------------------------------------------------- |
| TC-VIEW-MF-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                 |
| TC-VIEW-MF-02 | 图轨          | h1 含「最大流」；渲染 `GraphView`；无 `.bars-view` |
| TC-VIEW-MF-03 | 全模板同屏    | 正文含「残量」+ GraphView 同屏                     |

## L4 —— TC-HOOK（图算法第 9 项）

| 用例 ID | 改动                                                                         |
| ------- | ---------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[2]`（图算法）children 末项追加 `max-flow`（紧接 two-sat） |

## L5 —— 最大流页 e2e（`e2e/max-flow.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                     | 期望                                                                                                                          |
| ------------ | ------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-MF-01 | 全模板 + 互动 | 访问 `/docs/max-flow`；`.scrub` 拖到末步 | 正文 `.article h1` 含「最大流」；`.graph-view` 可见；4 `.graph-node`；无 `.bars-view`；拖末步 caption 含 `6`；真机 Shiki 着色 |

## 回归

- 既有 15 轨 + 8 图算法 + 6 DP + 回溯 8 页 + 字符串 7 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **GraphView 仅 additive 加 `edgeLabel`（缺省回退 w）+ `.reverse` 边样式**：8 图算法 + AC 自动机不设 `edgeLabel` → 边标签仍显示 w、渲染不变，`TC-VIZ-GRAPHVIEW-*`/各图算法用例全绿；AlgorithmPlayer 零改动。
- TC-HOOK 其余不变；仅图算法 children 追加 `max-flow`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1440 用例全绿**；`pnpm exec playwright test max-flow aho-corasick two-sat dijkstra` → **4/4 绿**。
- **本单新增 18 Case 全绿**：`TC-VIZ-GRAPHVIEW-LABEL-01/02`（L4）2 + `TC-MF-MOD-01..12`（L3）12 + `TC-VIEW-MF-01..03`（L4）3 + `TC-E2E-MF-01`（L5）1；**改** `TC-HOOK`（图算法 children +max-flow）menu+home 各 1。
- **关键断言实测**：末步最大流=maxFlow().value=6（TC-01）；4 轮增广路 s→a→b→t/s→a→t/s→b→t/s→b→a→t（TC-04）；瓶颈[1,2,2,1]（TC-05）；第 4 轮 reverse=[[1,2]]（TC-06）；流量守恒 s 出 6 = t 入 6、a→b 退到 0/1（TC-07）；反向边 reverse 类高亮（TC-08）；最小割 s→a/s→b（TC-09）。
- **真机自检**：边标签流量/容量、源汇 badge、反向退流红虚线、最大流 6=最小割，与设计一致。
- **覆盖**：statements 95.53% / branches 95.16%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；18 Case + 改 2 HOOK 全绿。
