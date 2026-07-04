# 实现记录：米勒-拉宾素性测试（C-20260705-090，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-090
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：mr.module.spec（TC-MR-MOD-01..12）红 → mr.{ts,sources,module} 绿（types 仅 +MrExecPoint）。
2. T2：MillerRabin.vue + 路由 + 菜单/首页数论第 8 项 + svg + TC-HOOK + 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **MatrixView 第 10 消费者纯复用零改动**：2 行试验 × 4 列平方链；updatedCell 逐格填、verdict 步 sources 黄高亮判定依据（41 的 −1 格 / 561 的 67 与 1）。types 仅 +MrExecPoint。
- oracle mr.ts：isPrimeBrute 试除（独立真值）、powMod、decompose、mrChain（early-exit 平方链 + verdict/reason 四态）。费马被骗断言 powMod(2,560,561)=1 是本页叙事的 spec 化。
- module 12 步：init（动机）→ 试验① 41（decomp/pow/square 撞 −1/verdict 通过）→ 试验② 561（decomp/pow/square×3 出非平凡平方根/verdict 合数）→ done（1/4 概率界 + 64 位确定性底数集 + OpenSSL 实践）。
- 双向链接：本页 → 快速幂（引擎）/筛法/φ/扩欧/CRT（RSA 流水线收官叙事）。

## 自测报告

- 门禁全绿 1685/95.92%/95.46%；e2e 3/3 首跑全过；真机 verdict 高亮 + caption 全对。
- 回归：MatrixView/AlgorithmPlayer 零改动，9 既有消费者零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
