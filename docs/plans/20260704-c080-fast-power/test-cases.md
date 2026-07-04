# 测试用例：快速幂（C-20260704-080，新建 PowerView 幂块轨）

> Status: verified
> Stable ID: C-20260704-080
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（fastpower.module）/ L4（PowerView + 播放器接线 + FastPower 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-POWERVIEW-*`、`TC-PLAYER-POWER-*`、`TC-FP-MOD-*`、`TC-VIEW-FP-*`、`TC-E2E-FP-01`；**改** `TC-HOOK`（数论 children）

## L4 —— PowerView 组件（`src/components/PowerView.spec.ts`，新增）

| 用例 ID             | 场景          | 期望                                                                 |
| ------------------- | ------------- | -------------------------------------------------------------------- |
| TC-VIZ-POWERVIEW-01 | 幂块行        | blocks 4 个 → 4 个 `.power-block`；每块显示值（含 3/9/81/6561）      |
| TC-VIZ-POWERVIEW-02 | 选中/当前     | selected 块 → `.power-selected`；`current=0` → 1 个 `.power-current` |
| TC-VIZ-POWERVIEW-03 | 结果 + 二进制 | 渲染 `.power-result`（含 result）；显示 n 的二进制串（含 1101）      |

## L4 —— 播放器接线（`src/components/player/AlgorithmPlayer.spec.ts`，追加）

| 用例 ID            | 场景            | 期望                                      |
| ------------------ | --------------- | ----------------------------------------- |
| TC-PLAYER-POWER-01 | step 带 power   | step 含 `power` → 渲染 `PowerView`        |
| TC-PLAYER-POWER-02 | 无 power 零回归 | 排序 step 无 `power` → 不渲染 `PowerView` |

## L3 —— `fastpower.module`（`src/algorithms/fastpower.module.spec.ts`）

固定 `a=3, n=13`；oracle `fastPow(3,13)`=1594323。

| 用例 ID      | 场景              | 期望                                                               |
| ------------ | ----------------- | ------------------------------------------------------------------ |
| TC-FP-MOD-01 | 末步 done + 结果  | 末步 `done`；`fastPow(3,13)` = 1594323 = 3\*\*13                   |
| TC-FP-MOD-02 | 步合法 + 带 power | 每步 `point ∈ {init,mul,skip,done}` 且带 `power`、`array===[]`     |
| TC-FP-MOD-03 | 幂块平方链        | 末步 blocks 值 = [3,9,81,6561]（a^1,a^2,a^4,a^8，每块 = 前块平方） |
| TC-FP-MOD-04 | 二进制位          | 末步 blocks 的 bit = [1,0,1,1]（13=1101₂，low→high）               |
| TC-FP-MOD-05 | 选中 = 位 1       | selected 块 = k∈{0,2,3}；指数和 1+4+8 = 13 = n                     |
| TC-FP-MOD-06 | mul/skip 步       | `mul` 步 3 个（位 1）、`skip` 步 1 个（位 0）                      |
| TC-FP-MOD-07 | 结果累乘          | result 每个 mul 步乘入当前块值；末步 = 选中块连乘 = 1594323        |
| TC-FP-MOD-08 | result 单调（幂） | 各步 result 非减；末步 = a\*\*n                                    |
| TC-FP-MOD-09 | 幂块对拍 oracle   | 末步 blocks = `powBlocks()`（值/位/选中一致）                      |
| TC-FP-MOD-10 | 结果 caption      | done 步 caption 含 `1594323` 与「3」的幂语义（1+4+8 或 3^13）      |
| TC-FP-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内      |
| TC-FP-MOD-12 | module 元信息     | `title` 含「快速幂」；`initialInput()` = `[]`                      |

## L4 —— `FastPower` 视图（`src/views/Article/Algorithm/FastPower.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                               |
| ------------- | ------------- | -------------------------------------------------- |
| TC-VIEW-FP-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                 |
| TC-VIEW-FP-02 | 幂块轨        | h1 含「快速幂」；渲染 `PowerView`；无 `.bars-view` |
| TC-VIEW-FP-03 | 全模板同屏    | 正文含「二进制」+ PowerView 同屏                   |

## L4 —— TC-HOOK（数学与数论第 4 项）

| 用例 ID | 改动                                                                                                             |
| ------- | ---------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[6]`（数学与数论）children url = `['sieve-of-eratosthenes','linear-sieve','gcd','fast-power']` |

## L5 —— 快速幂页 e2e（`e2e/fast-power.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                       | 期望                                                                                                                                     |
| ------------ | ------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-FP-01 | 全模板 + 互动 | 访问 `/docs/fast-power`；`.scrub` 拖到末步 | 正文 `.article h1` 含「快速幂」；`.power-view` 可见；无 `.bars-view`；拖末步 4 个 `.power-block` + caption 含 `1594323`；真机 Shiki 着色 |

## 回归

- 既有 17 轨 + 7 大类现有 Case **零改动**全绿。
- **新 `Step.power?` additive**：既有算法不设 `power` → PowerView 不渲染，`TC-PLAYER-*` 全绿；AlgorithmPlayer 仅加一行 v-if。
- TC-HOOK：数学与数论 children 追加 `fast-power`；其余不变。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1517 用例全绿**；`pnpm exec playwright test fast-power gcd bubble-sort` → **3/3 绿**。
- **本单新增 21 Case 全绿**：`TC-VIZ-POWERVIEW-01..03`（L4）3 + `TC-PLAYER-POWER-01/02`（L4）2 + `TC-FP-MOD-01..12`（L3）12 + `TC-VIEW-FP-01..03`（L4）3 + `TC-E2E-FP-01`（L5）1；**改** `TC-HOOK`（数论 children +fast-power）menu+home 各 1。
- **关键断言实测**：fastPow(3,13)=1594323=3¹³（TC-01）；幂块值 [3,9,81,6561] 每块=前块平方（TC-03）；位 [1,0,1,1]（TC-04）；选中 k{0,2,3} 指数和 1+4+8=13（TC-05）；mul 3/skip 1（TC-06）；result 累乘 [3,243,1594323]（TC-07）；幂块对拍 powBlocks()（TC-09）。
- **真机自检**：二进制 1101、幂块行选中/跳过/当前分色、结果累乘 3×81×6561=1594323，与设计一致。
- **覆盖**：statements 95.69% / branches 95.3%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；21 Case + 改 2 HOOK 全绿。
