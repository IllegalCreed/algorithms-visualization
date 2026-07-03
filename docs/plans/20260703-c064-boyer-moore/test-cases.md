# 测试用例：Boyer-Moore 字符串匹配（C-20260703-064，坏字符规则）

> Status: verified
> Stable ID: C-20260703-064
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（boyermoore.module）/ L4（KmpView 扩展 + BoyerMoore 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-KMPVIEW-06`、`TC-BM-MOD-*`、`TC-VIEW-BM-*`、`TC-E2E-BM-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `KmpView` 后缀扩展（`src/components/KmpView.spec.ts`，追加）

| 用例 ID           | 场景       | 期望                                                            |
| ----------------- | ---------- | --------------------------------------------------------------- |
| TC-VIZ-KMPVIEW-06 | 已匹配后缀 | matchedFrom=1（P 长 3）→ 模式下标 1、2 共 2 格带 `.kmp-matched` |

## L3 —— `boyermoore.module`（`src/algorithms/boyermoore.module.spec.ts`）

固定 T=`abcabxabc`、P=`abc`；oracle `bmLast`/`bmMatches`。

| 用例 ID      | 场景               | 期望                                                                                         |
| ------------ | ------------------ | -------------------------------------------------------------------------------------------- |
| TC-BM-MOD-01 | 末步 done + 命中   | 末步 `done`；`kmp.found` = `bmMatches()` = `[0,6]`                                           |
| TC-BM-MOD-02 | 步合法 + 带匹配轨  | 每步 `point ∈ {start,match,badChar,found,done}` 且带 `kmp`、`array===[]`                     |
| TC-BM-MOD-03 | 无 π 行（lps 空）  | 每步 `kmp.lps` = `[]`                                                                        |
| TC-BM-MOD-04 | 窗口对齐           | 每步 `kmp.windowStart` = `kmp.offset`                                                        |
| TC-BM-MOD-05 | 坏字符表展示       | vars 含坏字符表 `a:0`/`b:1`/`c:2`                                                            |
| TC-BM-MOD-06 | 存在两种跳 + 命中  | `#badChar >= 2` 且 `#found == 2`                                                             |
| TC-BM-MOD-07 | match 从右往左     | 每个 `match` 步 `T[compareText]===P[comparePat]` 且 `matchedFrom` = comparePat（后缀含当前） |
| TC-BM-MOD-08 | badChar 字符不等   | 每个 `badChar` 步 `T[compareText]≠P[comparePat]`                                             |
| TC-BM-MOD-09 | 大步跳（不在模式） | 存在一步坏字符不在模式（如 'x'）→ 该失配后 windowStart 增量 ≥ 模式长的一半                   |
| TC-BM-MOD-10 | 命中区间不越界     | 每个命中 s 满足 `T.substr(s,m) === P`                                                        |
| TC-BM-MOD-11 | 四语言 + 行号      | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                |
| TC-BM-MOD-12 | module 元信息      | `title` 含「Boyer-Moore」或「坏字符」；`initialInput()` = `[]`                               |

## L4 —— `BoyerMoore` 视图（`src/views/Article/Algorithm/BoyerMoore.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                                                      |
| ------------- | ------------- | ------------------------------------------------------------------------- |
| TC-VIEW-BM-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                        |
| TC-VIEW-BM-02 | 匹配轨        | h1 含「Boyer-Moore」；渲染 `KmpView`；无 `.bars-view`；无 `.kmp-lps-cell` |
| TC-VIEW-BM-03 | 全模板同屏    | Article 含「坏字符」+ KmpView 同屏                                        |

## L4 —— TC-HOOK（字符串第 3 项）

| 用例 ID      | 改动                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：`data[5]`（字符串）children url = `['kmp','rabin-karp','boyer-moore']` |
| TC-HOOK-02-1 | Menu：同上                                                                   |

## L5 —— Boyer-Moore 页 e2e（`e2e/boyer-moore.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                        | 期望                                                                                                                                                     |
| ------------ | ------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-BM-01 | 全模板 + 互动 | 访问 `/docs/boyer-moore`；`.scrub` 拖到末步 | 正文 `.article h1` 含「Boyer-Moore」；`.kmp-view` 可见；9 `.kmp-text-cell`；无 `.kmp-lps-cell`；无 `.bars-view`；拖末步 ≥1 `.kmp-found`；真机 Shiki 着色 |

## 回归

- 既有 12 轨 + 6 图算法 + 4 DP + 回溯 5 页 + KMP + Rabin-Karp + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **KmpView 仅 additive 扩展 `matchedFrom`**：KMP/Rabin-Karp 不设 → 用既有前缀 `matchedLen`/无高亮，其 `TC-VIZ-KMPVIEW-01..05`/`TC-PLAYER-KMP-*` 不变全绿；AlgorithmPlayer.vue 零改动。
- TC-HOOK 其余不变；仅 -01-1/-02-1 字符串 children 追加 `boyer-moore`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage`（Vitest 4，jsdom）→ **171 文件 / 1231 用例全绿**；`pnpm exec playwright test boyer-moore rabin-karp kmp` → **3/3 绿**。
- **本单新增 17 Case 全绿**：`TC-VIZ-KMPVIEW-06`（L4，matchedFrom 后缀）1 + `TC-BM-MOD-01..12`（L3，module）12 + `TC-VIEW-BM-01..03`（L4，页）3 + `TC-E2E-BM-01`（L5，e2e）1；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`（字符串 children `['kmp','rabin-karp','boyer-moore']`）2。
- **关键断言实测**：末步 `found === bmMatches() === [0,6]`（TC-BM-MOD-01）；match 步 `matchedFrom === comparePat`（TC-07）；存在坏字符不在模式的大步跳（'x'，TC-09）；两种跳 + 恰 2 命中（TC-06）；每步 `lps=[]` 无 π 行（TC-03）、`windowStart === offset`（TC-04）。
- **真机自检**：右往左比（第 7 步 P 最右 c 对 T 的 x）、坏字符大步跳（'x' 跳过整段）、matchedFrom 绿后缀（第 4 步整段绿）、命中 [0,6]，与设计一致。
- **覆盖**：聚合 statements 94.86% / branches 94.13% / functions 94.65% / lines 95.48%，全部超门槛；`boyermoore.module` 行覆盖 100%。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；17 Case + 改 2 HOOK 全绿。
