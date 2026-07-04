# 测试用例：2-SAT（C-20260704-074，蕴含图 + Tarjan · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-074
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（twosat.module）/ L4（GraphView checkPair + TwoSat 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-GRAPHVIEW-CHECK-*`、`TC-2SAT-MOD-*`、`TC-VIEW-2SAT-*`、`TC-E2E-2SAT-01`；**改** `TC-HOOK`（图算法 children）

## L4 —— GraphView checkPair（`src/components/GraphView.spec.ts`，追加）

| 用例 ID                   | 场景           | 期望                                                    |
| ------------------------- | -------------- | ------------------------------------------------------- |
| TC-VIZ-GRAPHVIEW-CHECK-01 | checkPair 高亮 | 传 `checkPair=[0,1]` → 节点 0、1 两个带 `.checking` 类  |
| TC-VIZ-GRAPHVIEW-CHECK-02 | 不设即零回归   | 不传 `checkPair` → 无 `.checking`（其它图算法不受影响） |

## L3 —— `twosat.module`（`src/algorithms/twosat.module.spec.ts`）

固定 `(A∨B)∧(A∨¬B)∧(A∨C)∧(¬A∨¬B)`；oracle `twoSatSolve()`=`{sat:true, assign:[true,false,true]}`；`comp=[0,2,2,0,1,3]`。

| 用例 ID        | 场景              | 期望                                                                             |
| -------------- | ----------------- | -------------------------------------------------------------------------------- |
| TC-2SAT-MOD-01 | 末步 done + 赋值  | 末步 `done`；解 = `twoSatSolve().assign` = `[true,false,true]`（A 真/B 假/C 真） |
| TC-2SAT-MOD-02 | 步合法 + 带图轨   | 每步 `point ∈ {init,clause,scc,check,assign,done}` 且带 `graph`、`array===[]`    |
| TC-2SAT-MOD-03 | 蕴含图成形        | `init` 步 0 边；末步 8 边（= `twoSatImplications().length`）                     |
| TC-2SAT-MOD-04 | clause 步逐条加边 | `clause` 步恰 4 个；边数随 clause 步累计 2,4,6,8（每子句 +2）                    |
| TC-2SAT-MOD-05 | scc 步逐个上色    | `scc` 步恰 4 个（4 个 SCC）；`nodeGroup` 已上色节点数单调不减                    |
| TC-2SAT-MOD-06 | 末步 SCC 分组     | 末步 `nodeGroup` = `comp` = `[0,2,2,0,1,3]`                                      |
| TC-2SAT-MOD-07 | check 步逐变量    | `check` 步恰 3 个；第 i 个 `checkPair` = `[2i, 2i+1]`                            |
| TC-2SAT-MOD-08 | 判定可满足        | 每对 `comp[2i] !== comp[2i+1]`（无同组）→ 可满足                                 |
| TC-2SAT-MOD-09 | assign 步赋值一致 | `assign` 步恰 3 个；第 i 变量真值 = `comp[2i] < comp[2i+1]`                      |
| TC-2SAT-MOD-10 | 解值 caption      | done 步 caption 含赋值信息（A/真、B/假、C/真 或「可满足」）                      |
| TC-2SAT-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                    |
| TC-2SAT-MOD-12 | module 元信息     | `title` 含「2-SAT」；`initialInput()` = `[]`                                     |

## L4 —— `TwoSat` 视图（`src/views/Article/Algorithm/TwoSat.spec.ts`，新增）

| 用例 ID         | 场景          | 期望                                              |
| --------------- | ------------- | ------------------------------------------------- |
| TC-VIEW-2SAT-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                |
| TC-VIEW-2SAT-02 | 图轨          | h1 含「2-SAT」；渲染 `GraphView`；无 `.bars-view` |
| TC-VIEW-2SAT-03 | 全模板同屏    | 正文含「蕴含」+ GraphView 同屏                    |

## L4 —— TC-HOOK（图算法第 8 项）

| 用例 ID | 改动                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[2]`（图算法）children 末项追加 `two-sat`（紧接 strongly-connected-components） |

## L5 —— 2-SAT 页 e2e（`e2e/two-sat.e2e.ts`，新增）

| 用例 ID        | 场景          | 操作                                    | 期望                                                                                                                                       |
| -------------- | ------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-E2E-2SAT-01 | 全模板 + 互动 | 访问 `/docs/two-sat`；`.scrub` 拖到末步 | 正文 `.article h1` 含「2-SAT」；`.graph-view` 可见；6 `.graph-node`；无 `.bars-view`；拖末步 caption 含「真」或「可满足」；真机 Shiki 着色 |

## 回归

- 既有 15 轨 + 7 图算法 + 6 DP + 回溯 8 页 + 字符串 6 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **GraphView 仅 additive 扩展 `checkPair`**：C-069 SCC 及其它 6 图算法不设 `checkPair` → 渲染不变，`TC-VIZ-GRAPHVIEW-*`/各图算法 module 用例全绿；AlgorithmPlayer 零改动。
- TC-HOOK 其余不变；仅图算法 children 追加 `two-sat`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1406 用例全绿**；`pnpm exec playwright test two-sat scc dijkstra` → **3/3 绿**。
- **本单新增 18 Case 全绿**：`TC-VIZ-GRAPHVIEW-CHECK-01/02`（L4）2 + `TC-2SAT-MOD-01..12`（L3）12 + `TC-VIEW-2SAT-01..03`（L4）3 + `TC-E2E-2SAT-01`（L5）1；**改** `TC-HOOK`（图算法 children +two-sat）menu+home 各 1。
- **关键断言实测**：末步赋值=twoSatSolve().assign=[true,false,true]（TC-01）；末步 nodeGroup=comp=[0,2,2,0,1,3]（TC-06）；clause 步边数累计 2,4,6,8（TC-04）；scc 步 4 个渐进着色（TC-05）；check 步 checkPair=[2i,2i+1]（TC-07）；每对不同组可满足（TC-08）；assign=comp[2v]<comp[2v+1]（TC-09）。
- **真机自检**：蕴含图 8 边逐子句成形、4 SCC 着色（{A,¬B}/{B,¬A} 合并对 + C/¬C 单点）、checkPair 蓝环、赋值 badge 真/假/真、解 A=真/B=假/C=真，与设计一致。
- **覆盖**：statements 95.42% / branches 95.01%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；18 Case + 改 2 HOOK 全绿。
