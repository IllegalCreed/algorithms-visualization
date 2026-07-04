# 测试用例：AC 自动机 Aho-Corasick（C-20260704-075，Trie + fail · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-075
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（ahocorasick.module）/ L4（GraphView .fail + AhoCorasick 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-GRAPHVIEW-FAIL-*`、`TC-AC-MOD-*`、`TC-VIEW-AC-*`、`TC-E2E-AC-01`；**改** `TC-HOOK`（字符串 children）

## L4 —— GraphView .fail 边样式（`src/components/GraphView.spec.ts`，追加）

| 用例 ID                  | 场景         | 期望                                                        |
| ------------------------ | ------------ | ----------------------------------------------------------- |
| TC-VIZ-GRAPHVIEW-FAIL-01 | fail 边类    | `edgeClass={'0-1':'fail'}` → 该 `.graph-edge` 带 `.fail` 类 |
| TC-VIZ-GRAPHVIEW-FAIL-02 | 不设即零回归 | 无 `fail` 类的边 → 不带 `.fail`（其它图算法不受影响）       |

## L3 —— `ahocorasick.module`（`src/algorithms/ahocorasick.module.spec.ts`）

固定模式 `{he,she,hers}` + 文本 `"ushers"`；oracle `acMatch()`=`[she[1,3], he[2,3], hers[2,5]]`；`fail=[0,0,0,0,1,2,0,3]`。

| 用例 ID      | 场景             | 期望                                                                           |
| ------------ | ---------------- | ------------------------------------------------------------------------------ |
| TC-AC-MOD-01 | 末步 done + 命中 | 末步 `done`；命中集 = `acMatch()` = she[1,3]、he[2,3]、hers[2,5]（顺序含位置） |
| TC-AC-MOD-02 | 步合法 + 带图轨  | 每步 `point ∈ {insert,fail,match,hit,done}` 且带 `graph`、`array===[]`         |
| TC-AC-MOD-03 | 建 Trie          | `insert` 步恰 3 个；建完 8 状态节点 + 7 条 trie 边                             |
| TC-AC-MOD-04 | BFS 建 fail      | `fail` 步恰 7 个（BFS 序）；末步图中 `fail` 类边恰 3 条（非平凡）              |
| TC-AC-MOD-05 | fail 值对拍      | 末步各状态 fail = `buildAc()` 的 fail = `[0,0,0,0,1,2,0,3]`                    |
| TC-AC-MOD-06 | 非平凡 fail 边   | `fail` 类边集合 = {`4-1`(sh→h), `5-2`(she→he), `7-3`(hers→s)}                  |
| TC-AC-MOD-07 | 匹配逐字符       | `match`+`hit` 步合计 6 个（文本长）；activeNode 随字符移动                     |
| TC-AC-MOD-08 | 命中步           | `hit` 步恰 2 个（i=3 命中 she+he、i=5 命中 hers）                              |
| TC-AC-MOD-09 | 输出链重叠       | 状态 `she`(5) 的 out 含 `he`（沿 fail 链合并 → 重叠命中）                      |
| TC-AC-MOD-10 | 命中汇总 caption | done 步 caption 含 `she`、`he`、`hers`                                         |
| TC-AC-MOD-11 | 四语言 + 行号    | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                  |
| TC-AC-MOD-12 | module 元信息    | `title` 含「AC」或「Aho」；`initialInput()` = `[]`                             |

## L4 —— `AhoCorasick` 视图（`src/views/Article/Algorithm/AhoCorasick.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                                    |
| ------------- | ------------- | ------------------------------------------------------- |
| TC-VIEW-AC-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                      |
| TC-VIEW-AC-02 | 图轨          | h1 含「AC」或「Aho」；渲染 `GraphView`；无 `.bars-view` |
| TC-VIEW-AC-03 | 全模板同屏    | 正文含「fail」+ GraphView 同屏                          |

## L4 —— TC-HOOK（字符串第 7 项）

| 用例 ID | 改动                                                                                                                                     |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[5]`（字符串）children url = `['kmp','rabin-karp','boyer-moore','manacher','suffix-array','lcp-array','aho-corasick']` |

## L5 —— AC 自动机页 e2e（`e2e/aho-corasick.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                         | 期望                                                                                                                                             |
| ------------ | ------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-E2E-AC-01 | 全模板 + 互动 | 访问 `/docs/aho-corasick`；`.scrub` 拖到末步 | 正文 `.article h1` 含「AC」或「Aho」；`.graph-view` 可见；8 `.graph-node`；无 `.bars-view`；拖末步 caption 含「hers」或「命中」；真机 Shiki 着色 |

## 回归

- 既有 15 轨 + 8 图算法 + 6 DP + 回溯 8 页 + 字符串 6 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **GraphView 仅加 `.fail` 边样式**（`edgeClass` 通用字典）：8 图算法不设 `fail` 类 → 渲染不变，`TC-VIZ-GRAPHVIEW-*`/各图算法用例全绿；GraphTrack 零改动、AlgorithmPlayer 零改动。
- TC-HOOK 其余不变；仅字符串 children 追加 `aho-corasick`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1423 用例全绿**；`pnpm exec playwright test aho-corasick two-sat scc` → **3/3 绿**。
- **本单新增 18 Case 全绿**：`TC-VIZ-GRAPHVIEW-FAIL-01/02`（L4）2 + `TC-AC-MOD-01..12`（L3）12 + `TC-VIEW-AC-01..03`（L4）3 + `TC-E2E-AC-01`（L5）1；**改** `TC-HOOK`（字符串 children +aho-corasick）menu+home 各 1。
- **关键断言实测**：末步命中=acMatch()=she[1,3]/he[2,3]/hers[2,5]（TC-01）；fail=[0,0,0,0,1,2,0,3]（TC-05）；非平凡 fail 边 {4-1,5-2,7-3}（TC-04/06）；insert 3 步建 8 状态 7 trie 边（TC-03）；match+hit 6 步、hit 2 步（TC-07/08）；输出链 she 含 he（TC-09）。
- **真机自检**：Trie 两分支成形、3 条 fail 虚线边、匹配 fail 跳（she→he→her）、三处重叠命中，与设计一致。
- **覆盖**：statements 95.48% / branches 95.15%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；18 Case + 改 2 HOOK 全绿。
