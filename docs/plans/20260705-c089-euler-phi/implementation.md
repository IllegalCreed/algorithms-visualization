# 实现记录：欧拉函数（C-20260705-089，纯复用 SieveView）

> Status: verified
> Stable ID: C-20260705-089
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：phi.module.spec（TC-PHI-MOD-01..12）红 → phi.{ts,sources,module} 绿（types 仅 +PhiExecPoint）。
2. T2：EulerPhi.vue + 路由 + 菜单/首页数论第 7 项 + svg + TC-HOOK + 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **SieveView 第 3 消费者纯复用零改动**：states 作颜色语义（unknown 未定含 1 / composite 已划 / prime 幸存者绿），current 琥珀环 = 当前质因子，marking 红闪 = 本步新划。types 仅 +PhiExecPoint。
- oracle phi.ts：phiBruteList gcd 逐个数（独立真值）；phiFormula 试除；phiCrossSets 每质因子新划集合 + resAfter + 幸存者（三方对拍）。
- module 7 步：init（分解蓝图）→ 2×(find 试除 + cross 划格记账 res·(1−1/p)）→ survive（互质幸存者）→ done（公式 + 欧拉定理 + RSA φ(pq)）。
- 双向链接：本页 → 扩欧（d≡e⁻¹）/快速幂（指数打折）/CRT（拆模提速）；数论线角色集齐叙事。

## 自测报告

- 门禁全绿 1670/95.93%/95.45%；e2e 3/3 首跑全过；真机划格/幸存者/记账全对。
- 回归：SieveView/AlgorithmPlayer 零改动，埃氏筛/线性筛零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
