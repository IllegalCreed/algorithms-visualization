# 实现记录：二分答案（C-20260705-094，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-094
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：banswer.module.spec（TC-BA-MOD-01..12）红 → banswer.{ts,sources,module} 绿（types 仅 +BaExecPoint）。
2. T2：BinaryAnswer.vue + 路由 + 菜单/首页查找第 4 项 + svg + TC-HOOK + 页 spec + e2e；C-091/093 页尾实链。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **柱子的语义反转（概念跃迁可视化）**：11 根柱 = 候选速度 1..11（不是被查数组）；速度 v → 柱下标 v−1 统一映射；groupMembers 候选答案区间、pivotIndex 试探答案、settle sortedIndices。types 仅 +BaExecPoint。
- oracle banswer.ts：hoursAt Σceil、bruteMinSpeed 线性首个可行（独立真值）、baTrace lower_bound-on-predicate 轨迹；单调谓词「恰一次 ✗→✓ 翻转」直接 spec 化。
- module 7 步：init（三要素登场）→ probe×4（caption 现场算 ⌈p/k⌉ 逐项 + 可行「还能更小」/不可行「只能加速」）→ settle（最小可行 4）→ done（三要素 + 最小化最大值家族 + 查找四页收官）。
- 双向链接：C-091 页尾「答案空间」改实链；本页链二分边界（lower_bound 同款）+ 三页回链收官地图。

## 自测报告

- 门禁全绿 1745/95.96%/95.67%；e2e 3/3；真机算账 caption/淡出/绿柱全对。
- 回归：主柱轨/ArrowTrack/emphasis 零改动；查找前 3 页零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
