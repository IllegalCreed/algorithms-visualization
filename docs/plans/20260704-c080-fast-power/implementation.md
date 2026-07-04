# 实现记录：快速幂（C-20260704-080，新建 PowerView 幂块轨）

> Status: verified
> Stable ID: C-20260704-080
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新建 PowerView + 播放器接线**（L4）：types.ts +`PowerBlock`/`PowerExecPoint`/`PowerTrack`/`Step.power?`；先 PowerView.spec（TC-VIZ-POWERVIEW-01..03）+ AlgorithmPlayer.spec（TC-PLAYER-POWER-01/02）跑红 → 新建 PowerView.vue（幂块行 + 结果）+ AlgorithmPlayer 加一行 v-if 跑绿。既有轨用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 fastpower.module.spec（TC-FP-MOD-01..12）跑红 → fastpower.{ts,sources.ts,module.ts}（快速幂 + 幂块）跑绿。
3. **T2 新页 + 接线**：FastPower.vue；路由 /docs/fast-power；菜单 + 首页「数学与数论」第 4 项（新 fast-power.svg）；改 TC-HOOK（数论 children +fast-power）；FastPower.spec + fast-power.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 数论第 4 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **新建第 18 条 PowerView 幂块轨**：顶部显 n 及其二进制串；一行幂块卡片（`v-for` blocks，每卡三行「aᵉˣᵖ/值/位=bit」），`selected` 绿、`skip` 灰暗、`current` 琥珀环；底部「结果 = 选中值连乘 = result」。新 `Step.power?` additive，AlgorithmPlayer 加一行 v-if。
- **oracle `fastpower.ts`**：`fastPow(a,n)` 迭代快速幂；`powBlocks()` 返回 a^(2^k) 幂块 + n 的第 k 位 + 是否选中。a=3,n=13 → 幂块 3/9/81/6561、选中 3¹·3⁴·3⁸（1+4+8=13）、结果 1594323=3¹³。
- **module 6 步**：init（n=13、二进制 1101、result=1）→ 逐位 k=0..3：底数平方出块 a^(2^k)、current=idx；位=1 → mul（selected、result×=块值）/ 位=0 → skip（不乘）→ done（result=1594323，caption 给 3^(1+4+8) 拆分 + 复杂度）。result 逐 mul 步累乘 [3,243,1594323]。
- **四语言 sources**：TS/Python/Go/Rust 迭代快速幂，lineMap 逐行核对（ts 10/py 9/go 10/rust 10 行）对齐 init/mul/skip/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1517/1517 全绿**、聚合 statements 95.69% · branches 95.3%。
- **e2e（真机 Playwright/Chromium）**：`fast-power` + 回归 `gcd`/`bubble-sort` **3/3 通过**——幂块轨、无柱数组、Shiki、拖末步 4 幂块 + 字幕含 1594323。
- **真机视觉自检（2 图眼验）**：第 4/6 步（mul k2）——顶部 1101、3 幂块 3¹选中绿/3²跳过灰/3⁴选中+当前琥珀、结果 3×81=243；末步 6/6——4 块 3 选中、结果 3×81×6561=1594323、字幕「3^(1+4+8)·4 次平方 3 次乘法」。
- **回归**：新 Step.power? additive；既有算法不设 power → PowerView 不渲染（TC-PLAYER-\* 全绿）；仅 TC-HOOK（数论 children）追加 fast-power。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；21 Case + 改 2 HOOK 全绿、双轨部署。
