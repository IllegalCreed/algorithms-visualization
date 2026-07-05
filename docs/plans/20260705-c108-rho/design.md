# 设计：Pollard's Rho（C-20260705-108，纯复用 GraphView · M9-6 收官）

> Status: verified
> Stable ID: C-20260705-108
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

n=8051=83×97、f(x)=x²+1 mod n、x₀=2。序列 [2,5,26,677,7474,2839,871,1848]；**mod 97**：[2,5,26,95,5,26,95,5]——尾 1 环 3。龟兔：race1 (5,26) gcd(21)=1；race2 (26,7474) gcd(7448)=1；race3 (677,871) **gcd(194)=97** ✓（677≡871≡95 mod 97，环上相遇）。8051 = 83 × 97，两者试除判素均素。

## 复用（无 T0）

GraphView 第 11 消费者零改动：`vertices` 8 节点 = 序列值（label 显值），布局「mod 97 同余同站台」——尾 2 居左，三站台（余 5 / 26 / 95）三角排布、二圈值径向内缩；`edges` 7 条链边 x*i→x*{i+1}（directed: true 显走向）；`edgeClass` mst = 龟兔已覆盖的链前缀；`checkPair` = [slow 节点, fast 节点]（蓝环一对——龟兔）；reveal 步 `nodeGroup` = [0,1,2,3,1,2,3,1]（尾/余5/余26/余95 四组调色板）。`RhoExecPoint = 'init'|'seed'|'race'|'hit'|'reveal'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`rho.ts`：`RHO_N=8051`、`rhoF`；`rhoTrace()` → `{xs(8), races:[{step,slow,fast,slowIdx,fastIdx,diff,g}], factor:97, cofactor:83}`；`isPrimeBrute`（试除）；`mod97Tail/Cycle`（尾 1 环 3 供 spec 断言）。对拍：factor×cofactor=n + 双素性 + 每步 gcd 与暴力 gcd 一致。
`rho.module.ts`：init（试除的墙：√8051≈90 内 24 个素数逐个试 vs Rho 几步）→ seed（f 与 x₀，序列「伪随机乱跳」）→ race×2（龟兔各进 1/2 步、gcd 显影失败——checkPair 蓝环 + 链边渐绿）→ hit（gcd(194)=97 揭晓 + 8051=83×97）→ reveal（nodeGroup 四色：mod 97 世界尾 1 环 3、龟兔同站台 95 相遇——ρ 现形）→ done（O(n^¼) 生日悖论 + 流水线 + Brent/RSA 点到）。**7 步**。
`rho.sources.ts`：四语言 Floyd 版 Pollard，lineMap init/seed/race/hit/reveal/done（reveal 落 gcd 行同注释）。

## T2：页面 + 接线

`PollardRho.vue`（Algorithm 目录）；路由 `/docs/pollard-rho`；菜单/首页「数学与数论」第 10 项（fft 后）；新 svg（ρ 字形 + 龟兔）；改 TC-HOOK（数论 9→10 两 spec）。

## 复用与零回归

GraphView 零改动（10 既有消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致。
