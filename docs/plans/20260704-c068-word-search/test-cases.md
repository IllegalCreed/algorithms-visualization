# 测试用例：单词搜索（C-20260704-068，DFS 回溯匹配 · 扩展 MazeView）

> Status: verified
> Stable ID: C-20260704-068
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（wordsearch.module）/ L4（MazeView 扩展 + WordSearch 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-MAZEVIEW-06`、`TC-WS-MOD-*`、`TC-VIEW-WS-*`、`TC-E2E-WS-01`；**改** `TC-HOOK`（回溯 children）

## L4 —— MazeView 字母网格扩展（`src/components/MazeView.spec.ts`，追加）

| 用例 ID            | 场景     | 期望                                                                  |
| ------------------ | -------- | --------------------------------------------------------------------- |
| TC-VIZ-MAZEVIEW-06 | 字母网格 | `letters=[['A','B'],['C','D']]` → 4 格 `.mz-letter`，文本依次 A/B/C/D |

## L3 —— `wordsearch.module`（`src/algorithms/wordsearch.module.spec.ts`）

固定 3×4 盘 + 词 "ADEE"；oracle `wordExists()`=true、`wordPath()`=`[[2,0],[2,1],[2,2],[2,3]]`。

| 用例 ID      | 场景                | 期望                                                                                       |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------ |
| TC-WS-MOD-01 | 末步 found + 路径   | 末步 `found`、`maze.solved`；末步 `maze.path` = `wordPath()` = `[[2,0],[2,1],[2,2],[2,3]]` |
| TC-WS-MOD-02 | 步合法 + 带网格轨   | 每步 `point ∈ {start,match,mismatch,backtrack,found}` 且带 `maze`、`array===[]`            |
| TC-WS-MOD-03 | 每格显字母          | 每步 `maze.letters` === `WORD_BOARD`                                                       |
| TC-WS-MOD-04 | 含真回溯            | 存在至少 1 个 `backtrack` 步（首个 A 起点走不通、撤销回退）                                |
| TC-WS-MOD-05 | 两次起点尝试        | `start` 步 ≥ 2，且每个 `start` 步当前格字母 === `WORD_TARGET[0]` === 'A'                   |
| TC-WS-MOD-06 | match 步字母对上    | 每个 `match` 步当前格字母 === `WORD_TARGET[path.length−1]`                                 |
| TC-WS-MOD-07 | mismatch 步字母不对 | 每个 `mismatch` 步当前格字母 ≠ 期望的下一个字母（或该格已在路径）                          |
| TC-WS-MOD-08 | 末步路径拼成词      | 末步 `path` 上各格字母顺序拼接 === "ADEE"，且相邻格四连通                                  |
| TC-WS-MOD-09 | 同格不复用          | 每步 `path` 无重复格                                                                       |
| TC-WS-MOD-10 | found solved        | `found` 步 `maze.solved` === true                                                          |
| TC-WS-MOD-11 | 四语言 + 行号       | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                              |
| TC-WS-MOD-12 | module 元信息       | `title` 含「单词搜索」；`initialInput()` = `[]`                                            |

## L4 —— `WordSearch` 视图（`src/views/Article/Algorithm/WordSearch.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                                |
| ------------- | ------------- | --------------------------------------------------- |
| TC-VIEW-WS-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                  |
| TC-VIEW-WS-02 | 网格轨        | h1 含「单词搜索」；渲染 `MazeView`；无 `.bars-view` |
| TC-VIEW-WS-03 | 全模板同屏    | 正文含「回溯」+ MazeView 同屏                       |

## L4 —— TC-HOOK（回溯与搜索第 7 项）

| 用例 ID | 改动                                                                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[4]`（回溯与搜索）children url = `['n-queens','subsets','permutations','combination-sum','maze','number-of-islands','word-search']` |

## L5 —— 单词搜索页 e2e（`e2e/word-search.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                        | 期望                                                                                                                                                                                |
| ------------ | ------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-WS-01 | 全模板 + 互动 | 访问 `/docs/word-search`；`.scrub` 拖到末步 | 正文 `.article h1` 含「单词搜索」；`.maze-view` 可见；12 `.maze-cell`；12 `.mz-letter`；无 `.bars-view`；拖末步 4 `.mz-solution`（ADEE 路径绿）+ caption 含 `ADEE`；真机 Shiki 着色 |

## 回归

- 既有 13 轨 + 6 图算法 + 5 DP + 回溯 6 页 + 字符串 4 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **MazeView 仅 additive 扩展 `letters`**：迷宫/岛屿不传 `letters` → `TC-VIZ-MAZEVIEW-01..05`/迷宫/岛屿 module/页/e2e 不变全绿；AlgorithmPlayer 零改动。
- TC-HOOK 其余不变；仅回溯 children 追加 `word-search`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage`（Vitest 4，jsdom）→ **1299 用例全绿**；`pnpm exec playwright test word-search maze number-of-islands` → **3/3 绿**。
- **本单新增 17 Case 全绿**：`TC-VIZ-MAZEVIEW-06`（L4，MazeView 字母扩展）1 + `TC-WS-MOD-01..12`（L3，module）12 + `TC-VIEW-WS-01..03`（L4，页）3 + `TC-E2E-WS-01`（L5，e2e）1；**改** `TC-HOOK`（回溯 children +word-search）menu+home 各 1。
- **关键断言实测**：末步 found + solved + path=wordPath()=[[2,0],[2,1],[2,2],[2,3]]（TC-WS-MOD-01）；含真回溯 backtrack≥1（TC-04）；两次起点尝试且首字母 A（TC-05）；match 步字母对上期望（TC-06）；末步路径拼成 ADEE 四连通（TC-08）；同格不复用（TC-09）。
- **真机自检**：字母网格全显、A(0,0) 起点撤销回退、A(2,0) 沿底行 ADEE 命中标绿，与设计一致。
- **覆盖**：聚合 statements 95.07% / branches 94.53%，全部超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；17 Case + 改 2 HOOK 全绿。
