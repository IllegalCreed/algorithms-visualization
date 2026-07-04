# 设计：米勒-拉宾素性测试（C-20260705-090，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-090
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

底数 a=2。**41**：`40 = 2³·5`，`2⁵ mod 41 = 32`，`32² = 40 = −1` → 撞 −1 通过（真质数，试除对拍）。**561 = 3·11·17** 卡迈克尔数：`2^560 ≡ 1 (mod 561)` 骗过费马；`560 = 2⁴·35`，链 `2³⁵=263 → 166 → 67 → 1`，`67² ≡ 1` 而 `67 ∉ {1, 560}` → 非平凡平方根 → 合数。

## 复用（无 T0）

MatrixView 第 10 消费者零改动：`labels/colLabels=['a^d','平方¹','平方²','平方³']`、`rowLabels=['41（真质数）','561（伪装者）']`、`cells:(number|null)[][]` 2×4（41 行只用前 2 格）、`emptyText:''`、`active/updatedCell`（当前填格）、`sources`（verdict 步高亮判定依据：41 → [[0,1]] 即 −1 格；561 → [[1,2],[1,3]] 即 67 与 1）。`MrExecPoint = 'init'|'decomp'|'pow'|'square'|'verdict'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`mr.ts`：`MR_CASES=[{n:41,a:2},{n:561,a:2}]`；`isPrimeBrute(n)` 试除（独立真值）；`powMod(a,e,m)`；`decompose(n)` → `{s,d}`；`mrChain(n,a)` → `{s,d,chain,verdict,reason}`（early-exit：撞 −1 → probable-prime；平方出 1 → composite；走完没 −1 → composite）。spec 对拍：41 → prime=brute；561 → composite=brute 且 `powMod(2,560,561)===1`（费马被骗断言）。
`mr.module.ts`：init（空表 + 动机）→ 每试验：decomp（caption n−1=2^s·d，vars s/d）→ pow（填 a^d，updatedCell）→ square×k（逐格填，caption 平方值与 ±1 判断）→ verdict（sources 高亮依据格 + 结论 caption）→ done（概率界 + 工程实践）。**12 步**。
`mr.sources.ts`：四语言 millerRabin(n,a)（分解 → powMod → 平方循环撞 −1/出 1），lineMap init/decomp/pow/square/verdict/done。

## T2：页面 + 接线

`MillerRabin.vue`（Algorithm 目录）正文（动机、费马漏洞、平方根卡点、概率界与确定性底数集、链快速幂/欧拉函数）；路由 `/docs/miller-rabin`；菜单/首页数论第 8 项；新 svg；改 TC-HOOK。

## 复用与零回归

MatrixView 零改动（Floyd/编辑距离/背包×2/LCS/LIS/硬币找零/扩欧/CRT 9 消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：MatrixView 第 10 消费者零改动；oracle mrChain 与 isPrimeBrute 试除对拍 + powMod(2,560,561)=1 费马被骗断言；module 12 步。
