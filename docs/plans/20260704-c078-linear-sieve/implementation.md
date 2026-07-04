# 实现记录：线性筛 / 欧拉筛（C-20260704-078，复用 SieveView + spf 角标）

> Status: verified
> Stable ID: C-20260704-078
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 SieveView spf 角标**（L4）：types.ts `SieveTrack` +`spf?` + `LinearSieveExecPoint`；先 SieveView.spec 追加 TC-VIZ-SIEVEVIEW-SPF-01/02 跑红 → SieveView.vue（composite 格 spf 角标）跑绿。埃氏筛 SieveView 用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 linearsieve.module.spec（TC-LS-MOD-01..12）跑红 → linearsieve.{ts,sources.ts,module.ts}（外层遍历所有数、按最小质因子只划一次）跑绿。
3. **T2 新页 + 接线**：LinearSieve.vue；路由 /docs/linear-sieve；菜单 + 首页「数学与数论」第 2 项（新 linear-sieve.svg）；改 TC-HOOK（数论 children +linear-sieve）；埃氏筛页尾双向链接；LinearSieve.spec + linear-sieve.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 数论第 2 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **SieveView additive 扩 spf 角标（零回归）**：`SieveTrack` +`spf?: (number|null)[]`；composite 格若 `spf[v]!=null` 渲染右下角小字（`.sieve-spf`，橙色 10px）。C-077 埃氏筛不传 spf → 无角标、渲染不变。复用 `Step.sieve`，AlgorithmPlayer 零改动。
- **oracle `linearsieve.ts`**：欧拉筛 `linearSieve()` 返回 primes + spf（每合数最小质因子）+ `smallestPrimeFactor()` 试除对拍。N=30 → 10 素数、spf 各合数最小质因子。核心 `i%p==0 break` 保证每合数只被其最小质因子划一次。
- **module 13 步**：init（1 special 其余 unknown、spf 全 null）→ 外层 i=2..10 逐 i 一步（mark 点、current=i；未划设 prime；对素数 p 划 i×p、spf[i×p]=p、marking=本步倍数；caption 给 i×p 与 i%p==0 停因）→ i=11..15 合并一步（各划 i×2）→ rest（i=16..30 不再划、剩余 17/19/23/29 素数）→ done。外层 current 会停在合数上（区别于埃氏筛）。
- **四语言 sources**：TS/Python/Go/Rust 欧拉筛，lineMap 逐行核对（ts 15/py 12/go 15/rust 15 行）对齐 init/mark/rest/done。
- **双向链接**：埃氏筛页尾「线性筛（欧拉筛）」改 router-link 指向本页；本页 2 处回指埃氏筛。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1477/1477 全绿**、聚合 statements 95.6% · branches 95.22%。
- **e2e（真机 Playwright/Chromium）**：`linear-sieve` + 回归 `sieve`/`bubble-sort` **3/3 通过**——30 数字格、spf 角标可见、无柱数组、Shiki、拖末步 10 素数 + 字幕含 10。
- **真机视觉自检（2 图眼验）**：第 5/13 步（i=5）——current=5 琥珀、10/15/25 红带角标 2/3/5、早先合数 4→2/6→2/8→2/9→3 角标、字幕「5%5==0 停」；末步 13/13——10 素数绿、19 合数各带 spf 角标、无重复划、字幕「每合数只被最小质因子划一次·严格 O(N)」。
- **回归**：SieveView spf additive；C-077 埃氏筛不传 spf → 无角标、渲染不变（TC-VIZ-SIEVEVIEW-01..03 + sieve e2e 全绿）；仅 TC-HOOK（数论 children）追加 linear-sieve。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；18 Case + 改 2 HOOK 全绿、双轨部署。
