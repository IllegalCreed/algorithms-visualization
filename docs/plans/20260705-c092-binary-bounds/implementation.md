# 实现记录：二分边界 lower/upper bound（C-20260705-092，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-092
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：bbound.module.spec（TC-BB-MOD-01..12）红 → bbound.{ts,sources,module} 绿（types 仅 +BbExecPoint）。
2. T2：BinaryBounds.vue + 路由 + 菜单/首页查找第 2 项 + svg + TC-HOOK + 页 spec + e2e；C-091 页尾实链。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **同 C-091 纯复用（零新 View 零轨字段）**：groupMembers=[lo,hi) 半开候选集；hi=n 哨兵位（10）越界不画黄箭头、vars 标注；settle 步 sortedIndices=[相遇点]、range 步 =[1,2,3]。types 仅 +BbExecPoint。
- oracle bbound.ts：bruteLb/bruteUb 线性扫（独立真值）；boundTrace(kind) 两分支轨迹（goRight 序列可断言）。
- module 14 步：runPhase(lower) + runPhase(upper) 共用一套 emit（比较文案按 kind 切 </≥ 与 ≤/>）→ range（等值区间合拢）→ done（模板对比 + 不存在退化 + STL/bisect 对应）。
- 双向链接：C-091 页尾「左右边界」改实链；本页回链基础二分 + 预告二分答案（单调谓词抽象）。

## 自测报告

- 门禁全绿 1715/95.95%/95.59%；e2e 2/2；真机 range 三绿 + 相遇定格全对。
- 回归：主柱轨/ArrowTrack/emphasis 零改动；C-091/排序页零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
