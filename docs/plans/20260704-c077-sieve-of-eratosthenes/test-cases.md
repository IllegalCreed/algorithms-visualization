# 测试用例：埃拉托斯特尼筛（C-20260704-077，新建 SieveView 数字网格轨）

> Status: verified
> Stable ID: C-20260704-077
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（sieve.module）/ L4（SieveView + 播放器接线 + SieveOfEratosthenes 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-SIEVEVIEW-*`、`TC-PLAYER-SIEVE-*`、`TC-SIEVE-MOD-*`、`TC-VIEW-SIEVE-*`、`TC-E2E-SIEVE-01`；**改** `TC-HOOK`（顶层分类 6→7）

## L4 —— SieveView 组件（`src/components/SieveView.spec.ts`，新增）

| 用例 ID             | 场景         | 期望                                                                                 |
| ------------------- | ------------ | ------------------------------------------------------------------------------------ |
| TC-VIZ-SIEVEVIEW-01 | 网格 + 素/合 | n=30 → 30 个 `.sieve-cell`；prime 格 `.sieve-prime`、composite 格 `.sieve-composite` |
| TC-VIZ-SIEVEVIEW-02 | 当前 + 划中  | `current=5` → 1 个 `.sieve-current`；`marking=[25]` → 25 号格 `.sieve-marking`       |
| TC-VIZ-SIEVEVIEW-03 | 1 特殊       | 1 号格 `.sieve-special`（既非素也非合）                                              |

## L4 —— 播放器接线（`src/components/player/AlgorithmPlayer.spec.ts`，追加）

| 用例 ID            | 场景            | 期望                                      |
| ------------------ | --------------- | ----------------------------------------- |
| TC-PLAYER-SIEVE-01 | step 带 sieve   | step 含 `sieve` → 渲染 `SieveView`        |
| TC-PLAYER-SIEVE-02 | 无 sieve 零回归 | 排序 step 无 `sieve` → 不渲染 `SieveView` |

## L3 —— `sieve.module`（`src/algorithms/sieve.module.spec.ts`）

固定 `N=30`；oracle `sievePrimes()`=`[2,3,5,7,11,13,17,19,23,29]`。

| 用例 ID         | 场景                 | 期望                                                                  |
| --------------- | -------------------- | --------------------------------------------------------------------- |
| TC-SIEVE-MOD-01 | 末步 done + 素数     | 末步 `done`；素数集 = `sievePrimes()` = `[2,3,5,7,11,13,17,19,23,29]` |
| TC-SIEVE-MOD-02 | 步合法 + 带筛轨      | 每步 `point ∈ {init,prime,mark,rest,done}` 且带 `sieve`、`array===[]` |
| TC-SIEVE-MOD-03 | init 全未定 + 1 特殊 | `init` 步 `states[1]==='special'`，2..30 全 `'unknown'`               |
| TC-SIEVE-MOD-04 | 主动筛的素数         | `prime` 步恰 3 个（p=2,3,5，p²≤30）；`rest` 步恰 1 个                 |
| TC-SIEVE-MOD-05 | 从 p² 起标记         | 各 `mark` 步 `marking` 最小值 = p²（p=2→4、p=3→9、p=5→25）            |
| TC-SIEVE-MOD-06 | 终态计数             | 末步 `states` 中 prime=10、composite=19、special=1                    |
| TC-SIEVE-MOD-07 | 试除法对拍           | 素数集 = `[x for x in 1..30 if isPrimeTrial(x)]`                      |
| TC-SIEVE-MOD-08 | 筛到 √N 即停         | 只对 `p²≤30` 的 p（2,3,5）主动 mark；7,11,…,29 经 `rest` 一次性确认   |
| TC-SIEVE-MOD-09 | 合数单调累加         | 相邻两步 composite 格数单调不减                                       |
| TC-SIEVE-MOD-10 | 素数清单 caption     | done 步 caption 含 `10` 与素数（如 `29`）                             |
| TC-SIEVE-MOD-11 | 四语言 + 行号        | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内         |
| TC-SIEVE-MOD-12 | module 元信息        | `title` 含「筛」或「埃氏」；`initialInput()` = `[]`                   |

## L4 —— `SieveOfEratosthenes` 视图（`src/views/Article/Algorithm/SieveOfEratosthenes.spec.ts`，新增）

| 用例 ID          | 场景          | 期望                                           |
| ---------------- | ------------- | ---------------------------------------------- |
| TC-VIEW-SIEVE-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`             |
| TC-VIEW-SIEVE-02 | 筛轨          | h1 含「筛」；渲染 `SieveView`；无 `.bars-view` |
| TC-VIEW-SIEVE-03 | 全模板同屏    | 正文含「素数」+ SieveView 同屏                 |

## L4 —— TC-HOOK（新增第 7 顶层大类）

| 用例 ID | 改动                                                                                                     |
| ------- | -------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data` 长度 6→7；`data[6].title==='数学与数论'`、children url = `['sieve-of-eratosthenes']` |

## L5 —— 埃氏筛页 e2e（`e2e/sieve.e2e.ts`，新增）

| 用例 ID         | 场景          | 操作                                                  | 期望                                                                                                                                               |
| --------------- | ------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-SIEVE-01 | 全模板 + 互动 | 访问 `/docs/sieve-of-eratosthenes`；`.scrub` 拖到末步 | 正文 `.article h1` 含「筛」；`.sieve-view` 可见；30 `.sieve-cell`；无 `.bars-view`；拖末步 10 个 `.sieve-prime` + caption 含 `10`；真机 Shiki 着色 |

## 回归

- 既有 15 轨 + 6 大类现有 Case **零改动**全绿。
- **新 `Step.sieve?` additive**：6 大类既有算法不设 `sieve` → SieveView 不渲染，`TC-PLAYER-*` 全绿；AlgorithmPlayer 仅加一行 v-if。
- TC-HOOK：分类数 6→7、原 6 类不变，仅追加数学与数论大类。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1460 用例全绿**；`pnpm exec playwright test sieve bubble-sort max-flow` → **3/3 绿**。
- **本单新增 21 Case 全绿**：`TC-VIZ-SIEVEVIEW-01..03`（L4）3 + `TC-PLAYER-SIEVE-01/02`（L4）2 + `TC-SIEVE-MOD-01..12`（L3）12 + `TC-VIEW-SIEVE-01..03`（L4）3 + `TC-E2E-SIEVE-01`（L5）1；**改** `TC-HOOK`（分类 6→7 + 数学与数论）menu+home 各 1。
- **关键断言实测**：末步素数=sievePrimes()=[2,3,5,7,11,13,17,19,23,29]（TC-01）；与试除法对拍（TC-07）；prime 步 3 个 rest 1 个（TC-04）；从 p² 起标 marking 最小值 [4,9,25]（TC-05）；终态 prime 10/composite 19/special 1（TC-06）；只 p²≤30 主动 mark（TC-08）。
- **真机自检**：6×5 数字网格、素数绿/合数灰划掉/当前琥珀/划中红、从 p² 起、末步 10 素数，与设计一致。
- **覆盖**：statements 95.57% / branches 95.19%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；21 Case + 改 2 HOOK 全绿。
