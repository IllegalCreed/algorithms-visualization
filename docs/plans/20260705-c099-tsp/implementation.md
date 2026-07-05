# 实现记录：状压 DP 旅行商 TSP（C-20260705-099，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-099
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：tsp.module.spec（TC-TSP-MOD-01..12）红 → tsp.{ts,sources,module} 绿（types 仅 +TspExecPoint）。
2. T2：Tsp.vue + 路由 + 菜单/首页 DP 第 8 项 + svg + TC-HOOK（7→8）+ 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **MatrixView 第 12 消费者纯复用零改动**：8 行含起点 mask（rowLabels 二进制 0001..1111）× 4 城列，无效格 null；fill 步 sources=[rowOf(prev), bestJ] 胜出前置格、close 步全集行三格。types 仅 +TspExecPoint。
- oracle tsp.ts：tspDp pull 式填表（fills 候选/胜者全记录 + close 回边）；bruteTsp 递归全排列（独立真值）。
- module 15 步：init（n! 爆炸 + 集合洞察 + 起点格）→ fill×12（mask 集合读法 + 候选枚举 caption）→ close（回边三候选取 min）→ done（7 + O(2ⁿ·n²) + n≈20 上限 + 状压家族）。
- 正文收官叙事：DP 八页三种状态设计（序列前缀/区间/集合）；链 LIS/LCS/石子合并。
- 踩坑：module 引入未用 TSP_DIST 被 no-unused-vars 拦下。

## 自测报告

- 门禁全绿 1820/96.10%/95.79%；e2e 4/4 首跑全过；真机候选枚举/前置黄格/close 全对。
- 回归：MatrixView/AlgorithmPlayer 零改动，11 既有消费者零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
