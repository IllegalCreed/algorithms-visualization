# 实现记录：中国剩余定理（C-20260705-087，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-087
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：crt.module.spec（TC-CRT-MOD-01..12）红 → crt.{ts,sources,module} 绿（types 仅 +CrtExecPoint；modInverse 复用 extgcd.ts）。
2. T2：Crt.vue + 路由 + 菜单/首页数论第 6 项 + svg + TC-HOOK + 页 spec + e2e；扩欧页双向链接。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **MatrixView 第 9 消费者纯复用零改动**：5 列 [r,m,Mᵢ,tᵢ,项]×4 行（三条同余 + 合计）；active/updatedCell 当前填格、sources 黄高亮引用（inv 引 Mᵢ/mᵢ、term 引 r/Mᵢ/tᵢ、sum 引三项）、emptyText='' 隐 null。types 仅 +CrtExecPoint。
- oracle crt.ts：crtBrute 暴力扫 0..M−1 作独立真值；modInverse 复用 extgcd.ts 的 extGcd（Bézout 系数）；crtRows/crtSolve 构造解与暴力对拍。
- module 12 步：init（r/m 就位 + M=105）→ 每行 mi/inv/term 三步（「有声音→校准成 1→点菜」叙事 + 逐步验证 caption）→ sum（233，sources 三项）→ done（233 mod 105 = 23 + RSA-CRT 语义）。
- 双向链接：扩欧页「中国剩余定理」→ 本页；本页 → 扩欧（求逆）/快速幂（RSA-CRT）；正文点出数论线闭环（筛→gcd/扩欧→快速幂→CRT）。

## 自测报告

- 门禁全绿 1638/95.89%/95.49%；e2e 3/3 首跑全过；真机构造表三色高亮 + 末步 x=23 + 首页图标正常。
- 回归：MatrixView/AlgorithmPlayer 零改动，8 既有消费者零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
