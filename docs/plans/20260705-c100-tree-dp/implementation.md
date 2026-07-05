# 实现记录：树形 DP 打家劫舍 III（C-20260705-100，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-100
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：treedp.module.spec（TC-TD-MOD-01..12）红 → treedp.{ts,sources,module} 绿（types 仅 +TreeDpExecPoint）。
2. T2：TreeDp.vue + 路由 + 菜单/首页 DP 第 9 项 + svg + TC-HOOK（8→9）+ 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **MatrixView 第 13 消费者纯复用零改动**：5 行节点（rowLabels 树位置 根/L/R/LL/LR）× 2 列 [选,不选]；填表后序跳行（updatedCell 行序 3→4→1→2→0 即后序足迹）；sel 步 sources=孩子不选格、not 步=孩子四格。types 仅 +TreeDpExecPoint。
- oracle treedp.ts：treeDpFills 后序填表全记录；bruteRob 位掩码枚举全部父子不相邻子集（独立真值）。
- module 10 步：init（树 ASCII + 两态定义 + 后序预告）→ leaf×3（一步双格）→ (sel+not)×2（公式 + 定向黄格）→ best（根取 max=14）→ done（三要素 + 舞会/树上背包/换根点到）。
- 正文 pre 块画树 + DP 四种状态设计收官叙事（序列/区间/集合/树）。

## 自测报告

- 门禁全绿 1835/96.13%/95.83%；e2e 4/4 首跑全过；真机公式/黄格全对。
- 回归：MatrixView/AlgorithmPlayer 零改动，12 既有消费者零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
