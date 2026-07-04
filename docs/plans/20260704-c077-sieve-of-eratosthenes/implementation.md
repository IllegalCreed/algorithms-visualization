# 实现记录：埃拉托斯特尼筛（C-20260704-077，新建 SieveView 数字网格轨）

> Status: verified
> Stable ID: C-20260704-077
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新建 SieveView + 播放器接线**（L4）：types.ts +`SieveCellState`/`SieveExecPoint`/`SieveTrack`/`Step.sieve?`；先 SieveView.spec（TC-VIZ-SIEVEVIEW-01..03）+ AlgorithmPlayer.spec（TC-PLAYER-SIEVE-01/02）跑红 → 新建 SieveView.vue（CSS-grid 数字网格 + 状态着色）+ AlgorithmPlayer 加一行 v-if 跑绿。既有轨用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 sieve.module.spec（TC-SIEVE-MOD-01..12）跑红 → sieve.{ts,sources.ts,module.ts}（埃氏筛逐素数）跑绿。
3. **T2 新页 + 新大类接线**：SieveOfEratosthenes.vue；路由 /docs/sieve-of-eratosthenes；菜单 + 首页新增第 7 大类「数学与数论」（新 sieve.svg）；改 TC-HOOK（分类 6→7 + 新分类断言）；SieveOfEratosthenes.spec + sieve.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 新大类）→ 两提交 → 双轨部署。

## 关键实现笔记

- **新建第 16 条 SieveView 数字网格轨**：CSS-grid（`repeat(cols,46px)`，复用 BoardView 模式），每格显数字 + 按 `states[v]` 着色——`special`(1) 淡灰 / `unknown` 中性 / `prime` 绿 / `composite` 灰划掉（line-through）；`current===v` 琥珀环、`marking.includes(v)` 红（覆盖 composite）。types +`SieveCellState`/`SieveExecPoint`/`SieveTrack`/`Step.sieve?`；AlgorithmPlayer 加一行 `<SieveView v-if="current.sieve">`。
- **oracle `sieve.ts`**：埃氏筛 `sievePrimes()`（从 p² 起标、筛到 √N）+ `isPrimeTrial()` 试除法对拍。N=30 → [2,3,5,7,11,13,17,19,23,29]。
- **module 9 步**：init（1 special 其余 unknown）→ 每个 `p²≤N` 且未被划的 p：prime（states[p]=prime、current=p）+ mark（从 p² 起把仍 unknown 的倍数设 composite、marking=这些）→ rest（p²>N，剩余 unknown 一次性设 prime）→ done（素数清单）。只 p=2,3,5 主动 mark；7,11,…,29 经 rest 确认。
- **四语言 sources**：TS/Python/Go/Rust 埃氏筛（布尔数组 + 从 p² 起标），lineMap 逐行核对（ts 12/py 9/go 13/rust 15 行）对齐 init/prime/mark/rest/done（rest 与 prime 同行，p²>N 仅检测不划）。
- **新增第 7 顶层大类「数学与数论」**：菜单 + 首页 categoryData 追加第 7 项 + 新 sieve.svg；改 TC-HOOK（分类 6→7 + data[6].title 断言）。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1460/1460 全绿**、聚合 statements 95.57% · branches 95.19%。
- **e2e（真机 Playwright/Chromium）**：`sieve` + 回归 `bubble-sort`/`max-flow` **3/3 通过**——30 数字格、无柱数组、Shiki、拖末步 10 素数 + 字幕含 10。
- **真机视觉自检（2 图眼验）**：第 5/9 步（p=3 mark）——6×5 网格、2/3 绿、当前 3 琥珀环、偶数灰划掉、9/15/21/27 红（从 9 起）、5/7/11… 白、字幕「从 9 起划 3 的倍数」；末步 9/9——10 素数全绿、19 合数灰划、1 淡灰、字幕「素数共 10 个」。
- **回归**：新 Step.sieve? additive；6 大类既有算法不设 sieve → SieveView 不渲染（TC-PLAYER-SIEVE-02 + 各算法 e2e 全绿）；仅 TC-HOOK 分类 6→7。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；21 Case + 改 2 HOOK 全绿、双轨部署。
