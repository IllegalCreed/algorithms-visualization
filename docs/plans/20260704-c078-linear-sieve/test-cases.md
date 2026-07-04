# 测试用例：线性筛 / 欧拉筛（C-20260704-078，复用 SieveView + spf 角标）

> Status: verified
> Stable ID: C-20260704-078
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（linearsieve.module）/ L4（SieveView spf + LinearSieve 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-SIEVEVIEW-SPF-*`、`TC-LS-MOD-*`、`TC-VIEW-LS-*`、`TC-E2E-LS-01`；**改** `TC-HOOK`（数论 children）

## L4 —— SieveView spf 角标（`src/components/SieveView.spec.ts`，追加）

| 用例 ID                 | 场景         | 期望                                                         |
| ----------------------- | ------------ | ------------------------------------------------------------ |
| TC-VIZ-SIEVEVIEW-SPF-01 | spf 角标     | composite 格传 `spf[v]` → 该格渲染 `.sieve-spf` 角标显示该值 |
| TC-VIZ-SIEVEVIEW-SPF-02 | 不设即零回归 | 不传 `spf`（埃氏筛）→ 无 `.sieve-spf` 角标                   |

## L3 —— `linearsieve.module`（`src/algorithms/linearsieve.module.spec.ts`）

固定 `N=30`；oracle `linearSieve()`：primes=`[2,3,5,7,11,13,17,19,23,29]`，spf 为各合数最小质因子。

| 用例 ID      | 场景                 | 期望                                                                            |
| ------------ | -------------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| TC-LS-MOD-01 | 末步 done + 素数     | 末步 `done`；素数集 = `linearSieve().primes` = `[2,3,5,7,11,13,17,19,23,29]`    |
| TC-LS-MOD-02 | 步合法 + 带筛轨      | 每步 `point ∈ {init,mark,rest,done}` 且带 `sieve`、`array===[]`                 |
| TC-LS-MOD-03 | init 全未定 + 1 特殊 | `init` 步 `states[1]='special'`，2..30 全 `'unknown'`，spf 全 null              |
| TC-LS-MOD-04 | 外层遍历所有数       | `mark` 步的 `current` 覆盖合数（如 i=4,6 也作 current，区别于埃氏筛只处理素数） |
| TC-LS-MOD-05 | spf = 最小质因子     | 末步 `spf[v]` = `smallestPrimeFactor(v)`（各合数 v）                            |
| TC-LS-MOD-06 | 每合数只划一次       | 全程各合数格从 unknown→composite 恰变一次（marking 并集无重复）                 |
| TC-LS-MOD-07 | 终态计数             | 末步 prime=10、composite=19、special=1；spf 非 null 数 = 19                     |
| TC-LS-MOD-08 | 试除法对拍           | primes = `[x∈1..30                                                              | smallestPrimeFactor(x)===x 且 x≥2]` |
| TC-LS-MOD-09 | 合数单调累加         | 相邻两步 composite 格数单调不减                                                 |
| TC-LS-MOD-10 | done caption         | done 步 caption 含 `10` 与「最小质因子」/「一次」                               |
| TC-LS-MOD-11 | 四语言 + 行号        | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                   |
| TC-LS-MOD-12 | module 元信息        | `title` 含「线性筛」或「欧拉」；`initialInput()` = `[]`                         |

## L4 —— `LinearSieve` 视图（`src/views/Article/Algorithm/LinearSieve.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                               |
| ------------- | ------------- | -------------------------------------------------- |
| TC-VIEW-LS-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                 |
| TC-VIEW-LS-02 | 筛轨          | h1 含「线性筛」；渲染 `SieveView`；无 `.bars-view` |
| TC-VIEW-LS-03 | 全模板同屏    | 正文含「最小质因子」+ SieveView 同屏               |

## L4 —— TC-HOOK（数学与数论第 2 项）

| 用例 ID | 改动                                                                                          |
| ------- | --------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[6]`（数学与数论）children url = `['sieve-of-eratosthenes','linear-sieve']` |

## L5 —— 线性筛页 e2e（`e2e/linear-sieve.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                         | 期望                                                                                                                                                                          |
| ------------ | ------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-LS-01 | 全模板 + 互动 | 访问 `/docs/linear-sieve`；`.scrub` 拖到末步 | 正文 `.article h1` 含「线性筛」；`.sieve-view` 可见；30 `.sieve-cell`；无 `.bars-view`；拖末步 10 个 `.sieve-prime` + 有 `.sieve-spf` 角标 + caption 含 `10`；真机 Shiki 着色 |

## 回归

- 既有 16 轨 + 7 大类现有 Case **零改动**全绿。
- **SieveView 仅 additive 扩 `spf` 角标**：C-077 埃氏筛不传 `spf` → 无角标、渲染不变，`TC-VIZ-SIEVEVIEW-01..03` 全绿；AlgorithmPlayer 零改动。
- TC-HOOK 其余不变；仅数学与数论 children 追加 `linear-sieve`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1477 用例全绿**；`pnpm exec playwright test linear-sieve sieve bubble-sort` → **3/3 绿**。
- **本单新增 18 Case 全绿**：`TC-VIZ-SIEVEVIEW-SPF-01/02`（L4）2 + `TC-LS-MOD-01..12`（L3）12 + `TC-VIEW-LS-01..03`（L4）3 + `TC-E2E-LS-01`（L5）1；**改** `TC-HOOK`（数论 children +linear-sieve）menu+home 各 1。
- **关键断言实测**：末步素数=linearSieve().primes=[2,3,5,7,11,13,17,19,23,29]（TC-01）；spf=各合数最小质因子且与 oracle 一致（TC-05）；每合数只划一次（marking 并集无重复=全部合数，TC-06）；外层遍历所有数（存在 current 为合数，TC-04）；终态 prime10/composite19/spf 非 null 19（TC-07）；试除对拍（TC-08）。
- **真机自检**：外层 i 停合数上、每合数 spf 角标、i=5 划 10/15/25 角标 2/3/5、末步 19 合数各一角标无重复，与设计一致。
- **覆盖**：statements 95.6% / branches 95.22%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；18 Case + 改 2 HOOK 全绿。
