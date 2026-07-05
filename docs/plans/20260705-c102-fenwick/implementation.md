# 实现记录：树状数组 Fenwick/BIT（C-20260705-102，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-102
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：fenwick.module.spec（TC-BIT-MOD-01..12）红 → fenwick.{ts,sources,module} 绿（types 仅 +FenwickExecPoint）。
2. T2：Fenwick.vue + 路由 + 菜单/首页数据结构第 16 项 + svg + TC-HOOK（15→16）+ 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **主柱轨纯复用（零新 View 零轨字段）**：8 柱 = tree[1..8]（snap 每步快照，update 时柱子真实长高——数组轨值变化天然动画）；蓝指针当前 i、groupMembers 累积 lowbit 链、pivotIndex 当前跳。types 仅 +FenwickExecPoint。
- oracle fenwick.ts：buildTree/queryTrace/updateTrace（hops 全记录）+ brutePrefix（含更新后重算）双对拍；建树逐段管辖和 spec 化。
- module 9 步：init（管辖区间读法）→ query(6) 两跳（lowbit 二进制拆解 caption）→ update(3,+2) 三跳（管辖者通知叙事）→ 复查两跳（19 验证 ✓）→ done（三方案对比 + 应用 + 链线段树）。
- 双向链接：本页 → 线段树（全能兄长叙事）。

## 自测报告

- 门禁全绿 1865/96.16%/95.84%；e2e 3/3 首跑全过；真机长高/验证全对。
- 回归：主柱轨/ArrowTrack/emphasis 零改动；排序/查找/线段树页零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
