# 设计：欧拉函数（C-20260705-089，纯复用 SieveView）

> Status: verified
> Stable ID: C-20260705-089
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`n=12=2²·3`：互质集 {1,5,7,11}（gcd 暴力）→ φ(12)=4；res 链 `12 → 12·(1/2)=6 → 6·(2/3)=4`；划格：p=2 → [2,4,6,8,10,12]，p=3 → 新划 [3,9]（6、12 已灰）。

## 复用（无 T0）

SieveView 第 3 消费者零改动：`n=12, cols=6`；states 作颜色语义——`unknown` 未定（含 1，φ 计入 1）、`composite` 已划掉（含质因子）、`prime` 幸存者（互质，绿）；`current` 当前质因子琥珀环；`marking` 本步红闪。`PhiExecPoint = 'init'|'find'|'cross'|'survive'|'done'`（仅 types 加执行点类型）。

## T1：oracle + module + sources

`phi.ts`：`PHI_N=12`；`phiBrute(n)` gcd 逐个数互质（独立真值）；`phiFormula(n)` 试除返回 `{res, factors}`；`phiCrossSets()` 返回每质因子的**新划**集合与幸存者（与暴力对拍）。
`phi.module.ts`：init（网格全未定 + 分解蓝图）→ 对每质因子 p：find（current=p，试除语义）+ cross（marking=新划集、states→composite，caption `res·(1−1/p)` 记账）→ survive（幸存者→prime，φ=4）→ done（公式 + 欧拉定理 `a^φ≡1` + RSA `φ(pq)=(p−1)(q−1)`）。**7 步**。vars：n、分解、res 链、当前 p。
`phi.sources.ts`：四语言试除 phi（res 从 n 出发、每质因子 `res -= res/p`、除尽、大质因子兜底），lineMap init/find/cross/survive/done。

## T2：页面 + 接线

`EulerPhi.vue`（Algorithm 目录）正文（定义、按比例划掉直观、积性/φ(p^k) 性质、欧拉定理与 RSA、链快速幂/CRT）；路由 `/docs/euler-phi`；菜单/首页数论第 7 项；新 svg（网格划格 + φ(12)=4）；改 TC-HOOK。

## 复用与零回归

SieveView 零改动（埃氏筛/线性筛 2 消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：SieveView 第 3 消费者零改动（states 作颜色语义）；oracle phiBrute gcd 暴力与 phiFormula/phiCrossSets 对拍；module 7 步。
