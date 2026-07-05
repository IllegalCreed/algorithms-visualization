# 实现记录：换根 DP 树中距离之和（C-20260705-103，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-103
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：reroot.module.spec（TC-RR-MOD-01..12）红 → reroot.{ts,sources,module} 绿（types 仅 +RerootExecPoint）。
2. T2：RerootDp.vue + 路由 + 菜单/首页 DP 第 11 项 + svg + TC-HOOK（10→11）+ 页 spec + e2e；TreeDp 页实链。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **MatrixView 第 15 消费者纯复用零改动**：5 行节点 × 3 列 [size,down,ans]；down 步双格填（内部节点孩子四格黄）、root 步 sources=down 格、reroot 步 sources=[父 ans, 自 size]。types 仅 +RerootExecPoint。
- oracle reroot.ts：rerootTrace 二次扫描全记录（postOrder/downFills/reroots）；bruteDist 逐点 BFS（独立真值）。
- module 12 步：init（O(n²) 之痛）→ down×5（后序 + 抬 1 步公式）→ root（第一趟收官）→ reroot×4（近/远两笔账逐项代入）→ done（三件套 + 应用）。
- 双向链接：TreeDp 页「换根 DP」改实链；DP 大类真收官叙事（五种状态 + 换根）。

## 自测报告

- 门禁全绿 1880/96.19%/95.86%；e2e 3/3 首跑全过；真机公式/黄格全对。
- 回归：MatrixView/AlgorithmPlayer 零改动，14 既有消费者零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
