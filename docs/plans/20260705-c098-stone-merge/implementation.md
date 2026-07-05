# 实现记录：区间 DP 石子合并（C-20260705-098，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-098
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：stones.module.spec（TC-ST-MOD-01..12）红 → stones.{ts,sources,module} 绿（types 仅 +StoneExecPoint）。
2. T2：StoneMerge.vue + 路由 + 菜单/首页 DP 第 7 项 + svg + TC-HOOK（6→7）+ 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **MatrixView 第 11 消费者纯复用零改动**：上三角 4×4（对角 0 init 即填、下三角 null 隐）；split 步 sources=[[i,k],[k+1,j]] 最优拆分对黄高亮。types 仅 +StoneExecPoint。
- oracle stones.ts：stonesDp fills 全记录（cands/bestK/sum/val）；bruteMerge 递归枚举全部相邻合并顺序（独立真值）。
- module 8 步：init（贪心反例预告 + 对角 0）→ pair×3（相邻直合算式）→ split×3（候选枚举 + 取小 + sum 记账 caption）→ done（20 + 区间 DP 范式 + 环形/四边形点到）。
- 正文链 LCS/编辑距离（二维表 DP 填表方向对比叙事）。

## 自测报告

- 门禁全绿 1805/96.07%/95.75%；e2e 3/3 首跑全过；真机候选枚举/黄格全对。
- 回归：MatrixView/AlgorithmPlayer 零改动，10 既有消费者零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
