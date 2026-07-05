# 实现记录：二分图匹配·匈牙利算法（C-20260705-097，纯复用 GraphView）

> Status: verified
> Stable ID: C-20260705-097
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：hungarian.module.spec（TC-HG-MOD-01..12）红 → hungarian.{ts,sources,module} 绿（types 仅 +HungarianExecPoint）。
2. T2：Hungarian.vue + 路由 + 菜单/首页图算法第 10 项 + svg + TC-HOOK（9→10）+ 页 spec + e2e；MaxFlow 页双向链接。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **GraphView 纯复用零改动**：两列布局（L x=120 / R x=340）；edgeClass 试探 current/匹配 mst/死路 rejected；nodeBadge 右点 ←L?；doneNodes 随 matchR。types 仅 +HungarianExecPoint。
- oracle hungarian.ts：hungarianTrace 事件流（round/try/match/fail + matchR 快照，DFS+seen 全确定）；bruteMaxMatching 递归枚举全部指派（独立真值）。
- module 12 步：事件流重放——round 融入首个 try 的 caption；**连续 match 合并**（增广路整条翻转一步呈现）；**连续 fail 合并**（死路链一步回退 + rejected 边）。
- 双向链接：MaxFlow 页「二分图最大匹配」改实链；本页回链最大流（单位容量归约叙事）。

## 自测报告

- 门禁全绿 1790/96.05%/95.72%；e2e 3/3 首跑全过；真机增广/死路/badge 全对。
- 回归：GraphView/AlgorithmPlayer 零改动，10 既有消费者零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
