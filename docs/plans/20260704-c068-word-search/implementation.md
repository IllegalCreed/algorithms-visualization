# 实现记录：单词搜索（C-20260704-068，DFS 回溯匹配 · 扩展 MazeView）

> Status: verified
> Stable ID: C-20260704-068
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 MazeView 扩展**（L4）：types.ts `MazeTrack` +`letters?`、+`WordSearchExecPoint`；先 MazeView.spec 追加 TC-VIZ-MAZEVIEW-06 跑红 → MazeView.vue（cells 加 letter + 模板优先渲染字母）跑绿。迷宫/岛屿 TC-VIZ-MAZEVIEW-01..05 保持绿。
2. **T1 module + oracle + sources**（L3）：先 wordsearch.module.spec（TC-WS-MOD-01..12）跑红 → wordsearch.{ts,sources.ts,module.ts}（DFS 逐字母试探 + 回溯）跑绿。
3. **T2 新页 + 接线**：WordSearch.vue（Article + AlgorithmPlayer）；路由 /docs/word-search；菜单 + 首页「回溯与搜索」第 7 项（新 word-search.svg）；改 TC-HOOK（回溯 children +word-search）；WordSearch.spec + word-search.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 回溯网格搜索第 3 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **MazeView 扩成带字母网格轨（第 3 消费者，全 additive）**：`MazeTrack` +`letters?: string[][]`；cells computed 每格加 `letter`，模板**优先**渲染字母（`v-if="cell.letter"`），当前格琥珀环 / path 琥珀 / solution 绿等既有高亮叠加其上。迷宫/岛屿不传 `letters` → 渲染不变，`TC-VIZ-MAZEVIEW-01..05` + 迷宫/岛屿 module/页/e2e 零回归。
- **复用 Step.maze，无新 Step 字段**：wordsearch.module 产出 `Step<WordSearchExecPoint>`、`maze` 用同一 MazeTrack（walls 全 false、无 start/goal、letters=board、path=当前 DFS 路径、solved=命中）。
- **DFS 逐字母试探 + 回溯**：进入格 emit `start`（首字母起点）/`match`（匹配深入）；邻格字母不符 emit `mismatch`（探查格琥珀、path 不变）；四方向试完 `path.pop()` + emit `backtrack`（撤销标记、回退）；`k===len-1` emit `found`（solved、整条 path 绿）。固定 3×4 盘 + ADEE → 11 步含 1 次真回退（A(0,0) 无 D 邻居撤销 → 换 A(2,0) 起点走底行）。oracle `wordExists()`/`wordPath()` 独立 DFS 对拍。
- **四语言 sources**：TS/Python/Go/Rust 标准回溯 `exist`（进入时标 '#'、回溯时撤销），lineMap 对齐 start/match/mismatch/backtrack/found。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓（0 warning）/ `type-check`（vue-tsc）✓ / `test:unit run --coverage` **1299/1299 全绿**、聚合 statements 95.07% · branches 94.53%（远超门槛）；`wordsearch.*` 满覆盖（v8 text 隐藏）。
- **e2e（真机 Playwright/Chromium）**：`word-search` + 回归 `maze` + `number-of-islands` **3/3 通过**——3×4=12 格 + 12 字母、无柱数组、Shiki 着色、拖末步 4 `.mz-solution`（ADEE 路径绿）+ 字幕含 ADEE。
- **真机视觉自检（1 图眼验）**：末步 11/11——3×4 字母网格全显（A B C E / S F C S / A D E E），底行 A D E E 四格绿（命中路径）、末格 E 琥珀环、字幕「拼出完整单词 "ADEE" → 命中」。
- **回归**：MazeView 仅 additive（迷宫/岛屿零回归）；N 皇后/子集/排列/组合总和/迷宫/岛屿现有 Case 不变全绿；仅 `TC-HOOK`（回溯 children）追加 `word-search`。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；17 Case + 改 2 HOOK 全绿、双轨部署。
